"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { ArrowLeft, ArrowLeftRight, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BarLoader } from 'react-spinners'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseList from '@/components/ExpenseList'
import SettlementsList from '@/components/SettlementsList'

const PersonPage = () => {
    const params = useParams()
    const router = useRouter()
    const [activeTab,setActiveTab] = useState('expenses')
    const {data,isLoading} = useConvexQuery(api.expenses.getExpensesBetweenUsers,{userId:params.id})

    if(isLoading){
        return(
            <div className="container mx-auto py-12">
                <BarLoader width={"100%"} color="grey"/>
            </div>
        )
    }

    const otherUser = data?.otherUser
    const expenses = data?.expenses || []
    const settlements = data?.settlements || []
    const balance = data?.balance || 0


    return (
        <div className='container mx-auto py-6 max-w-4xl px-4'>
            <div className='mb-6'>
                <Button variant="outline" size="sm" className="mb-4" onClick={()=>router.back()}>
                    <ArrowLeft className='size-4 mr-2'/>
                    Back
                </Button>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Avatar className="size-12 md:size-16">
                            <AvatarImage src={otherUser?.imageUrl}/>
                            <AvatarFallback>
                                {otherUser?.name?.charAt(0)||"?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl md:text-2xl gradient-title">{otherUser?.name}</h1>
                            <p className='text-sm md:text-sm text-muted-foreground'>{otherUser?.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/settlements/user/${params.id}`}>
                                <ArrowLeftRight className='mr-2 size-4'/>
                                Settle Up
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/expenses/new`}>
                                <PlusCircle className='mr-2 size-4'/>
                                Add Expense
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex justify-between items-center'>
                        <div>
                            {
                                balance === 0 ? (
                                    <p>you are all settled up</p>
                                ) : balance > 0 ? (
                                    <p>
                                        <span className='font-medium'>{otherUser?.name} has to pay you</span>
                                    </p>
                                ):(
                                    <p>You need to pay <span className='font-medium'>{otherUser?.name}</span></p>
                                )
                            }
                        </div>
                        <div className={`text-2xl font-bold ${balance > 0 ? "text-green-600" : balance < 0 ?"text-red-600":""}`}>
                            ₹ {Math.abs(balance).toFixed(2)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger className="hover:cursor-pointer" value="expenses">Expenses ({expenses.length})</TabsTrigger>
                    <TabsTrigger className="hover:cursor-pointer" value="settlements">Settlements ({settlements.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="space-y-4">
                    <ExpenseList 
                        expenses={expenses} 
                        showOtherPerson={false}
                        otherPersonId={params.id}
                        userLookupMap={{[otherUser.id]:otherUser}}
                    />
                </TabsContent>
                <TabsContent value="settlements" className="space-y-4">
                    <SettlementsList
                        settlements={settlements}
                        userLookupMap={{[otherUser.id]:otherUser}}
                    />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default PersonPage
