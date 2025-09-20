import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";


export const getExpensesBetweenUsers = query({
    args:{ userId:v.id("users") },
    handler:async( ctx,{ userId })=>{
        const me = await ctx.runQuery(internal.users.getCurrentUser)
        if(me._id===userId){
            throw new Error('Cannot query yourself')
        }

        //An expense between two people, paid by either one.

        //expense by current user
        const myPaid = await ctx.db.query('expenses').withIndex('by_user_and_group',(q)=>q.eq("paidByUserId",me._id).eq('groupId',undefined)).collect()
        //expense by userId-user
        const theirPaid = await ctx.db.query('expenses').withIndex('by_user_and_group',(q)=>q.eq('paidByUserId',userId).eq('groupId',undefined)).collect()

        const candidateExpenses=[...myPaid,...theirPaid]

        //keep only rows where only both are present 

        const expenses = candidateExpenses.filter((e)=>{

            // searching for me in splits (me refer to line no-8)
            const meInSplits = e.splits.some((e)=>e.userId===me._id)
            // searching for userId in splits (userId refer to args that we will pass from frontend)
            const themInSplits = e.splits.some((e)=>e.userId===userId)

            const meInvoled = e.paidByUserId === me._id || meInSplits
            const themInvolved = e.paidByUserId === userId || themInSplits

            //this will the those expenses in which (me) either present in paidByUserId or in splits 
            // same condition apply for userId
            return meInvoled && themInvolved
        })

        expenses.sort((a,b)=>b.date-a.date)

        //settlements between me and userId only

        const settlements = await ctx.db.query('settlements').filter((q)=>
            q.and(
                q.eq(q.field('groupId'),undefined),
                q.or(
                    q.and(
                        q.eq(q.field('paidByUserId'),me._id),
                        q.eq(q.field('receivedByUserId'),userId)
                    ),
                    q.and(
                        q.eq(q.field('paidByUserId'),userId),
                        q.eq(q.field('receivedByUserId'),me._id)
                    )
                )
            )
        ).collect()

        settlements.sort((a,b)=>b.date - a.date)

        //calculating running balance

        let balance = 0

        for(const e of expenses){
            // if me paid the amount then calculating userId split amount
            if(e.paidByUserId===me._id){
                const split = e.splits.find((s)=>s.userId===userId && !s.paid)
                if(split){
                    balance+=split.amount // userId give me
                }
            }
            else{
                // if userId paid the amount then calculating me split amount
                const split = e.splits.find((s)=>s.userId===me._id)
                if(split){
                    balance-=split.amount // I give to userId
                }
            }
        }

        for(const s of settlements){
            if(s.paidByUserId===me._id){
                balance+=s.amount
            }
            else{
                balance-=s.amount
            }
        }

        const other = await ctx.db.get(userId)
        if(!other){
            throw new Error('User not found !')
        }

        return {
            expenses,
            settlements,
            otherUser:{
                id:other._id,
                name:other.name,
                email:other.email,
                imageUrl:other.imageUrl
            },
            balance,
        }
    }
})


export const deleteExpense = mutation({
    args:{
        expenseId:v.id('expenses')
    },
    handler:async (ctx,args)=>{
        const user = await ctx.runQuery(internal.users.getCurrentUser)

        const expense = await ctx.db.get(args.expenseId)
        if(!expense){
            throw new Error('expense not found')
        }

        if(expense.createdBy!==user._id && expense.paidByUserId!==user._id){
            throw new Error("You don't have permission to delete this expense")
        }

        await ctx.db.delete(args.expenseId)

        return {success:true}
    }
})


export const createExpense = mutation({
    args:{
        description:v.string(),
        amount:v.number(),
        category:v.optional(v.string()),
        date:v.number(),
        paidByUserId:v.id('users'),
        splitType:v.string(), //equal,percentage,exact
        splits:v.array(
            v.object({
                userId:v.id('users'),
                amount:v.number(),
                paid:v.boolean(),
            })
        ),
        groupId:v.optional(v.id('groups')),
    },

    handler:async(ctx,args)=>{
        const user = await ctx.runQuery(internal.users.getCurrentUser)

        if(args.groupId){
            const group=await ctx.db.get(args.groupId)

            if(!group){
                throw new Error('Group not Found')
            }

            const isMember = group.members.some((member)=> member.userId === user._id)

            if(!isMember){
                throw new Error("You are not a member of this group")
            }   
        }


        const totalSplitAmount = args.splits.reduce((sum,split)=>sum+split.amount,0)

        const tolerance = 0.01

        if(Math.abs(totalSplitAmount - args.amount)>tolerance){
            throw new Error("Split amounts must add up to the total expense amount")
        }

        const expenseId = await ctx.db.insert('expenses',{
            description:args.description,
            amount:args.amount,
            category:args.category || "Other",
            date:args.date,
            paidByUserId:args.paidByUserId,
            splitType:args.splitType,
            splits:args.splits,
            groupId:args.groupId,
            createdBy:user._id
        })
        return expenseId
    }
})