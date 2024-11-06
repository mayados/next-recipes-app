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
import cloudinary from "@/lib/cloudinary"; 


export default function CreateRecipe() {

    const { user } = useUser();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
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
        ingredients: [],
        steps: [],
        tools: [] 

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
      
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
      
          console.log("Response status:", response.status); // Vérifie le statut de la réponse
          const responseText = await response.text(); // Lis la réponse en tant que texte
          console.log("Response text:", responseText); // Vérifie ce qui est renvoyé
      
          // Si la réponse est OK, on essaye de la parser en JSON
          if (response.ok) {
            const data = JSON.parse(responseText);
            if (data.url) {
              setImageUrl(data.url);
              console.log("Image URL:", data.url);
            } else {
              console.error("Erreur lors de l'upload de l'image.");
            }
          } else {
            console.error("Erreur lors de l'upload de l'image :", response.statusText);
          }
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image :", error);
        }
      };

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

    const handleCategoryChange= (event) => {
        const value = event.target.value
        setSelectedCategory(value)
    }

    // INGREDIENTS
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

    // TOOLS
    const handleToolChange = (index, event) => {
        const { value } = event.target;
        const newTools = [...formValues.tools];
        newTools[index] = {
            ...newTools[index],
            label: value,
        };
        setFormValues({
            ...formValues,
            tools: newTools,
        });
        // console.log(formValues)
    };

    const addTool = () => {
        setFormValues({
            ...formValues,
            tools: [...formValues.tools, { label: "", slug: "" }],
        });
    };

    const removeTool = (index) => {
        const newTools = formValues.tools.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            tools: newTools,
        });
    };


    // STEPS
    const handleStepChange = (index, event) => {
        const { value } = event.target;
        const newSteps = [...formValues.steps];
        newSteps[index] = {
            ...newSteps[index],
            text: value,
        };
        setFormValues({
            ...formValues,
            steps: newSteps,
        });
    };

    const addStep = () => {
        setFormValues({
            ...formValues,
            steps: [...formValues.steps, { text: "", number: formValues.steps.length + 1}],
        });
    };

    const removeStep = (index) => {
        const newSteps = formValues.steps.filter((_, i) => i !== index).map((step, idx) => ({ ...step, number: idx + 1 }));
        setFormValues({
            ...formValues,
            steps: newSteps,
        });
    };

    // Create the recipe thanks to the API
      const addRecipe = async (e : FormEvent) => {
        // We don't want the form to refresh the page when submitted
        e.preventDefault()

        if(user){
            try{
                // We retrieve the current user's data because we need it in the api method
                const { id, primaryEmailAddress, username } = user;
                const ingredients = formValues.ingredients
                ingredients.forEach(async (ingredient) => {
                    ingredient["slug"] = slugify(ingredient.name);
                    ingredient["name"] = ingredient.name.toLowerCase();
                });      
                formValues.tools.forEach(async (tool) => {
                    tool["slug"] = slugify(tool.label);
                    tool["label"] = tool.label.toLowerCase();
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
                            picture: imageUrl,
                            slug: slug,
                            createdAt: new Date().toISOString() ,
                            ingredients: formValues.ingredients,
                            email: primaryEmailAddress?.emailAddress,
                            pseudo: username,
                            clerkUserId: id,
                            categoryTitle: selectedCategory,
                            steps: formValues.steps,
                            tools: formValues.tools

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
                    onChange={handleCategoryChange} // Met à jour l'état lors de la sélection
                    className="w-full rounded-md bg-gray-700 text-white pl-3"
                >
                <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.title}>{category.title}</option>
                    ))}
                </Select>
            </div>
            <div>
                <label htmlFor="recipe-photo">Recipe's picture</label>
                <input
                type="file"
                id="recipe-photo"
                accept="image/*"
                onChange={handleImageUpload}
                />
                {imageUrl && <img src={imageUrl} alt="Aperçu de la recette" />}
            </div> 
            <h2>Steps</h2>
            {formValues.steps.map((step, index) => (
            <div key={index}>
                <label htmlFor="">Step {step.number}</label>
                <Input
                    type="text"
                    name="text"
                    placeholder="step's text"
                    value={step.text}
                    onChange={(event) => handleStepChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Button label="Remove step" icon={CircleX} type="button" action={() => removeStep(index)} className="text-red-500" />
            </div>
            ))}
            <Button label="Add step" icon={CirclePlus} type="button" action={() => addStep()} className="text-red-500" />
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
            {formValues.tools.map((tool, index) => (
            <div key={index}>
                <Input
                    type="text"
                    name="name"
                    placeholder="tool name"
                    value={tool.name}
                    onChange={(event) => handleToolChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Button label="Remove tool" icon={CircleX} type="button" action={() => removeTool(index)} className="text-red-500" />
            </div>
            ))}
            <Button label="Add tool" icon={CirclePlus} type="button" action={() => addTool()} className="text-red-500" />

            <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
        </form>  



    </>

  )
}
