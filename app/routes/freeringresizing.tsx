import React from 'react'

const freeringresizing = () => {
    return (
        <div className='pt-[90px] sm:pt-[100px] pb-5 md:pt-[235px] bg-white'>
            <div className='container max-w-[1350px] px-[15px] mx-auto'>

                {/* Page Title */}
                <h1 className='md:text-[56px] text-[32px] playfair text-primary'>
                    Resizing Your Ring
                </h1>

                {/* Intro */}
                <div className='py-6'>
                    <p className='text-[14px] outfit font-light text-primary'>
                        If you have ordered the wrong ring size, we have got you covered! We offer one complimentary
                        ring resize within the first 12 months of your purchase including free both way shipping
                        within the United States. If your ring is more than a year old or requires a second or further
                        resize, resizing and shipping charges will be applicable.
                    </p>
                </div>

                {/* Ring Resizing Terms */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Ring Resizing Terms</h5>
                    <p className='text-[14px] outfit font-light text-primary'>
                        The ring resizing policy offers complimentary resizes up to 2 sizes above or below the original
                        ring size. In case a resize outside of this range is required, an additional charge may be quoted,
                        or a completely new ring will have to be purchased depending on the design of the ring. Resizing
                        engraved rings may change the look of the engravings. The engraved characters may look different
                        and may not be legible. You can opt to re-engrave the ring after resizing for a $50 fee (up to 20
                        characters). Please refer to our ring engraving policy for more information. Excess diamonds or
                        metal left over from resizing will not be returned or refunded.
                    </p>
                </div>

                {/* Rings That Cannot Be Resized */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Rings That Cannot Be Resized</h5>
                    <p className='text-[14px] outfit font-light text-primary'>
                        Some rings, including but not limited to eternity rings, full eternity engagement ring settings,
                        and full eternity wedding and matching bands cannot be resized due to the design of the ring.
                        A new ring will have to be purchased in case a resize is required.
                    </p>
                </div>

                {/* Shipping Terms */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Shipping Terms for Resized Items</h5>
                    <p className='text-[14px] outfit font-light text-primary'>
                        All resized items are typically shipped within 7-10 business days from the date of receiving the item.
                    </p>
                </div>

                {/* How To Send In */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>How To Send In Your Ring For Resizing</h5>
                    <ol className='list-decimal pl-5 text-[14px] outfit font-light text-primary space-y-3'>
                        <li>
                            <strong>Contact Bello Diamonds Customer Service Department:</strong>
                            <ul className='list-disc pl-5 mt-2 space-y-1'>
                                <li>
                                    If the ring needs to be resized, do not hesitate to contact us! Send us an email at 
                                    <a href='mailto:customerservice@bellodiamonds.com' className='underline'> customerservice@bellodiamonds.com </a>
                                      with the order number and the word "Ring Resize" in the subject line. Please state the new size for the ring to be resized and provide all the necessary information as per the request.
                                </li>
                                <li>
                                    If resizing is possible as per the request, our team will process the order. A shipping label will be created along with the invoice and an email with information on further steps will be sent to the customer.
                                </li>
                            </ul>
                        </li>

                        <li>
                            <strong>Pack Your Order:</strong>
                            <ul className='list-disc pl-5 mt-2 space-y-1'>
                                <li>Ensure that the actual product is securely packed in the original packaging box.</li>
                                <li>For security reasons, do not write ‘jewelry’, ‘diamonds’, or other related words anywhere on the package.</li>
                                <li>For safety purposes, please double-box your package.</li>
                                <li>Affix the label to the outside of the larger box and drop it off at the nearest courier company location.</li>
                                <li>Bello Diamonds cannot be held responsible for shipping errors. We recommend that customers only use a staffed storefront to send returned items. <span className='font-semibold'>Please do not use drop boxes or non-staffed locations</span>.</li>
                                <li>Obtain a shipping receipt to confirm that the item has been shipped. This receipt will act as proof of shipment and insurance.</li>
                            </ul>
                        </li>
                    </ol>
                </div>

                {/* Help Section */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Need more help? We're here to assist you!</h5>
                    <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary space-y-1'>
                        <li>Contact us via email: <a href='mailto:customerservice@bellodiamonds.com' className='underline'>customerservice@bellodiamonds.com</a></li>
                        <li>Call us at: <a href='tel:212-845-8222' className='underline'>212-845-8222</a></li>
                    </ul>
                </div>

            </div>
        </div>

    )
}

export default freeringresizing
