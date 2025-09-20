"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useConvexQuery } from "@/hooks/useConvexQuery"
import { ChevronRight, PlusCircle, Users } from "lucide-react"
import Link from "next/link"
import { BarLoader } from "react-spinners"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ExpenseSummary from "./components/ExpenseSummary"
import BalanceSummary from "./components/BalanceSummary"
import GroupList from "./components/GroupList"
import Image from "next/image"

const Dashboard = () =>{
    const {data:balances,isLoading:balancesLoading}=useConvexQuery(api.dashboard.getUserBalances)

    const {data:groups,isLoading:groupsLoading} = useConvexQuery(api.dashboard.getUserGroups)
    
    const {data:totalSpent, isLoading:totalSpentLoading} = useConvexQuery(api.dashboard.getTotalSpent)

    const {data:monthlySpending,isLoading:monthlySpendingLoading} = useConvexQuery(api.dashboard.getMonthlySpending)

    const isLoading = groupsLoading || totalSpentLoading || monthlySpendingLoading

    return(
        <div className="container mx-auto py-6 space-y-6">
            {
                isLoading?(
                    <div className="w-full py-12 flex justify-center">
                        <BarLoader width={"100%"} color="gray"/>
                    </div>
                ):(
                    <div className="px-4 md:px-0">
                        <div className="flex items-center justify-between">
                            <h1 className="text-5xl gradient-title">DashBoard</h1>
                            <Button asChild>
                                <Link href="/expenses/new">
                                    <PlusCircle className="mr-2 size-4"/>
                                    Add Expense
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {
                                            balances.totalBalance > 0?(
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-600">
                                                        +₹ {balances?.totalBalance.toFixed(2)}
                                                    </span>
                                                    <Image src="/increment.svg" alt="increment" width={300} height={300}/>
                                                </div>
                                            ):
                                            balances.totalBalance<0?(
                                                <div className="flex items-center justify-between">
                                                    <span className="text-red-600">
                                                        -₹ {balances?.totalBalance.toFixed(2)}
                                                    </span>
                                                    <Image src="/decrement.svg" alt="decrement" width={300} height={300}/>
                                                </div>
                                            ):(
                                                <span>₹ 0.00</span>
                                            )
                                        }
                                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                                            {
                                                balances?.totalBalance>0 ? "Money belongs to you" : 
                                                balances?.totalBalance<0 ? "Payment is due from you" : "All settled up!"
                                            }
                                        </p>
                                    </div>

                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        People are supposed to pay you
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-2xl font-bold text-green-600">
                                        ₹ {balances?.youAreOwed.toFixed(2)}
                                        <Image src="/takeover.png" alt="recieving money" width={150} height={150}/>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        From {balances?.oweDetails?.youAreOwedBy?.length || 0 } people
                                    </p>

                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        You are supposed to pay
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        balances?.oweDetails?.youOwe?.length > 0?(
                                            <>
                                                <div className="flex items-center justify-between text-2xl font-bold text-red-600">
                                                    ₹ {balances?.youOwe.toFixed(2)}
                                                    <Image src="/donation.png" alt="giving money" width={200} height={200}/>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    To {balances?.oweDetails?.youOwe?.length || 0} people
                                                </p>
                                            </>
                                        ):(
                                            <>
                                                <div className="flex items-center justify-between text-2xl font-bold">
                                                    <span>₹ 0.00</span>
                                                    <Image src="/check-mark.png" alt="all check" width={150} height={150}/>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    You don’t need to pay money to anyone
                                                </p>
                                            </>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-col-1 lg:grid-cols-3 gap-4 mt-6">
                            <div className="lg:col-span-2 space-y-6">
                                <ExpenseSummary monthlySpending={monthlySpending} totalSpent={totalSpent}/>
                            </div>

                            <div className="space-y-6">
                                <Card className="w-full">
                                    <CardHeader className="pb-3 flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Balance Details
                                        </CardTitle>
                                        <Button variant="link" asChild className="p-0">
                                            <Link href="/contacts">
                                                view All
                                                <ChevronRight className="ml-1 size-4"/>
                                            </Link>
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <BalanceSummary balances={balances}/>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3 flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Your Groups
                                        </CardTitle>
                                        <Button variant="link" asChild className="p-0">
                                            <Link href="/contacts">
                                                view All
                                                <ChevronRight className="ml-1 size-4"/>
                                            </Link>
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <GroupList groups={groups}/>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" asChild className="w-full">
                                            <Link href="/contacts?createGroup=true">
                                                <Users className="mr-2 size-4"/>
                                                Create New Group
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>           
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard