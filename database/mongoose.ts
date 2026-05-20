import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache:{
        conn: typeof mongoose | null ; //⚠️ CONN MEANS CONNECTION
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached){
    cached = global.mongooseCache = {
        conn: null, 
        promise: null
    }
}



export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI is not defined');
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    console.log(`Connected to MongoDB ${process.env.NODE_ENV}`);
    return cached.conn;
} 


//global is another versio nof window. wherre it is a global variable

// Main purpose of this code

// This whole file exists to solve one problem:

// Prevent creating multiple MongoDB connections

// especially in:

// Next.js dev mode
// hot reload
// serverless environments

// Without this caching pattern, every reload can create new DB connections until MongoDB starts screaming.



// 3. declare global

// This is the important TypeScript part.

// declare global {
//     var mongooseCache:{
//         conn: typeof mongoose | null ;
//         promise: Promise<typeof mongoose> | null;
//     }
// }



// What is global?

// In Node.js:

// global

// is similar to:

// window

// in browser.

// It is a global shared object.



// Why store cache in global?
// Because in Next.js dev mode:

// files reload often
// modules re-run often
// If cache is normal variable:

// let cached = {}
// it resets every reload.
// But:
// global.mongooseCache
// survives module reloads.
// That is the entire trick.

// 4. Create cached variable
// let cached = global.mongooseCache;

// Gets existing cache if available.

// 5. Initialize cache if not exists
// if(!cached){
//     cached = global.mongooseCache = {
//         conn: null, 
//         promise: null
//     }
// }






// "global object will have a property called mongooseCache"

// This is purely:

// type declaration
// compile-time information
// TypeScript only







// This:
// global.mongooseCache = {
//    conn: null,
//    promise: null
// }
// is TYPE declaration.



// creates the REAL variable/value at runtime.

// declare global {
//    var mongooseCache: string;
// }

// means:

// "Trust me TS, this property exists somewhere."


// Without declare global:

// global.mongooseCache

// causes TS error:

// Property 'mongooseCache' does not exist on type 'globalThis'


// So the flow is:
// Step 1

// Tell TypeScript:

// declare global {
//    var mongooseCache: ...
// }


// Simple analogy

// declare global
// =
// adding new fields to TypeScript's knowledge

// global.mongooseCache = ...
// =
// actual runtime object creation
