"use client"


import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Avatar } from 'radix-ui';

const UserDropDown = () => {
    const router = useRouter();

    const handleSignout = () => {
        router.push('/sign-in');
    };


    const user={
        name:"John Doe",
        email:"pH5r9@example.com"
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button 
            variant="ghost"
             className="flex items-center 
             gap-3 text-gray-4 hover:text-yellow-500
             ">
                <Avatar className="h-8 w-8">
                    <AvatarImage

                </Avatar>

            </Button>


        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuLabel>Billing</DropdownMenuLabel>
            <DropdownMenuLabel>Team</DropdownMenuLabel>
            <DropdownMenuLabel>Subscription</DropdownMenuLabel>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown