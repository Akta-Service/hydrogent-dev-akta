"use client";
import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import educationImg from "~/assets/images/demo/demoimg.png";
import rightArrow from "~/assets/images/svg/right-stroke.svg";
import Modal from '~/components/ui/popup/Modal';
import removeIcon from '~/assets/images/svg/crossblack.svg';
import diamondImg from '~/assets/images/demo/diamond.png';
import Image from '@remix-run/react';


const Educationhub = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className='About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    <div className="h-[212px] flex flex-col justify-center items-center collectionBanner bg-[url('/diamond_academy_banner.png')] bg-no-repeat bg-cover bg-center">
                        <div className="breadcrum">
                            <ul className="flex items-center">
                                <li className="m-0 text-[14px] outfit font-light text-[#F6F6F6]">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-[#D1D1D1]">
                                    /
                                </li>
                                <li className="m-0 text-[14px] outfit font-light text-[#D1D1D1]">
                                    <Link to="/">Diamond Academy</Link>
                                </li>
                            </ul>
                        </div>
                        <h1 className=" text-center custom-border-bottom border-b border-[2px] border-solid playfair font-normal md:text-[76px] text-[32px] text-white md:leading-[140%] pb-[10px] leading-[35px] ">
                            {/* {collection.title} */}Diamond Academy
                        </h1>
                    </div>
                </div>
            </div>
            <div className='bg-white py-[45px]'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    {/* <div className='space-x-2 flex max-w-[770px] w-full mx-auto items-center justify-between'>
                        <div className='relative w-full'>
                            <label className='absolute top-[3px] left-[15px] text-[13px] outfit font-light text-primary'>Topic</label>
                            <select className="bg-[right_15px_center] bg-no-repeat appearance-none rounded-[8px] h-[45px] border border-[#454545] bg-black max-w-[375px] w-full block pt-[16px] px-[15px] text-[#f6f6f6] focus:outline-none text-[14px] outfit font-light" style={{ backgroundImage: "url('/downn.svg')" }}>
                                <option value="">Enter Text</option>
                                <option value="option1">Option One</option>
                                <option value="option2">Option Two</option>
                                <option value="option3">Option Three</option>
                            </select>
                        </div>
                        <div className='relative w-full'>
                            <label className='absolute top-[3px] left-[15px] text-[13px] outfit font-light text-primary'>Filter</label>
                            <select className="bg-[right_15px_center] bg-no-repeat appearance-none rounded-[8px] h-[45px] border border-[#454545] bg-black max-w-[375px] w-full block pt-[16px] px-[15px] text-[#f6f6f6] focus:outline-none text-[14px] outfit font-light" style={{ backgroundImage: "url('/downn.svg')" }}>
                                <option value="">Enter Text</option>
                                <option value="option1">Option One</option>
                                <option value="option2">Option Two</option>
                                <option value="option3">Option Three</option>
                            </select>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='bg-white pb-[45px]'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="bg-transparent">
                            <Link onClick={openModal} to="#" >
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <Modal isOpen={isModalOpen} onClose={closeModal}>
                            <div className="fixed overflow-y-auto  inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                                <div className="h-screen relative w-full">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="absolute top-6 right-6 flex items-center justify-center h-[60px] w-[60px] rounded-full bg-[#E7E7E7]"
                                    >
                                        <img src={removeIcon} />
                                    </button>
                                    <div className='pt-[150px] pb-[55px]'>
                                        <div className='container max-w-[1440px] px-[15px] mx-auto'>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-transparent">
                                                    <img src={diamondImg} alt="vg"/>
                                                </div>
                                                <div className="bg-transparent text-[14px] md:text-[16px] text-[#454545] outfit font-light">
                                                    <h4 className='mb-3 md:text-[24px] text-[18px] playfairsb text-primary'>4 C's of Diamonds Charts</h4>
                                                    <p>Created by the Gemological Institute of America (GIA) in the 1940s, the 4 C's — cut, color, clarity, and carat — serve as the universal standard for assessing diamond quality. Each C represents a distinct quality attribute, measured on its own scale:</p>
                                                    <ul className='space-y-2 mt-4 list-disc list-inside pt-[10px]'>
                                                        <li>Cut: Graded from Excellent to Poor on the GIA scale and Ideal to Poor on the International Gemological Institute (IGI) scale </li>
                                                        <li>Color: Graded from D (colorless) to Z (light yellow or brown)</li>
                                                        <li>Clarity: Graded from Flawless (FL) to Included (I3)</li>
                                                        <li>Carat: Measured in metric carats, where one carat equals 200 milligrams</li>
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <Link to="/">
                                <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                    <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                        <img
                                            src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                        />
                                    </div>
                                    <div className='pt-4 gridInfo flex items-center justify-between'>
                                        <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                        <Link to="/"><img src={rightArrow} alt='' /></Link>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-transparent">
                            <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                    <img
                                        src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                    />
                                </div>
                                <div className='pt-4 gridInfo flex items-center justify-between'>
                                    <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                    <Link to="/"><img src={rightArrow} alt='' /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent">
                            <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                    <img
                                        src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                    />
                                </div>
                                <div className='pt-4 gridInfo flex items-center justify-between'>
                                    <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                    <Link to="/"><img src={rightArrow} alt='' /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent">
                            <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                    <img
                                        src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                    />
                                </div>
                                <div className='pt-4 gridInfo flex items-center justify-between'>
                                    <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                    <Link to="/"><img src={rightArrow} alt='' /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent">
                            <div className="blogCard bg-transparent md:max-w-[340px] max-w-full md:w-[auto] w-full sm:max-w-full mx-auto">
                                <div className="cardImg md:h-[180px] rounded-[3px]" style={{ boxShadow: '1px 4px 15px 0px rgba(255, 255, 255, 0.1)' }}>
                                    <img
                                        src={educationImg} className='h-full w-full object-cover rounded-[3px]'
                                    />
                                </div>
                                <div className='pt-4 gridInfo flex items-center justify-between'>
                                    <span className='text-[16px] text-primary playfairsb'>4 C’s of Diamonds Charts</span>
                                    <Link to="/"><img src={rightArrow} alt='' /></Link>
                                </div>
                            </div>
                        </div>

                    </div> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Who Says Size Doesn't Matter */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">
                                Who Says Size Doesn't Matter
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe src="https://www.youtube.com/embed/h58KvhbgWs0" title="Who Says Size Doesn't Matter" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" ></iframe>
                            </div>
                        </div>

                        {/* The 5 Cs */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">The 5 Cs</h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.youtube.com/embed/4PUNX3VXRh8"
                                    title="The 5 Cs"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>

                        {/* Lab-Grown vs Natural Diamonds */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">
                                Lab-Grown vs Natural Diamonds
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.youtube.com/embed/qLWjr3Skj8M"
                                    title="Lab-Grown vs Natural Diamonds"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>

                        {/* Keeping Your Diamond Clean and Sparkly */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">
                                Keeping Your Diamond Clean and Sparkly
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.youtube.com/embed/GrECot1IQpw"
                                    title="Keeping Your Diamond Clean and Sparkly"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>

                        {/* Curves and Angles in All the Right Places */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">
                                Curves and Angles in All the Right Places
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.youtube.com/embed/KOi1-kKBhHE"
                                    title="Curves and Angles in All the Right Places"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>

                        {/* Capital Gains or Just Glamour */}
                        <div className="space-y-2">
                            <h3 className="text-lg outfit text-black">
                                Capital Gains or Just Glamour
                            </h3>
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.youtube.com/embed/w4kU365lYjM"
                                    title="Capital Gains or Just Glamour"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Educationhub;
