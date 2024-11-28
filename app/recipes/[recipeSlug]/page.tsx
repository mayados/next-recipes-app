"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import { Clock9, Key, ShoppingBasket } from 'lucide-react';
import { Gauge } from 'lucide-react';
import CategoryTag from "@/components/CategoryTag";
import CommentForm from "@/components/CommentForm";
import Button from "@/components/Button";
import Step from "@/components/Step";
import { Download } from 'lucide-react';
import { Heart } from 'lucide-react';
import {CldImage} from "next-cloudinary";
import Title from "@/components/Title";
import { ListChecks } from 'lucide-react';
import { CookingPot } from 'lucide-react';
import { GitFork } from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import {  Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { MessageSquareQuote } from 'lucide-react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.css';
// import required modules
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Comment from "@/components/Comment";
import Link from "next/link";
import DownloadPdf from "@/components/DownloadPdf";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';



const Recipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [recipetools, setTools] = useState<RecipeToolType[]>([]);
    const [compositions, setIngredients] = useState<CompositionType[]>([]);
    const [steps, setSteps] = useState<StepType[]>([]);
    const [comment, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState({text: ""})
    const [suggestions, setSuggestions] = useState<RecipeType[] | null>(null)
    // To manage the state between the recipe and user's favorites
    const [isFavorite, setIsFavorite] = useState<FavoriteType | null>(null)

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const {user} = useUser()

    useEffect(() => {
        // We want to know if the recipe is part of the user's favorite recipes
        const fetchRecipe = async () => {
            // Back quotes because dynamical parameter
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: RecipeTypeWithAll = await response.json()
            // Hydrating the recipe with retrieved datas
            setRecipe(data['recipe'])
            // We set ingredients and tools
            setIngredients(data['recipe'].compositions)
            setTools(data['recipe'].recipetools)
            setSteps(data['recipe'].steps)
            setComments(data['recipe'].comment)
            setSuggestions(data['suggestions'])
            const favoriteData = data.favorite
            if(favoriteData){
                setIsFavorite(favoriteData)                
            }
        }
        // We call the function
        fetchRecipe()
        // useEffect re-called if the recipeSlug changes
    }, [params.recipeSlug])

 
    const addRecipeToFavorites = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!user) return;
        try{

            const { id, primaryEmailAddress, username } = user;

            const response = await fetch(`/api/recipes/favorites`, {
                method: "POST",
                // We use JSON.stringify to assign key => value in json string
                body: JSON.stringify({
                    clerkUserId: id,
                    userPseudo: username,
                    email: primaryEmailAddress,
                    recipeId: recipe?.id,
                })
            });
            if (response.ok) {
                toast.success('Recipe added to favorites');  
                const dataResponse = await response.json();
                const favoriteData = dataResponse.favorite
                if(favoriteData){
                    setIsFavorite(favoriteData)                
                }                   
            }

        }catch(error){
            console.error("Erreur lors de l'ajout du commentaire :", error);
            toast.error('Something went wrong with adding to favorites. Please try again');      
        }

    }


    const removeRecipeFromFavorites = async (e: React.MouseEvent<HTMLButtonElement>,favoriteId: string) => {
        if(!user) return;
        console.log(favoriteId)
        try {
            const response = await fetch(`/api/recipes/favorites/${favoriteId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success('Favorite removed with success');      
                // If the API's call is working, we delete the comment locally => update view           
                setIsFavorite(null);
            }
        } catch (error) {
            console.error("Error during favorite's suppression :", error);
            toast.error('Something went wrong with removing your favorite. Please try again');      
        }
    }

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

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/comments/delete/${commentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success('Comment deleted with success');      
                // If the API's call is working, we delete the comment locally => update view           
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            toast.error('Something went wrong with deleting your comment. Please try again');      
        }
    }

    const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment({ text: e.target.value });
    };

    const addComment = async (e : FormEvent) => {
        // We don't want the form to refresh the page when submitted
        e.preventDefault()
        if(!user) return;
        try{

            const { id, primaryEmailAddress, username } = user;

            const response = await fetch(`/api/comments/commentsRecipe`, {
                method: "POST",
                // We use JSON.stringify to assign key => value in json string
                body: JSON.stringify({text: newComment.text,
                    clerkUserId: id,
                    email: primaryEmailAddress,
                    userPseudo: username,
                    recipeId: recipe?.id,
                    createdAt: new Date().toISOString() 
                })
            });
            if (response.ok) {
                toast.success('Comment added with success');      
                const commentAdded = await response.json();
                setComments(prevComments => [commentAdded['comment'],...prevComments, ]); 
                setNewComment({text: ""});                        
            }

        }catch(error){
            console.error("Erreur lors de l'ajout du commentaire :", error);
            toast.error('Something went wrong with deleting your comment. Please try again');      
        }

    }
            

  return (
    
    <div className="p-5">
        <div><Toaster/></div>
        <section className="flex flex-col lg:flex-row h-[50vh] bg-gray-800 mt-5">
            {/* Basic informations */}
            <div className="lg:flex-1 flex flex-col h-[50vh] items-center justify-center lg:h-full">
                <h1 className="text-center mb-3 text-4xl">{recipe?.title}</h1>
                <div className="flex justify-center mb-3 gap-2">
                    <CategoryTag categoryName={recipe?.category.title} />
                    <Clock9 />{recipe?.timePreparation} min.
                    <ul className="flex justify-center">
                    {   displayDifficultyLevel(recipe?.difficulty)}                        
                    </ul>
                </div>
                <div className="flex gap-2 justify-center">
                {recipe && (
                    <>
                        <DownloadPdf
                        icon={Download}
                        label="Download"
                        objectReference={recipe}
                        filename={recipe.slug || ""}
                        />
                        {isFavorite ? (
                        <Button
                            icon={Heart}
                            iconFill="red"
                            label="Favorite"
                            specifyBackground=""
                            action={(e) => removeRecipeFromFavorites(e, isFavorite.id)}
                        />
                        ) : (
                        <Button
                            icon={Heart}
                            iconFill="none"
                            label="Favorite"
                            specifyBackground=""
                            action={addRecipeToFavorites}
                        />
                        )}
                    </>
                    )}

                </div>
            </div>
            <div className="lg:flex-1">
                <Image
                    className="h-[100%] w-[100%] object-cover"
                    src={recipe?.picture || "/default-image"}
                    width={500}
                    height={500}
                    alt="Picture of the recipe"
                />
            </div>
        </section>
        {/* Main instructions about the recipe */}
        <section className=" mt-10 flex flex-col flex-wrap lg:flex-row">
            {/* Instructions */}
            <div className="lg:flex-1">
                <Title label="Instructions" icon={ListChecks} />
                <p>{recipe?.instructions}</p>
            </div>
            {/* Ingredients and tools */}
            <div className="lg:flex-1 mt-10">
                <Title label="Ingredients and Tools" icon={CookingPot} />
                {/* Tabs to choose to display ingredients or tools */}
                <TabGroup className="rounded-md border-2 border-gray-600">
                    <TabList className="bg-gray-600 p-2 flex gap-3">
                        <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">
                            Ingrédients
                        </Tab>
                        <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">
                            Tools
                        </Tab>
                    </TabList>
                    <TabPanels>
                        {/* Content of Tab1 => Ingredients */}
                        <TabPanel className="flex justify-evenly flex-wrap gap-3 px-2">
                        {
                            compositions.map((composition) => (
                                <div key={composition.id} className="mt-4 flex flex-col items-center text-center">
                                    <Image
                                        className="h-[100px] w-[100px] object-cover"
                                        src={`${composition?.ingredient?.picture}`}
                                        width={500}
                                        height={500}
                                        alt="Picture of the ingredient"
                                    />                        
                                    <p>{composition?.ingredient?.label}</p>                            
                                </div>
        
                        ))                      
                        }   
                        </TabPanel>
                        {/* Content of Tab2 => Tools */}
                        <TabPanel className="flex flex-wrap gap-3 px-2">
                            {
                            recipetools.map((tools) => (
                                <div className="mt-4 flex flex-col items-center text-center">
                                    <Image
                                        className="h-[100px] w-[100px] object-cover"
                                        src={`${tools?.tool?.picture}`}
                                        width={500}
                                        height={500}
                                        alt="Picture of the tool"
                                    />                          
                                    <p>{tools?.tool?.label}</p>                            
                                </div>
        
                            ))                      
                            }  
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </section>
        {/* Steps of the recipe => with a swiper and steps count on the title */}
        <section className="mt-10">
            <Title label={`Steps (${steps.length})`} icon={GitFork} />
            <Swiper
                slidesPerView={2}
                spaceBetween={30}
                cssMode={true}
                pagination={{ clickable: true }}  // Enable pagination bullets and make them clickable
                mousewheel={true}  // Allow mousewheel navigation
                keyboard={true}    // Allow keyboard navigation
                grabCursor={true}  // Enable grab cursor functionality
                modules={[Pagination, Mousewheel, Keyboard]}  // Include necessary modules
                className="mySwiperRecipePage"
                breakpoints={{
                    // Display fewer slides on smaller screens
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 2 },
                    1280: { slidesPerView: 2 },
                  }}
                >
                {steps.map((step) => (
                    <SwiperSlide key={step.number} className="h-[90vh] bg-neutral-600">
                    <Step text={step.text} number={step.number} />
                    </SwiperSlide>
                ))}
            </Swiper>



        </section>
        {/* Comments about the recipe */}
        <section className="mt-10">
            <Title label={`Comments (${comment.length})`} icon={MessageSquareQuote} />
            {comment.map((comment) => (
                <>
                    <Comment key={comment.id} comment={comment} action={() => deleteComment(comment.id)} borderColor="border-slate-200" borderSize="border-2" />
                </>
            ))}
        </section>
        {/* Adding comment section */}
        <section className="mt-10 w-full">
            <Title label="Add a comment" icon={MessageSquareQuote} />
            <CommentForm name="text" placeholder="Write your comment here..." action={addComment} type="submit" value={newComment.text} onChange={handleCommentInputChange}  />
        </section>
        {/* Suggestions */}
        <section className="mt-5">
            <Title label="Suggestions" icon={Lightbulb} />
            <div className="flex justify-center flex-wrap lg:justify-start gap-5 mt-5">
                {
                    suggestions?.map((suggestion: RecipeType) => (
                        <article key={suggestion.id} className='w-[200px] group border-slate-700 border-2 rounded-md'>
                            <div>
                                <Image
                                    className="h-[100%] w-[100%] object-cover"
                                    src={`${suggestion.picture}`}
                                    width={500}
                                    height={500}
                                    alt="Picture of the ingredient"
                                />     
                            </div>
                            <div className='p-3 flex flex-col items-center text-center'>
                                <h2 className='text-xl font-bold'>{suggestion?.title}</h2>
                                <Link className="flex flex-row rounded-md p-1 hover:bg-gray-600 cursor-pointer my-3" href={`/recipes/${recipe?.slug}`}>
                                    View recipe <ArrowRight  />
                                </Link>
                            </div>   
                        </article>                     
                    ))                      
                }                  
            </div>
        </section>
    </div>

  )
}

export default Recipe
