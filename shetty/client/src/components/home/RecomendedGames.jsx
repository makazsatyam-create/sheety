import React from 'react'

export const recommendedGames = [
  {
    id: 1,
    src: "https://cdn.dreamdelhi.com/trending/ab.webp",
    alt: "Andar Bahar"
  },
  {
    id: 2,
    src: "https://cdn.dreamdelhi.com/trending/baccarat.webp",
    alt: "Baccarat"
  },
  {
    id: 3,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-Y1MTP101.webp",
    alt: "Muflis Teenpatti"
  },
  {
    id: 4,
    src: "https://cdn.dreamdelhi.com/trending/bc.webp",
    alt: "Bollywood Casino"
  },
  {
    id: 5,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-YDT102.webp",
    alt: "Dragon Tiger"
  },
  {
    id: 6,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-DT2101.webp",
    alt: "Dragon Tiger 2"
  },
  {
    id: 7,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-X2TP101.webp",
    alt: "Instant 2 Cards Teenpatti"
  },
  {
    id: 8,
    src: "https://cdn.dreamdelhi.com/trending/l7.webp",
    alt: "Lucky 7"
  },
  {
    id: 9,
    src: "https://cdn.dreamdelhi.com/trending/poker.webp",
    alt: "Poker 1-Day"
  },
  {
    id: 10,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-YRTT102.webp",
    alt: "Race 20"
  },
  {
    id: 11,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-XRT101.webp",
    alt: "Roulette"
  },
  {
    id: 12,
    src: "https://cdn.dreamdelhi.com/trending/sicbo.webp",
    alt: "Sic Bo"
  },
  {
    id: 13,
    src: "https://cdn.dreamdelhi.com/trending/ttp.webp",
    alt: "Teenpatti"
  },
  {
    id: 14,
    src: "https://cdn.dreamdelhi.com/trending/5c.webp",
    alt: "5 Five Cricket"
  },
  {
    id: 15,
    src: "https://cdn.dreamdelhi.com/trending/dt1d.webp",
    alt: "1 Day Dragon Tiger"
  },
  {
    id: 16,
    src: "https://cdn.dreamdelhi.com/trending/32c.webp",
    alt: "20-20 Teenpatti"
  },
  {
    id: 17,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-TPTT2101.webp",
    alt: "20 20 Teenpatti 2"
  },
  {
    id: 18,
    src: "https://cdn.dreamdelhi.com/trending/32%20Cards.webp",
    alt: "32 Cards"
  },
  {
    id: 19,
    src: "https://cdn.dreamdelhi.com/updated/MAC88-YA3101.webp",
    alt: "Amar Akbar Anthony"
  },
  {
    id: 20,
    src: "https://cdn.uvwin2024.co/casino/trending_thumbnail/150063/dream_wheel.webp",
    alt: "Dream Wheel"
  },
  {
    id: 21,
    src: "https://cdn.dreamdelhi.com/trending/so.webp",
    alt: "Super Over One Day"
  }
];


function RecomendedGames() {
  return (
    <div>
        <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
              Recomended Games
            </span>
            <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
              {/* Highlight segment */}
              <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
            </div>
            <div className="flex gap-2 overflow-x-scroll scrollbar-hide mt-2">
              {recommendedGames.map((image) => (
                <img
                  key={image.id}
                  src={image.src} className="w-[100px]"/>
              ))}
            </div>
    </div>
  )
}

export default RecomendedGames