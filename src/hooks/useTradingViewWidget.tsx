"use client"

import { useEffect, useRef } from "react";


const useTradingViewWidget = (
    scriptUrl:string,
    config:Record<string,unknown>,
    height=600
) => {
    const containerRef = useRef<HTMLDivElement|null>(null);




    useEffect(() => {
        if (!containerRef?.current) return;
        if (containerRef?.current?.dataset?.loaded) return;

        //         containerRef.current.innerHTML = `
        // <div class="tradingview-widget-container"
        // style="width:100%; height:${height}px;"
        // >
        // </div>
        // `

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.type = "text/javascript";
        script.async = true;
        // ✅ Use textContent (not innerHTML) and correct JSON.stringify casing
        script.textContent = JSON.stringify(config);

        // ✅ Append to the container directly — don't wipe innerHTML first
        containerRef.current.appendChild(script);
        containerRef.current.dataset.loaded = 'true';

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                delete containerRef.current.dataset.loaded;
            }
        };
    }, [scriptUrl, config, height]);



    return containerRef;
};


export default useTradingViewWidget;


    // useEffect(() => {
    //     if (!containerRef?.current) return;
    //     if (containerRef?.current?.dataset?.loaded) return;

    //     const script = document.createElement("script");
    //     script.src = scriptUrl;
    //     script.type = "text/javascript";
    //     script.async = true;
    //     // ✅ Use textContent (not innerHTML) and correct JSON.stringify casing
    //     script.textContent = JSON.stringify(config);

    //     // ✅ Append to the container directly — don't wipe innerHTML first
    //     containerRef.current.appendChild(script);
    //     containerRef.current.dataset.loaded = 'true';

    //     return () => {
    //         if (containerRef.current) {
    //             containerRef.current.innerHTML = '';
    //             delete containerRef.current.dataset.loaded;
    //         }
    //     };
    // }, [scriptUrl, config, height]);













        // useEffect(() => {

    //     if(!containerRef?.current) return;
    //     //if alrady loaded one widget , then exit creating auto new one.
    //     if(containerRef?.current?.dataset?.loaded) return;

        // containerRef.current.innerHTML = `
        // <div class="tradingview-widget-container"
        // style="width:100%; height:${height}px;"
        // >
        // </div>
        // `

    //     const script = document.createElement("script");
    //     script.src = scriptUrl;
    //     script.type = "text/javascript";
    //     script.async = true;
    //     script.textContent  = `JSON.stringify(${JSON.stringify(config)})`;
    //     containerRef.current.appendChild(script);
    //     containerRef.current.dataset.loaded = 'true';

    //     return () => {
    //         if(containerRef.current){
    //             containerRef.current.innerHTML = '';
    //             delete containerRef.current.dataset.loaded;

    //         }

            
    //     }
    // }, [scriptUrl, config, height]);
