import React from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {LucideIcon} from 'lucide-react'


interface ButtonProps {
  label:string;
  icon: LucideIcon;
  specifyBackground: string;
  action?: () => void; 
}

const findBackgroundColor =  (specifyBackground)  => {
  if(specifyBackground === "none"){
    return "";
  } else{
    return "bg-pink-600"
  }

}

const Button:React.FC<ButtonProps> = ({label, icon: Icon, specifyBackground, action}) => {

  const backgroundColor = findBackgroundColor(specifyBackground);

  return (
        <button onClick={action} className={`flex f px-5 py-2 mt-1 ${backgroundColor} from-white hover:bg-pink-500 cursor-pointer rounded-lg`}>
            <Icon className="mx-2" /> 
            {label} 
        </button>
    )    

}

export default Button