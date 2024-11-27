"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import Button from "@/components/Button";
import { SendHorizontal } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {Input} from '@headlessui/react';


const Ingredient = ({params}: {params: {ingredientSlug: string}}) => {


    const [ingredient, setIngredient] = useState<IngredientType | null>(null)
    const [picturePreview, setPicturePreview] = useState<string | null>(null); 
    const [newPicture, setNewPicture] = useState<string | null>(null); 


    useEffect(() => {
        const fetchIngredient = async () => {
            const response = await fetch(`/api/admin/ingredients/${params.ingredientSlug}`)
            const data: OnlyIngredientType = await response.json()
            setIngredient(data['ingredient'])
        }
        fetchIngredient()
        // useEffect re-called if the ingredientSlug changes
    }, [params.ingredientSlug])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const previewUrl = URL.createObjectURL(file);
        setNewPicture(file);
        setPicturePreview(previewUrl);  
    };
    
    
    // Upload image 
    const uploadIngredientImage = async () => {
        const file = newPicture; 

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

    const modifyIngredient = async (e) => {
        e.preventDefault();

        try {
            // we call the uploadIngredientImage() to get the url
            const imageUrl = await uploadIngredientImage();

            const response = await fetch(`/api/admin/ingredients/modify`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                     ingredientSlug: params.ingredientSlug,
                     ingredientPicture: imageUrl,
                    }),
              });

            if (response.ok) {
                const data = await response.json();
                console.log(data["ingredient"])
                setIngredient(data["ingredient"])
                setPicturePreview(null);  
                toast.success('Ingredient modified successfully');
            } else {
                throw new Error('Failed to modify ingredient');
            }
        } catch (error) {
            console.error("Error during ingredient's modification :", error);
            toast.error('Something went wrong with modifying the ingredient. Please try again!');
        }
    };
 

  return (
    
    <div className="p-5">
        <div><Toaster/></div>
        <section className="w-screen mt-5">
            <h1>{ingredient?.label}</h1>
            <Image
                src={ingredient?.picture }
                width={'100'}
                height={'100'}
                alt={ingredient?.label || "ingredient"}
                className="rounded-md"
            />  
            <form onSubmit={modifyIngredient} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <label htmlFor="ingredient-picture">Ingredient's picture</label>
                <Input
                    type="file"
                    id={`ingredient-picture`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                />
                {picturePreview && <img src={picturePreview} alt={`Ingredient preview`} className="h-[100px] w-[100px]" />}
                
                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </section>
    </div>

  )
}

export default Ingredient
