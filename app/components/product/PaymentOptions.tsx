import React from 'react';
import { Image } from "@shopify/hydrogen";
import PaypalIcon from "~/assets/images/svg/apaypal.svg";
import SplitIcon from "~/assets/images/svg/split_payment.svg";
import AffirmIcon from "~/assets/images/svg/affirm.svg";
import Splitnew from "~/assets/images/svg/split.svg";
import afterPay from "~/assets/images/svg/afterpay.svg";
import bankTranfer from "~/assets/images/svg/banktransfer.svg";

const PaymentOptions = () => {
  return (
    <>
      <div className='paymentoption md:py-[60px] py-[35px]'>
        <div className="container max-w-[1350px] px-[15px] mx-auto">
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2'>
            <div className='text-center'>
                <div className='img-container max-w-[100px] mx-auto min-h-[45px]'>
                    <Image src={PaypalIcon} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Checkout securely via your Paypal account or Buy Now, Pay Later in interest-free installments.</p>
            </div>
            <div className='text-center'>
                <div className='img-container max-w-[100px] mx-auto min-h-[45px]'>
                    <Image src={SplitIcon} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Conveniently pay with Visa, MasterCard, American Express, and other major cards.</p>
            </div>
            <div className='text-center'>
                <div className='img-container max-w-[100px] mx-auto min-h-[45px]'>
                    <Image src={AffirmIcon} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Choose from various monthly repayment plans with rates as low as 0% APR for qualified buyers.</p>
            </div>
            <div className='text-center'>
                <div className='img-container max-w-[100px] mx-auto min-h-[45px]'>
                    <Image src={Splitnew} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Split costs into monthly payments with no interest or fees using your existing credit card.</p>
            </div>
            <div className='text-center'>
                <div className='img-container max-w-[150px] mx-auto min-h-[45px]'>
                    <Image src={afterPay} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Split your total order value into four payments over six weeks at checkout for added ease.</p>
            </div>
            <div className='text-center'>
                <div className='img-container max-w-[100px] mx-auto min-h-[45px]'>
                    <Image src={bankTranfer} alt=''/>
                </div>
                <p className='mt-3 outfit text-[14px] text-primary'>Enjoy a 2% discount pre-tax on cart value when you choose BankWire payments within the US.</p>
            </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default PaymentOptions;
