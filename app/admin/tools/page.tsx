"use client";

import AdminNav from "@/components/AdminNav";
import { useEffect, useState } from "react";
import { SendHorizontal, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils'
import Image from "next/image";
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';
import {Input} from '@headlessui/react';
import { ImageUp } from 'lucide-react';
import LinkButton from "@/components/LinkButton";



const Tools = () =>{

    const [tools, settools] = useState<ToolType[]>([])
    const [ToolToDelete, setToolToDelete] = useState<string | null>(null); 
    let [isOpen, setIsOpen] = useState(false);
    const [picturePreview, setPicturePreview] = useState<string | null>(null); 
    const [newTool, setnewTool] = useState({
        name: "",
        picture: "",
        slug: "",
    })

    useEffect(() => {
        const fetchtools = async () => {
          const response = await fetch(`/api/admin/tools`)
          const data: ToolType[] =  await response.json()
          settools(data)
    
        }
    
        fetchtools()
      },[]);

      tools.map((tool) => (
        
      console.log(tool)
    ))

    const deleteTool = async (toolId: string) => {
        try {
            const response = await fetch(`/api/admin/tools/delete/${toolId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setIsOpen(false);  
                toast.success('Tool deleted with success');                 
                settools(prevtools => prevtools.filter(tool => tool.id !== toolId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'outil :", error);
            toast.error('Something went wrong with deleting the tool. Please try again !');                 
        }
    }

    const openDeleteDialog = (toolId: string) => {
        setToolToDelete(toolId);
        setIsOpen(true);  
    };

    const closeDeleteDialog = () => {
        setIsOpen(false);  
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // Générer une URL temporaire pour l'aperçu
        const previewUrl = URL.createObjectURL(file);
        setnewTool((prevTool) => ({
            ...prevTool,
            picture: file,  // Mettre à jour la propriété picture
        }));
        setPicturePreview(previewUrl);  // Stocker l'URL pour l'aperçu de l'image
    };
    
    
    // Upload image 
    const uploadToolImage = async () => {
        const file = newTool.picture; 

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

    const createTool = async (e) => {
        e.preventDefault();

        try {
            // we call the uploadToolImage() to get the url
            const imageUrl = await uploadToolImage();
            
            // Adding picture to toolData object thanks to the spread operator
            const toolData = { ...newTool, picture: imageUrl };

            const response = await fetch('/api/admin/tools/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toolData),
            });

            if (response.ok) {
                const createdTool = await response.json();
                console.log("nouvel outil :"+createdTool)
                settools((prev) => [...prev, createdTool["tool"]]);
                setnewTool({ name: '', picture: '', slug: '' });
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

    <>
    <div className="flex w-screen">
        <div><Toaster/></div>
      {/* Navigation menu for admin */}
      <AdminNav />
      <div className="border-2 border-green-800 flex-[8]">
        <section>
            <h2>Create a tool</h2>
            <form onSubmit={createTool} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <Input
                    type="text"
                    name="name"
                    placeholder={newTool.name}
                    onChange={(e) => {
                        // Adding values for name and slug properties
                        const name = e.target.value;
                        setnewTool({
                            ...newTool,
                            name,
                            slug: slugify(name) 
                        });
                    }}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />
                <label htmlFor="tool-picture">Tool's picture</label>
                <Input
                    type="file"
                    id={`tool-picture`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                />
                {picturePreview && <img src={picturePreview} alt={`Tool preview`} />}
                
                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </section>
        <section>
            <h1 className="text-3xl text-white text-center">tools</h1>
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
                tools.map((tool) => {
                const toolId = tool.id;

                
                return (
                    <tr key={tool.id}>
                        <td>
                            {tool.label}
                        </td>
                        <td>
                            <Image
                                src={tool.picture }
                                width={'100'}
                                height={'100'}
                                alt={tool.label}
                                className="rounded-md"
                            />   
                        </td>
                        <td>
                            <LinkButton label="Modify picture" icon={ImageUp} path="/admin/tools/" dynamicPath={tool?.slug} />                        
                        </td>
                        <td>
                            <Button label="Remove" icon={Trash2} type="button" action={() => openDeleteDialog(toolId)} className="text-red-500" />
                        </td>
                    </tr>
                );
                })
            }
            </tbody>
            </table>  
        </section>
      </div> 
        {/* Delete tool Dialog */}
        {isOpen && ToolToDelete && (
            <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
                <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
                <DialogTitle>Delete tool</DialogTitle>
                <Description>This action is irreversible</Description>
                <p>Are you sure you want to delete this tool? All of its data will be permanently removed. This action cannot be undone.</p>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => deleteTool(ToolToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                        <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                    </div>
                </DialogPanel>
            </Dialog>
        )}       
    </div>
    </>

  )
}

export default Tools

