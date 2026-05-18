"use client"


import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import NavItems from './NavItems';

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

            <div
            // variant="ghost"
            className="flex items-center 
             gap-3 text-gray-4 hover:text-yellow-500 cursor-pointer"
             >
                <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}

                    <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                        {user?.name[0]}
                    </AvatarFallback>
                </Avatar>

                {/*USER NAME START */}
                <div
                 className="hidden md:flex flex-col items-start"
                 >
                <span
                className='text-base font-medium
                 text-gray-400'>
                    {user?.name ?? ""}
                    </span>
                </div>
                {/*USER NAME END */}

            </div>


        </DropdownMenuTrigger>
        <DropdownMenuContent className='text-gray-40 w-full py-4'> 


               <DropdownMenuLabel>
            {/*USER PROFILE + NAME START */}

            <div className='flex relative items-center gap-3 py-2'>
         <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                    <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                        {user?.name[0]}
                    </AvatarFallback>
                </Avatar>

                <div
                 className="flex flex-col items-start"
                 >
                <span
                className='text-sm font-medium
                 text-gray-400'>
                    {user?.name ?? ""}
                    </span>
                <span
                className='text-sm font-medium
                 text-gray-400'>
                    {user?.email ?? ""}
                    </span>
                </div>
            </div>
            {/*USER PROFILE + NAME END */}

               </DropdownMenuLabel>
               <DropdownMenuSeparator className='bg-gray-600'/>
               <DropdownMenuItem
               onClick={handleSignout}
               className='text-gray-100 text-sm font-medium 
               focus:bg-transparent focus:text-yellow-500
                transition-colors
                 cursor-pointer'
               >
                      <LogOut className='mr-2 h-4 w-4 hidden sm:block'/>
                      Logout
               </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-gray-600'/>

                <nav className='sm:hidden'>
                    <NavItems/>
                </nav>
      
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown