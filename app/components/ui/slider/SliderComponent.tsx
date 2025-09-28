import React, {useState, useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import {Link} from '@remix-run/react';
import ArrowIcon from '~/assets/svg/ArrowIcon';

import 'swiper/css';
import 'swiper/css/pagination';
import '~/assets/css/swiper.css';

const pagination = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return ``;
    // <span class="${className}"></span>   # Asked to hide the markers
  },
};

interface SliderComponentProps {
  images: any;
  handle?: string;
  title?: string;
  productTitle?: string;
  price?: string;
}

const SliderComponent = ({
  images,
  title,
  handle,
  productTitle,
  price,
}: SliderComponentProps) => {
  // const [loadedImages, setLoadedImages] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // Preload images when `images` changes
  // useEffect(() => {
  //   if (images.length === 0) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   let isMounted = true;
  //   const preload = async () => {
  //     setIsLoading(true);
  //     const promises = images.map(
  //       (src) =>
  //         new Promise<string>((resolve) => {
  //           const img = new Image();
  //           img.src = src;
  //           img.onload = () => resolve(src);
  //           img.onerror = () => resolve(src);
  //         }),
  //     );
  //     const result = await Promise.all(promises);
  //     if (isMounted) {
  //       setLoadedImages(result);
  //       setIsLoading(false);
  //     }
  //   };

  //   preload();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [images]);

  // if (isLoading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       {/* Loader or skeleton */}
  //       <span className="text-primary">Loading...</span>
  //     </div>
  //   );
  // }

  return (
    <Link
          to={`${handle}`}
          
        >
    <div className="swiper-container relative h-full">
      <Swiper
        className="mySwiper h-full"
        pagination={pagination}
        modules={[Pagination]}
      >
        {/* <div className="absolute px-[20px] md:px-0 top-[23px] md:right-2 sm:top-[30px] transform  z-50 md:max-w-[350px] md:text-left text-center max-w-full">
          <h2 className="sm:leading-[50px] font-medium text-white md:font-normal playfair md:text-[38px] md:leading-[45px] sm:text-[38px] text-[24px] leading-[28px]">
            {title}
          </h2>
        </div> */}

        <SwiperSlide>
          <img
            src={images}
            alt={`Slide ${images + 1}`}
            className="h-full transition-transform w-full duration-1000 ease-in-out hover:scale-140 rounded-[3px]"
          />
        </SwiperSlide>
      </Swiper>

      <div className="w-full z-10 left-0 lg:p-4 p-4 cardTitle absolute bottom-2">
        <div className="w-full flex items-center justify-between">
          <div>
            <h4 className="playfair text-[16px] md:text-[28px] md:leading-[120%] capitalize md:mb-[5px] lg:mb-[0] text-white font-medium">
              {productTitle ? productTitle : ''}
            </h4>
            <p className="outfit text-[14px] md:text-[18px] text-white md:mt-1 md:leading-[120%] font-normal">
              {price}
            </p>
          </div>
          <ArrowIcon rotate={0} size={24} className="text-white" />
          </div>
      </div>
    </div>
        </Link>
  );
};

export default SliderComponent;
