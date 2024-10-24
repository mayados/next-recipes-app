import React, { FormEvent } from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {LucideIcon} from 'lucide-react'
import { Field, Textarea } from '@headlessui/react';
import Button from './Button';
import { SendHorizontal } from 'lucide-react';



interface CommentFormProps {
  name:string;
  placeholder: string;
  action?: (e: FormEvent) => void; 
  onChange?: (e: React.ChangeEvent) => void; 
  type?: "submit" | "reset" | "button" | undefined;
  value?: string;
}


const CommentForm:React.FC<CommentFormProps> = ({name, placeholder, action, type, onChange, value}) => {

  return (
        <form onSubmit={action} className="flex flex-col justify-center items-center">
            <Field className="w-full">
                <Textarea name={name} onChange={onChange} placeholder={placeholder} value={value} className="w-full min-h-[10vh] rounded-md bg-gray-700 text-white p-3"></Textarea>
            </Field>
            <Button icon={SendHorizontal} label="Send" specifyBackground="" type={type} />
        </form>
    )    

}

export default CommentForm