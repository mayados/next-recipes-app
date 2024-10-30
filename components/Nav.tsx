"use client"

import React from 'react'
import Image from "next/image";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession
} from '@clerk/nextjs'
import { checkUserRole } from '../lib/utils';
import DarkModeToggle from './DarkModeToggle';


interface NavProps{
  logo: String;
}


const menu = [
  {title: "Recipes", url: '/recipes'},
  {title: "Search", url: '/search'},
  {title: "Blog", url: '/blog'},
  {title: "Profile", url: '/profile'},
  {title: "Admin", url: '/admin', role: 'admin'},
];

const Nav:React.FC<NavProps> = ({ logo}) => {

  // a hook from clerk which enables to retrieve user's session data
  const { session } = useSession();
  const userRole = checkUserRole(session);

  return (
    <nav className=' bg-slate-800 flex px-3 text-white h-[8vh] items-center justify-between'>
        <a href='/'>{logo}</a>
        <ul className='flex text-white gap-3'>
            <SignedOut>
              <li><a href={`/recipes`}>Recipes</a></li>                    
              <li><a href={`/search`}>Search</a></li>                    
              <li><a href={`/blog`}>Blog</a></li>                    
            <SignInButton />
          </SignedOut>
          <SignedIn>

              {menu.map((element) =>
                (element.role === 'admin' && userRole === 'org:admin') || !element.role ? (
                  <li key={element.title}><a href={`${element.url}`}>{element.title}</a></li>                    
                ) : null
              )}
            <UserButton />
          </SignedIn>      
          <DarkModeToggle />         
        </ul>
    </nav>
  )
}

export default Nav