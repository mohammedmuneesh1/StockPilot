"use client"
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface NavItemsProps {
  onSearchClick?: () => void
}

const NavItems: React.FC<NavItemsProps> = ({ onSearchClick }) => {
    const pathName = usePathname();


    const isActive = (path:string) => {
        return pathName === path
    }


  return (
    <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
        {NAV_ITEMS?.map((item) => (
            <li key={item?.href}>
                {item.href === '/search' && onSearchClick ? (
                  <button
                    type='button'
                    onClick={onSearchClick}
                    className={`hover:text-yellow-500 cursor-pointer transition-colors ${isActive(item.href) ? 'text-gray-100' : 'text-gray-400'}`}
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link 
                    href={item.href}
                    className={`hover:text-yellow-500 cursor-pointer transition-colors ${isActive(item.href) ? 'text-gray-100' : 'text-gray-400'}`}
                  >{item.title}</Link>
                )}
            </li>
        ))}

    </ul>
  )
}

export default NavItems