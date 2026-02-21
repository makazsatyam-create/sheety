import React from "react";
export const slotgame = [
  {
    id: 1,
    src: "https://cdn.dreamdelhi.com/updated/jili_jackpot_fishing.webp",
    alt: "Jackpot Fishing"
  },
  {
    id: 2,
    src: "https://cdn.dreamdelhi.com/updated/jili_royal_fishing.webp",
    alt: "Royal Fishing"
  },
  {
    id: 3,
    src: "https://cdn.dreamdelhi.com/updated/jili_mega_fishing.webp",
    alt: "Mega Fishing"
  },
  {
    id: 4,
    src: "https://cdn.dreamdelhi.com/updated/jili_ali_baba.webp",
    alt: "Ali Baba"
  },
  {
    id: 5,
    src: "https://cdn.dreamdelhi.com/updated/jili_bonus_hunter.webp",
    alt: "Bonus Hunter"
  },
  {
    id: 6,
    src: "https://cdn.dreamdelhi.com/updated/jili_boom_legend.webp",
    alt: "Boom Legend"
  },
  {
    id: 7,
    src: "https://cdn.dreamdelhi.com/updated/jili_boxing_king.webp",
    alt: "Boxing King"
  },
  {
    id: 8,
    src: "https://cdn.dreamdelhi.com/updated/jili_chin_shi_huang.webp",
    alt: "Chin Shi Huang"
  },
  {
    id: 9,
    src: "https://cdn.dreamdelhi.com/updated/kingmidas_coin_toss.webp",
    alt: "Coin Toss"
  },
  {
    id: 10,
    src: "https://cdn.dreamdelhi.com/updated/jili_crazy777.webp",
    alt: "Crazy777"
  },
  {
    id: 11,
    src: "https://cdn.dreamdelhi.com/updated/jili_dinosaur_tycoon.webp",
    alt: "Dinosaur Tycoon"
  },
  {
    id: 12,
    src: "https://cdn.dreamdelhi.com/updated/v2/jili_fortune_gems_2.webp",
    alt: "Fortune Gems 2"
  },
  {
    id: 13,
    src: "https://cdn.dreamdelhi.com/updated/v2/jili_fortune_gems_3.webp",
    alt: "Fortune Gems 3"
  },
  {
    id: 14,
    src: "https://cdn.dreamdelhi.com/updated/jili_master_tiger.webp",
    alt: "Master Tiger"
  },
  {
    id: 15,
    src: "https://cdn.dreamdelhi.com/updated/jili_mega_ace.webp",
    alt: "Mega Ace"
  },
  {
    id: 16,
    src: "https://cdn.dreamdelhi.com/trending/jili_moneycoming.webp",
    alt: "Money Coming"
  },
  {
    id: 17,
    src: "https://cdn.dreamdelhi.com/updated/jili_pharaoh_treasure.webp",
    alt: "Pharaoh Treasure"
  },
  {
    id: 18,
    src: "https://cdn.dreamdelhi.com/updated/gmz_pilot_coin.webp",
    alt: "Pilot Coin"
  },
  {
    id: 19,
    src: "https://cdn.dreamdelhi.com/updated/jili_pirate_queen.webp",
    alt: "Pirate Queen"
  },
  {
    id: 20,
    src: "https://cdn.dreamdelhi.com/updated/v2/jili_pusoy_go.webp",
    alt: "Pusoy Go"
  },
  {
    id: 21,
    src: "https://cdn.dreamdelhi.com/updated/jili_sevensevenseven.webp",
    alt: "SevenSevenSeven"
  }
];

function SlotsGame() {
  return (
    <div>
      <span className="text-[20px] lg:text-[25px] font-[900] text-[#fff] italic">
        Slots Games
      </span>
      <div className="relative mt-2 h-[2px] w-full bg-cyan-500/30">
        {/* Highlight segment */}
        <div className="absolute left-0 top-0 h-full w-[100px]  bg-cyan-400 rounded-full" />
      </div>
      <div className="flex gap-2 overflow-x-scroll scrollbar-hide mt-2">
        {slotgame.map((image) => (
          <img key={image.id} src={image.src} className="w-[100px]" />
        ))}
      </div>
    </div>
  );
}

export default SlotsGame;
