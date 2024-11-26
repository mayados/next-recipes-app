import React from 'react'

interface TagProps {
    name: string;
}

const Tag:React.FC<TagProps> = ({name}) => {
  return (
    <span 
        className='px-3 py-2 text-xs rounded-full bg-pink-600 group-hover:bg-blue-400'
    >
      <p className='text-slate-300'>{name}</p>  
    </span>
  )
}

export default Tag