import React from 'react'

const paymentoptions = () => {
    return (
        <div className='pt-[90px] sm:pt-[100px] pb-5 md:pt-[235px] bg-white'>
            <div className='container max-w-[1350px] px-[15px] mx-auto'>

                {/* Page Title */}
                <h1 className='md:text-[56px] text-[32px] playfair text-primary'>
                    Payment Options
                </h1>

                {/* Intro */}
                <div className='py-6'>
                    <p className='text-[14px] outfit font-light text-primary'>
                        Bello Diamonds offers a variety of payment methods for purchasing lab diamonds and diamond jewelry
                        to provide a smooth and hassle-free buying experience. All prices on our website are in US dollars.
                    </p>
                    <p className='text-[14px] outfit font-light text-primary pt-4'>
                        Customers can pay the entire amount in one go using any of the listed payment methods or they can
                        choose <strong>Split The Payment</strong> method to split their total order into two payments using
                        separate debit or credit cards. The first payment must be at least 51% of the total, and the
                        remaining amount can be paid with another card.
                    </p>
                </div>

                {/* Methods of Payment */}
                <div className='py-6'>
                    <h5 className='md:text-[32px] text-[18px] playfairsb mb-3 text-primary'>Methods of Payment</h5>

                    {/* Credit/Debit Card */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>Credit Card & Debit Card</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            We accept Visa, MasterCard, American Express, as well as other major credit cards & debit cards. If a payment fails, the order will be automatically canceled. The failure may happen due to insufficient funds in their bank account or if the amount charged exceeds their credit limit. Customers are advised to contact their bank in case their payment is rejected and try again once the bank approves the transaction.

                        </p>
                    </div>

                    {/* Afterpay */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>Afterpay</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Afterpay is a convenient and flexible payment option where customers can split their total order value into four easy payments over a period of six weeks by selecting this option during checkout
                        </p>
                    </div>

                    {/* Affirm */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>Affirm Monthly Payments</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Affirm Financing allows multiple monthly repayment plans with rates starting as low as 0% APR for well-qualified buyers. The process is simple, quick, and easy. Customers can fill out their basic information to receive a real time decision on the amount of financing they are approved for, with absolutely no hidden costs.

                        </p>
                        <p className='text-[14px] outfit font-light text-primary pt-2'>
                            Offer is subject to credit check and approval. Minimum monthly payments are required. The interest rate will be based on credit and is subject to an eligibility check. Options are based on the total purchase amount and there might be a requirement for a down payment. For more information, visit the Affirm Payments website
                        </p>
                        <p className='text-[14px] outfit font-light text-primary pt-2'>
                            <strong>Please Note:</strong> This financing option is only available for shipping within the United States.
                        </p>
                    </div>

                    {/* Splitit */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>Splitit</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Customers can also pay for their purchases with an existing credit card by splitting costs into interest and fee-free monthly payments without additional registrations or applications with Splitit.
                        </p>

                    </div>

                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>How Does It Work?</h6>
                        <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary mt-3 space-y-1'>
                            <li>TPay during the course of 2, 3, 4, or 6 months with no fees & 0% interest.</li>
                            <li>The first month’s installment is charged to the applied credit card. To ensure all debts are paid off, the entire purchase amount is held in reserve on the card at no cost.</li>
                            <li>The credit card will be charged monthly, and the same amount will be deducted from the credit line hold.</li>
                            <li>Monthly payments will appear on the credit card statement, but the remaining amount on hold will not show up as debt.</li>
                        </ul>
                    </div>

                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>To Be Eligible, Customers Will Need To Provide:</h6>
                        <ul className='list-disc pl-5 text-[14px] outfit font-light text-primary mt-3 space-y-1'>
                            <li>A valid credit card (VISA or MasterCard)</li>
                            <li>Sufficient funds on the card to cover the entire purchase</li>
                        </ul>
                        <p className='text-[14px] outfit font-light text-primary pt-2'>
                           For more information, please visit the Splitit website.
                        </p>
                    </div>
                    {/* PayPal */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>PayPal Express</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Streamline your checkout experience with PayPal Express. Simply click the PayPal button, log in to your account, and confirm your purchase—no need to manually enter payment details. Enjoy the same PayPal protections and benefits with fewer clicks for a faster, more convenient shopping experience.
                        </p>
                    </div>

                    {/* Google Pay */}
                    <div className='py-4'>
                        <h6 className='text-[18px] playfairsb text-primary mb-2'>Google Pay</h6>
                        <p className='text-[14px] outfit font-light text-primary'>
                            Shop securely with just a tap using Google Pay. This fast, convenient payment option lets you complete your purchase using payment information already stored in your Google account. Enjoy enhanced security features and a seamless checkout experience without entering card details each time you shop.
                        </p>
                    </div>
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

export default paymentoptions
