"use client";

import AdminNav from "@/components/AdminNav";
import { useEffect, useState } from "react";
import { Trash2 } from 'lucide-react';
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';


const Tags = () =>{

    const [tags, setTags] = useState<TagType[]>([])
    const [tagToDelete, setTagToDelete] = useState<string | null>(null); 
    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
          const response = await fetch(`/api/admin/blog/tags`)
          const data: TagType[] =  await response.json()
          setTags(data)
    
        }
    
        fetchTags()
    },[]);



    const deleteTag = async (tagId: string) => {
        try {
            const response = await fetch(`/api/admin/blog/tags/delete/${tagId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setIsOpen(false);  
                toast.success('Tag deleted with success');                 
                setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du tag :", error);
            toast.error('Something went wrong with deleting the tag. Please try again !');                 
        }
    }

    const openDeleteDialog = (tagId: string) => {
        setTagToDelete(tagId);
        setIsOpen(true);  
    };

    const closeDeleteDialog = () => {
        setIsOpen(false);  
    };

  return (

    <>
    <div className="flex w-screen">
        <div><Toaster/></div>
      {/* Navigation menu for admin */}
      <AdminNav />
        <section className="border-2 border-green-800 flex-[8]">
            <h1 className="text-3xl text-white text-center">Tags</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>  
                </thead>
                <tbody>
                {
                    tags.map((tag) => {
                        const tagId = tag.id;
                    
                    return (
                        <tr key={tag.id}>
                            <td>{tag.name}</td>
                            <td>
                                <Button label="Remove" icon={Trash2} type="button" action={() => openDeleteDialog(tagId)} className="text-red-500" />
                            </td>
                        </tr>
                    );
                    })
                }
                </tbody>
            </table>   
        </section>  
        {/* Delete tag Dialog */}
        {isOpen && tagToDelete && (
        <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
            <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
            <DialogTitle>Delete Tag</DialogTitle>
            <Description>This action is irreversible</Description>
            <p>Are you sure you want to delete this tag? All of its data will be permanently removed. This action cannot be undone.</p>
                <div className="flex justify-between mt-4">
                    <button onClick={() => deleteTag(tagToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                    <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                </div>
            </DialogPanel>
        </Dialog>
            )}   
    </div>
    </>

  )
}

export default Tags

