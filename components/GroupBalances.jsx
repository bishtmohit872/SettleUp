import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import React from 'react'

const GroupBalances = ({balances}) => {

    const {data:currentUser} =  useConvexQuery(api.users.getCurrentUser)
    if(!balances?.length || !currentUser){
        return(
            <div className="text-center py-4 text-muted-foreground">
                No Balance  information available
            </div>
        )
    }

    const me = balances.find((b)=>b.id === currentUser._id)
    if(!me){
        return(
            <div className="text-center py-4 text-muted-foreground">
                You're not part of this group
            </div>
        )
    }

    const userMap = Object.fromEntries(balances.map((b)=>[b.id,b]))

    const owedByMembers = me.owedBy.map(({from,amount})=>({...userMap[from],amount})).sort((a,b)=>b.amount - a.amount)
    const owingToMembers = me.owes.map(({to,amount})=>({ ...userMap[to],amount })).sort((a,b)=>b.amount - a.amount)

    const isAllSettledUp = me.totalBalance === 0 && 
    owedByMembers.length === 0 &&
    owingToMembers.length === 0

    return (
        <div>
            <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                    <p className="text-sm text-muted-foreground">Your Balance</p>
                    <p className={`text-2xl font-bold ${me.totalBalance > 0 ? "text-green-600" : me.totalBalance < 0 ? "text-red-600" : ""}`}>
                        {
                            me.totalBalance > 0 ? `+₹ ${me.totalBalance.toFixed(2)}`: 
                                                    me.totalBalance < 0 ? `-₹ ${Math.abs(me.totalBalance).toFixed(2)}`:"₹0.00" 
                        }
                    </p>
                </div>

                {
                    isAllSettledUp?(
                        <div className='text-center py-4'>
                            <p className='text-muted-foreground'>Everyone is settled up!</p>
                        </div>
                    ):(
                        <div className='space-y-4'>
                            {
                                owedByMembers.length>0 && (
                                    <div>
                                        <h3 className='text-sm font-medium flex items-center mb-3'>
                                            <ArrowUpCircle className='size-4 text-green-500 mr-2'/>
                                            Payable to you
                                        </h3>
                                        <div className='space-y-3'>
                                            {
                                                owedByMembers.map((member)=>(
                                                    <div key={(member.id)} className='flex items-center justify-between'>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className='size-8'>
                                                                <AvatarImage src={member.imageUrl}/>
                                                                <AvatarFallback>
                                                                    {
                                                                        member.name?.charAt(0) ?? "?"
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <span className="text-sm">{member.name}</span>
                                                        </div>
                                                        <span className='font-medium text-green-600'>
                                                            ₹ {member.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))
                                            }

                                            {
                                                owingToMembers.length > 0 && (
                                                    <div>
                                                        <h3 className='text-sm font-medium flex items-center mb-3'>
                                                            <ArrowDownCircle className='size-4 text-red-500 mr-2'/>
                                                            You have to pay
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {
                                                                owingToMembers.map((member)=>(
                                                                    <div key={(member.id)} className='flex items-center justify-between'>
                                                                        <div className="flex items-center gap-2">
                                                                            <Avatar className='size-8'>
                                                                                <AvatarImage src={member.imageUrl}/>
                                                                                <AvatarFallback>
                                                                                    {
                                                                                        member.name?.charAt(0) ?? "?"
                                                                                    }
                                                                                </AvatarFallback>
                                                                            </Avatar>

                                                                            <span className="text-sm">{member.name}</span>
                                                                        </div>
                                                                        <span className='font-medium text-red-600'>
                                                                            ₹ {member.amount.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default GroupBalances
