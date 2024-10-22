import React from 'react'
import Image from "next/image";
import {CldImage} from "next-cloudinary";
import { Gauge } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import CategoryTag from './CategoryTag';
import LinkButton from './LinkButton';

// Il faudra importer en props l'image de la recette
// Mettre une icone coeur sur la card

interface RecipeCardProps{
  recipe: RecipeType;
    categoryName: string;
}



const RecipeCard:React.FC<RecipeCardProps> = ({ recipe, categoryName }) => {
  return (
    <div className='group border-slate-700 border-2 rounded-md hover:bg-gray-600 cursor-pointer hover:-translate-y-2 duration-500'>
        <div>
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
        </div>
        <div className='p-3'>
          <h2 className='text-xl font-bold'>{recipe.title}</h2>
          {/* Tag of the recipe's category*/}
          <CategoryTag categoryName={categoryName} />
          <p className='text-sm text-slate-300'>{recipe.timePreparation} min.</p>
          <ul className='flex flex-wrap gap-2 my-4'>
              <li><Gauge /></li>
              <li><Gauge /></li>
              <li><Gauge /></li>
              <li><Gauge /></li>
              <li><Gauge /></li>
          </ul>
          
          <LinkButton key={recipe.id} label="View Recipe" icon={ArrowRight} path="/recipes/" dynamicPath={recipe.slug} />          
        </div>

    </div>
  )
}

export default RecipeCard