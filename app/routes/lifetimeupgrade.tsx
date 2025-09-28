import React from 'react'

const lifetimeupgrade = () => {
    return (
        <div className='pt-[90px] sm:pt-[100px] pb-5 md:pt-[235px] bg-white'>
            <div className='container max-w-[1350px] px-[15px] mx-auto'>

                {/* Page Title */}
                <h1 className='md:text-[56px] text-[32px] playfair text-primary'>
                    Bello Diamonds – Lifetime Full Jewelry Upgrade Promise
                </h1>

                {/* Intro */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>The Bello Diamonds Lifetime Upgrade Promise</h5>
                    <p className='text-[14px] outfit font-light text-primary'>
                         We believe your love — and your diamond — should grow over time. That’s why every <span className='font-semibold'>Bello Diamonds</span> lab-grown center stone comes with our <span className='font-semibold'>Lifetime Upgrade Promise</span>.
                    </p>
                    <p className='text-[14px] outfit font-light text-primary pt-4'>
                        At any time, you may trade in your original Bello Diamonds lab-grown center stone and receive <span className='font-semibold'>100% of your original purchase price</span> as credit towards a new diamond of greater value.
                    </p>
                </div>

                {/* Upgrade Requirements */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Upgrade Requirements</h5>
                    <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary space-y-2'>
                        <li>The new diamond must be at least <span className='font-semibold'>2X the original value</span> then the original purchase.</li>
                        <li>The original diamond must be in its original condition and accompanied by the original <span>Diamond certificate</span>.</li>
                        <li>Offer applies to <span className='font-semibold'>loose lab-grown diamonds</span> or center stones purchased from Bello Diamonds.</li>
                        <li>Settings and accent stones are not eligible for trade-in credit but may be repurchased or upgraded separately</li>
                    </ul>
                    <p className='text-[14px] outfit font-light text-primary pt-4'>
                        There is no expiration date — your upgrade credit is <span className='font-semibold'>valid for life</span>.
                    </p>
                </div>

            </div>
        </div>

    )
}

export default lifetimeupgrade
