"use client"

import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseForm from './components/ExpenseForm'


const NewExpensepage = () => {

    const router = useRouter()

    return (
        <div className='container px-4 max-w-3xl mx-auto py-6'>
            <div className='mb-6'>
                <h1 className='text-5xl gradient-title'>Add a New Expense</h1>
                <p className='text-muted-foreground mt-1'>
                    Drop in a new expense & split it hassle-free
                </p>
            </div>

            <Card>
                <CardContent>
                    <Tabs defaultValue="individual" className="pb-3">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="individual">Individual Expense</TabsTrigger>
                            <TabsTrigger value="group">Group Expense</TabsTrigger>
                        </TabsList>
                        <TabsContent value="individual" className="mt-0">
                            <ExpenseForm type="individual" onSuccess={(id)=>router.push(`/person/${id}`)}/>
                        </TabsContent>
                        <TabsContent value="group" className="mt-0">
                            <ExpenseForm type="group" onSuccess={(id)=>router.push(`/groups/${id}`)}/>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default NewExpensepage
