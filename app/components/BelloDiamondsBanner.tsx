import {Form, Link, useActionData} from '@remix-run/react';
import {X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {collectFacebookParams} from '~/utils/facebook-params.client';

type ActionData =
  | {error: string; success?: never; data?: never}
  | {success: string; data: unknown; error?: never};

export default function BelloDiamondsBanner() {
  const actionData = useActionData<ActionData>();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [facebookParams, setFacebookParams] = useState<{
    clickId: string | null;
    browserId: string | null;
    facebookLoginId: string | null;
    externalId: string;
  } | null>(null);

  // Giveaway end date: 9/29/25 at 12:01AM EDT
  const GIVEAWAY_END_DATE = new Date('2025-09-29T00:01:00-04:00'); // EDT timezone
  const STORAGE_KEY = 'bello_giveaway_submitted';
  const POPUP_DELAY = 2000; // 2 seconds delay

  // Check if giveaway has ended
  const isGiveawayActive = () => {
    const now = new Date();
    return now < GIVEAWAY_END_DATE;
  };

  // Check if user has already submitted
  const hasUserSubmitted = () => {
    if (typeof window === 'undefined') return false;

    try {
      const submitted = localStorage.getItem(STORAGE_KEY);
      return submitted === 'true';
    } catch (error) {
      console.warn('localStorage access failed:', error);
      return false;
    }
  };

  // Mark user as submitted
  const markUserAsSubmitted = () => {
    if (typeof window === 'undefined') return;

    try {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
      }, 600);
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
  };

  // Collect Facebook parameters
  useEffect(() => {
    const params = collectFacebookParams();
    setFacebookParams(params);
  }, []);
  useEffect(() => {
    // Don't show popup if:
    // 1. Giveaway has ended
    // 2. User has already submitted
    if (!isGiveawayActive() || hasUserSubmitted()) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Handle successful form submission
  useEffect(() => {
    if (actionData?.success) {
      // Mark user as submitted in localStorage
      markUserAsSubmitted();

      // Track Facebook pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        (async () => {
          const hashedEmail = await hashEmail(email);

          const userData: any = {
            em: hashedEmail,
          };

          if (facebookParams) {
            if (facebookParams.clickId) userData.fbp = facebookParams.clickId;
            if (facebookParams.browserId)
              userData.fbc = facebookParams.browserId;
            if (facebookParams.externalId)
              userData.external_id = facebookParams.externalId;
          }

          window.fbq('track', 'Lead', {
            content_name: 'Newsletter Signup',
            content_category: 'Popup Form',
            user_data: userData,
          });
        })();
      }

      // Close popup after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } else if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData, email, facebookParams]);

  // Hash email function (unchanged)
  async function hashEmail(email: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  // Don't render anything if giveaway has ended
  if (!isGiveawayActive()) {
    return null;
  }

  // Don't render if user has already submitted
  if (hasUserSubmitted()) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg w-full">
            <div
              key="popup-modal"
              className="absolute max-h-full inset-0 z-50 flex justify-center p-4 overflow-y-auto md:items-center"
              style={{backdropFilter: 'blur(5px)'}}
            >
              <div
                className="relative w-full max-w-[320px] md:max-w-[1064px] mx-auto overflow-y-auto md:overflow-hidden rounded-lg shadow-xl bg-no-repeat bg-cover bg-center backdrop-blur-md"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(113,3,42,0.9), rgba(9,21,60,0.9))',
                }}
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="cursor-pointer absolute h-[24px] w-[24px] top-6 right-6 md:right-[18px] md:top-[20px] z-50 p-1 text-white hover:text-gray-300 transition-colors border border-white"
                  aria-label="Close popup"
                  type="button"
                >
                  <X size={15} />
                </button>

                <div className="flex flex-col md:flex-row">
                  {/* Left Image */}
                  <div className="w-full md:w-[591px] relative">
                    <div className="absolute mb-0 inset-0 border-4 border-b-0 md:mb-4 md:border-b-4 md:border-r-0 m-3 md:mr-0 border-[#27282d] pointer-events-none z-10" />
                    <img
                      src="/new-pop-logo.svg"
                      alt="Bello Diamonds"
                      className="absolute inset-0 top-6 left-6 w-[67px] sm:w-[110px] md:w-[124px] transition-opacity duration-500"
                    />
                    <img
                      src="/sizeupdate.png"
                      alt="Bello Diamonds model"
                      className="hidden sm:block w-full h-full md:object-cover"
                    />
                    <img
                      src="/mobileModel.png"
                      alt="Mobile version"
                      className="block sm:hidden w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="w-full md:w-[473px] pb-2 md:pb-0 px-5 flex flex-col md:px-8 lg:px-[54px] bg-[url('/bello-patternnew.png')] bg-no-repeat bg-center bg-cover">
                    <div className="bg-[#27282d] pb-[15px] px-[15px] md:px-[15px] h-full shadow-[0px_19px_38px_rgb(0,0,0),_0px_15px_12px_rgb(0,0,0)] flex flex-col">
                      <div className="pt-[6px] border-t-0 md:pt-[15px] text-center mb-2 md:mb-4 border-2 md:border-4 md:border-t-0 border-white/80">
                        <div className="flex justify-center flex-col lg:max-w-[335px] lg:w-[335px] md:max-w-[335px] md:w-[335px] mx-auto">
                          <h2 className="text-[22px] leading-[20px] md:leading-[35px] md:mb-[2px] md:text-[48px] pl-[30px] md:pl-[60px] text-white font-400 mb-0 serif">
                            Lucky
                          </h2>
                          <h2 className="text-white text-[22px] md:mb-[5px] leading-[19px] md:leading-[30px] md:text-[48px] md:pr-[50px] pr-[30px] font-400 mb-0 serif">
                            Seven
                          </h2>
                        </div>
                        <h1 className="mt-[2px] md:mt-[2px] mb-[6px] text-white text-[28px] leading-[30px] md:leading-[100%] md:text-[54px] font-400 serif">
                          GIVEAWAY
                        </h1>
                      </div>
                      {!actionData?.success ? (
                        <>
                          <div className="mb-[4px] md:mb-[7px] text-center text-white">
                            <p className="leading-[24px] libre-regular font-[400] text-[22px] md:text-[32px] [-0.02em] align-middle mb-[3px] md:mb-[14px]">
                              One Lucky Person
                            </p>
                            <p className="leading-[22px] text-[14px] libre-regular font-400 md:text-[18px]">
                              will win
                            </p>
                          </div>

                          <div className="text-left md:text-center space-y-1 md:space-y-2 mb-0">
                            <p className="mb-[0] text-white/90 md:text-[22px] text-[13px] leading-[18px] md:leading-[24px] arial font-700">
                              • A Pair of 4 ct.
                            </p>
                            <p className="mb-[0] pl-[10px] md:pl-0 text-white/90 md:text-[22px] text-[13px] leading-[18px] md:leading-[24px] arial font-700">
                              Lab Grown Diamond Studs
                            </p>
                            <p className="my-[1px] pl-[10px] md:pl-0 text-white/70 md:mt-[2px] md:mb-[5px] text-[12px] md:text-[16px] font-400 arial-normal">
                              (4 ct. total weight)
                            </p>

                            <div className="md:mt-[8px]">
                              <p className="mt-[4px] text-white/90 md:mt-[0px] md:text-[22px] text-[13px] leading-[18px] md:leading-[24px] outfit font-700 arial">
                                • A 3 ct. Lab Grown Diamond
                              </p>
                              <p className="mb-[0] pl-[10px] md:pl-0 text-white/90 md:text-[22px] text-[13px] leading-[18px] md:leading-[24px] font-700 arial">
                                Pendant Necklace
                              </p>
                              <p className="mt-[1px] pl-[10px] md:pl-0 text-white/70 text-[12px] md:text-[16px] arial-normal font-400">
                                (3 ct. total weight)
                              </p>
                            </div>
                          </div>

                          <div className="text-center text-white pb-1 mt-[3px] md:mt-[2px]">
                            <p className="text-[17px] leading-[20px] md:text-[32px] md:leading-[40px] font-400 libre-bold">
                              (<span>7</span> ct. total weight)
                            </p>
                          </div>

                          <Form method="post" className="space-y-4">
                            <div className="text-left md:text-center arial-normal font-400 border-t border-white py-2 text-white/70 text-[10px] mb-0 leading-[12px]">
                              ENTER YOUR EMAIL BELOW AND FOLLOW US ON SOCIAL
                              MEDIA TO ENTER
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder=""
                              required
                              className="w-full h-[40px] md:h-[45px] pt-[6px] focus:outline-none focus:ring-0 pb-[10px] px-2 border border-white bg-transparent text-white placeholder-gray-400 placeholder:text-[11px] mb-[8px] md:mb-[13px]"
                            />

                            {facebookParams && (
                              <>
                                {facebookParams.clickId && (
                                  <input
                                    type="hidden"
                                    name="fbc"
                                    value={facebookParams.clickId}
                                  />
                                )}
                                {facebookParams.browserId && (
                                  <input
                                    type="hidden"
                                    name="fbp"
                                    value={facebookParams.browserId}
                                  />
                                )}
                                {facebookParams.facebookLoginId && (
                                  <input
                                    type="hidden"
                                    name="fb_login_id"
                                    value={facebookParams.facebookLoginId}
                                  />
                                )}
                                <input
                                  type="hidden"
                                  name="external_id"
                                  value={facebookParams.externalId}
                                />
                              </>
                            )}

                            <button
                              type="submit"
                              onClick={() => setError('')}
                              className="cursor-pointer text-[14px] md:text-[18px] w-full py-2 outfit bg-white text-black font-400 hover:bg-gray-200 transition-colors mb-[8px]"
                            >
                              ENTER GIVEAWAY
                            </button>
                          </Form>
                        </>
                      ) : (
                        <div className="text-white font-light m-auto">
                          <h1 className="text-[20px] text-center font-bold mb-10 mx-auto playfair">
                            Thanks for signing up!
                          </h1>
                          <div className="text-center max-w-[230px] text-[14px] mb-5 mx-auto outfit">
                            <div className="flex justify-center">
                              <svg
                                width="40px"
                                height="40px"
                                viewBox="0 0 1024 1024"
                                className="icon"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#000000"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="-10"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    d="M913.871918 369.867311c-6.433071-6.433071-14.863743-9.649095-23.289295-9.649095h-230.077272l51.34273-67.684964a24.706353 24.706353 0 0 0 2.444014-25.927848c-4.180524-8.429648-12.738157-13.706753-22.133329-13.706753h-72.31702V120.10482c0-13.641224-11.065129-24.706353-24.706353-24.706353H429.657094c-13.641224 0-24.706353 11.065129-24.706352 24.706353v132.793831h-73.605069a24.657206 24.657206 0 0 0-22.133329 13.706753 24.714544 24.714544 0 0 0 2.447086 25.927848l51.277201 67.684964H132.924888c-8.429648 0-16.856224 3.215-23.293391 9.649095-6.433071 6.433071-9.649095 14.863743-9.649095 23.292367v498.113043c0 8.426576 3.215 16.856224 9.649095 23.289296a32.849313 32.849313 0 0 0 23.293391 9.652167h757.656711c8.426576 0 16.856224-3.218072 23.289295-9.652167a32.840098 32.840098 0 0 0 9.652167-23.289296V393.159678a32.834978 32.834978 0 0 0-9.651143-23.292367z"
                                    fill="#42484d"
                                  ></path>
                                  <path
                                    d="M429.657094 302.310333c13.641224 0 24.706353-11.065129 24.706353-24.706353V144.810149H570.430064v132.793831c0 13.641224 11.0682 24.706353 24.706353 24.706353h47.291215c-36.351001 47.805206-105.258483 138.717008-130.672341 172.23799-25.414882-33.520982-94.387893-124.367255-130.67234-172.23799h48.574143z"
                                    fill="#FFFFFF"
                                  ></path>
                                  <path
                                    d="M400.447694 409.630921l91.617259 120.69765c4.697586 6.1771 11.968196 9.780153 19.689315 9.780153s15.054186-3.604076 19.686243-9.780153l91.554802-120.69765H832.288736L510.209225 687.253332 190.76417 409.630921h209.683524z"
                                    fill="#ffffff"
                                  ></path>
                                  <path
                                    d="M149.396132 439.097317l170.047898 147.78556-170.047898 236.059833zM172.942422 874.802502L356.88854 619.439359l120.892189 105.067016c9.395172 8.23511 21.4248 12.738157 33.972515 12.738158 12.481162 0 24.577343-4.503048 33.906986-12.675701l120.958741-105.129473 183.943046 255.363143H172.942422zM874.11138 822.94271L704.063481 586.882877l170.047899-147.78556z"
                                    fill="#ffffff"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                            <p className="">Important:</p>
                            <p className="">
                              Please{' '}
                              <b className="font-semibold">check your inbox</b>{' '}
                              for next steps to complete the entry.
                            </p>
                            <p className="">
                              Don't forget to check your <br /> spam or
                              promotions folder— <br />
                              just in case!
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="text-center flex items-center justify-center">
                        <p className="text-[8.49px] md:text-[12px] text-white opacity-70 arial-normal font-400 hover:text-white cursor-pointer">
                          <Link to="/terms&conditionsgiveaway">
                            Giveaway Terms & Conditions
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
