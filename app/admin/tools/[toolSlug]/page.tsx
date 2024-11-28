"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import Button from "@/components/Button";
import { SendHorizontal } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {Input} from '@headlessui/react';


const Tool = ({params}: {params: {toolSlug: string}}) => {


    const [tool, setTool] = useState<ToolType | null>(null)
    const [picturePreview, setPicturePreview] = useState<string | null>(null); 
    const [newPicture, setNewPicture] = useState<string | null>(null); 


    useEffect(() => {
        const fetchTool = async () => {
            const response = await fetch(`/api/admin/tools/${params.toolSlug}`)
            const data: OnlyToolType = await response.json()
            setTool(data['tool'])
        }
        fetchTool()
        // useEffect re-called if the toolSlug changes
    }, [params.toolSlug])

    const handleImageChange = (e: React.ChangeEvent<any>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const previewUrl = URL.createObjectURL(file);
        setNewPicture(file);
        setPicturePreview(previewUrl);  
    };
    
    
    // Upload image 
    const uploadToolImage = async () => {
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

    const modifyTool = async (e: React.MouseEvent<any>) => {
        e.preventDefault();

        try {
            // we call the uploadToolImage() to get the url
            const imageUrl = await uploadToolImage();

            const response = await fetch(`/api/admin/tools/modify`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                     toolSlug: params.toolSlug,
                     toolPicture: imageUrl,
                    }),
              });

            if (response.ok) {
                const data = await response.json();
                console.log(data["tool"])
                setTool(data["tool"])
                setPicturePreview(null);  
                toast.success('Tool created successfully');
            } else {
                throw new Error('Failed to create tool');
            }
        } catch (error) {
            console.error("Error during tool's creation :", error);
            toast.error('Something went wrong with creating the tool. Please try again!');
        }
    };
 

  return (
    
    <div className="p-5">
        <div><Toaster/></div>
        <section className="w-screen mt-5">
            <h1>{tool?.label}</h1>
            <Image
                src={(tool?.picture  || "/default-image").toString()}
                width={'100'}
                height={'100'}
                alt={tool?.label || "tool"}
                className="rounded-md"
            />  
            <form onSubmit={modifyTool} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <label htmlFor="tool-picture">Tool's picture</label>
                <Input
                    type="file"
                    id={`tool-picture`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                />
                {picturePreview && <img src={picturePreview} alt={`Tool preview`} className="h-[100px] w-[100px]" />}
                
                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </section>
    </div>

  )
}

export default Tool
