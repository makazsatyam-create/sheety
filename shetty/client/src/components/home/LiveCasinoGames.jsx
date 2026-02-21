import React from 'react'
export const casinoGames = [
  {
    id: 1,
    src: "https://cdn.dreamdelhi.com/trending/evo_ar.webp",
    alt: "Auto-Roulette"
  },
  {
    id: 2,
    src: "https://cdn.dreamdelhi.com/trending/evo_ct.webp",
    alt: "Crazy Time"
  },
  {
    id: 3,
    src: "https://cdn.dreamdelhi.com/trending/evo_dt.webp",
    alt: "Dragon Tiger"
  },
  {
    id: 4,
    src: "https://cdn.dreamdelhi.com/trending/evo_ld.webp",
    alt: "Lightning Dice"
  },
  {
    id: 5,
    src: "https://cdn.uvwin2024.co/casino/trending_thumbnail/825521/__6-MARBLE-RACE-135x180-PIXELS.webp",
    alt: "Marble Race"
  },
  {
    id: 6,
    src: "https://cdn.dreamdelhi.com/trending/evo_rdr.webp",
    alt: "Red Door Roulette"
  },
  {
    id: 7,
    src: "https://cdn.dreamdelhi.com/trending/evo_speedb.webp",
    alt: "Speed Baccarat A"
  },
  {
    id: 8,
    src: "https://cdn.dreamdelhi.com/trending/evo_ssb.webp",
    alt: "Super Sic Bo"
  },
  {
    id: 9,
    src: "https://cdn.dreamdelhi.com/trending/evo_xlr.webp",
    alt: "XXXtreme Lightning Roulette"
  }
];

function LiveCasinoGames() {
  return (
    <div>
            <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
                  Live Casino Games
                </span>
                <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
                  {/* Highlight segment */}
                  <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
                </div>
                <div className="flex gap-2 overflow-x-scroll scrollbar-hide mt-2">
                  {casinoGames.map((image) => (
                    <img
                      key={image.id}
                      src={image.src} className="w-[100px]"/>
                  ))}
                </div>
        </div>
  )
}

export default LiveCasinoGames