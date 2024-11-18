"use client";

import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from 'lucide-react';


const Users = () =>{

    const [users, setUsers] = useState<UserType[]>([])


    useEffect(() => {
        const fetchUsers = async () => {
          const response = await fetch(`/api/admin/users`)
          // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
          const data: UserType[] =  await response.json()
          setUsers(data)

        }
    
        fetchUsers()
      },[]);

      users.map((user) => (
        
      console.log(user)
    ))

  return (

    <>
    <div className="flex w-screen">
      {/* Navigation menu for admin */}
      <AdminNav />
      <section className="border-2 border-green-800 flex-[8]">
        <h1 className="text-3xl text-white text-center">Users</h1>
        <table className="table-auto">
        <thead>
            <tr>
                <th>Username</th>
                <th>E-mail</th>
                <th>Last Signed In</th>
                <th>Is banned</th>
                <th>Details</th>
            </tr>  
        </thead>
        <tbody>
        {
            users.map((user) => {
            const clerkUserId = user.id;
            
            return (
                <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email_addresses[0].email_address}</td>
                <td>13/11/2024</td>
                <td>{user.banned ? "Banni" : "Non banni"}</td>
                <td>
                    <Link href={`/admin/users/${clerkUserId}`}>
                    <Eye />
                    </Link>
                </td>
                </tr>
            );
            })
        }
        </tbody>
        </table>   
      </section>     
    </div>
    </>

  )
}

export default Users

