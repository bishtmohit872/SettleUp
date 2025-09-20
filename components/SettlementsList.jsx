import { useConvexQuery } from '@/hooks/useConvexQuery'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { api } from '@/convex/_generated/api'
import { ArrowLeftRight } from 'lucide-react'
import { Badge } from './ui/badge'
import { format } from 'date-fns'

const SettlementsList = ({settlements,isGroupSettlement=false,userLookupMap}) => {

    const {data:currentUser} = useConvexQuery(api.users.getCurrentUser)

    if(!settlements || !settlements.length){
        return(
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No Settlements Found
                </CardContent>
            </Card>
        )
    }

    const getUserDetails = (userId) =>{
        return{
            name:userId === currentUser?._id?"You":userLookupMap[userId]?.name || "Other User",
            id:userId,
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {
                settlements.map((settlement)=>{
                    const payer = getUserDetails(settlement.paidByUserId)
                    const reciever = getUserDetails(settlement.recievedByUserId)
                    const isCurrentUserPayer = settlement.paidByUserId === currentUser?._id
                    const isCurrentUserReciever = settlement.recievedByUserId === currentUser?._id
                    
                    return(
                        <Card className="hover:bg-muted/30 transition-colors" key={settlement?._id}>
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <ArrowLeftRight className='size-5 text-primary'/>
                                        </div>

                                        <div>
                                            <h3 className="font-medium">
                                                {
                                                    isCurrentUserPayer?`You Paid ${reciever.name}`:isCurrentUserReciever?`${payer.name} paid you`:`${payer.name} paid ${reciever.name}`
                                                }
                                            </h3>

                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <span>
                                                    {format(new Date(settlement.date),'MMM d, yyyy')}
                                                </span>
                                                {
                                                    settlement.note && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{settlement.note}</span>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-medium">
                                            ₹{settlement.amount.toFixed(2)}
                                        </div>
                                        {
                                            isGroupSettlement?(
                                                <Badge variant="outline" className='mt-1'>
                                                    Group Settlement
                                                </Badge>
                                            ):(
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        isCurrentUserPayer?(
                                                            <span className='text-amber-600'>You paid</span>
                                                        ): isCurrentUserReciever?(
                                                            <span className='text-green-600'>You Received</span>
                                                        ):(
                                                            <span>Payment</span>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default SettlementsList