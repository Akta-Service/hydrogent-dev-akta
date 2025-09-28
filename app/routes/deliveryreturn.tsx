import React from 'react';
import { Link } from '@remix-run/react';
import Tabs from '~/components/ui/tabs/Tabs';
import Accordion from '~/components/ui/Accordion/Accordion';
import ArrowIcon from '~/assets/svg/ArrowIcon';
/**
 * Renders a chevron icon with rotation based on open state
 * @param isOpen - Whether the associated content is open
 * @returns JSX element containing the chevron icon
 */
const renderChevronIcon = (isOpen: boolean) => (
    <div
        className={`bg-transparent transition-transform ${!isOpen ? 'rotate-180' : ''}`}
    >
        {/* <img src={arrowDown} alt="Chevron Icon" /> */}
        <ArrowIcon className='rotate-[270deg] w-[20px]' />
    </div>
);
/**
 * Delivery and Returns page component
 * Displays return policy information and FAQ sections
 * @returns JSX element containing the delivery/returns page content
 */
const Deliveryreturn = () => {
    return (
        <>
            <div className='delivery-inner pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    <div className="h-[212px] flex justify-center items-center collectionBanner">
                        <div className="breadcrum">
                            {/* <ul className="flex items-center">
                                <li className="m-0 text-[14px] outfit font-light text-primary">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">
                                    /
                                </li>
                                <li className="m-0 text-[14px] outfit font-light text-primary">
                                    <Link to="/">Returns</Link>
                                </li>
                            </ul> */}
                        </div>
                        <h1 className="playfair font-normal md:text-[76px] text-[32px] text-primary md:leading-[75px] pb-[10px] leading-[35px] ">
                            {/* {collection.title} */}Returns

                        </h1>
                    </div>
                    <div className="flex items-top delivery">
                        <Tabs>

                            <Tabs.Tab label="">
                                <div className='max-w-[920px] w-full mx-auto py-[55px]'>
                                    <div className='mb-8'>
                                        <h6 className='mb-4 md:text-[18px] text-[16px] playfairsb text-primary'>How much time do I have to make a return?</h6>
                                        <p className='md:text-[16px] text-[14px] outfit font-light text-primary'>
                                            <b>30 Day Returns</b><br></br>
                                            At Bello Diamonds, we’re confident you’ll love your purchase. However, if you decide to
                                            return an item for any reason, we’re here to make it easy. We offer a 30-day return
                                            policy with no questions asked and a full refund guaranteed.
                                        </p>
                                    </div>
                                    <div className='mb-8'>
                                        <h6 className='mb-4 md:text-[18px] text-[16px] playfairsb text-primary'>What is the return method and do I have to pay for the return shipping?</h6>
                                        <p className='md:text-[16px] text-[14px] outfit font-light text-primary'>We provide FREE return shipping on all eligible items returned within 30 days of the
                                            delivery date.</p>
                                    </div>
                                    <div className='mb-8'>
                                        <h6 className='mb-4 md:text-[18px] text-[16px] playfairsb text-primary'>How to make a return?</h6>
                                        <p className='md:text-[16px] text-[14px] outfit font-light text-primary'>To be eligible for a return, all items must be in unworn condition and include the original
                                            packaging, documentation, and diamond certificate.
                                            If the item shows signs of wear or use, a $500 fee will be deducted from your refund.
                                            Lost or altered diamond certificates will incur a $150 replacement fee, which will also be
                                            deducted from the refund. Appraisal fees ($50) are non-refundable. For engraved rings,
                                            a $50 engraving removal fee will be deducted.
                                            The 30-day return period starts from the date the order is delivered.
                                            Please note: Due to the personalized nature of our jewelry, custom-designed pieces and
                                            resized items are not eligible for return. Additionally, items that have already been
                                            exchanged cannot be returned or exchanged again.</p>
                                    </div>
                                    <div className='mb-8'>
                                        <h6 className='mb-4 md:text-[18px] text-[16px] playfairsb text-primary'>How do I find the return label I generated?</h6>
                                        <p className='md:text-[16px] text-[14px] outfit font-light text-primary'>To ensure safe delivery, all eligible returns must be securely packaged. When sending
                                            your return, you are required to provide the following photos:</p>
                                        <ul className=''>
                                            <li className='md:text-[16px] text-[14px] outfit font-light text-primary'>.The items inside the package (clearly showing the merchandise being returned)</li>
                                            <li className='md:text-[16px] text-[14px] outfit font-light text-primary'>.The exterior of the sealed package (showing proper and secure packaging)</li>
                                        </ul>
                                        <p className='md:text-[16px] text-[14px] outfit font-light text-primary'>Approval of returns depends on the quality and accuracy of these images. If the
                                            required photos are not submitted or do not meet our standards, the return will not be
                                            insured, and we cannot be held responsible for any damage or loss during transit.</p>
                                    </div>
                                    
                                </div>
                                
                                {/* <div className='max-w-[920px] mx-auto pt-16 pb-[45px]'>
                                    <h6 className='mb-4 mt-8 md:text-[28px] text-center text-[22px] playfairsb text-primary'>General Questions</h6>
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
                                        <div className='border-dashed border-[#FFFFFF80] w-full border' style={{
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
                                </div> */}
                            </Tabs.Tab>

                        </Tabs>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Deliveryreturn;
