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
    // console.log("Informations sur le user : "+user?.username)
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const isHealthyChoices = ["Yes","No"];
    const isVeganChoices = ["Yes","No"];
    const difficultyChoices = ["1","2","3","4","5"];
    // const [selectedHealthyChoice, setSelectedHealthyChoice] = useState(isHealthyChoices[0])
    // const [selectedVeganChoice, setSelectedVeganChoice] = useState(isVeganChoices[0])
    // const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyChoices[0])
    const [ingredientSuggestions, setIngredientSuggestions] = useState<IngredientType[]>([]); // Pour stocker les suggestions
    const [toolSuggestions, setToolSuggestions] = useState<ToolType[]>([]); // Pour stocker les suggestions

    

    // Because we have plenty of values to retrieve from the creation form : 
    const [formValues, setFormValues] = useState<FormValueType>({
        title: "",
        preparationTime: "",
        instructions: "",
        isHealthy: "",
        isVegan: "",
        difficulty: "",
        picture: "",
        ingredients: [],
        steps: [],
        tools: [],
        // stock of selected files
        images: [],

    })
    // Hook to redirect
    const router = useRouter();

    // Retrieve the categories 
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
    }, []);

    // Manage image changement => everytime we add an image in the form
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: string, index = 0) => {
        // There is only one file to get each time
        const file = e.target.files?.[0];
        if (!file) return;

        // generate temporary url for preview
        const previewUrl = URL.createObjectURL(file);

        // update to display preview
        if (type === 'recipe') {
            setFormValues((prevValues) => ({
                ...prevValues,
                picture: previewUrl,
                images: [...prevValues.images, { file, type, index }],
            }));
        } else if (type === 'ingredient') {
            setFormValues((prevValues) => {
                const updatedIngredients = [...prevValues.ingredients];
                updatedIngredients[index] = { ...updatedIngredients[index], picture: previewUrl };
                return { ...prevValues, ingredients: updatedIngredients, images: [...prevValues.images, { file, type, index }] };
            });
        } else if (type === 'tool') {
            setFormValues((prevValues) => {
                const updatedTools = [...prevValues.tools];
                updatedTools[index] = { ...updatedTools[index], picture: previewUrl };
                return { ...prevValues, tools: updatedTools, images: [...prevValues.images, { file, type, index }] };
            });
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

    const handleCategoryChange= (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        setSelectedCategory(value)
    }

    // INGREDIENTS
    // We search ingredient suggestions with the letters the user submit (= the query)
    // We don't search if the query is less than 2 characters
    const fetchIngredientSuggestions = async (query: string) => {
        if (query.length < 2) return; 
        try {
            const response = await fetch(`/api/ingredients/search?query=${query}`);
            const data = await response.json();
            console.log("API response data:", data); 
    
            if (Array.isArray(data) && data.length > 0) {
                setIngredientSuggestions(data); 
            } else {
                setIngredientSuggestions([]); 
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions d'ingrédients :", error);
        }
    };
    

    // Gestion du changement dans le champ de nom d'ingrédient
    const handleIngredientNameChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const newIngredients = [...formValues.ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            name: value,
            slug: slugify(value),
        };

        setFormValues({
            ...formValues,
            ingredients: newIngredients,
        });

        // Call the function to get suggestions
        fetchIngredientSuggestions(value);
    };

    // Lorsqu'un ingrédient suggéré est cliqué
// Lorsqu'un ingrédient suggéré est cliqué
const handleSuggestionClick = (index: number, suggestion: SuggestionType) => {
    // Vérifier l'objet ingredient avant et après modification
    console.log('Avant mise à jour:', formValues.ingredients[index]);

    // Créer une copie des ingrédients pour éviter la mutation directe
    const newIngredients = [...formValues.ingredients];

    // Mise à jour de l'ingrédient à l'index spécifique
    newIngredients[index] = {
        ...newIngredients[index],
        name: suggestion.label, 
        slug: suggestion.slug,   
    };

    // Vérifier l'objet après modification
    console.log('Après mise à jour:', newIngredients[index]);

    // Mettre à jour l'état global avec la copie modifiée
    setFormValues({
        ...formValues,
        ingredients: newIngredients,
    });

    // Fermer les suggestions après la sélection
    setIngredientSuggestions([]);
};

    // Retrieve data from the form for ingredients
    const handleIngredientChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newIngredients = [...formValues.ingredients];
        
        newIngredients[index] = {
            ...newIngredients[index],
            [name]: value,
        };
    
        // Slug generated just for the field name
        if (name === "name") {
            newIngredients[index].slug = slugify(value);
        }
    
        setFormValues({
            ...formValues,
            ingredients: newIngredients,
        });
    };

    // Add an ingredient
    const addIngredient = () => {
        setFormValues({
            ...formValues,
            ingredients: [...formValues.ingredients, { name: "", quantity: "", unity: "", slug: "" , picture:""}],
        });
    };

    // remove an ingredient
    const removeIngredient = (index: number) => {
        const newIngredients = formValues.ingredients.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            ingredients: newIngredients,
        });
    };

    // TOOLS

    const fetchToolSuggestions = async (query: string) => {
        // if the query is shorter than 2 char we don't make the API call
        if (query.length < 2) return;
 
            try {
                const response = await fetch(`/api/tools/search?query=${query}`);
                const data = await response.json();
        
                if (Array.isArray(data) && data.length > 0) {
                    setToolSuggestions(data);  
                } else {
                    setToolSuggestions([]);  
                }
            } catch (error) {
                console.error("Error when retrieving tool suggestions", error);
            }
    };
    
    const handleToolSuggestionClick = (index: number, suggestion: SuggestionType) => {
    
        // Create a copy of the tools
        const newTools = [...formValues.tools];
        console.log('Avant mise à jour, outil:', newTools[index]);

    
        // Update tool at the great index
        newTools[index] = {
            ...newTools[index],
            name: suggestion.label,   
            label: suggestion.label,   
            slug: suggestion.slug,   
        };
        console.log('slug -Après mise à jour, outil:', newTools[index]);

    
        
        setFormValues({
            ...formValues,
            tools: newTools,
        });
    
        // After click on the selection, "clean" the array
        setToolSuggestions([]);
    };

    // const handleToolChange = (index, event) => {
    //     const { name,value } = event.target;
    //     const newTools = [...formValues.tools];
    //     newTools[index] = {
    //         ...newTools[index],
    //         [name]: value,
    //         slug: slugify(value)  
    //     };

    //     // Slug generated just for the field name
    //     if (name === "name") {
    //         newTools[index].slug = slugify(value);
    //     }

    //     setFormValues({
    //         ...formValues,
    //         tools: newTools,
    //     });
    //     // console.log(formValues)
    //     fetchToolSuggestions(value);
        
    // };

    const handleToolChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newTools = [...formValues.tools];
    
        newTools[index] = {
            ...newTools[index],
            [name]: value,
            label: value,
        };
    
        // Slug generated just for the field name (same as in handleIngredientChange)
        if (name === "name") {
            newTools[index].slug = slugify(value);
        }
    
        setFormValues({
            ...formValues,
            tools: newTools,
        });
    
        fetchToolSuggestions(value);
    };
    

    const addTool = () => {
        setFormValues({
            ...formValues,
            tools: [...formValues.tools, { label: "", slug: "", picture:"" }],
        });
    };

    const removeTool = (index: number) => {
        const newTools = formValues.tools.filter((_, i) => i !== index);
        setFormValues({
            ...formValues,
            tools: newTools,
        });
    };


    // STEPS
    const handleStepChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
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

    const removeStep = (index: number) => {
        const newSteps = formValues.steps.filter((_, i) => i !== index).map((step, idx) => ({ ...step, number: idx + 1 }));
        setFormValues({
            ...formValues,
            steps: newSteps,
        });
    };

    // Create the recipe thanks to the API
    const addRecipe = async (e: FormEvent) => {
        // avoi reload of the page when click on submit button
        e.preventDefault(); 
        console.log("dans la fonction de création")
    
        // If the user in not connected we return
        if (!user) return; 
    
        try {
            console.log("dans le try de création")

            const { id, primaryEmailAddress, username } = user;
    
            // Slugify et put to lower case ingredients and tools
            const ingredients = formValues.ingredients.map((ingredient) => ({
                ...ingredient,
                // functions as slugify() and toLowerCase() ask for a strict string, that's why we use conditions there
                slug: ingredient.name ? slugify(ingredient.name) : '',
                name: ingredient.name ? ingredient.name.toLowerCase() : '',
            }));

            // console.log("ingredient "+formValues.ingredients)
    
            const tools = formValues.tools.map((tool) => ({
                ...tool,
                slug: tool.name ? slugify(tool.name) : '',
                label: tool.label ? tool.label.toLowerCase() : '',
            }));

            tools.forEach(tool => {
                console.log("tool qui va partir en bdd : "+tool.slug)
            });

            console.log("Les tools : "+formValues.tools)


            // Prepare image's upload for each tool and ingredient
            const uploadPromises = formValues.images.map(async ({ file, type, index }) => {
                const formData = new FormData();
                formData.append("file", file);
    
                // Thanks to the API we upload every image
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
    
                const data = await response.json();
                // Get the returned url
                 return { url: data.url, type, index }; 

            });
    
            // We wait for all the uploads to be completed because we need each one of them to add in the database
            const uploadResults = await Promise.all(uploadPromises);
            // console.log("Les résultats des différents uploads sont : "+uploadResults)
    
            // Create temporary variable to stock new urls from cloudinary (not temporary urls anymore) => We have to do this because setFormValues is asynchrone, so we have to be sure the new values are added when the form is submitted, which is not the case with setFormValues 
            let updatedFormValues = { ...formValues };

           // update urls of ingredients and tools
            uploadResults.forEach(({ url, type, index }) => {
                // console.log(`Type: ${type}, Index: ${index}, URL: ${url}`);
                if (type === "recipe") {
                    // console.log("L'url de la recette est : "+url)
                    updatedFormValues.picture = url;
                  } else if (type == "ingredient") {
                    // console.log("L'url de l'ingrédient est : "+url)
                    // console.log("je tente d'acceder à l'ingrédient: "+ingredients[index].picture)
                    updatedFormValues.ingredients[index] = {
                        ...updatedFormValues.ingredients[index],
                        picture: url,
                    };
                  } else if (type == "tool") {
                    console.log("L'url de l'outil est : "+url)
                    updatedFormValues.tools[index] = {
                        ...updatedFormValues.tools[index],
                        picture: url,
                    };
                  }
            });
    
            // console.log('Recieved recipe picture:', formValues.picture);
            // console.log('Recieved ingredients pictures:', ingredients.map(i => i.picture));
            // console.log('Recieved tools pictures:', tools.map(t => t.picture));
            // console.log("ISVEGAN "+formValues.isVegan)

            // Recipe's creation
            const slug = slugify(formValues.title);
            formValues.steps.forEach(step => {
                console.log("Un des steps qui va aller en bdd : "+step.text)
            });
            console.log("slug de la recipe "+slug)
            const response = await fetch(`/api/recipes/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formValues.title,
                    preparationTime: formValues.preparationTime,
                    instructions: formValues.instructions,
                    isHealthy: formValues.isHealthy,
                    isVegan: formValues.isVegan,
                    difficulty: formValues.difficulty,
                    picture: updatedFormValues.picture,
                    slug: slug,
                    createdAt: new Date().toISOString(),
                    ingredients:  updatedFormValues.ingredients, 
                    email: primaryEmailAddress?.emailAddress,
                    pseudo: username,
                    clerkUserId: id,
                    categoryTitle: selectedCategory,
                    steps: formValues.steps,
                    tools:  updatedFormValues.tools,  
                }),
            });
    
            if (response.ok) {
                toast.success('Recipe created with success');
                const dataResponse = await response.json();
                router.push(`/recipes/${dataResponse.recipeSlug}`);
            } else {
                throw new Error("Failed to create recipe");
            }
    
        } catch (error) {
            console.error("Erreur lors de la création de la recette :", error);
            toast.error("There was a problem with creating your recipe. Please try again!");
        }
    };
    

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
                    onChange={handleCategoryChange}
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
                onChange={(e) => handleImageChange(e, "recipe")}
                />
                {formValues.picture && <img src={formValues.picture} alt="Aperçu de la recette" />}
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
                <Button label="Remove step" icon={CircleX} type="button" action={() => removeStep(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add step" icon={CirclePlus} type="button" action={() => addStep()} specifyBackground="text-red-500" />
            <h2>Ingredients</h2>
            {formValues.ingredients.map((ingredient, index) => (
            <div key={index}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(event) => handleIngredientNameChange(index, event)}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                {/* Suggestions d'ingrédients */}
                {ingredientSuggestions.length > 0 ? (
                <ul>
                    {ingredientSuggestions.map((ingredient) => (
                        <li 
                            key={ingredient.id}
                            onClick={() => handleSuggestionClick(index, ingredient)} 
                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                        >
                            {ingredient.label}
                        </li>
                    ))}
                </ul>
                    ) : (
                        <p>Aucune suggestion disponible</p>
                    )}

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
                <Button label="Remove ingredient" icon={CircleX} type="button" action={() => removeIngredient(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add ingredient" icon={CirclePlus} type="button" action={() => addIngredient()} specifyBackground="text-red-500" />
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
                {/* tools suggestions */}
                {toolSuggestions.length > 0 ? (
                <ul>
                    {toolSuggestions.map((suggestion) => (
                        <li 
                            key={suggestion.id}
                            onClick={() => handleToolSuggestionClick(index, suggestion)}  // Ajout du gestionnaire de clic
                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                        >
                            {suggestion.label}
                        </li>
                    ))}
                </ul>
                    ) : (
                        <p>Aucune suggestion disponible</p>
                    )}
                <Button label="Remove tool" icon={CircleX} type="button" action={() => removeTool(index)} specifyBackground="text-red-500" />
            </div>
            ))}
            <Button label="Add tool" icon={CirclePlus} type="button" action={() => addTool()} specifyBackground="text-red-500" />

            <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
        </form>  



    </>

  )
}