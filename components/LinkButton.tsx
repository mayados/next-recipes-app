import React from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {LucideIcon} from 'lucide-react'
import Link from 'next/link';
import dynamic from 'next/dynamic';


interface LinkButtonProps {
  label:string;
  icon: LucideIcon;
  actionButton?: () => void;
  path: any
  dynamicPath?: string
}

const LinkButton:React.FC<LinkButtonProps> = ({label, icon: Icon, actionButton, path, dynamicPath}) => {
  return (
    <Link href={`${path}${dynamicPath}`} className='flex f px-5 py-2 mt-3 bg-cyan-900 hover:bg-cyan-800 cursor-pointer rounded-lg' onClick={actionButton}>
        {/* On rend le texte du bouton variable */}
        {label} 
        <Icon className="mx-2" />
    </Link>
  )
}

export default LinkButton