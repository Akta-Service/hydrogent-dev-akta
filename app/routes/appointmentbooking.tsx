import React, { useEffect } from 'react';
import {Link} from '@remix-run/react';
import Accordion from '~/components/ui/Accordion/Accordion';
import ArrowIcon from '~/assets/svg/ArrowIcon';
import engagementRing from '~/assets/images/demo/engagementring.png';
import weddingRing from '~/assets/images/demo/weddingring.png';
import giftRing from '~/assets/images/demo/gift.png';
import phoneIcon from '~/assets/images/svg/phones.svg';
import clockIcon from '~/assets/images/svg/clock.svg';
import serviceRing from '~/assets/images/svg/service.svg';
import phonegrey from '~/assets/images/svg/phonenew.svg';
import messagegrey from '~/assets/images/svg/envelopes.svg';
import chatgrey from '~/assets/images/svg/chatnew.svg';

const appointmentbooking = () => {
 useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  
  return (
    <>
      <div className="About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <div className="md:h-[212px] h-[168px] flex flex-col justify-center items-center collectionBanner">
            <div className="breadcrum mb-4 md:mb-0">
              <ul className="flex items-center">
                <li className="m-0 text-[14px] outfit font-light text-primary">
                  <Link to="/">Home</Link>
                </li>
                <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">
                  /
                </li>
                <li className="m-0 text-[14px] outfit font-light text-primary">
                  <Link to="/">Book an Appointment</Link>
                </li>
              </ul>
            </div>
            <h1 className="uppercase md:capitalize text-center custom-border-bottom border-b border-[2px] border-solid playfair font-normal md:text-[76px] text-[32px] text-primary md:leading-[140%] pb-[10px] leading-[35px] ">
              {/* {collection.title} */}Book an Appointment
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white md:py-[50px] py-4">
        <div className="container max-w-[1350px] px-[15px] mx-auto">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/bellodiamonds/30min"
            style={{minWidth: '320px', height: '700px'}}
          ></div>
        </div>
        </div>


      {/* <div className='bg-white md:py-[50px] py-4'>
        <div className='container max-w-[1350px] px-[15px] mx-auto'>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_382px] w-full gap-[30px]">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_382px] w-full gap-[30px]">
            <div className="order-2 md:order-1 bg-transparent">
              <Accordion
                titleClasses="md:text-[24px] playfairsb"
                title="Step 1 - Select Services "
                className="text-primary appointmentbd  text-[18px] md:text-[24px] w-full outfit font-normal pt-4 md:px-[30px] px-[15px] mb-4 "
                renderIcon={renderChevronIcon}
                maxContentHeight={800}
              >
                <div
                  className=" w-full "
                  style={{
                    borderImage:
                      'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                    borderImageSlice: 1,
                  }}
                />
                <div className="md:py-2 md:pt-5">
                  <div className="flex space-y-[13px] flex-col">
                    <div className="overflow-x-auto">
                      <table className="min-w-full  text-sm text-left">
                        <tbody>
                          <tr className="px-6 md:py-4 ">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={engagementRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Engagement Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Find your ideal ring setting and center
                                  diamond or gemstone pairing.
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" className="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={weddingRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Wedding Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Our experts will help you and your partner
                                  select the perfect wedding bands.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" class="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={giftRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Fine Jewelry & Gifts
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Discover our assortment of necklaces,
                                  bracelets, earrings, and more, for gifting—or
                                  wearing.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Accordion>
              <Accordion
                titleClasses="md:text-[24px] playfairsb"
                title="Step 2 - Select Date and Time"
                className="text-primary appointmentbd  text-[18px] md:text-[24px] w-full outfit font-normal pt-4 md:px-[30px] px-[15px] mb-4 "
                renderIcon={renderChevronIcon}
                maxContentHeight={800}
              >
                <div
                  className=" w-full "
                  style={{
                    borderImage:
                      'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                    borderImageSlice: 1,
                  }}
                />
                <div className="md:py-2 md:pt-5">
                  <div className="flex space-y-[13px] flex-col">
                    <div className="overflow-x-auto">
                      <table className="min-w-full  text-sm text-left">
                        <tbody>
                          <tr className="px-6 md:py-4 ">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={engagementRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Engagement Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Find your ideal ring setting and center
                                  diamond or gemstone pairing.
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" class="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={weddingRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Wedding Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Our experts will help you and your partner
                                  select the perfect wedding bands.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" class="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={giftRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Fine Jewelry & Gifts
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Discover our assortment of necklaces,
                                  bracelets, earrings, and more, for gifting—or
                                  wearing.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Accordion>
              <Accordion
                titleClasses="md:text-[24px] playfairsb"
                title="Step 3 - Contact Details"
                className="text-primary appointmentbd  text-[18px] md:text-[24px] w-full outfit font-normal pt-4 md:px-[30px] px-[15px] mb-4 "
                renderIcon={renderChevronIcon}
                maxContentHeight={800}
              >
                <div
                  className=" w-full "
                  style={{
                    borderImage:
                      'linear-gradient(to right, #FFFFFF80 0%, rgba(255,255,255,0) 100%) 1',
                    borderImageSlice: 1,
                  }}
                />
                <div className="md:py-2 md:pt-5">
                  <div className="flex space-y-[13px] flex-col">
                    <div className="overflow-x-auto">
                      <table className="min-w-full  text-sm text-left">
                        <tbody>
                          <tr className="px-6 md:py-4 ">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={engagementRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Engagement Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Find your ideal ring setting and center
                                  diamond or gemstone pairing.
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" class="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={weddingRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Wedding Ring
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Our experts will help you and your partner
                                  select the perfect wedding bands.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3" class="h-6"></td>
                          </tr>
                          <tr className="">
                            <td className="bg-transparent w-[120px] md:w-auto">
                              <img src={giftRing} alt="" />
                            </td>
                            <td className="md:px-6 px-2 py-4">
                              <div>
                                <h6 className="text-[18px] outfit font-normal text-primary">
                                  Fine Jewelry & Gifts
                                </h6>
                                <p className="md:hidden text-[16px] outfit font-light text-[#b0b0b0]">
                                  50 minutes
                                </p>
                                <p className="md:pt-2 text-[16px] outfit font-light text-primary">
                                  Discover our assortment of necklaces,
                                  bracelets, earrings, and more, for gifting—or
                                  wearing.
                                </p>
                              </div>
                            </td>
                            <td className="hidden md:block">
                              <p className="text-[16px] outfit font-light text-[#b0b0b0]">
                                50 minutes
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>

            <div className="order-1 md:order-2 max-h-[330px] rounded-[15px] bg-[linear-gradient(34.45deg,_#09090A_21.46%,_#656570_299.52%)] p-8">
              <h5 className="text-[18px] playfairsb text-primary mb-8">
                Your Appointment
              </h5>
              <ul>
                <li className="flex items-start pb-4">
                  <span>
                    <img src={serviceRing} alt="" />
                  </span>
                  <span className="flex flex-col px-2">
                    <span className="text-[14px] pb-2 leading-[16px] outfit font-light text-primary">
                      Service
                    </span>
                    <span className="text-[18px] outfit font-light text-primary">
                      -
                    </span>
                  </span>
                </li>
                <li className="flex items-start pb-4">
                  <span>
                    <img src={clockIcon} alt="" />
                  </span>
                  <span className="flex flex-col px-2">
                    <span className="text-[14px] pb-2 leading-[16px] outfit font-light text-primary">
                      Date and Time
                    </span>
                    <span className="text-[18px] outfit font-light text-primary">
                      -
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <img src={phoneIcon} alt="" />
                  </span>
                  <span className="flex flex-col px-2">
                    <span className="text-[14px] pb-2 leading-[16px] outfit font-light text-primary">
                      Contact
                    </span>
                    <span className="text-[18px] outfit font-light text-primary">
                      -
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      <div className='bg-white md:pb-6 pb-12'>
      <div className='contactSection  md:py-[50px] py-[25px]'>
        <div className='container max-w-[1350px] px-[15px] mx-auto'>
          <h2 className='mb-10 text-center playfair md:text-[56px] text-[32px] font-normal text-primary'>Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
                <div className='w-[33px] mx-auto'><img className='w-full' src={phonegrey} alt=''/></div>
                <div className='mt-3'>
                  <h6 className='mb-2 text-[18px] playfairsb text-primary'>Call Us</h6>
                  <p className='text-[14px] outfit font-light text-primary'>
                    <a href="tel:212-845-8222">212-845-8222</a>
                  </p>
                </div>
            </div>
            <div className="text-center">
                <div className='w-[33px] mx-auto'><img className='w-full' src={messagegrey} alt=''/></div>
                <div className='mt-3'>
                  <h6 className='mb-2 text-[18px] playfairsb text-primary'>Email Us</h6>
                  <p className='text-[14px] outfit font-light text-primary'>
                    <a href="mailto:customerservice@bellodiamonds.com">customerservice@bellodiamonds.com</a>
                  </p>
                </div>
            </div>
            <div className="text-center">
                <div className='w-[33px] mx-auto'>
                  <img className='w-full' src={chatgrey} alt=''/></div>
                <div className='mt-3'>
                  <h6 className='mb-2 text-[18px] playfairsb text-primary'>Chat With Us</h6>
                  {/* <p className='text-[14px] outfit font-light text-primary'>
                    <a href="#">Live Chat</a>
                  </p> */}
                </div>
                
              </div>
              {/* <div className="flex items-start justify-between">
                <div className="w-[33px]">
                  <img className="w-full" src={chatgrey} alt="" />
                </div>
                <div className="md:max-w-[370px] max-w-[285px]">
                  <h6 className="mb-2 text-[18px] playfairsb text-primary">
                    Title
                  </h6>
                  <p className="text-[14px] outfit font-light text-primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.{' '}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default appointmentbooking;
