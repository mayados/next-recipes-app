"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import { Clock9, Key } from 'lucide-react';
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
import { SendHorizontal } from 'lucide-react';
import { Field, Label, Tab, TabGroup, TabList, TabPanel, TabPanels, Textarea } from '@headlessui/react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { MessageSquareQuote } from 'lucide-react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.css';
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Comment from "@/components/Comment";
import { json } from "stream/consumers";
import Link from "next/link";
import DownloadPdf from "@/components/DownloadPdf";


const Recipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [recipetools, setTools] = useState<RecipeToolType[]>([]);
    const [compositions, setIngredients] = useState<CompositionType[]>([]);
    const [steps, setSteps] = useState<StepType[]>([]);
    const [comment, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState({text: ""})
    const [suggestions, setSuggestions] = useState<RecipeType | null>(null)
    // To manage recipes put in favorite (in localstorage for now)
    const [favoriteRecipe, setFavoriteRecipe] = useState<RecipeType | null>(null);


    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    useEffect(() => {
        const fetchRecipe = async () => {
            // Back quotes because dynamical parameter
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: RecipeType = await response.json()
            // Hydrating the recipe with retrieved datas
            setRecipe(data['recipe'])
            // We set ingredients and tools
            setIngredients(data['recipe'].compositions)
            setTools(data['recipe'].recipetools)
            setSteps(data['recipe'].steps)
            setComments(data['recipe'].comment)
            setSuggestions(data['suggestions'])

        }
        // We call the function
        fetchRecipe()
        // useEffect re-called if the recipeSlug changes
    }, [params.recipeSlug])

    const saveToLocalStorage = async (recipe:RecipeType) => {
        localStorage.setItem("favoriteRecipe", JSON.stringify(recipe))
        setFavoriteRecipe(recipe);
        console.log(localStorage.getItem("favoriteRecipe"))
    }

    // To retrieve favorite recipes, we have to retrieve the value using json parse, to get something we can read
    const getFromLocalStorage = (): RecipeType | null => {
        const storedRecipe = localStorage.getItem("favoriteRecipe");
        if (storedRecipe) {
            return JSON.parse(storedRecipe);
  

        }
        return null;
    };

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/recipes/${recipe?.slug}/comments/${commentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                // Si l'appel à l'API fonctionne, on supprime le commentaire localement
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
        }
    }

    const handleCommentInputChange = (e: React.ChangeEvent) => {
        setNewComment({ text: e.target.value });
    };

    const addComment = async (e : FormEvent) => {
        // We don't want the form to refresh the page when submitted
        e.preventDefault()
        try{

            const response = await fetch(`/api/comments`, {
                method: "POST",
                // We use JSON.stringify to assign key => value in json string
                body: JSON.stringify({text: newComment.text,
                    userId: "6718be46cbfe3064f8998c23",
                    recipeId: "671750047bbc414450065a73",
                    createdAt: new Date().toISOString() 
                })
            });
            if (response.ok) {
                const commentAdded = await response.json();
                setComments(prevComments => [commentAdded['comment'],...prevComments, ]); 
                setNewComment({text: ""});                        
            }

        }catch(error){
            console.error("Erreur lors de l'ajout du commentaire :", error);
        }

    }
            

  return (
    
    <div className="p-5">
        <section className="lg:w-screen flex flex-col lg:flex-row h-[50vh] bg-gray-800 mt-5">
            {/* Basic informations */}
            <div className="lg:flex-1 flex flex-col h-[50vh] items-center justify-center lg:h-full">
                <h1 className="text-center mb-3 text-4xl">{recipe?.title}</h1>
                <div className="flex justify-center mb-3 gap-2">
                    <CategoryTag categoryName={recipe?.category.title} />
                    <Clock9 />{recipe?.timePreparation} min.
                    <ul className='flex justify-center'>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                    </ul>
                </div>
                <div className="flex gap-2 justify-center">
                    <DownloadPdf icon={Download} label="Download" objectReference={recipe} filename={recipe?.slug} />
                    <Button icon={Heart} label="Favorite" specifyBackground="" action={() => saveToLocalStorage(recipe)} />
                </div>
            </div>
            <div className="lg:flex-1">
                <Image
                    className="h-[100%] w-[100%] object-cover"
                    src={`https://res.cloudinary.com/${cloudName}/${recipe?.picture}`}
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
                            <Gauge /> Ingrédients
                        </Tab>
                        <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">
                            <Gauge /> Tools
                        </Tab>
                    </TabList>
                    <TabPanels>
                        {/* Content of Tab1 => Ingredients */}
                        <TabPanel className="flex flex-wrap gap-3 px-2">
                        {
                            compositions.map((composition) => (
                                <div key={composition.id} className="mt-4 flex flex-col items-center text-center w-2/12">
                                    <Image
                                        className="h-[100%] w-[100%] object-cover"
                                        src={`https://res.cloudinary.com/${cloudName}/${composition.ingredient.picture}`}
                                        width={500}
                                        height={500}
                                        alt="Picture of the ingredient"
                                    />                        
                                    <p>{composition.ingredient.label}</p>                            
                                </div>
        
                        ))                      
                        }   
                        </TabPanel>
                        {/* Content of Tab2 => Tools */}
                        <TabPanel className="flex flex-wrap gap-3 px-2">
                            {
                            recipetools.map((tools) => (
                                <div className="mt-4 flex flex-col items-center text-center w-2/12">
                                    <Image
                                        className="h-[100%] w-[100%] object-cover"
                                        src={`https://res.cloudinary.com/${cloudName}/${tools.tool.picture}`}
                                        width={500}
                                        height={500}
                                        alt="Picture of the ingredient"
                                    />                          
                                    <p>{tools.tool.label}</p>                            
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
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
            >
                {
                steps.map((step) => (
                    <SwiperSlide>
                        <Step text={step.text} number={step.number} />
                    </SwiperSlide>
                    ))                      
                }  
            </Swiper>

        </section>
        {/* Comments about the recipe */}
        <section className="mt-10">
            <Title label={`Comments (${comment.length})`} icon={MessageSquareQuote} />
            {comment.map((comment) => (
                <>
                    <Comment key={comment.id} comment={comment} action={() => deleteComment(comment.id)}  />
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
            <div className="flex justify-start gap-5 mt-5">
                {
                    suggestions?.map((suggestion) => (
                        <article key={suggestion.id} className='w-[200px] group border-slate-700 border-2 rounded-md'>
                            <div>
                                <Image
                                    className="h-[100%] w-[100%] object-cover"
                                    src={`https://res.cloudinary.com/${cloudName}/${suggestion.picture}`}
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
