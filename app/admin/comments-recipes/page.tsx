"use client";

import AdminNav from "@/components/AdminNav";
import { useEffect, useState } from "react";
import { formatDate } from '@/lib/utils'
import { Trash2 } from 'lucide-react';
import Button from "@/components/Button";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';


const CommentRecipes = () =>{

    const [comments, setComments] = useState<CommentRecipe[]>([])
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null); 
    let [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
          const response = await fetch(`/api/admin/comments/comments-recipes`)
          const data: CommentArticleDetails[] =  await response.json()
          setComments(data)
    
        }
    
        fetchComments()
    },[]);

      comments.map((comment) => (
        
      console.log(comment)
    ))

    const deleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`/api/comments/delete/${commentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setIsOpen(false);  
                toast.success('Comment deleted with success');                 
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            toast.error('Something went wrong with deleting your comment. Please try again !');                 
        }
    }

    const openDeleteDialog = (commentId: string) => {
        setCommentToDelete(commentId);
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
            <h1 className="text-3xl text-white text-center">Comments recipes</h1>
            <table className="table-auto">
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Creation date</th>
                        <th>Author</th>
                        <th>Delete</th>
                    </tr>  
                </thead>
                <tbody>
                {
                    comments.map((comment) => {
                        const commentId = comment.id;
                    
                    return (
                        <tr key={comment.id}>
                            <td>{comment.text}</td>
                            <td>{formatDate(comment.createdAt)}</td>
                            <td>{comment.user.pseudo}</td>
                            <td>
                            <Button label="Remove" icon={Trash2} type="button" action={() => openDeleteDialog(commentId)} className="text-red-500" />
                            </td>
                        </tr>
                    );
                    })
                }
                </tbody>
            </table>   
        </section>  
        {/* Delete comment Dialog */}
        {isOpen && commentToDelete && (
        <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
            <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
            <DialogTitle>Delete Recipe</DialogTitle>
            <Description>This action is irreversible</Description>
            <p>Are you sure you want to delete this recipe? All of its data will be permanently removed. This action cannot be undone.</p>
                <div className="flex justify-between mt-4">
                    <button onClick={() => deleteComment(commentToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                    <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                </div>
            </DialogPanel>
        </Dialog>
            )}   
    </div>
    </>

  )
}

export default CommentRecipes

