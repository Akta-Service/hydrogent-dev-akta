import React from 'react';
import arrowRight from '~/assets/images/svg/arrowstroke.svg';
import {Link} from '@remix-run/react';
import GradientBorderButton from '../buttons/GradientBorderButton';

interface BlogCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
}
const BlogCard: React.FC<BlogCardProps> = ({image, title, date, time}) => {
  return (
    <>
      <div className="blogCard bg-transparent max-w-[340px] sm:max-w-full mx-auto">
        <img
          src={image}
          alt={title}
          style={{boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)'}}
        />

        <div className="cardInfo px-2 py-4">
          <div className="flex items-center">
            <span className="outfit text-[13px] font-light text-[#5D5D5D]">
              {date}
            </span>
            <span className="h-[4px] w-[4px] bg-[#5D5D5D] mx-[7px] rounded"></span>
            <span className="outfit text-[13px] font-light text-[#5D5D5D]">
              {time}
            </span>
          </div>
          <h5 className="mt-[10px] text-[18px] playfair font-[500] text-primary">
            {title}
          </h5>
          <div className="text-right">
            <GradientBorderButton
              to="/"
              className="flex justify-center w-[101px] h-[26px] ml-auto mt-[10px]"
            >
              <span>Read</span>
              <img src={arrowRight} alt="arrow" className="w-4 h-4" />
            </GradientBorderButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
