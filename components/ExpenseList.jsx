import { api } from '@/convex/_generated/api'
import { useConvexQuery,useConvexMutation } from '@/hooks/useConvexQuery'
import React from 'react'
import { getCategoryById, getCategoryIcon } from '@/lib/expenseCategories'
import {Card,CardContent} from "@/components/ui/card"
import { format } from 'date-fns'
import { Trash, Trash2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge";
import { Button } from './ui/button'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from './ui/avatar'



const ExpenseList = ({expenses,showOtherPerson=true,isGroupExpense=false, OtherPersonId=null,userLookupMap={}}) => {

    const {data:currentUser} = useConvexQuery(api.users.getCurrentUser)
    const deleteExpense = useConvexMutation(api.expenses.deleteExpense)

    if(!expenses || !expenses.length){
        return(
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No expenses found
                </CardContent>
            </Card>
        )
    }

    const getUserDetails=(userId)=>{
        return {
            name:userId===currentUser?._id?"You":userLookupMap[userId]?.name || "Other User",
            id:userId
        }
    }

    const canDeleteExpense = (expense)=>{
        if(!currentUser){
            return false
        }

        return(
            expense.createdBy === currentUser._id || expense.paidByUserId === currentUser._id
        )
    }

    const handleDeleteExpense = async (expense)=>{
        const confirmed = window.confirm("Are you sure you want to delete this expense ? This action cannot be undone.")
        
        if(!confirmed){
            return 
        }

        try{
            await deleteExpense.mutate({expenseId: expense._id})
            toast.success("Expense deleted successfully")
        }
        catch(error){
            toast.error('Failed to Delete Expense: '+ error.message)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            {
                expenses.map((expense)=>{
                    const payer = getUserDetails(expense.paidByUserId)
                    const isCurrentUserPayer = expense.paidByUserId === currentUser?.id
                    const category = getCategoryById(expense.category)
                    const CategoryIcon = getCategoryIcon(category.id)
                    const showDeleteOption = canDeleteExpense(expense)

                    return(
                        <Card key={expense._id}>
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className='flex items-center gap-3'>
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <CategoryIcon className="size-5 text-primary"/>
                                        </div>

                                        <div>
                                            <h3 className='font-medium'>{expense.description}</h3>
                                            <div className='flex items-center text-sm text-muted-foreground gap-2'>
                                                <span>
                                                    {format(new Date(expense.date),'MMM d, yyyy')}
                                                </span>
                                                {showOtherPerson && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            {isCurrentUserPayer ? 'You':payer.name} Paid
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <div className='text-right'>
                                            <div className='font-medium'>
                                                ₹ {expense.amount.toFixed(2)}
                                            </div>

                                            {
                                                isGroupExpense ? (
                                                    <Badge variant="outline" className='mt-1'>
                                                        Group Expense
                                                    </Badge>
                                                ):(
                                                    <div className='text-sm text-muted-foreground'>
                                                        {
                                                            isCurrentUserPayer ? (
                                                                <span className='text-green-600'>
                                                                    You Paid
                                                                </span>
                                                            ):(
                                                                <span className="text-red-600">
                                                                    {payer.name} Paid
                                                                </span>
                                                            )
                                                        }
                                                    </div>  
                                                )
                                            }
                                        </div>

                                        {
                                            showDeleteOption && (
                                                <Button variant ="ghost" size="icon" className="size-8 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100" onClick={()=>handleDeleteExpense(expense)}>
                                                    <Trash2 className='size-4'/>
                                                    <span className='sr-only'>Delete Expense</span>
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                                
                                <div className="mt-3 text-sm flex gap-2 flex-wrap">
                                     {expense.splits.map((split,idx)=>{
                                        const splitUser = getUserDetails(split.userId,expense)
                                        const isCurrentUser = split.userId === currentUser?._id

                                        return(
                                            <Badge key={idx} variant={split.paid?"outline":"secondary"} className="flex items-center gap-1">
                                                <Avatar className='size-4'>
                                                    <AvatarFallback>
                                                        {splitUser.name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>
                                                    {isCurrentUser?"You":splitUser.name}: ₹ {split.amount.toFixed(2)}
                                                </span>
                                            </Badge>
                                        )
                                     })}   
                                </div>

                            </CardContent>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default ExpenseList