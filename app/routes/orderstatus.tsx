import { Form } from '@remix-run/react'
import React from 'react'

const orderstatus = () => {
    return (
        <>
            <div className='pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className='container max-w-[1350px] px-[15px] mx-auto'>
                    <h1 className='md:text-[56px] text-[32px] text-center playfair text-primary'>Order Status</h1>
                    <Form className="py-4 pb-6 max-w-[600px] w-full mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
                                    First name*
                                </label>
                                <input
                                    aria-label="First name"
                                    autoComplete="given-name"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="First name"
                                    required
                                    type="text"
                                    className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-[#ffffff] bg-black focus:outline-none focus:ring-2 focus:ring-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
                                    Last name*
                                </label>
                                <input
                                    aria-label="Last name"
                                    autoComplete="given-name"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Last name"
                                    required
                                    type="text"
                                    className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-[#ffffff] bg-black focus:outline-none focus:ring-2 focus:ring-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
                                    Email Address*
                                </label>
                                <input
                                    aria-label="Addresses"
                                    autoComplete="given-name"
                                    id="address"
                                    name="address"
                                    placeholder="Addresses"
                                    required
                                    type="text"
                                    className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-[#ffffff] bg-black focus:outline-none focus:ring-2 focus:ring-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
                                    Phone Number*
                                </label>
                                <input
                                    aria-label="Phone Number"
                                    autoComplete="given-name"
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone Number"
                                    required
                                    type="number"
                                    className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-[#ffffff] bg-black focus:outline-none focus:ring-2 focus:ring-transparent"
                                />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <label htmlFor="firstName" className="block text-[12px] outfit font-normal text-primary mb-1">
                                Order Number*
                            </label>
                            <input
                                aria-label="order"
                                autoComplete="order"
                                id="order"
                                name="order"
                                placeholder="Order Number"
                                required
                                type="number"
                                className="w-full px-4 py-[2px] border border-[#454545] rounded-[8px] text-[14px] h-[45px] outfit font-light text-[#ffffff] bg-black focus:outline-none focus:ring-2 focus:ring-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-solid bg-transparent text-primary rounded-md text-[13px] outfit font-light focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Check My Order Status
                        </button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default orderstatus
