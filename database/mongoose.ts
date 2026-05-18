import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache:{
        conn: typeof mongoose | null ;
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