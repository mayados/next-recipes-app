import React from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {LucideIcon} from 'lucide-react'


interface ButtonProps {
  label:string;
  icon: LucideIcon;
//   actionButton?: () => void;
//   path: any
 
}

const Button:React.FC<ButtonProps> = ({label, icon: Icon}) => {
  return (
        <button className='flex f px-5 py-2 mt-1 bg-pink-600 from-white hover:bg-pink-500 cursor-pointer rounded-lg'>
            <Icon className="mx-2" /> 
            {label} 

        </button>
    )    

}

export default Button