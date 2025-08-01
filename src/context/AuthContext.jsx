import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase-client";


const AuthContext = createContext()
export function AuthContextProvider({children}){
    const [session, setSession] = useState(undefined)

    useEffect(() => {
        async function getInitialSession() {
            try {
                const { data, error } = await supabase.auth.getSession()
                if(error) {
                    throw new error
                }
                setSession(data.session)
            }
            catch(error) {
                console.error(error)
            }
        }
        getInitialSession()

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signinUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password: password
            })
            if(error) {
                console.error(`Supabase Sign-in error: `, error.message)
                return {success: false, error: error.message}
            }
            return {success: true, data}
        }
        catch(error) {
            console.error(`Unexpected sign-in error: `, error.message)
            return {success: false, error: `Unexpected error occured during sign-in. Please try again`}
        }
    }

    const signOutUser = async () => {
        try {
            const {error} = await supabase.auth.signOut()
            if(error) {
                console.error(`Supabase Sign-out error: `, error.message)
                return {success: false, error: error.message}
            }
            return {success: true}
        }
        catch(error) {
            console.error(`Unexpected sign-in error: `, error.message)
            return {success: false, error: `Unexpected error occured during sign-out. Please try again`}
        }
    }

    const createUserProfile = async (userId, name) => {
        try {
            const {error} = await supabase
            .from('profiles')
            .insert([
                {id: userId, name: name}
            ])

            if(error) {
                console.error(error)
                return
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    const signUpNewUser = async (email, password, name) => {
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email.toLowerCase(),
                password: password
            })
            if(error) {
                console.error(`Supabase Sign-up error: `, error.message)
                return {success: false, error: error.message}
            }

            const userId = data.user?.id
            if(userId) {
                await createUserProfile(userId, name)
            }

            return {success: true, data}
        }
        catch(error) {
            console.error(`Unexpected sign-up error: `, error.message)
            return {success: false, error: `Unexpected error occured during sign-up. Please try again`}
        }
    }


    const getUserId = async () => {
        try {
            const {data, error} = await supabase.auth.getUser()
            if(error) {
                console.error(error)
                return null
            }
            return data?.user?.id || null
        }
        catch(e) {
            console.error(e)
        }
        return null
    }
    

    return(
        <AuthContext.Provider value={{session, signinUser, signOutUser, signUpNewUser, getUserId}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}