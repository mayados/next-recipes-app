import React from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {LucideIcon} from 'lucide-react'


interface ButtonProps {
  label:string;
  icon: LucideIcon;
  specifyBackground: string;
  action?: () => void; 
  type?:  "submit" | "reset" | "button" | undefined;
}

const findBackgroundColor =  (specifyBackground)  => {
  if(specifyBackground === "none"){
    return "";
  } else{
    return "bg-pink-600"
  }

}

const Button:React.FC<ButtonProps> = ({label, icon: Icon, specifyBackground, action, type}) => {

  const backgroundColor = findBackgroundColor(specifyBackground);

  return (
        <button onClick={action} type={type} className={`flex items-center px-3 py-1 mt-1 ${backgroundColor} from-white hover:bg-pink-500 cursor-pointer rounded-lg`}>
            <Icon className="mx-2" /> 
            {label} 
        </button>
    )    

}

export default Button