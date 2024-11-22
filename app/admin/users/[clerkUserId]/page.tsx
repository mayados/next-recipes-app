"use client"

import Title from '@/components/Title'
import { formatDate } from '@/lib/utils'
import { convertMillisecondsToDate } from '@/lib/utils'
import { useEffect, useState, FormEvent } from "react";
import { capitalizeFirstLetter } from '@/lib/utils'
import Image from 'next/image'
import { Ban, CookingPot, SendHorizontal, MessageCircle } from 'lucide-react';
import Button from '@/components/Button';
import toast, { Toaster } from 'react-hot-toast';
import { Field, Textarea, Label, Legend, Radio, RadioGroup, Fieldset, Input, Select  } from '@headlessui/react';


const UserDetails = ({params}: {params: {clerkUserId: string}}) => {

    // clerk already has its own types so there is no really need to provide one, except if we want to create a type with all the informations we want to retrieve 
    // type UserType can't be placed here because its props doesn't match props of the user of clerk
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true);
    const [ban, setBan] = useState<boolean | undefined>();
    const [numberComments, setNumberComments] = useState<number | null>();
    const [numberRecipes, setNumberRecipes] = useState<number | null>();
    const [pictureUrl, setPictureUrl] = useState<string | null>();
    const [userPicture, setUserPicture] = useState("");
    const [userName, setUserName] = useState<string | undefined>();
    const [userMail, setUserMail] = useState<string | undefined>();


    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch(`/api/admin/users/${params.clerkUserId}`)
            const data: [] = await response.json()
            console.log(data)
            setUser(data['user'])   
            setBan(data['user'].banned) 
            setUserPicture(data['user'].image_url) 
            setUserName(data['user'].username) 
            setUserMail(data['user'].email_addresses[0].email_address) 
            setNumberComments(data['countComments'])
            setNumberRecipes(data['countRecipes'])
          } catch (error) {
              console.error("Error fetching user data:", error);
          } finally {
              // stop the loading when the informations are retrieved
              setLoading(false); 
          }
        }  
        fetchUser()

      
    }, [params.clerkUserId])

    const banUser = async (userId: string) => {
      try {
          const response = await fetch(`/api/admin/users/${params.clerkUserId}/ban`, {
              method: "POST",
          });
          if (response.ok) {
              toast.success('User unbanned with success');          
              // we have to update the state of ban with the useState
              setBan(true)
          }
      } catch (error) {
          console.error("Error during the user's ban :", error);
          toast.error("Something went wrong with the user's ban. Please try again !");                 
      }
    }

    const unBanUser = async (userId: string) => {
      try {
          const response = await fetch(`/api/admin/users/${params.clerkUserId}/ban`, {
              method: "POST",
          });
          if (response.ok) {
              toast.success('User banned with success');          
              // we have to update the state of ban with the useState
              setBan(false)
          }
      } catch (error) {
          console.error("Error during the user's ban :", error);
          toast.error("Something went wrong with the user's ban. Please try again !");                 
      }
    }

    const handleImageChange = (e) => {
      // There is only one file to get each time
      const file = e.target.files?.[0];
      if (!file) return;

      // generate temporary url for preview
      const previewUrl = URL.createObjectURL(file);
      setPictureUrl(previewUrl);  
      setUserPicture(file);

    };


    const modifyUser = async (e) => {
      e.preventDefault();
      try{
          const uploadUserImage = async () => {
              const file = userPicture; 
          
              if (file) {
                  const formData = new FormData();
                  formData.append("file", file);
          
                  const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                  });
          
                  const data = await response.json();
                  return data.url;  
                  
              }
          
              return null;  
          };
          // const pictureUser = await uploadUserImage();
          const clerkUserId = user?.id;
          // console.log("la vraie url de l'image est : "+pictureUser);
          const userMailId = user?.email_addresses[0].id;
          console.log("L'id de l'adresse mail utilisateur est : "+userMailId)
          // update user picture
          const formData = new FormData();
          formData.append("userPicture", userPicture);  // Ajout du fichier au FormData
          formData.append("clerkUserId", clerkUserId);  // ID utilisateur Clerk
          formData.append("userName", userName);  // Nom de l'utilisateur
          formData.append("userMail", userMail);  // Email de l'utilisateur
          formData.append("userMailId", userMailId);  // ID de l'adresse mail
          const response = await fetch(`/api/admin/users/modify`, {
            method: "POST",
           
            body: formData,
          });
          if (response.ok) {
            const updatedDatas = await response.json();
            toast.success("User updated with success");
            console.log('mise ç jour'+updatedDatas.profileImageUrl)
            setUserName(updatedDatas.newUsername)
            setUserPicture(updatedDatas.profileImageUrl)
            console.log(updatedDatas.newPicture)
            setUserMail(updatedDatas.newMail)
            console.log(updatedDatas.newMail)
            console.log("La nouvelle adresse est :"+updatedDatas.newMail['email_address'])

          }

          

      }catch (error) {
          console.error("Erreur lors de la modification de la recette :", error);
          toast.error("There was a problem with updating your recipe. Please try again!");
      }
    };

    if (loading) return <p>Loading user informations...</p>;

  return (
    <>
      <div><Toaster/></div>
      <section className='flex gap-5 items-center p-2 rounded-md bg-gray-700'>
        <Image
          src={userPicture }
          width={'100'}
          height={'100'}
          alt={user?.username}
          className="rounded-[50%]"
        />   
        <div>
          <div className='flex items-center gap-3'>
            <h1>{capitalizeFirstLetter(user?.username) }</h1>
          </div>
          <div className='flex flex-col'>
            <p>Ban : {ban ? "Yes": "No"}</p>
            <p>Last active at : {convertMillisecondsToDate(user?.last_active_at)}</p>
          </div>
        </div>
      </section>
      <section className='flex justify-center gap-5 mt-3'>
        <div className='text-center border-2 border-pink-600 p-2 rounded-md'>
          <p className="flex gap-2">< CookingPot />Recipes</p>
          <p className="font-semibold text-pink-600">{numberRecipes}</p>
        </div>
        <div className='text-center border-2 border-pink-600 p-2 rounded-md'>
          <p className="flex gap-2">< MessageCircle />Comments</p>
          <p className="font-semibold text-pink-600">{numberComments}</p>
        </div>
      </section>
      <section>
        {ban ? (
          // If the user is banned, we want the button to unban him
          <Button
            label="Unban"
            icon={Ban}
            type="button"
            action={() => unBanUser(user?.id)}
            className="text-white"
          />
        ) : (
          // If the user isn't banned, we want the button to ban him
          <Button
            label="Ban user"
            icon={Ban}
            type="button"
            action={() => banUser(user?.id)}
            className="text-white"
          />
        )}
         <form onSubmit={modifyUser} className="flex flex-col gap-5 border-2 border-pink-600 mx-[20vh] mt-5 px-5 py-3 rounded-md">
            <div>
                <label htmlFor="">Username</label>
                <Field className="w-full">
                    <Input 
                        name="username" 
                        className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        type='text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}>
                    </Input>
                </Field>
            </div>
            <div>
                <label htmlFor="">E-mail</label>
                <Field className="w-full">
                    <Input 
                        name="email" 
                        type='text'
                        className="w-full h-[2rem] rounded-md bg-gray-700 text-white pl-3" 
                        value={userMail}
                        onChange={(e) => setUserMail(e.target.value)}>
                    </Input>
                </Field>
            </div>
            <div>
                <label htmlFor="user-picture">User's picture</label>
                <input
                type="file"
                id="user-picture"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                />
                {pictureUrl && <img src={pictureUrl} alt="Preview of new profile picture" />}
            </div> 
            <Button icon={SendHorizontal} label="Update user" specifyBackground="" type="submit" />
        </form> 
      </section>

    </>
  )

}

export default UserDetails