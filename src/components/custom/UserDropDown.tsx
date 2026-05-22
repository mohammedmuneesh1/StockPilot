"use client"


import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import NavItems from './NavItems';
import { SIGN_OUT } from '@/lib/actions/auth.action';


interface UserDropDownInterface{
    user:{
      id:string,
      name:string,
      email:string
    } | null;
    onSearchClick?: () => void;
}
const UserDropDown:React.FC<UserDropDownInterface> = ({user, onSearchClick}) => {
    const router = useRouter();

    const handleSignout =async () => {
        await SIGN_OUT();
        router.push('/sign-in');
    };



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
                    <NavItems onSearchClick={onSearchClick} />
                </nav>
      
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown