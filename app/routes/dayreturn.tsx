import React from 'react'

const Dayreturn = () => {
  return (
    <div className='pt-[90px] sm:pt-[100px] pb-5 md:pt-[235px] bg-white'>
      <div className='container max-w-[1350px] px-[15px] mx-auto'>

        {/* Page Title */}
        <h1 className='md:text-[56px] text-[32px] playfair text-primary'>
          30 Day Returns
        </h1>

        {/* Intro */}
        <div className='py-6'>
          <p className='text-[14px] outfit font-light text-primary'>
            At Bello Diamonds, we’re confident you’ll love your purchase. However, if you decide to return an item for any reason, we’re here to make it easy. We offer a 30-day return policy with no questions asked and a full refund guaranteed.
          </p>
        </div>

        {/* Return Shipping */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Return Shipping</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            We provide FREE return shipping on all eligible items returned within 30 days of the delivery date.
          </p>
        </div>

        {/* Return Policy Terms */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Return Policy Terms</h5>
          <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary space-y-2'>
            <li>To be eligible for a return, all items must be in unworn condition and include the original packaging, documentation, and diamond certificate.</li>
            <li>If the item shows signs of wear or use, a $500 fee will be deducted from your refund. Lost or altered diamond certificates will incur a $150 replacement fee, which will also be deducted from the refund. Appraisal fees ($50) are non-refundable. For engraved rings, a $50 engraving removal fee will be deducted.</li>
            <li>The 30-day return period starts from the date the order is delivered.</li>
          </ul>
          <p className='text-[14px] outfit font-light text-primary mt-5'>
            Please note: Due to the personalized nature of our jewelry, custom-designed pieces and resized items are not eligible for return. Additionally, items that have already been exchanged cannot be returned or exchanged again.
          </p>
        </div>

        {/* Return Packaging Requirements */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Return Packaging Requirements</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            To ensure safe delivery, all eligible returns must be securely packaged. When sending your return, you are required to provide the following photos:
          </p>
          <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary mt-3 space-y-2'>
            <li>The items inside the package (clearly showing the merchandise being returned)</li>
            <li>The exterior of the sealed package (showing proper and secure packaging)</li>
          </ul>
          <p className='pt-[20px] text-[14px] outfit font-light text-primary'>
            Approval of returns depends on the quality and accuracy of these images. If the required photos are not submitted or do not meet our standards, the return will not be insured, and we cannot be held responsible for any damage or loss during transit.
          </p>
        </div>

        {/* Order Cancellations */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Order Cancellations</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            You may cancel your order for a full refund at any time before it has been shipped. However, bespoke custom designs are only eligible for cancellation within 48 hours of order confirmation.
          </p>
        </div>

        {/* How to Return Your Order */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>How to Return Your Order</h5>
          <ol className='list-decimal pl-5 text-[14px] outfit font-light text-primary space-y-3'>
            <li>
              <strong>Contact <span className='font-semibold'>Bello Diamonds Customer Service</span>:</strong> If you wish to return an item, please reach out to us by emailing <a href='mailto:customerservice@bellodiamonds.com' className='underline font-semibold'>customerservice@bellodiamonds.com</a>. Include your order number and the word <span className='font-semibold'>“Return”</span> in the subject line. In the email body, clearly state your return request and provide any relevant details.
            </li>
            <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary mt-3 space-y-2'>
              <li>We will generate a <span className='font-semibold'>FREE insured return shipping label</span> and send it to you via email.</li>
            </ul>
            <li>
              <strong>Prepare Your Package:</strong> Carefully place the item, along with the <span className='font-semibold'>diamond certificate</span> and <span className='font-semibold'>appraisal certificate</span>, inside the <span className='font-semibold'>original packaging</span>.
              <ul className='list-disc pl-5 mt-2 space-y-1'>
                <li>For security, <span className='font-semibold'>do not write "jewelry," "diamonds," or similar terms</span> on the exterior of the package. (If You do, the Package will not be insured and you are responsible for any damage or theft that occurs)</li>
                <li>For added protection, <span className='font-semibold'>double-box</span> your shipment.</li>
                <li>Attach the provided shipping label to the outside of the larger box.</li>
                <li>Drop off the package at an official courier location — <span className='font-semibold'>do not use drop boxes or unstaffed drop-off points</span>.</li>
              </ul>
            </li>
          </ol>
          <p className='text-[14px] outfit font-light text-primary mt-5 mb-5'>Please note that <span className='font-semibold'>Bello Diamonds is not responsible for shipping errors</span>. We require you to hand the package to an employee of the authorized shipping company to ensure your package is handled properly</p>
          <p className='text-[14px] outfit font-light text-primary'>Be sure to <span className='font-semibold'>obtain a shipping receipt</span>—this serves as your proof of shipment and insurance coverage.</p>
        </div>

        {/* Refund Process */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Refund Process</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            Once we receive the return parcel, our quality assessment team will inspect the item and begin the refund process. Please note the customer may receive a follow-up email or inquiry to determine the eligibility if the item is not in like-new condition. Refunds typically take up to 5-7 business days to process after the refund is approved. Refunded amounts will be issued via the original payment method used in the original purchase. For all credit card refunds, please allow one monthly billing cycle for your credit to appear.
          </p>
        </div>

        {/* Serial Returns (Bracketing) */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Serial Returns (Bracketing)</h5>
          <p className='text-[14px] outfit font-light text-primary'>
            To maintain the exceptional craftsmanship and high quality of our jewelry, and to ensure fairness for all customers, we discourage serial returns and bracketing. Bracketing refers to purchasing multiple variations of a product with the intention of returning the unwanted ones. Returns from orders suspected of bracketing will not be accepted.
          </p>
          <p className='text-[14px] outfit font-light text-primary mt-5'>
            We appreciate your understanding that this practice of over-ordering contributes to issues of over-consumption and sustainability, which ultimately harms the environment.
          </p>
        </div>

        {/* Help Section */}
        <div className='py-6'>
          <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Need more help? We’re happy to help and assist you.</h5>
          <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary space-y-1'>
            <li>Contact us via email: <a href='mailto:customerservice@bellodiamonds.com' className='underline'>customerservice@bellodiamonds.com</a></li>
            <li>Call us at: <a href='tel:212-845-8222' className='underline'>212-845-8222</a></li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Dayreturn
