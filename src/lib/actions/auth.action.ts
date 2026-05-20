"use server";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";


//signupformdata from global.d.ts 

//-----------------------------SIGN UP FUNCTION BETTER-AUTH THE DATA WILL BE SAVE3D ON DB COLLECTION -----------------------------
export const signUpWithEmail = async (data: SignUpFormData) => {
try {
    //here better auth will create a new user record in mongodb user record in user collection
    // it will hash the password, generateed  storga session token, and set token for session management
    const response = await auth.api.signUpEmail({
        body:{
            name: data.fullName,
            email: data.email,
            password: data.password,
            country: data.country,
            investmentGoals: data.investmentGoals,
            riskTolerance: data.riskTolerance,
            preferredIndustry: data.preferredIndustry,
        }
    });

    //after successfull user registration, we want to send a welcome email with personalization using Gemini AI model and Inngest for serverless function orchestration and event handling. So we will trigger an event 'app/user.created' with user data as payload, which will be picked up by our Inngest function to generate personalized welcome email and send it to the user.
    if(response){
        await inngest.send({
            name: 'app/user.created',
            data: {
                email: data.email,
                name: data.fullName,
                country: data.country,
                investmentGoals: data.investmentGoals,
                riskTolerance: data.riskTolerance,
                preferredIndustry: data.preferredIndustry,
            }
        });
        return { success: true ,data: response, message: 'User created successfully' };
    }
} catch (error) {
    console.error('Error during sign up:', error instanceof Error ? error.message : error);
    return { success: false, error: 'Failed to create an account.' };
}
}
//-----------------------------SIGN UP FUNCTION BETTER-AUTH THE DATA WILL BE SAVE3D ON DB COLLECTION -----------------------------

//-----------------------------SIGN OUT FUNCTION START -----------------------------
export const SIGN_OUT = async ()=>{
    try {
        //-- BETTER-AUTH  SIGNOUT , BY READING THE SESSION-TOKEN FROM HTTP ONLY COOKIE,
        //  THEN IT WILL REMOVE THE SESSION FROM THE MONGODB SESSION COLLECTION,
        //  CLEAR ALL THE AUTHENITCATION LOGIC, AND INVALID THE SESSION AND FINALLY LOGOUT   
        await auth.api.signOut({ 
            headers:await headers() 
        });
        
    } catch (error) {
        console.error('sign out failed',
            error instanceof Error ?
             error.message:error);
        return{
            success:false,
            error:"Technical issue occured while signing out"
        }
    }
}
//-----------------------------SIGN OUT FUNCTION END  -----------------------------


//-----------------------------SIGN IN FUNCTION START  -----------------------------


export const signInWithEmail = async (data: SignInFormData) => {
try {
    //here better auth will create a new user record in mongodb user record in user collection
    // it will hash the password, generateed  storga session token, and set token for session management
    const response = await auth.api.signInEmail({
        body:{
            email: data.email,
            password: data.password,
        }
    });
    return { success: true ,data: response, message: 'User created successfully' };
} catch (error) {
    console.error('Error during sign In:', error instanceof Error ? error.message : error);
    return { success: false, error: 'Failed to Sign In.' };
}
}



//-----------------------------SIGN IN FUNCTION END  -----------------------------




