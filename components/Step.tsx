import React from 'react'

interface StepProps {
  text:string;
  number: number;
}

const Step:React.FC<StepProps> = ({text, number}) => {
  return (
    <div className='flex flex-col gap-3 items-center'>
        <p className=' text-red-500 text-5xl flex items-end font-semibold mb-2'>
            {number} 
        </p>
        <p>
            {text}
        </p>    
    </div>
    )    
}

export default Step