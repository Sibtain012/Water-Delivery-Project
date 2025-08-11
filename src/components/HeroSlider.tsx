import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import images (adjust relative path as needed)
import doubleBottle from '../../assets/images/double-bottle.png';
import hero1 from '../../assets/images/icons/Ice-1.png';
import hero2 from '../../assets/images/hero-2.png';

interface HeroSliderProps {
  onOrderToday: () => void;
  onSubscribeClick: () => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onOrderToday, onSubscribeClick }) => {
  const heroSlides = [
    {
      id: 1,
      tagline: "~ Understand the importance of life",
      title: "Pure & Healthy",
      subtitle: "Drinking Water",
      buttonText1: "ORDER TODAY!",
      buttonText2: "SUBSCRIBE NOW",
      image: doubleBottle,
      imageAlt: "Water Bottles",
      backgroundImage: hero1,
      isFullBackground: false
    },
    {
      id: 2,
      tagline: "~ Fresh and Available",
      title: "ABE TAHURA",
      para: "The Perfect TDdS for Kidney, Refereshing Hydration in Every Drop",
      buttonText1: "ORDER NOW!",
      buttonText2: "SUBSCRIBE TODAY",
      image: doubleBottle,
      imageAlt: "Water Delivery",
      backgroundImage: hero2,
      isFullBackground: true
    }
  ];

  return (
    <section className="relative pt-24 bg-white overflow-hidden">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="hero-swiper"
        style={{ height: '600px' }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className={`absolute top-0 w-full h-full bg-no-repeat z-0 ${slide.isFullBackground
                    ? 'left-0 bg-cover bg-center'
                    : 'right-0 bg-contain bg-right-center md:bg-right-center hidden md:block'
                  }`}
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  ...(slide.isFullBackground
                    ? {
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center'
                    }
                    : {
                      backgroundSize: 'contain',
                      backgroundPosition: 'right center',
                      backgroundRepeat: 'no-repeat'
                    }
                  )
                }}
              />

              {/* Overlay for better text readability on full background */}
              {slide.isFullBackground && (
                <div className="absolute inset-0 z-5"></div>
              )}

              {/* Content Container */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="flex flex-col items-center justify-center h-full py-8 md:py-12 text-center md:text-left">
                    {/* Text Content */}
                    <div className="w-full max-w-4xl">
                      <p className={`text-sm sm:text-base lg:text-lg font-normal mb-3 sm:mb-4 ${slide.isFullBackground ? 'text-secondary text-shadow' : 'text-secondary'
                        }`}>
                        {slide.tagline}
                      </p>

                      <h1 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-3 sm:mb-4 ${slide.isFullBackground ? 'text-black text-shadow-lg' : 'text-black'
                        }`}>
                        {slide.title}
                        {slide.subtitle && (
                          <>
                            <br />
                            <span className={slide.isFullBackground ? 'text-black text-shadow-lg' : 'text-black'}>
                              {slide.subtitle}
                            </span>
                          </>
                        )}
                      </h1>

                      {slide.para && (
                        <p className={`text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto md:mx-0 ${slide.isFullBackground ? 'text-black text-shadow' : 'text-secondary'
                          }`}>
                          {slide.para}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start max-w-md mx-auto md:mx-0">
                        <button
                          onClick={onOrderToday}
                          className="bg-secondary text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg shadow-xl hover:bg-accent transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm w-full sm:w-auto"
                        >
                          {slide.buttonText1}
                        </button>
                        <button
                          onClick={onSubscribeClick}
                          className="bg-accent text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg shadow-xl hover:bg-secondary transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm w-full sm:w-auto"
                        >
                          {slide.buttonText2}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Image - Show for all slides on mobile */}
                    <div className="mt-6 md:hidden flex justify-center">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="w-48 sm:w-64 h-auto object-contain relative z-20"
                      />
                    </div>

                    {/* Desktop Image Side - Show for all slides on desktop */}
                    <div className="hidden md:flex md:w-1/2 justify-center md:justify-end absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="w-80 lg:w-96 xl:w-[450px] 2xl:w-[500px] h-auto object-contain relative z-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Styles */}
      <style>{`
        .hero-swiper {
          height: 600px !important;
        }
        
        .hero-swiper .swiper-slide {
          height: 600px !important;
        }
        
        .hero-swiper .swiper-pagination {
          bottom: 30px !important;
          z-index: 20;
        }
        
        .hero-swiper .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: rgba(255, 255, 255, 0.6);
          opacity: 1;
          margin: 0 8px;
          transition: all 0.3s ease;
        }
        
        .hero-swiper .swiper-pagination-bullet-active {
          background: #60A5FA;
          transform: scale(1.2);
        }
        
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #60A5FA;
          background: rgba(255, 255, 255, 0.9);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-top: -25px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 20;
        }
        
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }
        
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        
        /* Responsive styles */
        @media (max-width: 1024px) {
          .hero-swiper {
            height: 500px !important;
          }
          .hero-swiper .swiper-slide {
            height: 500px !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-swiper {
            height: 600px !important;
          }
          .hero-swiper .swiper-slide {
            height: 600px !important;
          }
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
        
        @media (max-width: 640px) {
          .hero-swiper {
            height: 550px !important;
          }
          .hero-swiper .swiper-slide {
            height: 550px !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-swiper {
            height: 500px !important;
          }
          .hero-swiper .swiper-slide {
            height: 500px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;