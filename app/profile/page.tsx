'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useAuthUser } from '@/components/UserProvider';
import  LinkButton  from '@/components/LinkButton';
import  Title  from '@/components/Title';
import { capitalizeFirstLetter } from '@/lib/utils';
import { UserPen, Heart, BookText, CircleX, Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import Button from '@/components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogPanel, Description } from '@headlessui/react';

const Profile = () => {
    // Retrieve user from react context
    const user = useAuthUser(); 
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [favorites, setFavorites] = useState<RecipeType[]>([]);
    const [comments, setComments] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    let [isOpen, setIsOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null); 
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;


    // Retrieve all the recipes and favorites
    useEffect(() => {

        if (!user) return;

        // We want to know if the recipe is part of the user's favorite recipes
        const fetchRecipesAndFavorites = async () => {
            try {
                const response = await fetch(`/api/profile/my-profile?clerkUserId=${user.id}`);
                const data = await response.json();
                setRecipes(data.recipes || []);
                setFavorites(data.favorites || []);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                // stop the loading when the informations are retrieved
                setLoading(false); 
            }
        }
        // We call the function
        fetchRecipesAndFavorites();
    }, [user]);

    const deleteRecipe = async (recipeId: string) => {
        try {
            const response = await fetch(`/api/recipes/delete/${recipeId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                closeDeleteDialog();
                toast.success('Recipe deleted with success');                 
                setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
            }
        } catch (error) {
            console.error("Error during recipe's deleting :", error);
            toast.error('Something went wrong with deleting your recipe. Please try again !');                 
        }
    };

    const openDeleteDialog = (recipeId: string) => {
        setRecipeToDelete(recipeId);
        setIsOpen(true);  
    };

    const closeDeleteDialog = () => {
        setIsOpen(false);  
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className='relative'>
            <div><Toaster/></div>
            <section className='flex gap-5 items-center p-2 rounded-md bg-gray-700'>
                <Image
                    src={user.profileImageUrl || `https://res.cloudinary.com/${cloudName}/image/upload/icon-7359529_640_zfkjaw.jpg`}
                    width={'100'}
                    height={'100'}
                    alt={user.username}
                    className="rounded-[50%]"
                />   
                <div>
                    <div className='flex items-center gap-3'>
                        <h1>{capitalizeFirstLetter(user?.username) }</h1>
                        <LinkButton label="Edit profile" icon={UserPen} path="/recipes" dynamicPath="" />                        
                    </div>
                    <div className='flex text-center gap-3'>
                        <div>
                            <p>Recipes</p>
                            <p>{recipes.length}</p>
                        </div>
                        <div>
                            <p>Comments</p>
                            <p>{comments.length}</p>
                        </div>
                        <div>
                            <p>Favorites</p>
                            <p>{favorites.length}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='my-5'>
                <Title label="My recipes" icon={BookText}  />
                <div className='flex flex-wrap gap-5'>
                    {
                        recipes.map((recipe) => (
                        <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            categoryName={recipe.category.title} 
                            isHealthy={recipe.isHealthy} 
                            IsVegan={recipe.IsVegan} 
                            difficultyLevel={recipe.difficulty} 
                            additionalButtonComponents={[ 
                                <LinkButton key="link-button" label="Edit" icon={Pen} path="/recipes/modify/" dynamicPath={recipe.slug} />,
                                <Button label="Delete recipe" icon={CircleX} type="button" action={() => openDeleteDialog(recipe.id)} className="bg-red-600"/>
                            ]} 
                        />         
                    ))}  
                </div>
            </section>
            <section>
                <Title label="My favorites" icon={Heart}  />
                <div className='flex flex-wrap gap-5'>
                    {
                        favorites.map((favorite) => (
                        <RecipeCard key={favorite.id} recipe={favorite} categoryName={favorite.category.title} isHealthy={favorite.isHealthy} IsVegan={favorite.IsVegan} difficultyLevel={favorite.difficulty} />         
                    ))}  
                </div>
            </section>
            {/* Delete Recipe Dialog */}
            {isOpen && recipeToDelete && (
                <Dialog open={isOpen} onClose={closeDeleteDialog} className="absolute top-[50%] left-[25%]" >
                    <DialogPanel className="bg-gray-300 p-5 rounded-md shadow-lg text-black">
                        <DialogTitle>Delete Recipe</DialogTitle>
                        <Description>This action is irreversible</Description>
                        <p>Are you sure you want to delete this recipe? All of its data will be permanently removed. This action cannot be undone.</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => deleteRecipe(recipeToDelete)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                            <button onClick={closeDeleteDialog} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </DialogPanel>
                </Dialog>
            )}
        </div>
    );
};

export default Profile;
