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

import Slider from "react-slick";

const settings = {
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true
};
function NewLaunch() {
  return (
    <Slider {...settings}>
  {images.map(item => (
    <div key={item.id}>
      <img src={item.src} alt={item.title} className="home-casino-img-slider" />
    </div>
  ))}
</Slider>
  )
}

export default NewLaunch