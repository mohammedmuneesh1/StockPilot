"use client"

import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import { cn } from '@/lib/utils';
// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';




interface TradingViewWidgetInterface{
    title?:string,
    config:Record<string,unknown>,
    scriptUrl:string
    height?:number, //600
    className?:string

} 

const TradingViewWidget:React.FC<TradingViewWidgetInterface>=({
    config,
    scriptUrl,
    className,
    height=600,
    title
})=>{
    //this hook return a ref object
  const containerRef  = useTradingViewWidget(scriptUrl,config,height)
  return (

    <div 
    // style={{height:`${height}px`}}
    className={`w-full `}>

        {title && <h3
         className='text-xl sm:text-2xl font-semibold
          text-gray-200 mb-5
          '>{title}</h3>
          }
    <div 
    className={cn(
        "tradingview-widget-container",
        className,

    )}
    // className="tradingview-widget-container"
     ref={containerRef}
      
      >

      <div
       className="tradingview-widget-container__widget" 
       style={{
        width:'100%',
        height,
       }}
       />

      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span className="blue-text">AAPL stock chart</span></a><span className="trademark"> by TradingView</span></div>
    </div>
    </div>

  );
}

export default memo(TradingViewWidget);