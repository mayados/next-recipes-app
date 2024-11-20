"use client";

import AdminNav from "@/components/AdminNav";
import { useEffect, useState } from "react";
import { Trash2 } from 'lucide-react';
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';


const Categories = () =>{

    const [categories, setCategories] = useState<CategoryType[]>([])
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null); 
    let [isOpen, setIsOpen] = useState(false);
    const [newCategory, setnewCategory] = useState({
        title: "",
        slug: "",
    })

    useEffect(() => {
        const fetchCategories = async () => {
          const response = await fetch(`/api/admin/categories`)
          const data: CategoryType[] =  await response.json()
          setCategories(data)
    
        }
    
        fetchCategories()
    },[]);

    const createCategory = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('/api/admin/categories/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });

            if (response.ok) {
                const createdCategory = await response.json();
                console.log("nouvelle catégories :"+createdCategory)
                setCategories((prev) => [...prev, createdCategory["category"]]);
                setnewCategory({ title: '', slug: '' });
                toast.success('Category created successfully');
            } else {
                throw new Error('Failed to create category');
            }
        } catch (error) {
            console.error("Error during category's creation :", error);
            toast.error('Something went wrong with creating the category. Please try again!');
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/admin/blog/categories/delete/${categoryId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setIsOpen(false);  
                toast.success('Category deleted with success');                 
                setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
            }
        } catch (error) {
            console.error("Error with category deletion :", error);
            toast.error('Something went wrong with deleting the category. Please try again !');                 
        }
    }

    const openDeleteDialog = (tagId: string) => {
        setCategoryToDelete(tagId);
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
      <section>
            <h2>Create a category</h2>
            <form onSubmit={createCategory} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
                <Input
                    type="text"
                    name="name"
                    placeholder={newCategory.name}
                    onChange={(e) => {
                        // Adding values for name and slug properties
                        const name = e.target.value;
                        setnewCategory({
                            ...newCategory,
                            title,
                            slug: slugify(title) 
                        });
                    }}
                    className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3 mb-2"
                />                
                <Button icon={SendHorizontal} label="Send" specifyBackground="" type="submit" />
            </form>
        </section>
        <section className="border-2 border-green-800 flex-[8]">
            <h1 className="text-3xl text-white text-center">Tags</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Slug</th>
                        <th>Delete</th>
                    </tr>  
                </thead>
                <tbody>
                {
                    categories.map((category) => {
                        const categoryId = category.id;
                    
                    return (
                        <tr key={category.id}>
                            <td>{category.title}</td>
                            <td>{category.slug}</td>
                            <td>
                                <Button label="Remove" icon={Trash2} type="button" action={() => openDeleteDialog(categoryId)} className="text-red-500" />
                            </td>
                        </tr>
                    );
                    })
                }
                </tbody>
            </table>   
        </section>  
        {/* Delete category Dialog */}
        {isOpen && categoryToDelete && (
        <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
            <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
            <DialogTitle>Delete category</DialogTitle>
            <Description>This action is irreversible</Description>
            <p>Are you sure you want to delete this category? All of its data will be permanently removed. This action cannot be undone.</p>
                <div className="flex justify-between mt-4">
                    <button onClick={() => deleteCategory(categoryToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                    <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                </div>
            </DialogPanel>
        </Dialog>
            )}   
    </div>
    </>

  )
}

export default Categories

