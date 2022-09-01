import React from 'react';
import { createContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { destroyCookie, setCookie, parseCookies } from '../../node_modules/nookies/dist/index';
import Router from '../../node_modules/next/router';



import { api } from '../services/apiClient';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: ( credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')     //api.ts
    } catch (error) {
        console.log('erro ao deslogar')
    }
}
export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>()

    const isAuthenticated = !!user; //if user is empty -> false

    //will be executed wen reload the page
    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();

        if(token) {
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() =>{

                signOut();

            })
        }
    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token } = response.data;

            // console.log(response.data);
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60*60*24*30, // validate for this token = 1 month
                path: "/" //routes that can access the token
            })

            setUser({
                id,
                name,
                email,
            })

            //let new requirements know the token
            api.defaults.headers['Aithorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')
            //redirect to dashboards
            Router.push('/dashboard')
        } catch (err) {

            toast.error("Erro ao acessar!")
            console.log("Erro ao acessar", err)
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('users', {
                name,
                email,
                password
            })

            console.log("CADASTRADO COM SUCESSO!")

            Router.push('/')
            
        } catch (err) {
            console.log("erro ao cadastrar", err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}