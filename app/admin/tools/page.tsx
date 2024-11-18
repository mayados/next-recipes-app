"use client";

import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils'
import Image from "next/image";
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';



const Tools = () =>{

    const [tools, setTools] = useState<ToolType[]>([])
    const [toolToDelete, setToolToDelete] = useState<string | null>(null); 
    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchTools = async () => {
          const response = await fetch(`/api/admin/tools`)
          const data: ToolType[] =  await response.json()
          setTools(data)
    
        }
    
        fetchTools()
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
                setTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'outil :", error);
            toast.error('Something went wrong with deleting the tool. Please try again !');                 
        }
    }

    const openDeleteDialog = (toolId: string) => {
        setToolToDelete(tagId);
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
        <h1 className="text-3xl text-white text-center">Tools</h1>
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
                    <td>Modify</td>
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
        {/* Delete ingredient Dialog */}
        {isOpen && toolToDelete && (
            <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
                <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
                <DialogTitle>Delete tool</DialogTitle>
                <Description>This action is irreversible</Description>
                <p>Are you sure you want to delete this tool? All of its data will be permanently removed. This action cannot be undone.</p>
                    <div className="flex justify-between mt-4">
                        <button onClick={() => deleteTool(toolToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
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

