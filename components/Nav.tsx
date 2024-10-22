import React from 'react'
import Image from "next/image";


interface NavProps{
  logo: String;
  menu: string[];
}



const Nav:React.FC<NavProps> = ({ logo, menu }) => {
  return (
    <nav className=' bg-slate-800 flex px-3 text-white h-[8vh] items-center justify-between'>
        <p>{logo}</p>
        <ul className='flex text-white gap-3'>
            {
                menu.map((element) => (
                 <li>{element}</li>                    
                ))
            }
        </ul>
    </nav>
  )
}

export default Nav