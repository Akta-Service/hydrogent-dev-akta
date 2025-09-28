'use client';

import type React from 'react';

import { Suspense, useState, type FormEvent, memo, useEffect } from 'react';
import { Await, Link, useActionData } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { motion } from 'framer-motion';
import Button from './buttons/Button';
import logo from '~/assets/images/logo/logo.svg';
import facebook from '~/assets/images/svg/facebook.svg';
import insta from '~/assets/images/svg/insta.svg';
import prista from '~/assets/images/svg/tiktok.svg';
import appleIcon from '~/assets/images/svg/applepay.svg';
import googleIcon from '~/assets/images/svg/gpay.svg';
import paypalIcon from '~/assets/images/svg/paypal.svg';
import shopifyIcon from '~/assets/images/svg/shop.svg';
import masterCardIcon from '~/assets/images/svg/mastercard.svg';
import visaIcon from '~/assets/images/svg/visa.svg';
import Modal from './popup/Modal';
import LoginModal from './forms/login';
import removeIcon from '~/assets/images/svg/remove.svg';
import { fetchStorefront, ProfileAPI } from '~/utils/shopifyClient';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

interface NewsletterResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

const isNewsletterResponse = (data: unknown): data is NewsletterResponse =>
  typeof data === 'object' &&
  data !== null &&
  ('success' in data ? typeof data.success === 'boolean' : true) &&
  ('message' in data ? typeof data.message === 'string' : true) &&
  ('error' in data ? typeof data.error === 'string' : true);

const SocialLinks = () => (
  <div className="flex items-center  space-x-4 md:mb-8">
    <a href="https://www.instagram.com/bellodiamonds" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <rect x="2" y="2.66357" width="20" height="20" rx="4" stroke="currentColor"/>
        <circle cx="12" cy="12.6636" r="5" stroke="currentColor"/>
      </svg>
    </a>
    <a href="https://www.tiktok.com/@BelloDiamonds" aria-label="Tiktok" target="_blank" rel="noopener noreferrer">
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M17.2008 8.1C17.2008 8.32 17.0208 8.501 16.8008 8.49C15.6253 8.43107 14.4774 8.11352 13.4388 7.56C13.1578 7.41 12.8008 7.605 12.8008 7.924V13.5C12.8007 14.6696 12.4588 15.8137 11.8171 16.7916C11.1753 17.7695 10.2618 18.5385 9.18878 19.004C8.11577 19.4695 6.9301 19.6112 5.7776 19.4118C4.6251 19.2123 3.55603 18.6803 2.70187 17.8813C1.84772 17.0823 1.24573 16.051 0.969949 14.9144C0.694169 13.7777 0.756623 12.5852 1.14963 11.4836C1.54264 10.382 2.24906 9.41923 3.18201 8.71379C4.11496 8.00835 5.23375 7.59098 6.40078 7.513C6.45294 7.51024 6.5051 7.51826 6.55401 7.53656C6.60293 7.55486 6.64755 7.58305 6.68508 7.61937C6.72262 7.65568 6.75226 7.69934 6.77217 7.74763C6.79208 7.79591 6.80182 7.84778 6.80078 7.9V10.7C6.80078 10.92 6.62078 11.097 6.40278 11.133C5.95147 11.2089 5.53126 11.4122 5.1917 11.7191C4.85215 12.0259 4.6074 12.4234 4.48631 12.8648C4.36522 13.3061 4.37285 13.7729 4.50829 14.21C4.64372 14.6472 4.90133 15.0365 5.25073 15.3321C5.60012 15.6276 6.02675 15.8172 6.4803 15.8783C6.93385 15.9394 7.39542 15.8695 7.81059 15.677C8.22576 15.4844 8.57722 15.1772 8.82353 14.7915C9.06984 14.4057 9.20074 13.9577 9.20078 13.5V0.9C9.20078 0.793913 9.24293 0.692172 9.31794 0.617157C9.39295 0.542143 9.4947 0.5 9.60078 0.5H12.4008C12.5077 0.502727 12.6098 0.545223 12.6871 0.619189C12.7644 0.693154 12.8114 0.793276 12.8188 0.9C12.9123 1.92472 13.362 2.88426 14.0897 3.61177C14.8174 4.33928 15.777 4.78874 16.8018 4.882C17.0218 4.902 17.2018 5.079 17.2018 5.3L17.2008 8.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
    <a href="https://www.facebook.com/BelloDiamonds/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M18 2.66357H6C3.79086 2.66357 2 4.45444 2 6.66357V18.6636C2 20.8727 3.79086 22.6636 6 22.6636H10.5V15.6636H7V12.6636H10.5V10.6636C10.5 8.45444 12.2909 6.66357 14.5 6.66357H17V9.66357H14.5C13.9477 9.66357 13.5 10.1113 13.5 10.6636V12.6636H17V15.6636H13.5V22.6636H18C20.2091 22.6636 22 20.8727 22 18.6636V6.66357C22 4.45444 20.2091 2.66357 18 2.66357Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  </div>
);

const PaymentIcons = () => (
  <div className="flex space-x-2">
    {[
      { src: appleIcon, alt: 'Apple Pay', width: 'w-8' },
      { src: googleIcon, alt: 'Google Pay', width: 'w-8' },
      { src: paypalIcon, alt: 'Paypal', width: 'w-8' },
      { src: shopifyIcon, alt: 'Shopify', width: 'w-10' },
      { src: masterCardIcon, alt: 'MasterCard', width: 'w-10' },
      { src: visaIcon, alt: 'Visa', width: 'w-10' },
    ].map(({ src, alt, width }) => (
      <div key={alt} className={` h-5`}>
        <img src={src || '/placeholder.svg'} alt={alt} />
      </div>
    ))}
  </div>
);

const NewsletterForm = ({ publicStoreDomain }: { publicStoreDomain: string }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<NewsletterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const actionData = useActionData<NewsletterResponse>();

  const displayMessage = message || actionData;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!isNewsletterResponse(data)) {
        throw new Error('Invalid response format');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setMessage({ success: true, message: data.message });
      setEmail('');
    } catch (error) {
      setMessage({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (message?.error || actionData?.error || actionData?.success) {
      setMessage(null);
    }
  };

  return (
    <div className="md:max-w-[330px] footeer">
      <h3 className="text-[18px] outfit font-normal mb-3 text-black">
        Subscribe to our Newsletter
      </h3>
      <form
        onSubmit={handleSubmit}
        className="flex lg:flex-row md:flex-col"
        aria-label="Newsletter subscription"
      >
        <input
          type="email"
          name="email"
          placeholder="Email *"
          required
          value={email}
          onChange={handleEmailChange}
          className="md:mb-2 mt-[0.5px] lg:mb-0 md:max-w-[210px] sm:max-w-full rounded-l-[10px] h-[48px] outfit font-light border border-[rgba(69,69,69,1)] text-[13px] text-primary px-4 py-2 w-full md:w-[auto] focus:outline-none focus:border-primary mr-[-1px]"
          aria-label="Email address"
        />
        <Button
          type="submit"
          className="lg:min-w-[120px] min-w-full text-[15px] md:text-[16px] bg-[#09090A] text-center footer-btn md:min-w-full w-full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Subscribing' : 'Subscribe'}
        </Button>
      </form>
      {displayMessage?.success && (
        <p className="text-green-500 mt-2" role="alert">
          {displayMessage.message}
        </p>
      )}
      {displayMessage?.error && (
        <p className="text-red-500 mt-2" role="alert">
          You are already subscribed or there was a network error
        </p>
      )}
    </div>
  );
};

const OrdersSection = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  return (
    <div>
      <h5 className="text-[18px] outfit font-normal mb-3 text-black">Orders</h5>
      <ul>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/freeshipping">Free Shipping</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <a onClick={() => setIsOpen(true)} className="cursor-pointer">
            Order Status
          </a>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <a href="/dayreturn">30 Day Returns</a>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/freeengraving">Free Engraving</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/freeringresizing">Free Ring Resizing</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/lifetimeupgrade">Lifetime Upgrade</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/paymentoptions">Payment Options</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/deliveryreturn">Returns</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/faq">FAQs</Link>
        </li>
      </ul>
    </div>
  );
};

const EverythingBelloSection = () => (
  <div>
    <h5 className="text-[18px] outfit font-normal mb-3 text-black">
      Everything Bello
    </h5>
    <ul>
      <li className="text-[16px] outfit mb-2 font-light tetx-black">
        <a href="/our-story">Our Story</a>
      </li>
      <li className="text-[16px] outfit mb-2 font-light tetx-black">
        <a href="/products/free-ring-sizer">Order a Free Ring Sizer</a>
      </li>
      <li className="text-[16px] outfit mb-2 font-light tetx-black">
        <a href="/how-we-give-back">How We Give Back</a>
      </li>
      <li className="text-[16px] outfit mb-2 font-light tetx-black">
        <a href="/educationhub">Diamond Academy</a>
      </li>
      <li className="text-[16px] outfit mb-2 font-light tetx-black">
        <Link to="/reviews">Reviews</Link>
      </li>
    </ul>
  </div>
);

const ContactUsSection = ({
  setIsOpenAssistance,
  isMobile
}: {
  setIsOpenAssistance: (open: boolean) => void;
  isMobile:boolean
}) => {
  return (
    <div>
      <h5 className="text-[18px] outfit font-normal mb-3 text-black">
        Contact Us
      </h5>
      <ul>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <Link to="/appointmentbooking">Book Appointment</Link>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <a
            onClick={() => setIsOpenAssistance(true)}
            className="cursor-pointer"
          >
            Assistance
          </a>
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          {isMobile ? 
          <a href="mailto:info@bellodiamonds.com">Email Us</a>:
          <a
            onClick={() => setIsOpenAssistance(true)}
            className="cursor-pointer"
          >
            Email Us
          </a>
          }
          
        </li>
        <li className="text-[16px] outfit mb-2 font-light tetx-black">
          <a href="tel:212-845-8222">212-845-8222</a>
        </li>
      </ul>
    </div>
  );
};

const OrderStatusModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  if (!isOpen) return null;

  const fields = [
    // {type: 'text', placeholder: 'First Name'},
    // {type: 'text', placeholder: 'Last Name'},
    { type: 'email', placeholder: 'Email' },
    // {type: 'tel', placeholder: 'Phone Number'},
    { type: 'text', placeholder: 'Order Number' },
  ];

  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleOrderStatusSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderLoading(true);
    setOrderStatus(null);

    const formData = new FormData(e.currentTarget);
    setFormData(formData);

    try {
      const responseEmail = await ProfileAPI.getUserEmail();

      if (responseEmail) {
        try {
          if (responseEmail) {
            await checkOrderStatus(formData);
          } else {         
            setShowLoginModal(true);
            setOrderLoading(false);
          }
        } catch (parseError) {
          console.error('Error parsing profile response:', parseError);
          setShowLoginModal(true);
          setOrderLoading(false);
        }
      } else {
        setShowLoginModal(true);
        setOrderLoading(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setShowLoginModal(true);
      setOrderLoading(false);
    }
  };

  const checkOrderStatus = async (formData: FormData) => {
    const responseToken = await ProfileAPI.getUserToken();

    try {
      const formOrderNumber = Number(formData.get('ordernumber'));

      const variables = {
        customerAccessToken: responseToken.token.accessToken,
        first: 250,
        last: null,
        startCursor: null,
        endCursor: null,
        country: 'US',
        language: 'EN',
      };

      const data = await fetchStorefront(
        CUSTOMER_ORDERS_QUERY,
        variables,
        null,
      );

      const matchingOrder = data?.customer?.orders?.nodes.find(
        (order: any) => order.orderNumber === formOrderNumber,
      );

      const payload = {
        email: formData.get('email') as string,
        orderId: matchingOrder?.id ?? null,
      };

      const result = await fetchStorefront(CUSTOMER_ORDER_QUERY, payload, null);

      if (result?.order) {
        setOrderStatus(result?.order);
      } else {
        setOrderStatus({
          error:
            result.error ||
            'Unable to find order. Please check your email and order number.',
        });
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setOrderStatus({
        error:
          'Unable to find order. Please check your email and order number.',
      });
    } finally {
      setOrderLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    if (formData) {
      setOrderLoading(true);
      await checkOrderStatus(formData);
    }
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setOrderLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="w-full  lg:px-16 px-4 mx-auto flex justify-center">
          <div className="rounded-2xl bg-white md:w-full w-[95%] max-w-[1440px] relative shadow-2xl overflow-hidden">
            <div className="overflow-x-hidden md:max-h-[calc(100vh-20px)] max-h-[calc(100vh-180px)] overflow-y-auto [scrollbar-gutter:stable_both-edges] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="w-full md:p-[40px_40px_0px_40px] p-[30px_15px_0px_15px] ">
                <div
                  className="w-full flex gap-4 justify-between items-start relative z-1"
                  style={{
                    borderWidth: '2px 2px 0px 2px',
                    borderStyle: 'solid',
                    borderImageSource:
                      'linear-gradient(231.68deg, rgba(255, 255, 255, 0.01) 4.33%, rgba(255, 255, 255, 0.5) 51.55%, rgba(255, 255, 255, 0) 100.77%)',
                    borderImageSlice: 1,
                  }}
                >
                  <div className="max-w-[615px]">
                    <h2 className="text-[24px] md:text-[32px] font-medium leading-[140%] font-playfair tracking-[-1px] text-primary mb-4">
                      Order Status
                    </h2>
                    <p className="text-primary text-base font-light outfit mb-8 leading-[140%]">
                      To view the latest update on your Bello Diamonds order,
                      enter your email address and order number below. You will
                      be provided with your expected delivery date and tracking
                      number if it has been generated.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="relative lg:w-[55px] lg:h-[55px] lg:min-w-[55px] w-[35px] h-[35px] min-w-[35px] rounded-full p-[1px] bg-[linear-gradient(245.74deg,rgba(255,255,255,0)_-3.74%,#FFFFFF_33.82%,rgba(255,255,255,0)_72.6%)]"
                  >
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-[#151515] text-primary text-[14px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.71277 9.77294C9.00567 10.0658 9.48054 10.0658 9.77343 9.77294C10.0663 9.48004 10.0663 9.00517 9.77343 8.71228L6.06114 4.99998L9.77342 1.2877C10.0663 0.994805 10.0663 0.519931 9.77342 0.227038C9.48053 -0.065855 9.00566 -0.065855 8.71276 0.227038L5.00048 3.93932L1.28815 0.226994C0.995258 -0.0658993 0.520385 -0.065899 0.227491 0.226994C-0.0654019 0.519888 -0.0654023 0.994761 0.227491 1.28765L3.93982 4.99998L0.227483 8.71232C-0.065411 9.00521 -0.0654107 9.48009 0.227483 9.77298C0.520376 10.0659 0.995249 10.0659 1.28814 9.77298L5.00048 6.06064L8.71277 9.77294Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="grid lg:grid-cols-[36.02%_auto] md:p-[40px_40px_20px_40px] p-[30px_15px_20px_15px] relative z-1 gap-10 md:gap-[30px]">
                <form
                  className="space-y-3 mt-[40px]"
                  onSubmit={handleOrderStatusSubmit}
                >
                  {fields.map((field, idx) => (
                    <div key={idx} className="relative w-full mb-4">
                      <input
                        type={field.type}
                        id={`field-${idx}`}
                        name={field.placeholder.toLowerCase().replace(' ', '')}
                        placeholder=" "
                        className="peer w-full rounded-[8px] border border-[#454545] 
       text-primary 
        px-3 pt-5 pb-2 outfit text-[14px] leading-[140%] font-light"
                      />
                      <label
                        htmlFor={`field-${idx}`}
                        className="absolute left-3 outfit leading-[140%] font-light top-[4px] text-[#6D6D6D] text-[13px] transition-all
        peer-placeholder-shown:top-[15px]
        peer-placeholder-shown:text-[#6D6D6D]
        peer-focus:top-[4px]
        peer-focus:text-[#6D6D6D]"
                      >
                        {field.placeholder}
                      </label>
                    </div>
                  ))}

                  {orderStatus && (
                    <div className="mt-4 p-4 rounded-lg outfit border border-[#d1d1d1] text-primary">
                      {orderStatus.error ? (
                        <p className="text-red-400">{orderStatus.error}</p>
                      ) : (
                        <div>
                          <h3 className=" mb-2">Order Found!</h3>

                          <p>
                            Order Number:{' '}
                            {orderStatus.orderNumber}
                          </p>
                          {/* <p><strong>Status URL:</strong> <a href={orderStatus.statusUrl} target="_blank" className="underline text-blue-400">{orderStatus.statusUrl}</a></p> */}
                          <p>
                            Fulfillment:{' '}
                            {orderStatus.fulfillmentStatus}
                          </p>
                          <p>
                            Processed At:{' '}
                            {new Date(orderStatus.processedAt).toLocaleString()}
                          </p>

                          <p>
                            Total Price: $
                            {orderStatus.totalPriceV2.amount}{' '}
                            {orderStatus.totalPriceV2.currencyCode}
                          </p>
                          <p>
                            Subtotal: $
                            {orderStatus.subtotalPriceV2.amount}{' '}
                            {orderStatus.subtotalPriceV2.currencyCode}
                          </p>
                          <p>
                            Tax: $
                            {orderStatus.totalTaxV2.amount}{' '}
                            {orderStatus.totalTaxV2.currencyCode}
                          </p>

                          <div className="mt-4">
                            <h4 className="text-[20px]">Shipping Address:</h4>
                            <p>{orderStatus.shippingAddress.name}</p>
                            {orderStatus.shippingAddress.formatted.map(
                              (line: any, index: any) => (
                                <p key={index}>{line}</p>
                              ),
                            )}
                          </div>

                          <div className="mt-4">
                            <h4 className="">Line Items:</h4>
                            <ul className="">
                              {orderStatus.lineItems.nodes.map(
                                (item: any, index: any) => (
                                  <li key={index}>
                                    <p>
                                      <strong>Title:</strong> {item.title}
                                    </p>
                                    <p>
                                      <strong>Quantity:</strong> {item.quantity}
                                    </p>
                                    <p>
                                      <strong>Price:</strong> $
                                      {item.discountedTotalPrice.amount}{' '}
                                      {item.discountedTotalPrice.currencyCode}
                                    </p>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center md:mt-[40px] mb-[20px] mt-[30px] lg:mb-[100px] lg:w-full w-[242px] mx-auto">
                    <Button
                      type="submit"
                      className="w-full max-w-[242px] min-w-[242px] h-[48px] text-[15px] md:text-[16px] text-center footer-btn tracking-[-2%] outfit font-bold"
                      disabled={orderLoading}
                    >
                      <span>
                        {orderLoading ? 'CHECKING...' : 'CHECK MY ORDER STATUS'}
                      </span>
                    </Button>
                  </div>
                </form>

                <div className="relative text-center">
                  <img
                    src="/orderstatus.png"
                    alt="Order"
                    className="rounded-[16px] mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

const AssistanceModal = ({
  isOpenAssistance,
  setIsOpenAssistance,
}: {
  isOpenAssistance: boolean;
  setIsOpenAssistance: (open: boolean) => void;
}) => {
  if (!isOpenAssistance) return null;

  const Assistance = [
    { type: 'text', placeholder: 'First Name', name: 'firstName' },
    { type: 'text', placeholder: 'Last Name', name: 'lastName' },
    { type: 'email', placeholder: 'Email', name: 'email' },
    { type: 'tel', placeholder: 'Phone Number (optional)', name: 'phone' },
    { type: 'textarea', placeholder: 'Message', name: 'message' },
  ];

  const contactItems = [
    {
      id: 1,
      label: 'Phone Number',
      value: '212-845-8222',
      url: 'tel:212-845-8222',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#09090A"
        >
          <path
            d="M21 19V17.3541C21 16.5363 20.5021 15.8008 19.7428 15.4971L17.7086 14.6835C16.7429 14.2971 15.6422 14.7156 15.177 15.646L15 16C15 16 12.5 15.5 10.5 13.5C8.5 11.5 8 9 8 9L8.35402 8.82299C9.28438 8.35781 9.70285 7.25714 9.31654 6.29136L8.50289 4.25722C8.19916 3.4979 7.46374 3 6.64593 3H5C3.89543 3 3 3.89543 3 5C3 13.8366 10.1634 21 19 21C20.1046 21 21 20.1046 21 19Z"
            stroke="white"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: 'Email address',
      value: 'info@BelloDiamonds.com',
      url: 'mailto:info@BelloDiamonds.com',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#09090A"
        >
          <path
            d="M6 8L9.7812 10.5208C11.1248 11.4165 12.8752 11.4165 14.2188 10.5208L18 8M6 21H18C20.2091 21 22 19.2091 22 17V7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21Z"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: 'Virtual Appointment through Calendly',
      value: '',
      url: '/appointmentbooking',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="#09090a"
        >
          <path
            d="M16.3726 6.17276C19.0986 7.39695 21 10.1611 21 13.375V16.75C21 17.9926 20.0051 19 18.7778 19H12.1111C9.2084 19 6.73898 17.1217 5.82379 14.5M16.3726 6.17276C15.6711 3.20566 13.0344 1 9.88889 1H8.77778C4.48223 1 1 4.52576 1 8.875V12.25C1 13.4926 1.99492 14.5 3.22222 14.5H5.82379M16.3726 6.17276C16.4922 6.67875 16.5556 7.20688 16.5556 7.75C16.5556 11.4779 13.5708 14.5 9.88889 14.5H5.82379"
            stroke="white"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMessage('');

    const formData = new FormData(e.currentTarget);
    const contactData = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone_number: formData.get('phone') as string,
      description: formData.get('message') as string,
    };

    try {
      const response = await fetch(
        'http://31.97.65.197:8000/api/v1/wishlist/contact-us',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        },
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && typeof data === 'object' && 'success' in data) {
        setContactMessage(
          (data as { message?: string }).message || 'Message sent successfully!',
        );
      } else {
        setContactMessage('An error occurred. Please try again later.');
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactMessage('An error occurred. Please try again later.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full lg:px-16 px-4 mx-auto flex justify-center">
        <div className="rounded-2xl bg-white md:w-full w-[95%] max-w-[1440px] relative shadow-2xl overflow-hidden">
          <div className="overflow-x-hidden md:max-h-[calc(100vh-20px)] max-h-[calc(100vh-180px)] overflow-y-auto [scrollbar-gutter:stable_both-edges] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-full md:p-[40px_40px_10px_40px] p-[30px_15px_0px_15px]">
              <div
                className="w-full md:p-[40px_24px_50px_24px]  p-[30px_14px_30px_14px] flex gap-4 justify-center items-start relative z-1"
                style={{
                  borderWidth: '2px 2px 0px 2px',
                  borderStyle: 'solid',
                  borderImageSource:
                    'linear-gradient(231.68deg, rgba(255, 255, 255, 0.01) 4.33%, rgba(255, 255, 255, 0.5) 51.55%, rgba(255, 255, 255, 0) 100.77%)',
                  borderImageSlice: 1,
                }}
              >
                <div className="">
                  <h2 className="text-[24px] md:text-[32px] font-medium leading-[140%] font-playfair tracking-[-1px] text-primary mb-4">
                    Need Assistance?
                  </h2>
                </div>
                <div className="absolute lg:right-5 right-3">
                  <button
                    onClick={() => {
                      setIsOpenAssistance(false);
                      setContactMessage('');
                    }}
                    className="relative lg:w-[55px] lg:h-[55px] lg:min-w-[55px] w-[35px] h-[35px] min-w-[35px] rounded-full p-[1px] bg-[linear-gradient(245.74deg,rgba(255,255,255,0)_-3.74%,#FFFFFF_33.82%,rgba(255,255,255,0)_72.6%)]"
                  >
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-[#151515] text-primary text-[14px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.71277 9.77294C9.00567 10.0658 9.48054 10.0658 9.77343 9.77294C10.0663 9.48004 10.0663 9.00517 9.77343 8.71228L6.06114 4.99998L9.77342 1.2877C10.0663 0.994805 10.0663 0.519931 9.77342 0.227038C9.48053 -0.065855 9.00566 -0.065855 8.71276 0.227038L5.00048 3.93932L1.28815 0.226994C0.995258 -0.0658993 0.520385 -0.065899 0.227491 0.226994C-0.0654019 0.519888 -0.0654023 0.994761 0.227491 1.28765L3.93982 4.99998L0.227483 8.71232C-0.065411 9.00521 -0.0654107 9.48009 0.227483 9.77298C0.520376 10.0659 0.995249 10.0659 1.28814 9.77298L5.00048 6.06064L8.71277 9.77294Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-[36.02%_36.02%] grid-cols-1 justify-center items-start md:p-[40px_40px_20px_40px] p-[30px_20px_20px_20px] relative z-1 gap-10 md:gap-[60px]">
              <form className="space-y-3" onSubmit={handleContactSubmit}>
                {Assistance.map((field, idx) => {
                  let spacing = 'mb-2';
                  if (idx === 1) spacing = 'mb-[24px]';
                  if (idx === 3) spacing = 'mb-[24px]';

                  return (
                    <div key={idx} className={`relative w-full ${spacing}`}>
                      {field.type === 'textarea' ? (
                        <>
                          <textarea
                            id={`field-${idx}`}
                            name={field.name}
                            placeholder=" "
                            required={
                              field.placeholder !== 'Phone Number (optional)'
                            }
                            className="peer w-full rounded-[8px] border border-[#454545] 
bg-[#f6f6f6] text-primary 
px-3 pt-5 pb-2 outfit text-[14px] leading-[140%] font-light 
focus:outline-none min-h-[100px]
peer-placeholder-shown:bg-[#000000]
peer-placeholder-shown:text-primary
peer-focus:bg-white peer-focus:text-black
[&:not(:placeholder-shown)]:bg-white
[&:not(:placeholder-shown)]:text-[#3D3D3D]"
                          />
                          <label
                            htmlFor={`field-${idx}`}
                            className="absolute left-3 outfit leading-[140%] font-light top-[4px] text-[#6D6D6D] text-[13px] transition-all
peer-placeholder-shown:top-[15px]
peer-placeholder-shown:text-[#6D6D6D]
peer-focus:top-[4px]
peer-focus:text-[#6D6D6D]"
                          >
                            {field.placeholder}
                          </label>
                        </>
                      ) : (
                        <>
                          <input
                            type={field.type}
                            id={`field-${idx}`}
                            name={field.name}
                            placeholder=" "
                            required={
                              field.placeholder !== 'Phone Number (optional)'
                            }
                            className="peer w-full rounded-[8px] border border-[#454545] 
bg-[#f6f6f6] text-primary 
px-3 pt-5 pb-2 outfit text-[14px] leading-[140%] font-light 
focus:outline-none h-[45px]
peer-placeholder-shown:bg-[#000000]
peer-placeholder-shown:text-primary
peer-focus:bg-white peer-focus:text-black
[&:not(:placeholder-shown)]:bg-white
[&:not(:placeholder-shown)]:text-[#3D3D3D]"
                          />
                          <label
                            htmlFor={`field-${idx}`}
                            className="absolute left-3 outfit leading-[140%] font-light top-[4px] text-[#6D6D6D] text-[13px] transition-all
peer-placeholder-shown:top-[15px]
peer-placeholder-shown:text-[#6D6D6D]
peer-focus:top-[4px]
peer-focus:text-[#6D6D6D]"
                          >
                            {field.placeholder}
                          </label>
                        </>
                      )}
                    </div>
                  );
                })}

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="relative inline-block w-[20px] h-[20px]">
                    <input
                      type="checkbox"
                      className="w-[16px] h-[16px] accent-black"
                    />
                  </span>
                  <span className="outfit text-[12px] leading-[140%] text-black font-light">
                    Send me updates on new style and special offers
                  </span>
                </label>


                {contactMessage && (
                  <div className="mt-4 p-4 rounded-lg text-primary outfit">
                    {contactMessage}
                  </div>
                )}

                <div className="flex justify-center md:mt-[40px] mb-[20px] mt-[30px] lg:mb-[100px] lg:w-full w-[242px] mx-auto">
                  <Button
                    type="submit"
                    className="w-full max-w-[242px] min-w-[242px] h-[48px] text-[15px] md:text-[16px] text-center footer-btn tracking-[-2%] outfit font-bold"
                    disabled={contactLoading}
                  >
                    <span>
                      {contactLoading ? 'Sending...' : 'Request Assistance'}
                    </span>
                  </Button>
                </div>
              </form>
              <div className="w-full bg-bottom-left bg-[url('/bello-transparent.png')] bg-no-repeat relative bg-[#f6f6f6] text-primary p-5 md:p-[32px] rounded-[16px] space-y-[24px] lg:max-w-[491px]">
                {contactItems.map((item) => (
                  <div key={item.id}>
                    <a href={item.url} className='flex items-start gap-3'>
                    {item.icon}
                    <div>
                      <p className="outfit text-[15px] md:text-[16px] font-light leading-[140%]">
                        {item.label}
                      </p>
                      {item.value && (
                        <p className="outfit text-[14px] tetx-black font-light leading-[140%]">
                          {item.value}
                        </p>
                      )}
                    </div>
                    </a>
                  </div>
                ))}
                <Link
                  to="/faq"
                  className="outfit text-[13px] text-primary hover:text-primary font-light leading-[140%]"
                >
                  View FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ORDER_STATUS_QUERY = `#graphql
  query getCustomerOrdersForFooter($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      orders(first: 250) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPriceV2 {
              amount
              currencyCode
            }
            statusUrl
            customerUrl
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    image {
                      url
                    }
                  }
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              address1
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const Footer = memo(
  ({ footer: footerPromise, header, publicStoreDomain }: FooterProps) => {
    const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] =>
      Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
        arr.slice(i * chunkSize, (i + 1) * chunkSize),
      );

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAssistance, setIsOpenAssistance] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768); // adjust breakpoint as needed
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <>
              <footer className="bg-white gg text-primary pt-10 border-t border-[rgba(69,69,69,1)]">
                <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-3 md:gap-10 gap-8 mb-8">
                    <div className="flex md:block lg:flex-row flex-col lg:justify-between xl:items-center">
                      <Link to="/">
                        <img
                          src={logo || '/placeholder.svg'}
                          alt="Logo"
                          className="mb-6"
                        />
                      </Link>
                      <SocialLinks />
                    </div>

                    <OrdersSection setIsOpen={setIsOpen} />
                    <EverythingBelloSection />
                    <ContactUsSection
                      setIsOpenAssistance={setIsOpenAssistance}
                      isMobile={isMobile}
                    />

                    <div className="flex flex-col md:items-end">
                      <NewsletterForm publicStoreDomain={publicStoreDomain} />
                    </div>
                  </div>

                  <OrderStatusModal isOpen={isOpen} setIsOpen={setIsOpen} />
                  <AssistanceModal
                    isOpenAssistance={isOpenAssistance}
                    setIsOpenAssistance={setIsOpenAssistance}
                  />
                </div>
              </footer>
            </>
          )}
        </Await>
      </Suspense>
    );
  },
);

export default Footer;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Order
const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineProductVariant on ProductVariant {
    id
    image {
      altText
      height
      url
      id
      width
    }
    price {
      ...OrderMoney
    }
    product {
      handle
    }
    sku
    title
  }
  fragment OrderLineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...OrderMoney
    }
    discountedTotalPrice {
      ...OrderMoney
    }
    variant {
      ...OrderLineProductVariant
    }
  }
  fragment Order on Order {
    id
    name
    orderNumber
    statusUrl
    processedAt
    fulfillmentStatus
    totalTaxV2 {
      ...OrderMoney
    }
    totalPriceV2 {
      ...OrderMoney
    }
    subtotalPriceV2 {
      ...OrderMoney
    }
    shippingAddress {
      ...AddressFull
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    order: node(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    id
    orderNumber
  }
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $customerAccessToken: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const;
