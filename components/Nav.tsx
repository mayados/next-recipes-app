"use client"

import React, { useState } from 'react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession
} from '@clerk/nextjs'
import { checkUserRole } from '../lib/utils';
import { CookingPot, Menu, X } from 'lucide-react';
import Link from 'next/link';
import ThemeTogggle from '@/components/ThemeToggle';





interface NavProps{
  logo: string;
}


const menu = [
  {title: "Recipes", url: '/recipes'},
  {title: "Search", url: '/search'},
  {title: "Blog", url: '/blog'},
  // {title: "Profile", url: '/profile'},
  {title: "Admin", url: '/admin', role: 'admin'},
];

const Nav:React.FC<NavProps> = ({ logo}) => {

  // a hook from clerk which enables to retrieve user's session data
  const { session } = useSession();
  const userRole = checkUserRole(session);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-slate-800 relative flex px-3 text-white h-[8vh] items-center justify-between">
    {/* Logo */}
    <a className='text-pink-600' href="/">{logo}</a>

    {/* Menu burger button for mobile */}
    <button
      onClick={toggleMenu}
      className="text-white md:hidden focus:outline-none"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      {/* display burger menu or closing cross */}
      {isOpen ? (
        <X className="w-6 h-6" /> 
      ) : (
        <Menu className="w-6 h-6" /> 
      )}
    </button>

    {/* Navigation links */}
    <ul className={`text-white gap-3 ${isOpen ? 'flex flex-col justify-evenly items-center absolute top-[8vh] h-[92vh] bg-green-700 z-10 w-screen' : 'hidden'}  lg:flex`}>
      <SignedOut>
        <li><Link className={`lg:hover:text-pink-600 ${isOpen ? 'hover:none' : 'hover:text-pink-600'}`} href={`/recipes`}>Recipes</Link></li>                    
        <li><Link className='lg:hover:text-pink-600' href={`/search`}>Search</Link></li>                    
        <li><Link className='lg:hover:text-pink-600' href={`/blog`}>Blog</Link></li>  
        <div className="lg:hover:text-pink-600">
          <SignInButton />
        </div>                  
        {/* <SignInButton className='lg:hover:text-pink-600' /> */}
      </SignedOut>
      
      <SignedIn>
        {menu.map((element) =>
          (element.role === 'admin' && userRole === 'org:admin') || !element.role ? (
            <li key={element.title}><Link className='lg:hover:text-pink-600 ' href={`${element.url}`}>{element.title}</Link></li>                    
          ) : null
        )}
        
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="My recipes and activities"
              labelIcon={<CookingPot />}
              href="/profile"
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>    
      <ThemeTogggle />
  
    </ul>
  </nav>
  )
}

export default Nav