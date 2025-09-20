"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { ArrowLeft, ArrowLeftRight, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ExpenseList from '@/components/ExpenseList'
import SettlementsList from '@/components/SettlementsList'
import GroupBalances from "@/components/GroupBalances";
import GroupMembers from "@/components/GroupMembers";

const GroupPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
    groupId: params.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="grey" />
      </div>
    );
  }

  const group = data?.group;
  const members = data?.members || [];
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balances = data?.balances || [];
  const userLookupMap = data?.userLookupMap || [];

  return (
    <div className="container mx-auto py-6 max-w-4xl px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-4 rounded-md">
              <Users className="size-10 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl gradient-title">{group?.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">{group?.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total Members:{members.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Button asChild variant="outline">
              <Link href={`/settlements/user/${params.id}`}>
                <ArrowLeftRight className="mr-2 size-4" />
                Settle Up
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/expenses/new`}>
                <PlusCircle className="mr-2 size-4" />
                Add Expense
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Group Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupBalances balances = {balances}/>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Members</CardTitle>
              <hr className="text-gray-800"></hr>
            </CardHeader>
            <CardContent>
              <GroupMembers members={members}/>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="hover:cursor-pointer" value="expenses">Expenses ({expenses.length})</TabsTrigger>
            <TabsTrigger className="hover:cursor-pointer" value="settlements">Settlements ({settlements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
            <ExpenseList 
                expenses={expenses} 
                showOtherPerson={true}
                isGroupExpense={true}
                userLookupMap={userLookupMap}
            />
        </TabsContent>
        <TabsContent value="settlements" className="space-y-4">
            <SettlementsList
                settlements={settlements}
                isGroupSettlement={true}
                userLookupMap={userLookupMap}
            />
        </TabsContent>
        </Tabs>
    </div>
  );
};

export default GroupPage;
