import React from 'react'
import Button from './Button';
import { formatDate } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CommentProps{
    comment: CommentType;
    action: () => void;
    borderColor?: string;
    bgColor?: string;
    borderSize?: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const Comment:React.FC<CommentProps> = ({comment, action, borderColor, bgColor, borderSize}) => {
  return (
    <div className={`flex justify-between  my-3 rounded-md py-2 px-3 ${borderColor} ${bgColor} ${borderSize}`} >
        <div className='flex flex-col'>
          <div className='flex gap-3'>
          <Image
                    className="h-[20px] w-[20px] object-cover rounded-[50%]"
                    src={`https://res.cloudinary.com/${cloudName}/${comment.user.picture}`}
                    width={500}
                    height={500}
                    alt="Picture profile of the user"
                />
            <p>{comment.user.pseudo}</p>            
          </div>
 
            <p className='text-sm text-slate-300'>{formatDate(comment.createdAt)}</p>
            <p>
                {comment.text}  
            </p>            
        </div>
        <Button  label="Delete" icon={Trash2}  action={action} specifyBackground='' />             
    </div>
  )
  

}

export default Comment