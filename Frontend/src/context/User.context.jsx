import React, {  useState } from 'react'
import { createContext } from "react";

export const userContext = createContext()



export const UserProvider = ({children}) => {

    const [user, setUser] = useState(null)

    return (

    <userContext.Provider value={{user,setUser}}>
        {children}
    </userContext.Provider>
    
    )
}

