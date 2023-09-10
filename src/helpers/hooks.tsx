import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { LoadingStateResetContext, NotificationsContext, NotificationsDispatchContext } from "./contexts";
import { PostsType, UserInterface, IndexInterface } from "./types";
import { produceDefaultErrorPairs } from "./utils";


export const useErrorStates = function(errorParameters: string[]){
    
    const defaultErrors = produceDefaultErrorPairs(errorParameters); 
    const [errors, setErrors] = useState(Object.fromEntries(defaultErrors));
    
    return [errors,setErrors]
};


export const useFetchIndexData = function(){

    const [user,setUser] = useState<UserInterface | null>(null);
    const [posts, setPosts] = useState<PostsType | null>(null);

    const resetIndexData = function hardReset(){
        setPosts(() => null);
        setUser(() => null)
    };

    useEffect(()=> {

        const checkIfDataIsNull = function(){
            return posts === null && user === null
        };

        const setFreshUser = function(res:Record<'user' | 'posts', UserInterface | PostsType>){
            const responseUser = res.user;
            setUser(() => Object.assign({}, responseUser as UserInterface))
            return 
        };

        const setFreshPosts = function(res:Record<'user' | 'posts', UserInterface | PostsType>){
            const responsePosts = res.posts;
            setPosts([...responsePosts as PostsType])
            return

        };

        const setFreshIndexData = function(res:Record<'user' | 'posts', UserInterface | PostsType>){
            setFreshUser(res);
            setFreshPosts(res);
            return
        };

        const abortFetch = new AbortController();

        const fetchData = async function(){
            const response = await fetch("https://wswapi.onrender.com/admin", { 
                headers: {"Accept": "application/json", "Origin": `${window.location.origin}`},
                credentials: 'include',
                method: 'GET', 
                mode: 'cors',
                signal: abortFetch.signal
              }).catch((err:Error) => {throw err})
            return response.ok ?  setFreshIndexData(await response.json().catch((err:Error)=>{console.error(err)})) : false
        };

        checkIfDataIsNull() && fetchData()

        return () => {
            abortFetch.abort()
        }

    },[user,posts])



   return {user, posts, resetIndexData, setUser, setPosts}
};


export const useIndexData = function(){
    return useOutletContext<IndexInterface>()
};

export const useLoadingState = function(posts?: PostsType | null){
    const [loading, setLoading] = useState<boolean>(true);
    const resetLoadingState = function(){
        setLoading(true)
    }

    useEffect(()=>{
        const timeout = loading ? setTimeout(()=>{setLoading(false)},60000) : null
        posts ? setLoading(false) : null;

        return () => {
            timeout === null ? null : clearTimeout(timeout)
        }

    },[loading,posts])

    return {loading, resetLoadingState}
};

export const useNotifications = function(){
    return useContext(NotificationsContext)
};

export const useNotificationsDispatch = function(){
    return useContext(NotificationsDispatchContext)
};

export const useResetLoadingState = function(){
    return useContext(LoadingStateResetContext)
}