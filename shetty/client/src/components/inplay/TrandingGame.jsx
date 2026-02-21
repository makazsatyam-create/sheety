import React from 'react'
export const trandinggames=[
  {
    "id": 150079,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/150079/__LIGHTENING-DRAGON-TIGER.webp"
  },
  {
    "id": 151180,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151180/__LIGHTNING-ROULETTE.webp"
  },
  {
    "id": 151163,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151163/__1-DRAGON-TOWER.webp"
  },
  {
    "id": 151164,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151164/__2-PACKS.webp"
  },
  {
    "id": 151165,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151165/NAUGHTY-BUTTON.png"
  },
  {
    "id": 151154,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151154/__RACE-TRACK.webp"
  },
  {
    "id": 151133,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151133/__JHANDI-MUNDA.webp"
  },
  {
    "id": 151080,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151080/TWIST-X.png"
  },
  {
    "id": 151178,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151178/__1-THE-VOICE.webp"
  },
  {
    "id": 151179,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151179/__2-DEAL-NO-DEAL.webp"
  },
  {
    "id": 151170,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151170/__3-SNAKES.webp"
  },
  {
    "id": 151162,
    "image": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151162/PUMP.png"
  }
]

function TrandingGame() {
  return (
    <div className='p-1'>
        <div className='bg-[#071123] rounded-sm p-2 flex justify-between items-center'>
            <span className='text-[13px] font-[500] text-[#ffffff]'>Trending Games</span>
            <span className='text-[#01fafe] text-[12px] font-[400]'>See more</span>

        </div>
        <div className='grid grid-cols-3 p-1 gap-1'>
        {trandinggames.map((game)=>(
            <div key={game.id} className=''>
                <img src={game.image} alt="tranding game" className="min-w-[50px] h-auto rounded-md"/>
            </div>
        ))}
    </div>
    </div>
  )
}

export default TrandingGame