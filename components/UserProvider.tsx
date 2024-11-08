"use client"; 

import { createContext, useEffect, useState, useContext } from 'react';
import { useUser } from '@clerk/nextjs';

const UserContext = createContext(null);

export const useAuthUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { user, isLoaded } = useUser(); // Ajout de isLoaded pour suivre le chargement
    const [authUser, setAuthUser] = useState(null);

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
