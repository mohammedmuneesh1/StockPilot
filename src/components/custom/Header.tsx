"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropDown from './UserDropDown'

const Header = () => {
  return (
    <div className='sticky top-0 header'>
        <div className="container header-wrapper"> 

<Link href="/">
<Image
src={"/assets/icons/logo.svg"}
alt='StockPilot'
width={140}
height={32}
/>
</Link>



{/*LARGE SCREEN NAV START */}
<nav className="hidden sm:block">
    <NavItems/>
</nav>
{/*LARGE SCREEN NAV END */}

{/*SMALL SCREEN NAV START */}
<div className="block">
<UserDropDown/>
</div>
{/*SMALL SCREEN NAV END */}


        </div>

    </div>
  )
}

export default Header