import React from 'react';
import arrowRight from '~/assets/images/svg/arrow-right.svg';
import {Link} from '@remix-run/react';
import GradientBorderButton from '../buttons/GradientBorderButton';

interface BlogCardProps {
  image: string;
  title: string;
  date: string;
  time: string;
  to?:string;
}
const BlogCard: React.FC<BlogCardProps> = ({image, title, date, time, to='#'}) => {
  return (
    <>
      <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full">
        {/* <Link to="/"> */}
        <div className="cardImg sm:h-[170px] md:h-[180px] rounded-[3px]"style={{boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)'}}>
          <img
            src={image}
            alt={title}
            // style={{boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)'}}
            className='h-full w-full object-cover rounded-[3px]'
          />
        </div>
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
          <h5 className="sm:min-h-[100px] md:min-h-[92px] mt-[10px] text-[18px] playfair font-[500] text-primary">
            {title}
          </h5>
          <div className="text-right">
            <GradientBorderButton to={to} as='link' className="cursor-pointer w-[101px] h-[26px] block ml-auto mt-[10px]">
            <span>Read</span> 
                  <img src={arrowRight} alt="arrow" className="w-4 h-4" />
                  </GradientBorderButton>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </>
  );
};

export default BlogCard;
