"use client"

import React from 'react'
import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession
} from '@clerk/nextjs'
import { checkUserRole } from '../lib/utils';


interface NavProps{
  logo: String;
  menu: string[];
}



const Nav:React.FC<NavProps> = ({ logo, menu }) => {

  // a hook from clerk which enables to retrieve user's session data
  const { session } = useSession();
  const userRole = checkUserRole(session);

  return (
    <nav className=' bg-slate-800 flex px-3 text-white h-[8vh] items-center justify-between'>
        <p>{logo}</p>
        <ul className='flex text-white gap-3'>
            {
                menu.map((element) => (
                 <li><a href={`/${element.toLowerCase()}`}>{element}</a></li>                    
                ))
            }
            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>               
        </ul>
    </nav>
  )
}

export default Nav