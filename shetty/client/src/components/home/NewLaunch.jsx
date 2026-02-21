import React from 'react'
const images = [
  {
    "id": 1,
    "title": "Lightning Dragon Tiger",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/150079/__LIGHTENING-DRAGON-TIGER.webp"
  },
  {
    "id": 2,
    "title": "VR Lightning Roulette",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151180/__LIGHTNING-ROULETTE.webp"
  },
  {
    "id": 3,
    "title": "Dragon Tower",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151163/__1-DRAGON-TOWER.webp"
  },
  {
    "id": 4,
    "title": "Packs",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151164/__2-PACKS.webp"
  },
  {
    "id": 5,
    "title": "Naughty Button",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151165/NAUGHTY-BUTTON.png"
  },
  {
    "id": 6,
    "title": "Race Track",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151154/__RACE-TRACK.webp"
  },
  {
    "id": 7,
    "title": "Jhandi Munda",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151133/__JHANDI-MUNDA.webp"
  },
  {
    "id": 8,
    "title": "Twist X",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151080/TWIST-X.png"
  },
  {
    "id": 9,
    "title": "The Voice",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151178/__1-THE-VOICE.webp"
  },
  {
    "id": 10,
    "title": "Deal Or No Deal",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151179/__2-DEAL-NO-DEAL.webp"
  },
  {
    "id": 11,
    "title": "Snakes",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151170/__3-SNAKES.webp"
  },
  {
    "id": 12,
    "title": "Pump",
    "src": "https://cdn.uvwin2024.co/casino/trending_thumbnail/151162/PUMP.png"
  }
]
function NewLaunch() {
  return (
    <div className="mt-2">
           <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
              NEW LAUNCH
            </span>
            <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
              {/* Highlight segment */}
              <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
            </div>
            <div className="flex gap-2 overflow-x-scroll scrollbar-hide mt-2">
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.src} className="w-[100px]"/>
              ))}
            </div>
        </div>
  )
}

export default NewLaunch