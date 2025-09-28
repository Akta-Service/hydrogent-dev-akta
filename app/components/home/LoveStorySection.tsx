import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '~/assets/css/swiper.css';
import coupleImg1 from '~/assets/images/demo/lenaK.png';
import coupleImg2 from '~/assets/images/demo/newcouple.png';
import coupleImg3 from '~/assets/images/demo/ringcouple.png';
import transLogo from '~/assets/images/demo/shape.png';

interface Testimonial {
  id: string;
  image: string;
  description: string;
  author: string;
}

const pagination = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return `<span class="${className}"></span>`;
  },
};

interface LoveStorySectionProps {
  image?: string;
  description?: string;
  author?: string;
}

const LoveStorySection: React.FC<LoveStorySectionProps> = ({
  image = coupleImg1,
  description,
  author,
}) => {
  const testimonials: Testimonial[] = [
  {
    id: '1',
    image: coupleImg1,
    description:
      '"When we decided to get a lab-grown diamond engagement ring, we had no idea where to start. Then we found Bello Diamonds on Instagram and booked a call with their jewelry concierge. The whole experience was effortless! I had always dreamed of a 5-carat diamond ring, and now I have both, my dream husband and my dream ring"',
    author: 'Lena K.',
  },
  {
    id: '2',
    image: coupleImg2, 
    description:
      '"When my husband and I decided to renew our vows for our 20 year anniversary, it happened to fall on the Saturday before Mothers Day. When we got married many years ago he gave me a ring that he could afford at the time but now I’m ready for an upgrade. We are still on a tight budget because now we have two kids in college and I was considering lab diamonds. I was referred to Bello Diamonds from a co-worker of mine and I am so happy with my new diamond ring. I’m extremely happy with the quality and the craftsmanship of the ring. Thank you so much!". The perfect ring for the perfect moment!',
    author: 'Addilyn S. & Sophia R.',
  },
  {
    id: '3',
    image: coupleImg3, 
    description:
      '"I was struggling to find an engagement ring that felt unique and personal. Then I found Bello, and everything changed. From the first consultation, I knew I was in good hands. They listened to my vision and helped me create a ring that felt so ‘us.’ My wife couldn’t have been happier, and neither could I!. Not just a piece of jewelry, but a piece of my heart. I purchased a necklace as a gift for my wife’s birthday, and the experience was incredible. The Bello team made sure I understood the design process and what went into making the piece. When she opened it, her face lit up. She said it was the most meaningful gift I’d ever given her. It’s a piece that’s always close to her heart—and now, it holds even more sentimental value."',
    author: 'Daniel N., Kenny C',
  },
];
  return (
    <div className="w-full bg-white pb-[10px]">
      <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
        <h2 className="md:max-w-[320px] pb-[10px] custom-border-bottom border-b border-[2px] border-solid playfair text-primary text-[32px] md:text-[48px] md:leading-[55px] lg:leading-[75px] lg:text-[64px] font-normal">
          Love Story
        </h2>
        <div className="swiper-container relative h-full">
          <Swiper
            className="mySwiper h-full testimonial"
            pagination={pagination}
            modules={[Pagination]}
          >
            {testimonials?.map((slideKey, index) => (
              <SwiperSlide key={slideKey.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="flex flex-col items-start justify-center bg-no-repeat bg-[0px_45px]"
                    style={{ backgroundImage: `url(${transLogo})` }}
                  >
                    <p
                      className={`mt-[30px] ${
                        index === 0
                          ? 'lg:mb-[52px] md:mb-[35px]'
                          : 'mb-[20px]'
                      } playfair font-medium text-[16px] md:text-[17px] text-primary`}
                    >
                      {slideKey.description}
                    </p>
                    <p
                      className={`${
                        index === 0 ? 'hidden md:block' : ''
                      } author text-primary text-[18px] font-medium outfit`}
                    >
                      {slideKey.author}
                    </p>
                  </div>
                  <div>
                    <img src={slideKey.image} alt="couple" className="filter grayscale"/>
                  </div>
                  {index === 0 && (
                    <p className="block md:hidden author text-primary text-[18px] font-medium outfit">
                      {author}
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default LoveStorySection;