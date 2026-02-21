import React from 'react'
import aviatorimage from '../../assets/tranding1.webp'
import livePredictionimage from '../../assets/liveprediction.webp'
import chickenGamesimage from '../../assets/chickengames.webp'
import colourPredictionimage from '../../assets/colourprediction.jfif'
import bombeylobbeyimage from '../../assets/bombeylobbey.jfif'
import minesimage from '../../assets/mines.webp'
function TrandingGames() {
  return (
    <div className='mt-2'>
        <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
          Trending Games
        </span>
        <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
            {/* Highlight segment */}
            <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
        </div>
        <div className='grid grid-cols-3 gap-2'>
            <img src={aviatorimage} alt="Aviator" className=' mt-2 cursor-pointer w-xs h-xs'/>
            <img src={livePredictionimage} alt="Live Prediction" className='w-xs h-xs mt-2 cursor-pointer'/>
            <img src={chickenGamesimage} alt="Chicken Games" className='w-xs h-xs mt-2 cursor-pointer'/>
        </div>
        <div className='grid grid-cols-3 gap-2 mt-2'>
            <img src={colourPredictionimage} alt="Colour Prediction" className='w-xs h-xs mt-2 cursor-pointer'/>
            <img src={bombeylobbeyimage} alt="Bombey Lobbey" className='w-xs h-xs mt-2 cursor-pointer'/>
            <img src={minesimage} alt="Mines" className='w-xs h-xs mt-2 cursor-pointer'/>
        </div>
    </div>
  )
}

export default TrandingGames