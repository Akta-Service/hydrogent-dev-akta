import React from 'react';
import DiamondImag from '~/assets/images/demo/diamondreal.png';
import StarImg from '~/assets/images/demo/star.png';
import reCycle from '~/assets/images/demo/recycle-sign.png';
import Earth from '~/assets/images/demo/earth.png';


const features = [
    {
        title: "Carbon Commitment",
        description:
            "A portion of every purchase supports Carbon 180, helping reverse carbon emissions worldwide.",
        icon: (
            <img
                src={DiamondImag}
                alt="Carbon Commitment"
            />
        ),
    },
    {
        title: "Conflict-Free Brilliance",
        description:
            "Only lab-grown diamonds—identical in beauty, ethical in origin.",
        icon: (
            <img
                src={StarImg}
                alt="Conflict"
            />
        ),
    },
    {
        title: "Recycled Gold",
        description:
            "We give precious metals new life, reducing the need for destructive mining.",
       icon: (
            <img
                src={reCycle}
                alt="Recycked gold"
            />
        ),
    },
    {
        title: "Smaller Footprint",
        description:
            "Local sourcing & streamlined logistics mean fewer miles and fewer emissions.",
        icon: (
            <img
                src={Earth}
                alt="Earth"
            />
        ),
    },
];

const HowWeGiveBack = () => {
    return (
        <div className='pt-[90px] sm:pt-[100px] pb-5 md:pt-[235px] bg-white'>
            <div className="bg-white text-primary py-16 px-6 lg:px-20 min-h-[calc(100vh-731px)]">
                <div className="max-w-[1024px] mx-auto">
                    <h2 className="md:text-[46px] text-[32px] playfair font-bold text-center mb-10">
                        Our Promise to the Planet
                    </h2>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <div>
                            <img
                                src="/gril.png"
                                alt="Luxury Diamond Ring"
                                className="shadow-md w-full h-full mb-6 max-h-[350px]"
                            />
                            <div className='px-4 lg:px-[30px]'>
                                <h3 className="md:text-[38px] text-[30px] playfairsb tracking-normal font-bold leading-[140%] mb-4">Where Luxury Meets Responsibility</h3>
                                <p className="text-primary font-light text-base outfit leading-relaxed">
                                    At Bello Diamonds, every piece tells a story of beauty, ethics and sustainability.
                                    Because true luxury leaves the world better than we found it.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="space-y-8 lg:max-w-[373px]">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <span className='min-w-[40px] relative top-2'>{feature.icon}</span>
                                        <div>
                                            <h4 className="md:text-[26px] text-[18px] md:leading-[40px] playfairsb tracking-normal font-semibold mb-2">{feature.title}</h4>
                                            <p className="text-primary font-light text-base outfit">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HowWeGiveBack
