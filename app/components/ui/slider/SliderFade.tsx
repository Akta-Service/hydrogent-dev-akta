import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade } from 'swiper/modules';
import {Link} from '@remix-run/react';
import ringImg from "~/assets/images/demo/ring.png";
import linkArrow from '~/assets/images/svg/link_icon.svg';
import arrowBlack from "~/assets/images/demo/linkArroeblack.svg"

import 'swiper/css';
import 'swiper/css/pagination';
import '~/assets/css/swiper.css';
import 'swiper/css/effect-fade';

const pagination = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return `<span class="${className}"></span>`;
  },
};

interface SliderFadeComponentProps {
    imageOne: string;
    imageTwo: string;
    titleOne: string;
    titleTwo: string
  }

const SliderFade: React.FC<SliderFadeComponentProps> = ({imageOne, imageTwo, titleOne, titleTwo}) => {

  return (
    <div className="swiper-container relative">
     <Swiper className="mySwiper lg:h-[650px] md:h-[550px]"
      effect="fade"
      pagination={false}
      modules={[Pagination, EffectFade]} // 👈 Include EffectFade module
        fadeEffect={{ crossFade: true }} // Optional: enable crossFade
     >
        <SwiperSlide>
            <img src={imageOne} alt='ring' className=' transition-transform duration-300 ease-in-out'/>
            <div className='w-full z-10 left-0 py-2 cardTitle flex items-center justify-between relative'>
                <div>
                  <h4 className='playfair text-[18px] md:text-[18px] text-[#454545] font-medium'>{titleOne}</h4>
                  <p className='outfit text-[#151515] text-[16px] md:text-[16px] font-normal'>€2224,10</p>
                </div>
                <Link to="/"><img src={arrowBlack} alt='arrow' /></Link>
              </div>
        </SwiperSlide>
        <SwiperSlide><img src={imageTwo} alt='ring' className=' transition-transform duration-300 ease-in-out'/>
        <div className='w-full z-10 left-0 py-2 cardTitle flex items-center justify-between relative'>
                <div>
                  <h4 className='playfair text-[18px] md:text-[18px] text-[#454545] font-medium'>{titleTwo}</h4>
                  <p className='outfit text-[#151515] text-[16px] md:text-[16px] font-normal'>€2224,10</p>
                </div>
                <Link to="/"><img src={arrowBlack} alt='arrow' /></Link>
              </div>
        </SwiperSlide>
      
      </Swiper>

      
    </div>
  );
};

export default SliderFade;
