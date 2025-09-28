import { useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/react';

import beauty from '~/assets/images/demo/timeless-beauty.png'
import Craft from '~/assets/images/demo/craftsmanship.png'
import Personal from '~/assets/images/demo/authenticity.png'
import logo from '~/assets/images/logo/footer.svg';

import ArrowIcon from '~/assets/svg/ArrowIcon';
import Button from '~/components/ui/buttons/Button';
import Accordion from '~/components/ui/Accordion/Accordion';


// Meta function
export const meta: MetaFunction = () => {
    return [
        { title: 'Bello Diamonds' },
        {
            name: 'description',
            content: 'Discover our exquisite diamond collections',
        },
    ];
};

const AboutUs = () => {
    const stats = [
        { label: "years of expertise", value: "10+" },
        { label: "original designs", value: "1500+" },
        { label: "happy customers", value: "2500+" },
        { label: "purchases every day", value: "100+" },
    ];

    const renderChevronIcon = (isOpen: boolean) => (
        <div
            className={`bg-transparent transition-transform ${!isOpen ? 'rotate-180' : ''}`}
        >
            {/* <img src={arrowDown} alt="Chevron Icon" /> */}
            <ArrowIcon className='rotate-[270deg] w-[20px]' />
        </div>
    );
    return (<>
        <div className='About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
            <div className="container max-w-[1350px] mx-auto px-[15px]">
                    <div className="md:h-[212px] h-[180px] flex flex-col justify-center items-center collectionBanner md:bg-[url('/about.png')] bg-no-repeat bg-cover bg-center">
                    <div className="breadcrum">
                                <ul className="flex items-center">
                                  <li className="m-0 text-[14px] outfit font-light text-[#E7E7E7]">
                                    <Link to="/">Home</Link>
                                  </li>
                                  <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-[#F6F6F6]">
                                    /
                                  </li>
                                  <li className="m-0 text-[14px] outfit font-light text-[#F6F6F6]">
                                    <Link to="/about">About</Link>
                                  </li>
                                </ul>
                              </div>
                        <h1 className="w-full mt-4 md:mt-0 uppercase md:capitalize text-center titleborder playfair font-normal md:text-[76px] text-[34px] text-white md:leading-[140%] pb-[10px] leading-[35px] ">
                            {/* {collection.title} */}About
                        </h1>
                    </div>
            </div>
        </div>
        <div className='bg-white'>
        <div className="container max-w-[1350px] mx-auto px-[15px]">
            <div className='md:py-16 sm:py-4'>
                <h2 className="text-center playfairsb font-normal max-w-[980px] mx-auto text-primary text-[18px] md:text-[24px]">{`From day one, we've created jewelry you can feel good about wearing. We never compromise between quality and conscience — and neither do our customers.`}</h2>
            </div>
            <div className="mt-[68px] md:pt-[0] grid md:grid-cols-2 pt-7 pb-20 md:items-center gap-7 text-primary">
                <div className="relative w-full h-full">
                     <h1 className="capitalize mb-4 md:hidden block playfair font-normal text-primary text-[32px] leading-[37px] md:text-[45px] lg:text-[56px] md:leading-[140%]">
                        Where timeless beauty<br />begins...
                    </h1>
                    <img
                        src={beauty}
                        alt="Bello Diamonds Store"
                        className="object-cover w-full rounded-[3px] h-full"
                    />
                    <Link to="/" className='absolute md:bottom-5 md:left-6 bottom-[-70px] left-6'>
                        <img src={logo} alt="Logo" className="md:mb-6 mb-0 md:w-[205px] w-[109px]" />
                    </Link>
                </div>

                <div className="pt-[66px] md:pt-[0] w-full h-full flex flex-col justify-center">
                    <h1 className="hidden md:block playfair font-normal text-primary text-[34px] md:text-[45px] lg:text-[56px] md:leading-[140%]">
                        Where timeless beauty<br />begins ...
                    </h1>
                    <p className="text-[14px] md:text-[16px] outfit font-light leading-[140%] mb-4 mt-5 text-primary">
                       { `At the heart of our brand lies a passion for craftsmanship, elegance, and authenticity. Each piece we create is more than an accessory — it's a story, a symbol, a memory. For over a decade, we’ve sourced the finest diamonds and metals, handcrafting every design with care.`}
                    </p>
                    <p className="text-[14px] md:text-[16px] outfit mb-4 text-primary">
                        Our mission is to celebrate life's most meaningful moments with jewelry that lasts. From bespoke rings to everyday elegance, true beauty lives in the details — and in the emotions our pieces evoke.
                    </p>

                    <div className="mt-5 text-[20px] text-end md:text-[24px] playfairsb font-medium font-serif text-primary max-w-[360px] ml-auto">
                        Welcome to a world where timeless beauty lives with you
                    </div>
                </div>
            </div>
            <div className="text-primary md:py-12 pt-12 pb-[90px] md:pb-12 md:px-4">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-2 max-w-7xl mx-auto">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="bg-[#F6F6F6] gradient-border-input-new md:px-6 px-[5px] hover:shadow-lg transition md:h-[156px] h-[117px] flex flex-col justify-center"
                        >
                            <div className="flex justify-between md:items-start items-center">
                                <div className="md:text-[18px] text-[14px] playfair text-primary">{stat.label}</div>
                                <div className=""><ArrowIcon className='w-[20px] h-[20px]' /></div>
                            </div>
                            <div className="playfair font-normal text-[34px] md:text-[56px] text-primary md:leading-[140%] text-center playfair mt-0">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        <div className="container max-w-[1350px] mx-auto px-[15px] md:py-16 py-20 bg-[#fff]">
            <div>
                <h1 className="uppercase text-center custom-border-bottom-black border-b border-[2px] border-solid playfair font-normal md:text-[56px] mx-auto text-[32px] text-black md:leading-[140%] pb-[10px] leading-[35px] ">Our Benefits</h1>
            </div>
            <div className="text-black md:pt-16 pt-10 md:px-4">
                <div className="mx-auto grid md:grid-cols-2 gap-0 items-center">
                    <div>
                        <img
                            src={Craft}
                            alt="Exquisite diamond"
                            className="w-full h-auto rounded-[3px] object-cover"
                        />
                    </div>
                    <div className='md:pl-7 pt-4 md:pt-0'>
                        <h2 className="text-[24px] md:text-[32px] playfairsb md:mb-5 mb-2">
                            Exquisite Craftsmanship
                        </h2>
                        <p className="text-[#454545] outfit md:text-[16px] text-[14px] font-light md:mb-6 mb-4 leading-[20px]">
                            Every piece we offer is the result of masterful artistry and meticulous attention to detail.
                            Our jewelers combine traditional techniques with modern design to ensure timeless
                            beauty in every item.
                        </p>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Handcrafted by experienced artisans;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Premium materials only;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Quality checked at every stage.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="py-6 md:py-0 mx-auto grid md:grid-cols-2 gap-0 items-center">
                    <div className='order-2 md:order-1 md:pl-7 pt-4 md:pt-0'>
                        <h2 className="text-[24px] md:text-[32px] playfairsb md:mb-5 mb-2">
                            Certified Authenticity
                        </h2>
                        <p className="text-[#454545] outfit md:text-[16px] text-[14px] font-light md:mb-6 mb-4 leading-[20px]">
                            We guarantee the origin and quality of every gemstone and metal used. All our diamonds and precious stones come with official certification.
                        </p>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Verified by trusted gem experts;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Ethically sourced materials;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Authenticity certificate included with every purchase
                            </li>
                        </ul>
                    </div>
                    <div className='order-1 md:order-2'>
                        <img
                            src={beauty}
                            alt="Exquisite diamond"
                            className="w-full h-auto rounded-[3px] object-cover"
                        />
                    </div>
                </div>
                <div className="mx-auto grid md:grid-cols-2 gap-0 items-center">
                    <div>
                        <img
                            src={Personal}
                            alt="Exquisite diamond"
                            className="w-full h-auto rounded-[3px] object-cover"
                        />
                    </div>
                    <div className='md:pl-7 pt-4 md:pt-0'>
                        <h2 className="text-[24px] md:text-[32px] playfairsb md:mb-5 mb-2">
                            Personalized Service
                        </h2>
                        <p className="text-[#454545] outfit md:text-[16px] text-[14px] font-light md:mb-6 mb-4 leading-[20px]">
                            We believe jewelry should reflect your unique story. That's why we offer a personal approach at every step of your journey — from consultation to final delivery.
                        </p>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                               <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                One-on-one expert guidance;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                               <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Custom design options;
                            </li>
                            <li className="flex items-start md:text-[18px] text-[16px] playfairsb leading-[140%]">
                                <span className="md:mr-2 mr-[15px] text-black"><ArrowIcon className='w-[20px]' /></span>
                                Elegant packaging for every order.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex justify-center mt-10'>
                    <Button className='md:w-[230px] w-[300px]' to="/collections">
                        Shop now
                    </Button>
                </div>
            </div>
        </div>
        <div className="container max-w-[1350px] mx-auto px-[15px] py-16 bg-white">
            <div>
                <h1 className="w-[50%] text-center custom-border-bottom border-b border-[2px] border-solid playfair font-normal md:text-[56px] mx-auto text-[32px] text-primary md:leading-[140%] pb-[10px] leading-[35px] ">FAQs</h1>
            </div>
            <div className='max-w-[920px] mx-auto pt-16'>
                <Accordion
                    titleClasses="md:text-[24px] playfairsb"
                    title="How can I determine my ring size?"
                    className="text-primary bg-custom-gradient text-[18px] md:text-[24px] w-full outfit font-normal pt-4 px-[30px] mb-4 rounded-[10px]"
                    renderIcon={renderChevronIcon}
                    maxContentHeight={300}
                >
                    <div className='border-dashed border-primary w-full border' style={{
                        borderImage: 'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                        borderImageSlice: 1,
                    }} />
                    <div className="py-2 pt-5">
                        <div className="flex space-y-[13px] flex-col">
                            <p className='text-[16px] leading-[26px] text-primary outfit font-light'>To determine your ring size, you can either visit one of our stores for a professional measurement or use our online guide. You can also measure the inner diameter of a ring that fits comfortably or wrap a piece of string around your finger and measure its length.</p>
                        </div>
                    </div>
                </Accordion>
                <Accordion
                    titleClasses="md:text-[24px] playfairsb"
                    title="Can I return or exchange jewelry items?"
                    className="text-primary bg-custom-gradient text-[18px] md:text-[24px] w-full outfit font-normal pt-4 px-[30px] mb-4 rounded-[10px]"
                    renderIcon={renderChevronIcon}
                    maxContentHeight={300}
                >
                    <div className='border-dashed border-[#FFFFFF80] w-full border' style={{
                        borderImage: 'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                        borderImageSlice: 1,
                    }} />
                    <div className="py-2 pt-5">
                        <div className="flex space-y-[13px] flex-col">
                            <p className='text-[16px] leading-[26px] text-primary outfit font-light'>Yes, we offer a return and exchange policy within 30 days of purchase. Items must be unused and in their original condition to be eligible for a return or exchange.</p>
                        </div>
                    </div>
                </Accordion>
                <Accordion
                    titleClasses="md:text-[24px] playfairsb"
                    title="What warranties do you offer on jewelry items?"
                    className="text-primary bg-custom-gradient text-[18px] md:text-[24px] w-full outfit font-normal pt-4 px-[30px] mb-4 rounded-[10px]"
                    renderIcon={renderChevronIcon}
                    maxContentHeight={300}
                >
                    <div className='border-dashed border-[#FFFFFF80] w-full border' style={{
                        borderImage: 'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                        borderImageSlice: 1,
                    }} />
                    <div className="py-2 pt-5">
                        <div className="flex space-y-[13px] flex-col">
                            <p className='text-[16px] leading-[26px] text-primary outfit font-light'> All of our jewelry comes with a warranty covering manufacturing defects. The warranty duration may vary depending on the product, but generally lasts for 1-2 years from the date of purchase.</p>
                        </div>
                    </div>
                </Accordion>
                <Accordion
                    titleClasses="md:text-[24px] playfairsb"
                    title="How should I care for my diamond jewelry?"
                    className="text-primary bg-custom-gradient text-[18px] md:text-[24px] w-full outfit font-normal pt-4 px-[30px] mb-4 rounded-[10px]"
                    renderIcon={renderChevronIcon}
                    maxContentHeight={300}
                >
                    <div className='border-dashed border-[#FFFFFF80] w-full border' style={{
                        borderImage: 'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                        borderImageSlice: 1,
                    }} />
                    <div className="py-2 pt-5">
                        <div className="flex space-y-[13px] flex-col">
                            <p className='text-[16px] leading-[26px] text-primary outfit font-light'>To keep your diamond jewelry in pristine condition, avoid exposing it to harsh chemicals or extreme temperatures. Clean your jewelry regularly with a soft cloth and mild soap solution, and store it in a safe place when not in use.</p>
                        </div>
                    </div>
                </Accordion>
                <Accordion
                    titleClasses="md:text-[24px] playfairsb"
                    title="Do you offer custom jewelry design services?"
                    className="text-primary bg-custom-gradient text-[18px] md:text-[24px] w-full outfit font-normal pt-4 px-[30px] mb-4 rounded-[10px]"
                    renderIcon={renderChevronIcon}
                    maxContentHeight={300}
                >
                    <div className='border-dashed border-[#FFFFFF80] w-full border' style={{
                        borderImage: 'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                        borderImageSlice: 1,
                    }} />
                    <div className="py-2 pt-5">
                        <div className="flex space-y-[13px] flex-col">
                            <p className='text-[16px] leading-[26px] text-primary outfit font-light'>Yes, we offer personalized jewelry design services. Our expert designers can help you create a one-of-a-kind piece tailored to your preferences and style. Contact us for more information on the custom design process.</p>
                        </div>
                    </div>
                </Accordion>
            </div>
        </div>
    </>
    );
};

export default AboutUs;