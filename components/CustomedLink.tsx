import Link from 'next/link';
import React from 'react'

interface LinkProps {
  label:string;
  textColor: string;
  href: string;
  fontSize: string;
}


const CustomedLink:React.FC<LinkProps> = ({label, textColor, href, fontSize}) => {

  return (
        <Link href={href} className={`${textColor} ${fontSize} hover:cursor-pointer `}>
            {label} 
        </Link>
    )    

}

export default CustomedLink