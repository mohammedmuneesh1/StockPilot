import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { nextCookies} from "better-auth/next-js";
import { connectToDatabase } from "../../../database/mongoose";

// let authInstance: ReturnType<typeof betterAuth> | null = null;

//EXPLANATION:
//it ensure we only create on instance and prevent multiple connections and improve preformance
// to mongodb in development mode with hot reload and in serverless environments where functions can be called multiple times and create multiple connections. This is a common pattern for database connection management in Next.js applications.
//eslint-disable-next-line
let authInstance:any = null;

export const getAuth = async () => {

    if(authInstance) return authInstance;
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if(!db) throw new Error('MongoDB connection not found');


     authInstance = betterAuth({
        // eslint-disable-next-line
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        //SETTING EMAIL AND PASSWORD AS THE ONLY AUTH METHOD FOR NOW,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },

        user:{
            additionalFields:{
                 country: {
                type: "string",
                required: false,
            },
            investmentGoals: {
                type: "string",
                required: false,
            },
            riskTolerance: {
                type: "string",
                required: false,
            },
            preferredIndustry: {
                type: "string",
                required: false,
            },
            }
        },
        //plugins are like middlewares that can be used to add extra functionality 
        // to the auth instance.
        //  In this case, we are using the nextCookies plugin to automatically set and read cookies for authentication in Next.js applications.
        plugins: [nextCookies()],
    });

    return authInstance;
}

// We export the auth instance directly so that it can be imported
//  and used in other parts of the application without needing to call getAuth() every time.
//  This ensures that we are always using the same instance and prevents multiple connections to MongoDB.

export const auth = await getAuth();