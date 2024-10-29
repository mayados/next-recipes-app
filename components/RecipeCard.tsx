import React from 'react'
import Image from "next/image";
import {CldImage} from "next-cloudinary";
import { Gauge } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import CategoryTag from './CategoryTag';
import LinkButton from './LinkButton';
import { Leaf } from 'lucide-react';
import { HeartPulse } from 'lucide-react';
import { Timer } from 'lucide-react';


interface RecipeCardProps{
  recipe: RecipeType;
    categoryName: string;
    difficultyLevel?: number | undefined;
    isHealthy: boolean;
    IsVegan: boolean;
}

  // Display icons if the recipe is vegan, healthy or both
  const displayTopIcons = (isHealthy: boolean, IsVegan: boolean) => {
    
    if((isHealthy && IsVegan)){
      return(
        <div className='absolute flex bg-gray-300 top-3 right-3 p-1 rounded-md'>
          <Leaf fill='green' className='text-black' />       
          <HeartPulse fill='red' className='text-black' />           
        </div>
            
      );

    }else if(isHealthy){
      return(
        <div className='absolute bg-gray-300 top-3 right-3 rounded-md p-1'>
        <Leaf fill='green' className='text-black' />       
      </div>
      );
    }else{
      return(
      <div className='absolute bg-gray-300 top-3 right-3 rounded-md p-1'>   
        <HeartPulse fill='pink' className='text-black' />           
      </div>
      );
      return null;
    }
  }

// display difficulty level
const displayDifficultyLevel =  (difficultyLevel: number | undefined)  => {
  switch(difficultyLevel) {
    case 1:
      return(
        <>
          <li><Gauge className='text-green-600' /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>        
        </>

      )
      break;
    case 2:
      return(
        <>
          <li><Gauge className='text-green-600' /></li>
          <li><Gauge className='text-green-600' /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>        
        </>

      )
      break;
    case 3:
      return(
        <>
          <li><Gauge className='text-orange-600' /></li>
          <li><Gauge className='text-orange-600' /></li>
          <li><Gauge className='text-orange-600' /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>        
        </>

      )
        break;
    case 4:
      return(
        <>
          <li><Gauge className='text-orange-800' /></li>
          <li><Gauge className='text-orange-800' /></li>
          <li><Gauge className='text-orange-800' /></li>
          <li><Gauge className='text-orange-800' /></li>
          <li><Gauge /></li>        
        </>

      )
      break;
    case 5:
      return(
        <>
          <li><Gauge className='text-red-700' /></li>
          <li><Gauge className='text-red-700' /></li>
          <li><Gauge className='text-red-700' /></li>
          <li><Gauge className='text-red-700' /></li>
          <li><Gauge className='text-red-700' /></li>        
        </>

      )
      break;
    default:
      return(
        <>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>
          <li><Gauge /></li>        
        </>

      )
  }

}


const RecipeCard:React.FC<RecipeCardProps> = ({ recipe, categoryName, difficultyLevel, isHealthy, IsVegan }) => {
  const difficulty = displayDifficultyLevel(difficultyLevel);
  const topIcons = displayTopIcons(isHealthy, IsVegan);

  return (
    <div className='group border-slate-700 border-2 rounded-md hover:bg-gray-600 cursor-pointer hover:-translate-y-2 duration-500'>
        <div className='relative'>
          <CldImage
                alt=""
                src="cld-sample-5"
                width="250"
                height="250"
                crop={{
                    type: 'auto',
                    source: true
                }}
            />
          {topIcons}
        </div>
        <div className='p-3 text-left'>
          <h2 className='text-xl font-bold mb-3'>{recipe.title}</h2>
          {/* Tag of the recipe's category*/}
          <CategoryTag categoryName={categoryName} />
          <p className='text-sm text-slate-300 flex mb-3'><Timer />{recipe.timePreparation} min.</p>
          <ul className='flex flex-wrap gap-2'>
              {difficulty}
          </ul>
          
          <LinkButton key={recipe.id} label="View Recipe" icon={ArrowRight} path="/recipes/" dynamicPath={recipe.slug} />          
        </div>

    </div>
  )
}

export default RecipeCard