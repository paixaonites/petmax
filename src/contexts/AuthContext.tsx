import React, {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {api,configured,session} from '../services/api';
import {User} from '../types';
type SignUpResult = {needsEmailConfirmation:boolean;pendingApproval:boolean};
type AuthContextValue = {user:User|null;loading:boolean;configured:boolean;signIn:(email:string,password:string)=>Promise<void>;signUp:(name:string,email:string,password:string)=>Promise<SignUpResult>;signOut:()=>Promise<void>;refreshProfile:()=>Promise<void>};
const Context = createContext<AuthContextValue|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}) {
 const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);
 async function refreshProfile(){const token=await session.get();if(!token){setUser(null);return;}try{setUser((await api<{user:User}>('/auth/me')).user);}catch{await session.clear();setUser(null);}}
 useEffect(()=>{void refreshProfile().finally(()=>setLoading(false));},[]);
 const value=useMemo<AuthContextValue>(()=>({user,loading,configured,
 signIn:async(email,password)=>{const result=await api<{token:string;user:User}>('/auth/login',{method:'POST',body:{email,password}});await session.save(result.token);setUser(result.user);},
 signUp:async(name,email,password)=>{const result=await api<SignUpResult>('/auth/register',{method:'POST',body:{name,email,password}});return result;},
 signOut:async()=>{await session.clear();setUser(null);},refreshProfile
 }),[user,loading]);return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('AuthProvider ausente');return value;}
