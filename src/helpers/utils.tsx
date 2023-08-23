import { DateTime } from 'luxon'; 
import { PostsType } from "./types";
import React from "react";

export const extractPostById = function(id:string, posts:PostsType){
    const post = posts.find(post => post._id === id)
    return post
};

export const handleStatus401 = function(res:Response){

    const unauthorisedResponse = function(){
        const errors = {errors: {msg: 'The submitted username and password combination is not valid. Please try again.'}};
        const blobErrors = new Blob([JSON.stringify(errors)],{type: 'application/json'});
        return new Response(blobErrors)
    }

    const check401 = res.status === 401;
    return check401 ? unauthorisedResponse() : res;
};

export const parseAPIErrors = function(response:Record<'errors',Record<string,string | Record<string,string>>>){

    const errors = response?.errors;
    const keys = Object.keys(errors);

    const convertToErrorInterface = function(errorKey:string){
        return errorKey === 'msg' ? {
            'general': {
                error: true,
                msg: errors[errorKey] as string
            }
        } : {
            [errorKey]: {
                error: true,
                msg: (errors[errorKey] as Record<string,string>)['msg']
            }
        }
    }; 

   const errorsCollection = keys.map(convertToErrorInterface);
   const parsedErrors = Object.assign({}, ...errorsCollection)
   return parsedErrors 

};

export const produceDefaultErrorPairs = function(errorKeys:string[]){

    const produceDefaultErrorValue = function(){
        return {
            error : false,
            msg: ''
        }
    };

    const generalError = ['general', produceDefaultErrorValue()]

    return [generalError, ...errorKeys.map(function convertToKeyValues(key){
        return [key, produceDefaultErrorValue()]
    })]

};

export const produceDefaultNotificationStatus = function(){
    
    return {
        'Add Comment Notify': {message: 'Comment successfully added.' ,status: false}, 
        'Delete Comment Notify': {message: 'Comment successfully deleted.' ,status: false}, 
        'Edit Comment Notify': {message: 'Comment successfully modified.' ,status: false}
    }
   
};

export const restoreOriginalErrorState = function(errorsSetter: React.Dispatch<React.SetStateAction<Record<string,Record<string, string | boolean>>>>){
    const restorer = function(errors:Record<string,Record<string, string | boolean>>){
        const parameters = Object.keys(errors);
        const defaultErrorsCollection = produceDefaultErrorPairs(parameters);
        const defaultErrorsState = Object.fromEntries(defaultErrorsCollection);
        return defaultErrorsState
    }
    errorsSetter(restorer)
};

export const regulariseDate = function(postDate:string){    
    const utcDate = DateTime.fromISO(postDate, {zone: 'utc'});
    const localDate = utcDate.toLocal();
    const date = localDate.toLocaleString();
    return date

}

