import React, { createContext, useState, useContext } from 'react'

type UserContextType = {
    name: string
    setName: (n: string) => void
}


const UserContext = createContext<UserContextType | undefined>(undefined)


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [name, setName] = useState(() => {
        return localStorage.getItem('ochat:name') || ''
    })


    const setNameAndPersist = (n: string) => {
        setName(n)
        localStorage.setItem('ochat:name', n)
    }


    return (
        <UserContext.Provider value={{ name, setName: setNameAndPersist }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUser = () => {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used inside UserProvider')
    return ctx
}
