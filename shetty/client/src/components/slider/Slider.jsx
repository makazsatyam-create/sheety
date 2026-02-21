import Slider from "react-slick";

const settings = {
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true
};

<Slider {...settings}>
  {images.map(item => (
    <div key={item.id}>
      <img src={item.src} alt={item.title} className="home-casino-img-slider" />
    </div>
  ))}
</Slider>

export default Slider;