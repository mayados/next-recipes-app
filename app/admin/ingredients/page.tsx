"use client";

import AdminNav from "@/components/AdminNav";
import { useEffect, useState } from "react";
import { ImageUp, SendHorizontal, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils'
import Image from "next/image";
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';
import {  Input  } from '@headlessui/react';
import LinkButton from "@/components/LinkButton";
import Pagination from "@/components/Pagination";



const Ingredients = () =>{

    const [ingredients, setIngredients] = useState<IngredientType[]>([])
    const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(null); 
    const resultsPerPage = 10; 
    const [totalIngredients, setTotalIngredients] = useState<number | null>()
    const [page, setPage] = useState(1);
    let [isOpen, setIsOpen] = useState(false);
    const [picturePreview, setPicturePreview] = useState<string | null>(null); 
    const [newIngredient, setNewIngredient] = useState<{
        name: string;
        picture: File | string; 
        slug: string;
    }>({
        name: "",
        picture: "",
        slug: "",
    });
    

    useEffect(() => {
        const fetchIngredients = async () => {
          const response = await fetch(`/api/admin/ingredients?page=${page}&resultsPerPage=${resultsPerPage}`)
          const data: IngredientsTypeWithTotal =  await response.json()
          setIngredients(data.ingredients)
          setTotalIngredients(data.totalIngredients)    
        }
    
        fetchIngredients()
      },[page]);

      ingredients.map((ingredient) => (
        
      console.log(ingredient)
    ))

    const deleteIngredient = async (ingredientId: string) => {
        try {
            const response = await fetch(`/api/admin/ingredients/delete/${ingredientId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setIsOpen(false);  
                toast.success('Ingredient deleted with success');                 
                setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'ingredient :", error);
            toast.error('Something went wrong with deleting the ingredient. Please try again !');                 
        }
    }

    const openDeleteDialog = (ingredientId: string) => {
        setIngredientToDelete(ingredientId);
        setIsOpen(true);  
    };

    const closeDeleteDialog = () => {
        setIsOpen(false);  
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // Générer une URL temporaire pour l'aperçu
        const previewUrl = URL.createObjectURL(file);
        setNewIngredient((prevIngredient) => ({
            ...prevIngredient,
            picture: file,  // Mettre à jour la propriété picture
        }));
        setPicturePreview(previewUrl);  // Stocker l'URL pour l'aperçu de l'image
    };
    
    
    // Upload image 
    const uploadIngredientImage = async () => {
        const file = newIngredient.picture; 

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Data de Cloudinary :", data);
            return data.url;  
        }

        return null;  
    };

    const createIngredient = async (e: React.MouseEvent<any>) => {
        e.preventDefault();

        try {
            // we call the uploadIngredientImage() to get the url
            const imageUrl = await uploadIngredientImage();
            
            // Adding picture to ingredientData object thanks to the spread operator
            const ingredientData = { ...newIngredient, picture: imageUrl };

            const response = await fetch('/api/admin/ingredients/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ingredientData),
            });

            if (response.ok) {
                const createdIngredient = await response.json();
                console.log("nouvel ingrédient :"+createdIngredient)
                setIngredients((prev) => [...prev, createdIngredient["ingredient"]]);
                setNewIngredient({ name: '', picture: '', slug: '' });
                setPicturePreview(null);  
                toast.success('Ingredient created successfully');
            } else {
                throw new Error('Failed to create ingredient');
            }
        } catch (error) {
            console.error("Error during ingredient's creation :", error);
            toast.error('Something went wrong with creating the ingredient. Please try again!');
        }
    };

    const maxPages = Math.ceil((totalIngredients || 0) / resultsPerPage );
    console.log("Le nombre de pages est : "+maxPages)
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= maxPages) {
      setPage(newPage);
    }
  };

  return (

    <>
    <div className="flex w-screen">
        <div><Toaster/></div>
      {/* Navigation menu for admin */}
      <AdminNav />
      <div className="border-2 border-green-800 flex-[8]">
        <section>
            <h2>Create an ingredient</h2>
            <form onSubmit={createIngredient} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <Input
                    type="text"
                    name="name"
                    placeholder={newIngredient.name}
                    onChange={(e) => {
                        // Adding values for name and slug properties
                        const name = e.target.value;
                        setNewIngredient({
                            ...newIngredient,
                            name,
                            slug: slugify(name) 
                        });
                    }}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <label htmlFor="ingredient-picture">Ingredient's picture</label>
                <Input
                    type="file"
                    id={`ingredient-picture`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                />
                {picturePreview && <img src={picturePreview} alt={`Ingredient preview`} />}
                
                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </section>
        <section>
            <h1 className="text-3xl text-white text-center">Ingredients</h1>
            <table className="table-auto">
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Picture</th>
                    <th>modify picture</th>
                    <th>Delete</th>
                </tr>  
            </thead>
            <tbody>
            {
                ingredients.map((ingredient) => {
                const ingredientId = ingredient.id;

                
                return (
                    <tr key={ingredient.id}>
                        <td>
                            {ingredient.label}
                        </td>
                        <td>
                            <Image
                                src={(ingredient.picture || "/default-picture").toString() }
                                width={'100'}
                                height={'100'}
                                alt={(ingredient.label || "ingrédient").toString()}
                                className="rounded-md"
                            />   
                        </td>
                        <td>
                            <LinkButton label="Modify picture" icon={ImageUp} path="/admin/ingredients/" dynamicPath={ingredient?.slug} />                        
                        </td>
                        <td>
                            <Button label="Remove" icon={Trash2} type="button" action={() => openDeleteDialog((ingredientId).toString())} specifyBackground="text-red-500" />
                        </td>
                    </tr>
                );
                })
            }
            </tbody>
            </table>  
        </section>
        <Pagination previousAction={() => handlePageChange(page - 1)} nextAction={() => handlePageChange(page + 1)} page={page} maxPages={maxPages} />
      </div> 
        {/* Delete ingredient Dialog */}
        {isOpen && ingredientToDelete && (
            <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
                <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
                <DialogTitle>Delete ingredient</DialogTitle>
                <Description>This action is irreversible</Description>
                <p>Are you sure you want to delete this ingredient? All of its data will be permanently removed. This action cannot be undone.</p>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => deleteIngredient(ingredientToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                        <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                    </div>
                </DialogPanel>
            </Dialog>
        )}       
    </div>
    </>

  )
}

export default Ingredients

