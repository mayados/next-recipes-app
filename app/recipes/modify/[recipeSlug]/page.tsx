"use client";

import { useEffect, useState, FormEvent } from "react";
import Button from "@/components/Button";
import { CircleX, SendHorizontal, CirclePlus } from 'lucide-react';
import { Field, Textarea, Label, Legend, Radio, RadioGroup, Fieldset, Input, Select  } from '@headlessui/react';
// import required modules
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";




const ModifyRecipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [title, setTitle] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [preparationTime, setPreparationTime] = useState<string | number>("");
    const [isVegan, setIsVegan] = useState("");
    const [picture, setPicture] = useState<File | string>("");
    const [isHealthy, setIsHealthy] = useState("");
    const [instructions, setInstructions] = useState("");
    const [tools, setTools] = useState<RecipeToolType[]>([]);
    const [ingredients, setIngredients] = useState<CompositionType[]>([]);
    const [steps, setSteps] = useState<StepType[]>([]);
    const isHealthyChoices = ["Yes","No"];
    const isVeganChoices = ["Yes","No"];
    const difficultyChoices = ["1","2","3","4","5"];
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState<CategoryType[]>([]);




    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const {user} = useUser()
    const router = useRouter();


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories'); 
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error during the retrieving of the categories :", error);
            }
        };

        fetchCategories();

        const fetchRecipe = async () => {
            // Back quotes because dynamical parameter
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: OnlyRecipeType = await response.json()
            // Hydrating the recipe with retrieved datas
            setRecipe(data['recipe'])
            setTitle(data['recipe'].title)
            setPicture(data['recipe'].picture)
            setPreparationTime(data['recipe'].timePreparation)
            setSelectedCategory(data['recipe'].category.title)
            setDifficulty(String(data['recipe'].difficulty))
            setInstructions(data['recipe'].instructions)
            setIngredients(data['recipe'].compositions)
            setIsHealthy(data['recipe'].isHealthy ? "Yes" : "No");
            setIsVegan(data['recipe'].IsVegan ? "Yes" : "No");
            setTools(data['recipe'].recipetools)
            setSteps(data['recipe'].steps)
            console.log(data)
        }
        // We call the function
        fetchRecipe()
        // useEffect re-called if the recipeSlug changes
    }, [params.recipeSlug])

    const modifyRecipe = async (e: React.MouseEvent<any>) => {
        e.preventDefault();
        try{
            const uploadRecipeImage = async () => {
                const file = picture; 
            
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
            
                    const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });
            
                    const data = await response.json();
                    console.log("data de cloudinary : "+data)
                    return data.url;  
                    
                }
            
                return null;  
            };
            const recipePicture = await uploadRecipeImage();
            console.log("la vraie url de l'image est : "+recipePicture)
            const slugRecipe = recipe?.slug
            const newSlug = slugify(title)

            const response = await fetch(`/api/recipes/modify`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title, instructions, ingredients, tools, steps, recipePicture ,slugRecipe,newSlug, preparationTime, selectedCategory, isVegan, isHealthy, difficulty  }),
            });
            if (response.ok) {
                toast.success("Recipe updated successfully !");
                try {
                    await router.push("/profile");
                } catch (err) {
                    console.error("Redirection to the profile failed :", err);
                }
            }
        }catch (error) {
            console.error("Erreur lors de la modification de la recette :", error);
            toast.error("There was a problem with updating your recipe. Please try again!");
        }
      };

      const handleCategoryChange= (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSelectedCategory(value)
    }

    const addStep = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { text: "", number: prevSteps.length + 1 }
        ]);
    };
    const handleStepChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSteps((prevSteps) =>
            prevSteps.map((step, idx) =>
                idx === index ? { ...step, text: value } : step
            )
        );
    };

    const removeStep = (index: number) => {
        setSteps((prevSteps) => {
            const newSteps = prevSteps
                .filter((_, i) => i !== index) 
                .map((step, idx) => ({ ...step, number: idx + 1 })); 
    
            return newSteps; 
        });
    };

    // INGREDIENTS
    const handleIngredientChange = (
            index: number, 
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            const { name, value } = event.target;
        
            const newIngredients = [...ingredients];
        
            newIngredients[index] = {
                ...newIngredients[index],
                [name]: value,
            };
        
            if (name === "name") {
                newIngredients[index].slug = slugify(value);
            }
        
            setIngredients(newIngredients);
    }; 


    // Add an ingredient
    const addIngredient = () => {
        setIngredients((prevIngredients) => [
            ...prevIngredients,
            { name: "", quantity: "", unity: "", slug: "" , picture:""}
        ]);
    };

    // remove an ingredient
    const removeIngredient = (index: number) => {
        setIngredients((prevIngredients) => {
            const newIngredients = prevIngredients
                .filter((_, i) => i !== index) 
                .map((ingredient, idx) => ({ ...ingredient, index: idx + 1 })); 
    
            return newIngredients; 
        });
    };

    // TOOLS
    const handleToolChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newTools = [...tools];
        newTools[index] = {
            ...newTools[index],
            label: value,
            slug: slugify(value)  
        };
        setTools(newTools);

    };

    const addTool = () => {
        setTools((prevTools) => [
            ...prevTools,
            { label: "", slug: "", picture:"" }
        ]);
    };

    const removeTool = (index: number) => {
        setTools((prevTools) => {
            const newTools = prevTools
                .filter((_, i) => i !== index) 
                .map((tool, idx) => ({ ...tool, index: idx + 1 })); 
    
            return newTools; 
        });
    };

    // Recipe picture change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // There is only one file to get each time
        const file = e.target.files?.[0];
        if (!file) return;

        // generate temporary url for preview
        const previewUrl = URL.createObjectURL(file);
        setPicture(file);  // Stocker le fichier réel ici pour l'upload
        setPictureUrl(previewUrl);  // Stocker l'URL pour l'aperçu de l'image

      };

 
  return (
    

    <>
      <h1 className="text-3xl text-white ml-3 text-center">Recipe's modification : {title}</h1>
      <div><Toaster/></div>
      <form onSubmit={modifyRecipe} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
            <div>
                <label htmlFor="">Title</label>
                <Field className="w-full">
                    <Textarea name="title" className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}>
                    </Textarea>
                </Field>
            </div>
            <div>
                <label htmlFor="">Preparation time (en minutes)</label>
                <Field className="w-full">
                    <Input type="number" name="preparationTime" className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        value={preparationTime}
                        onChange={(e)=> setPreparationTime(e.target.value)}>
                    </Input>
                </Field>
            </div>
            <div>
                <label htmlFor="">Instructions</label>
                <Field className="w-full">
                    <Textarea name="instructions" placeholder="e.g : Tout d'abord, commencez par découper..."  className="w-full min-h-[10vh] rounded-md bg-gray-700 text-white p-3"
                        value={instructions}
                        onChange={(e)=> setInstructions(e.target.value)}>
                    </Textarea>
                </Field>
            </div>
            <Fieldset>
                <Legend>Is the dish Healthy ?</Legend>
                <RadioGroup 
                    value={isHealthy}
                    onChange={(value)=> setIsHealthy(value)}

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
                       value={isVegan}
                       onChange={(value)=> setIsVegan(value)}
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
                    value={difficulty}
                    onChange={(value)=> setDifficulty(value)}

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
                onChange={handleImageChange}
                />
                {pictureUrl && <img src={pictureUrl} alt="Aperçu de la recette" />}
                {picture && <img src={(picture).toString()} alt="Aperçu de la recette" />}
            </div> 
            <h2>Steps</h2>
            {steps.map((step, index) => (
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
                <Button label="Remove step" icon={CircleX} type="button" action={() => removeStep(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add step" icon={CirclePlus} type="button" action={() => addStep()} specifyBackground="text-red-500" />
            <h2>Ingredients</h2>
            {ingredients.map((ingredient, index) => (
            <div key={index}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Ingredient name"
                    value={ingredient.ingredient?.label || ""} 
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
                    value={ingredient.unit}
                    onChange={(event) => handleIngredientChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Button label="Remove ingredient" icon={CircleX} type="button" action={() => removeIngredient(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add ingredient" icon={CirclePlus} type="button" action={() => addIngredient()} specifyBackground="text-red-500" />
            <h2>Tools</h2>
            {tools.map((tool, index) => (
            <div key={index}>
                <Input
                    type="text"
                    name="name"
                    placeholder="tool name"
                    value={tool.tool?.label || ""}
                    onChange={(event) => handleToolChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <Button label="Remove tool" icon={CircleX} type="button" action={() => removeTool(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add tool" icon={CirclePlus} type="button" action={() => addTool()} specifyBackground="text-red-500" />

            <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
        </form>  



    </>

  )
}

export default ModifyRecipe
