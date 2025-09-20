import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import z, { set } from "zod";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConvexMutation, useConvexQuery } from "@/hooks/useConvexQuery";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";


const groupSchema = z.object({
    name:z.string().min(1,"Group Name is Required"),
    description:z.string().optional(),
})

const CreateGroupModel = ({isOpen,onClose,onSuccess}) => {
    const[selectedMembers,setSelectedMembers] = useState([])
    const[searchQuery,setSearchQuery] = useState("")
    const[commandOpen,setCommandOpen] = useState(false)

    const {data:currentUser} = useConvexQuery(api.users.getCurrentUser)
    const {data:searchResults,isLoading:isSearching} = useConvexQuery(api.users.searchUsers,{query:searchQuery})

    const createGroup = useConvexMutation(api.contacts.createGroup)
    
    const addMember = (user)=>{
        if(!selectedMembers.some((m)=>m.id===user.id)){
            setSelectedMembers([...selectedMembers,user])
        }
        setCommandOpen(false)
    }

    const removeMember = (userId) =>{
        setSelectedMembers(selectedMembers.filter((m)=>m.id!==userId))
    }

    const {register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm({
        resolver:zodResolver(groupSchema),
        defaultValues:{
            name:"",
            description:"",
        }
    })

    const handleClose=()=>{
        reset()
        setSelectedMembers([])
        onClose()
    }

    const onSubmit = async(data) =>{
        try{

            const memberIds = selectedMembers.map((member)=> {return member.id})
            const groupId = await createGroup.mutate({
                name:data.name,
                description:data.description,
                members:memberIds,
            })
            toast.success("Group Created Successfully")
            handleClose()

            if(onSuccess){
                onSuccess(groupId)
            }
        }
        catch(error){
            toast.error("Failed to Create group:"+error.message)

        }


    }



    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
            
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id='name' placeholder="Enter group name here" {...register("name")}/>
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="name">Group Description (Optional)</Label>
                        <Textarea id='description' placeholder="Enter group description" {...register("description")}/>
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Members</Label>
                        <div className="flex flex-wrap gap-2 my-2">
                            {
                                currentUser&&(
                                    <Badge variant="secondary" className="px-3 py-1">
                                        <Avatar className="size-5 mr-2">
                                            <AvatarImage src={currentUser.imageUrl}/>
                                            <AvatarFallback>
                                                {currentUser.name?.charAt(0)|| "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{currentUser.name} (You)</span>
                                    </Badge>
                                )
                            }

                            {/* rendering the selected members */}

                            {
                                selectedMembers.map((member)=>(
                                    <Badge key={member.id} variant="secondary" className="px-3 py-1">
                                        <Avatar className="size-5 mr-2">
                                            <AvatarImage src={member.imageUrl}/>
                                            <AvatarFallback>
                                                {member.name?.charAt(0)||"?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{member.name}</span>
                                        <button type="button" onClick={()=>removeMember(member.id)} className="ml-2 text-muted-foreground">
                                            <X className="size-3"/>
                                        </button>
                                    </Badge>
                                ))
                            }



                            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                                <PopoverTrigger asChild>
                                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                        <UserPlus className="size-3.5"/>
                                        Add Member
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0" align="start" side="bottom">
                                    <Command>
                                        <CommandInput placeholder="Search by name or email..." value={searchQuery} onValueChange={setSearchQuery} />
                                        <CommandList>
                                            <CommandEmpty>
                                                {
                                                    searchQuery.length<2?(
                                                        <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                            Type atleast 2 characters to search
                                                        </p>
                                                    ):(
                                                        isSearching?(
                                                            <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                                Searching...
                                                            </p>
                                                        ):(
                                                            <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                                                                No Users Found
                                                            </p>
                                                        )
                                                    )
                                                }
                                            </CommandEmpty>
                                            <CommandGroup heading="Users">
                                                {
                                                    searchResults?.map((user)=>(
                                                        <CommandItem key={user.id} value={user.name + user.email} onSelect={()=>addMember(user)}>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="size-6">
                                                                    <AvatarImage src={user.imageUrl}/>
                                                                    <AvatarFallback>{user.name?.charAt(0)|| "?"}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm">{user.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                                </div>
                                                            </div>
                                                        </CommandItem>
                                                    ))
                                                }
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        {
                            selectedMembers.length === 0 && (
                                <p className="text-sm text-amber-600">Add at least one other person to the group</p>
                            )
                        }

                    </div>
                
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting||selectedMembers.length===0}>
                            {
                                isSubmitting?'Creating...':'Create Group'
                            }
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
};

export default CreateGroupModel;
