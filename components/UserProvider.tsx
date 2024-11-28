"use client"; 

import { createContext, useEffect, useState, useContext } from 'react';
import { useUser } from '@clerk/nextjs';
// import type { User } from '@clerk/nextjs/server';
import { UserResource } from "@clerk/types";

const UserContext = createContext<UserResource | null>(null); // Context can be UserResource or null
// const UserContext = createContext(null);

export const useAuthUser = () => useContext(UserContext);

interface UserProviderProps{
    children: React.ReactNode;
}


export const UserProvider = ({ children }: UserProviderProps) => {
    const { user, isLoaded } = useUser(); // Ajout de isLoaded pour suivre le chargement
    const [authUser, setAuthUser] = useState<UserResource| null>(null); // Initialize state with UserResource or null
    // const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        if (isLoaded && user) {
            setAuthUser(user);
        }
    }, [user, isLoaded]);

    // Évitez de fournir le contexte tant que l’utilisateur n’est pas chargé
    if (!isLoaded) return null;

    return (
        <UserContext.Provider value={authUser}>
            {children}
        </UserContext.Provider>
    );
};
