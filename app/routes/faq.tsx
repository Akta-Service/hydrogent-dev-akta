import React from 'react'
import { Link } from '@remix-run/react';
import Accordion from '~/components/ui/Accordion/Accordion';
import ArrowIcon from '~/assets/svg/ArrowIcon';
const renderChevronIcon = (isOpen: boolean) => (
    <div
        className={`bg-transparent transition-transform ${!isOpen ? 'rotate-180' : ''}`}
    >
        {/* <img src={arrowDown} alt="Chevron Icon" /> */}
        <ArrowIcon className='rotate-[270deg] w-[20px]' />
    </div>
);

const Faq = () => {
    return (
        <>
            <div className='delivery-inner pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    <div className="md:h-[212px] h-[100px] flex flex-col justify-center items-center collectionBanner">
                        {/* <div className="breadcrum">
                            <ul className="flex items-center">
                                <li className="m-0 text-[14px] outfit font-light text-primary">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">
                                    /
                                </li>
                                <li className="m-0 text-[14px] outfit font-light text-primary">
                                    <Link to="/">Faqs</Link>
                                </li>
                            </ul>
                        </div> */}
                        <h1 className="text-center playfair font-normal md:text-[76px] text-[32px] text-primary md:leading-[75px] pb-[10px] leading-[35px] ">
                           FAQs
                        </h1>
                        </div>
                        
                         <div className='max-w-[920px] mx-auto pb-[45px]'>
                                                            <h6 className='mb-4 md:mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>General Questions</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="What makes Bello Diamonds different from other jewelers?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            At Bello Diamonds, we offer premium-quality, ethically sourced diamonds paired with exceptional craftsmanship. Our designs are timeless, our service is personal, and our pricing is transparent.</p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Do you sell certified diamonds?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>Yes! All our diamonds are certified by trusted gemological laboratories such as GIA and IGI. You'll receive a certificate with every diamond purchase.</p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Where are you located?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>We are proudly based in the USA. Our Headquarters is Located in NJ  but we ship worldwide and offer virtual consultations for customers anywhere.</p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Products & Custom Orders</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Can I customize a diamond ring or jewelry piece?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>Absolutely! Bello Diamonds specializes in custom jewelry. You can work with our expert designers to create a one-of-a-kind engagement ring, wedding band, or any bespoke piece.</p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Can I return a custom-made item?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            Unfortunately, custom orders are non-refundable due to their personalized nature. However, we’ll work with you to ensure satisfaction before final delivery.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="How long do custom orders take?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            Custom designs typically take 3-5 weeks from concept to completion, depending on complexity. We'll keep you updated every step of the way.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="What metals do you offer?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            We offer 14k and 18k gold (yellow, white, rose), and platinum.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Shipping & Delivery</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Do you offer free shipping?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            Yes! We offer free insured shipping within the U.S. Expedited options are also available at checkout.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Is my shipment insured?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                            Absolutely. All Bello Diamonds shipments are fully insured for your peace of mind.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                             <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="How long will delivery take?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             In-stock items usually ship within 2-3 business days. Custom or made-to-order items take longer, and we'll provide an estimated delivery date at purchase.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Shipping & Delivery</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="What is your return policy?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             We offer a 30-day return or exchange window on most non-custom items. Items must be in original condition and accompanied by certification. Please read our “Delivery & Returns” Policy.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                             <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Can I return a custom-made item?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             Unfortunately, custom orders are non-refundable due to their personalized nature. However, we’ll work with you to ensure satisfaction before final delivery.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="How do I initiate a return?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             Contact us at <a href="mailto:customerservice@bellodiamonds">customerservice@bellodiamonds</a>.com. We'll guide you through the process and provide a prepaid return label.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Repairs & Resizing</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Do you offer resizing?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             Yes! We offer one complimentary resizing within 12 months of purchase for most ring styles.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="What if my jewelry needs repair?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             We stand behind our craftsmanship. If you need a repair, contact us with details and we'll assess the issue and guide you on next steps.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Warranty</h6>
                                                            <Accordion
                                                                titleClasses="md:text-[24px] playfairsb"
                                                                title="Is there a warranty on your jewelry?"
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
                                                                        <p className='text-[16px] leading-[26px] text-primary outfit font-light'>
                                                                             Yes, all Bello Diamonds pieces come with a lifetime warranty.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Accordion>
                                                            <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>Still Have Questions?</h6>
                                                            <p className='outfit text-primary text-center font-light mb-3'>We're here to help.</p>
                                                            <ul>
                                                                <li className='text-primary mb-2 text-center outfit font-normal text-[14px]'>Email: <a href="mailto:customerservice@bellodiamonds.com">customerservice@bellodiamonds.com</a></li>
                                                                <li className='text-primary outfit text-center font-normal text-[14px]'>Call: <a href="tel:212-845-8222">212-845-8222</a></li>
                                                            </ul>
                                                        </div>
                    </div>

                </div>
            
        </>
    )
}

export default Faq
