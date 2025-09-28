import React from 'react'


const Freeengraving = () => {
  return (
    <div className='pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white pb-5'>
      <div className='container max-w-[1350px] px-[15px] mx-auto'>

        {/* Page Title */}
        <h1 className='md:text-[56px] text-[32px] playfair text-primary'>
          Personalize Your Ring
        </h1>

        {/* Intro */}
        <div className='py-6'>
          <p className='text-[14px] outfit font-light text-primary'>
            Have a meaningful message to convey or a date to remember forever? Why not get it permanently inscribed on the inside of your engagement ring or wedding band!
          </p>
        </div>

        {/* Free Engraving Service */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Free Engraving Service</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            Bello Diamonds offers FREE engraving service for all make-to-order and custom-made rings. Our 'Create Your Own' engagement rings allow you to add a message to the ring on the 'Complete Your Ring' page. A few settings may not have an option for engraving due to the ring's design. Engravings can be an alphanumeric combination and ideally the length should not exceed 20 characters. For ring engraving ideas and inspirations, read our blog on <a href="https://friendlydiamonds.com/blog/wedding-band-ring-engraving" className='underline'>ring engraving ideas</a>.
          </p>
        </div>

        {/* Returns, Resize, and Repairs */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Returns, Resize, and Repairs of Engraved Rings</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            Due to their personalized characteristics, an amount of $150 is deducted from the refund or exchange value when returning or exchanging engraved rings. Depending on the increase or decrease in size of the ring, the engraved characters may look different from the original when resized and may become lighter, narrower, wider, or erased altogether. Repairs to engraved rings can change the look of the engraving depending on the nature of repair. In this case, the ring can be re-engraved for an additional fee of $50.00. Please refer to our <a href="https://friendlydiamonds.com/customer-service/ring-resizing" className='underline'>resizing policy</a> for more information.
          </p>
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

export default Freeengraving
