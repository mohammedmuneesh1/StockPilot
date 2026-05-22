

"use client"

import { useCallback, useRef } from "react";




// So instead of:

// A → API call
// AP → API call
// APP → API call
// APPL → API call

// You get:
// user stops typing → 250ms → ONE API call




export function useDebounce(callbackFn:()=>void,delay:number){

    //This is a memory box that survives re-renders.
    //It stores: the current timer ID even when component re-renders
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); 

    return useCallback(() => {
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(callbackFn,delay);
        //This says:  “Run the real function after 250ms (if not cancelled)”
    },
    //“If user is still typing, cancel previous scheduled call”
//     A → schedule search
// AP → cancel previous, schedule new
// APP → cancel previous, schedule new

     [callbackFn, delay])
}



// 1️⃣ Your real search function

// const handleSearch = async ()=>{
//     setLoading(true);
//     try{
//         const results = await searchStocks(searchTerm);  
//         setStocks(results);
//     }
//     catch(error){
//         setStocks([]);
//     }
//     finally{
//         setLoading(false);
//     }

// }


// 2️⃣ Debounced version
// const debouncedSearch = useDebounce(handleSearch,250);
// Now debouncedSearch() is NOT immediate.

// 3️⃣ Triggering it

// useSearch(()=>{
// debouncedSearch();
// },[searchTerm])


// So every time user types:
// searchTerm changes
