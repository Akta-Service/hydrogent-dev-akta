import React, { SVGProps } from 'react';
import arrow from '~/assets/images/svg/arrow.svg'
interface IconProps extends SVGProps<SVGSVGElement> {
    rotate?: number;
    size?: number;
    color?: string;
}

const AngleIcon = ({ rotate = 0, size = 24, color, className = '', ...props }: IconProps) => {
    return (<>
        <span className='' style={{ transform: `rotate(${rotate}deg)` }}>
            <img src={arrow} width={size} height={size} alt="arrow" />
        </span>
        {/* <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 26 23" 
            fill="none"
            style={{ transform: `rotate(${rotate}deg)` }}
            {...props}
            className={`hidden md:block ${className}`}
        >
            <path 
                d="M24.7165 11.3981L1.6142 11.713M24.7165 11.3981L14.4237 1.14333M24.7165 11.3981L14.2172 21.9363" 
                stroke="url(#paint0_linear_2_85)" 
                strokeWidth="1.81318" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            <defs>
                <linearGradient 
                    id="paint0_linear_2_85" 
                    x1="18.9983" 
                    y1="5.70102" 
                    x2="7.33243" 
                    y2="17.4101" 
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#0D0C0C" />
                    <stop offset="0.841346" stopColor="#736A6A" />
                    <stop offset="1" stopColor="#0D0C0C" />
                </linearGradient>
            </defs>
        </svg> */}
        </>
    );
};

export default AngleIcon;