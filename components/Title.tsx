import React from 'react'
import {LucideIcon} from 'lucide-react'


interface TitleProps {
  label:string;
  icon: LucideIcon; 
}

const Title:React.FC<TitleProps> = ({label, icon: Icon}) => {
  return (
        <h2 className='text-red-500 text-xl flex items-end font-semibold mb-2'>
            <Icon className='mr-2' /> 
            {label} 
        </h2>
    )    

}

export default Title