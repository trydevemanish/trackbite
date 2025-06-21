import React, { createContext, useContext } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useappwrite";

interface User {
    $id : string;
    name : string;
    email : string;
    avatar : string;
}

interface GlobalContextType { 
    isloggedIn : boolean;
    user : User | null;
    loading : boolean;
    refetch: (newParams?: Record<string, any>) => Promise<void>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

const GlobalProvider = ({children}:{children:React.ReactNode}) => {

    const { 
        data : appwriteUser,
        loading,
        refetch
    } = useAppwrite({fn:getCurrentUser})

    const user: User | null = appwriteUser
    ? {
        $id: appwriteUser.$id,
        name: appwriteUser.name || "user",
        email: appwriteUser?.email || '',
        avatar: appwriteUser.avatar || '',
      }
    : null;


    const isloggedIn = !!user;

    return(
        <GlobalContext.Provider value={{ isloggedIn,user,loading, refetch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext)

    if(!context) throw new Error('useGlobalContext must be used within a Gloabalprovider');

    return context;
}

export default GlobalProvider