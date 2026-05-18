"use client"

import TradingViewWidget from '@/components/tradingView/TradingViewWidget'
import { Button } from '@/components/ui/button'
import { MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'
import React from 'react'

const page = () => {
  const scriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-'
  return (
    <div className="flex min-h-screen home-wrapper">
      <section className="w-full grid gap-8 grid-cols-1 
      md:grid-cols-2
       xl:grid-cols-3
       ">

        <div
         className="md:col-span-1 xl:col-span-1 p-3"
         >
          <TradingViewWidget 
          scriptUrl={`${scriptUrl}market-overview.js`}
          config={MARKET_OVERVIEW_WIDGET_CONFIG}
          className='custom-chart'
          height={500}
          title='Market Overview'
          /> 
        </div>


        <div 
        className='md-col-span xl:col-span-2'>
        <TradingViewWidget 
          scriptUrl={`${scriptUrl}stock-heatmap.js`}
          config={MARKET_OVERVIEW_WIDGET_CONFIG}
          className='custom-chart'
          height={500}
          title='Custom-Chart'
          /> 
        </div>
      </section>


      {/*SECTION TWO START */}
      <section className="w-full grid gap-8 grid-cols-1 
      md:grid-cols-2
       xl:grid-cols-3
       ">

        <div
         className="h-full md:col-span-1 xl:col-span-1"
         >
          <TradingViewWidget 
          scriptUrl={`${scriptUrl}timeline.js`}
          config={TOP_STORIES_WIDGET_CONFIG}
          className='custom-chart'
          height={50}
          /> 
        </div>


        <div 
        className='md-col-span xl:col-span-2'>
        <TradingViewWidget 
          scriptUrl={`${scriptUrl}market-quotes.js`}
          config={MARKET_DATA_WIDGET_CONFIG}
          className='custom-chart'
          height={50}
          /> 
        </div>
      </section>
      {/*SECTION TWO END */}





      
    </div>
  )
}

export default page