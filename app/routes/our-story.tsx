import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ActionFunctionArgs } from '@shopify/remix-oxygen';
import { json } from '@shopify/remix-oxygen';
import { Link, Form, useActionData } from '@remix-run/react';
// import sha256 from "crypto-js/sha256";

type ActionData =
    | { error: string; success?: never; data?: never }
    | { success: string; data: unknown; error?: never };

export default function BelloDiamondsBanner() {
    const actionData = useActionData<ActionData>();
    const [error, setError] = useState<string>('');


    return (
        <>
            <div className='pt-[90px] sm:pt-[100px] pb-10 md:pt-[235px] bg-white lg:px-10 px-4'>
                <div
                    className="relative w-full max-w-[380px] container md:max-w-[1350px] px-[15px] mx-auto overflow-y-auto md:overflow-hidden bg-no-repeat bg-cover bg-center backdrop-blur-md"
                >


                    <div className="grid lg:grid-cols-[auto_515px] lg:gap-[80px] gap-[30px]  bg-[url('/bello-patternnew.png')] bg-no-repeat bg-center bg-cover">

                        <div className="w-full relative">
                            
                            <img
                                src="modal-girl.png"
                                alt="Bello Diamonds model"
                                className="block w-full h-full md:max-h-[750px] max-h-[550px] md:object-cover"
                            />
                        </div>

                        <div className="w-full pb-2 md:pb-0 flex flex-col">
                            <div className=" p-[20px_10px_20px_15px] md:p-[30px_40px_30px_60px] h-full flex flex-col">

                                <div className='flex justify-center items-center md:mb-12 mb-8 md:mt-6 mt-4'>
                                    <img
                                        src="/new-pop-logo.svg"
                                        alt="Bello Diamonds"
                                        className="w-[110px] sm:w-[130px] md:w-[160px] transition-opacity duration-500 filter invert brightness-0"
                                    />

                                </div>

                                <div className="w-full text-white ">
                                    <h2 className="text-[21px] text-justify leading-[19px] md:leading-[30px] md:text-[28px] font-semibold outfit tracking-wider md:mb-8 mb-6">
                                        FROM OUR <span className="text-red-800">HEART</span> TO YOURS
                                    </h2>

                                    <div className='leading-[22px] text-[14px] text-justify outfit font-light space-y-5'>
                                        <p>
                                            At Bello Diamonds, we believe luxury should never come at the cost of our planet. That’s why we’re committed to showcasing our exquisite, hand-forged jewelry crafted with stunning lab-grown diamonds — ethically, sustainably, and responsibly.
                                        </p>

                                        <p>
                                            Our jewelry is more than just beauty — it’s a statement. A vibrant expression of growth, integrity, and love with intention.
                                        </p>

                                        <p>
                                            Whether you’re celebrating a milestone, gifting your most valuable players, or simply embracing sparkle — thank you for letting us be part of your journey.
                                        </p>

                                        <p>
                                            Here’s to brilliance — with meaning.
                                        </p>
                                    </div>

                                    <p className="text-[16px] md:text-[18px] outfit mt-8 md:mt-10 mb-8 md:mb-10">
                                        Rosie Jung <br />
                                        <span className='italic font-light text-[14px] md:text-[16px]'>Founder & CEO</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
