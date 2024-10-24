import React from 'react'

interface TagProps {
    name: string;
}

const Tag:React.FC<TagProps> = ({name}) => {
  return (
    <span 
        className='px-3 py-2 text-xs rounded-full bg-neutral-500 group-hover:bg-blue-400'
    >
        {name}
    </span>
  )
}

export default Tag