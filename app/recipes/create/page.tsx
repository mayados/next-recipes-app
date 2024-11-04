"use client";

import { useEffect, useState, FormEvent } from "react";
import { Field, Textarea, Label, Legend, Radio, RadioGroup, Fieldset, Input, Select  } from '@headlessui/react';
import Button from "@/components/Button";
import { SendHorizontal } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { slugify } from '@/lib/utils'
import { useRouter } from "next/navigation";
import { CircleX } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { useUser } from "@clerk/nextjs";


export default function CreateRecipe() {

    const { user } = useUser();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const isHealthyChoices = ["Yes","No"];
    const isVeganChoices = ["Yes","No"];
    const difficultyChoices = ["1","2","3","4","5"];
    const [selectedHealthyChoice, setSelectedHealthyChoice] = useState(isHealthyChoices[0])
    const [selectedVeganChoice, setSelectedVeganChoice] = useState(isVeganChoices[0])
    const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyChoices[0])
    // Because we have plenty of values to retrieve from the creation form : 
    const [formValues, setFormValues] = useState({
        title: "",
        preparationTime: "",
        instructions: "",
        isHealthy: "",
        isVegan: "",
        difficulty: "",
        ingredients: [] 
    })
    // Hook to redirect
    const router = useRouter();

    // Retrieve the categories 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories'); 
                const data = await response.json();
                console.log(data)
                setCategories(data);
            } catch (error) {
                console.error("Error during the retrieving of the categories :", error);
            }
        };

        fetchCategories();
    }, []);

    // Retrieve datas from the inputs
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setFormValues({
          ...formValues,
          [event.target.name]: event.target.value,
        });

      };

    //   Retrieve datas from the radio buttons. Because they are in a RadioGroup, we can't retrieve the value just thanks to an event, we have to get the name (of the group) + the value selected
    // For : isVegan, isHealthy, difficulty
    const handleRadioChange = (name: string, value: string) => {
        setFormValues((formValues) => ({
          ...formValues,
          [name]: value,
        }));
      };

    // Retrieve data from the form for ingredients
    const handleIngredientChange = (index, event) => {
        const { name,slug, value } = event.target;
        const newIngredients = [...formValues.ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [name]: value,
            [slug]: slugify(value)
        };
        setFormValues({
            ...formValues,
            ingredients: newIngredients,
        });
        // console.log(formValues)
    };

    // Add an ingredient
    const addIngredient = () => {
        setFormValues({
            ...formValues,
            ingredients: [...formValues.ingredients, { name: "", quantity: "", unity: "", slug: "" }],
        });
    };

    // remove an ingredient
    const removeIngredient = (index) => {
        const newIngredients = formValues.ingredients.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            ingredients: newIngredients,
        });
    };

    // Create the recipe thanks to the API
      const addRecipe = async (e : FormEvent) => {
        // We don't want the form to refresh the page when submitted
        e.preventDefault()

        if(user){
            try{
                console.log("La catégorie sélectionnée est :"+selectedCategory)
                // We retrieve the current user's data because we need it in the api method
                const { id, primaryEmailAddress, username } = user;
                const ingredients = formValues.ingredients
                ingredients.forEach(async (ingredient) => {
                    ingredient["slug"] = slugify(ingredient.name);
                    ingredient["name"] = ingredient.name.toLowerCase();
                });      
                const slug = slugify(formValues.title)
                    const response = await fetch(`/api/recipes/create`, {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        // We use JSON.stringify to assign key => value in json string
                        body: JSON.stringify({
                            title: formValues.title,
                            preparationTime: formValues.preparationTime,
                            instructions: formValues.instructions,
                            isHealthy: formValues.isHealthy,
                            isVegan: formValues.isVegan,
                            difficulty: formValues.difficulty,
                            picture: "picturerecipe",
                            slug: slug,
                            createdAt: new Date().toISOString() ,
                            ingredients: formValues.ingredients,
                            email: primaryEmailAddress?.emailAddress,
                            pseudo: username,
                            clerkUserId: id,
                            category: selectedCategory,
                        })
                    });
                    if (response.ok) {
                        toast.success('Recipe created with success')
                        const dataResponse = await response.json();
                        console.log(dataResponse.recipeSlug)
                        // Method for the client to redirect
                        router.push(`/recipes/${dataResponse.recipeSlug}`)
                    }
        
            }catch(error){
                console.log("erreur")
                toast.error("There was a problem with creating your recipe. Please try again !")
            }                
        } 



    }

  return (

    <>
      <h1 className="text-3xl text-white ml-3 text-center">Create a recipe</h1>
      <div><Toaster/></div>
      <form onSubmit={addRecipe} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
            <div>
                <label htmlFor="">Title</label>
                <Field className="w-full">
                    <Textarea name="title" placeholder="e.g : Tarte à la framboise"  className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        onChange={(event)=> handleInputChange(event)}>
                    </Textarea>
                </Field>
            </div>
            <div>
                <label htmlFor="">Preparation time (en minutes)</label>
                <Field className="w-full">
                    <Input type="number" name="preparationTime" placeholder="e.g : 20"  className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        onChange={(event)=> handleInputChange(event)}>
                    </Input>
                </Field>
            </div>
            <div>
                <label htmlFor="">Instructions</label>
                <Field className="w-full">
                    <Textarea name="instructions" placeholder="e.g : Tout d'abord, commencez par découper..."  className="w-full min-h-[10vh] rounded-md bg-gray-700 text-white p-3"
                        onChange={(event)=> handleInputChange(event)}>
                    </Textarea>
                </Field>
            </div>
            <Fieldset>
                <Legend>Is the dish Healthy ?</Legend>
                <RadioGroup 
                    onChange={(value)=> handleRadioChange("isHealthy",value)}

                >
                    {isHealthyChoices.map((choice) => (
                        <Field key={choice} className="flex gap-2 items-center">
                        <Radio value={choice} className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-pink-600" />
                        <Label>{choice}</Label>
                        </Field>
                    ))}
                </RadioGroup>
            </Fieldset>
            <Fieldset>
                <Legend>Is the dish vegan ?</Legend>
                <RadioGroup 
                    onChange={(value)=> handleRadioChange("isVegan",value)}
                >
                    {isVeganChoices.map((choice) => (
                        <Field key={choice} className="flex gap-2 items-center">
                        <Radio value={choice} className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-pink-600" />
                        <Label>{choice}</Label>
                        </Field>
                    ))}
                </RadioGroup>
            </Fieldset>
            <Fieldset>
                <Legend>Difficulty</Legend>
                <RadioGroup className="flex gap-2"
                    onChange={(value)=> handleRadioChange("difficulty",value)}

                >
                    {difficultyChoices.map((choice) => (
                        <Field key={choice} className="flex gap-1 items-center">
                        <Radio value={choice} className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-pink-600" />
                        <Label>{choice}</Label>
                        </Field>
                    ))}
                </RadioGroup>
            </Fieldset>
            <div>
                <label htmlFor="category">Recipe's category</label>
                <Select
                    id="category"
                    value={selectedCategory}
                    onChange={setSelectedCategory} // Met à jour l'état lors de la sélection
                    className="w-full rounded-md bg-gray-700 text-white pl-3"
                >
                <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.title}>{category.title}</option>
                    ))}
                </Select>
            </div>
            <div >
                <label for="recipe-photo" class="block text-sm/6 font-medium text-white">Recipe's picture</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600 justify-center">
                        <label for="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold p-1 text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-black">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                        </label>
                    </div>
                    <p className="text-xs/5 text-gray-600">PNG, JPG up to 10MB</p>
                    </div>
                </div>
            </div>
            <h2>Ingredients</h2>
            {formValues.ingredients.map((ingredient, index) => (
            <div key={index}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(event) => handleIngredientChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(event) => handleIngredientChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Input
                    type="text"
                    name="unity"
                    placeholder="Unity e.g : liter, slice..."
                    value={ingredient.unity}
                    onChange={(event) => handleIngredientChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Button label="Remove ingredient" icon={CircleX} type="button" action={() => removeIngredient(index)} className="text-red-500" />
            </div>
            ))}
            <Button label="Add ingredient" icon={CirclePlus} type="button" action={() => addIngredient()} className="text-red-500" />
            <h2>Tools</h2>

            <h2>Steps</h2>

            <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
        </form>  



    </>

  )
}
