/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/namespace */
/* eslint-disable import/no-named-as-default */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Suspense,
  startTransition,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from 'react';
import {
  Await,
  Link,
  NavLink,
  useNavigate,
} from '@remix-run/react';

import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';

import { useWishlist } from '~/hooks/useWishlist';
import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated';

import { Aside, useAside } from '~/components/Aside';
import { useDrawer } from '~/components/PageLayout';
import Drawer from './drawer/Drawer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import LoginModal from './forms/login';
import logo from '~/assets/images/logo/logo.svg';
import greyArrow from '~/assets/images/svg/rightblackarrow.svg';
import mobileLogo from '~/assets/images/logo/mobileLogo.svg';
import cartIcon from '~/assets/images/svg/cartt.svg';
import heartImg from '~/assets/images/svg/heart.svg';
import mailImg from '~/assets/images/svg/newenvelope.svg';
import phoneIcon from '~/assets/images/svg/phone_repo.svg';
import backIcon from '~/assets/images/svg/leftarrow.svg';
import profileIcon from '~/assets/images/svg/prfile.svg';
import clockIcon from '~/assets/images/svg/clocknew.svg';
import chatIcon from '~/assets/images/svg/chatround.svg';
import moreIcon from '~/assets/images/svg/arrowa-right_svg.svg';
import searchIcon from '~/assets/images/svg/searchnew.svg';
import stopWatch from '~/assets/images/svg/stpwatch.svg';
import downchev from '~/assets/images/svg/downnab.svg';
import toggleIcon from '~/assets/images/svg/togglemain.svg';
import ringnavImg from '~/assets/images/demo/ringnavbanner.png';
import womenWeddings from '~/assets/images/demo/womenweddingbands.png';
import ringBanner from '~/assets/images/ringbanner.png';
import earingBanner from '~/assets/images/earingbanner.png';
import ringNavBanner from '~/assets/images/demo/ring_banner.webp';
import diamondBanner from '~/assets/images/demo/diamondban.png';
import jewelleryBanner from '~/assets/images/jewelleryBanner.png';
import RingBuilder from './RIngBuilder';

interface HeaderProps {
  header: any;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: boolean;
  publicStoreDomain: string;
}

// Add this interface for the AssistanceModal props
interface AssistanceModalProps {
  isOpenAssistance: boolean;
  setIsOpenAssistance: (open: boolean) => void;
}

type Viewport = 'desktop' | 'mobile';

const FALLBACK_HEADER_MENU = {
  id: 'fallback-menu',
  items: [
    { id: 'home', title: 'Home', url: '/' },
    { id: 'shop', title: 'Shop', url: '/shop' },
    { id: 'about', title: 'About', url: '/about' },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'gray' : 'white',
  };
}

export const HeaderMenu = memo(({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) => {
  const className = `header-menu-${viewport}`;
  const { close } = useAside();

  const menuItems = useMemo(() => {
    return (menu || FALLBACK_HEADER_MENU).items.map((item: any) => {
      if (!item.url) return null;

      const url =
        item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;
      return {
        id: item.id,
        title: item.title,
        url,
      };
    }).filter(Boolean);
  }, [menu, primaryDomainUrl, publicStoreDomain]);

  return (
    <nav
      className={`${className} flex ${viewport === 'mobile' ? 'flex-col' : 'flex-row'
        } gap-4`}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
          className="text-primary text-base font-outfit font-normal hover:underline"
        >
          Home
        </NavLink>
      )}
      {menuItems.map((item: any) => (
        <NavLink
          className="header-menu-item text-primary text-base font-outfit font-normal hover:underline"
          end
          key={item.id}
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to={item.url}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
});

function MobileMenuAside({
  header,
  publicStoreDomain,
  isLoggedIn,
  handleOpenModal
}: {
  header: any;
  publicStoreDomain: string;
  isLoggedIn: any;
  handleOpenModal: () => void;
}) {
  const { close } = useAside();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("")

  const goToSubMenu = useMemo(() => (menuItem: any) => {
    if (menuItem.items?.length > 0) {
      setActiveMenu(menuItem);
    } else {
      close();
      if (menuItem.url) {
        navigate(new URL(menuItem.url).pathname);
      }
    }
  }, [close, navigate]);

  const goBack = useMemo(() => () => {
    setActiveMenu(null);
  }, []);

  const renderMainMenu = () => (
    <>
      <div className="flex items-center bg-[#f6f6f6] rounded px-4 py-2 mb-6">
        <img src={searchIcon} alt="search" className="w-[24px] h-[24px] mr-2" />
        <input
          type="text"
          placeholder="SEARCH"
          onChange={(e)=>setSearchText(e.target.value)}
          className="bg-transparent text-primary text-[12px] font-light outfit outline-none w-full placeholder-primary"
        />
        <button onClick={() => {
          close()
          navigate(`/search?q=${searchText}`);

        }}>
          Search
        </button>
      </div>
      <ul>
        {header.menu.items.map((item: any) => {
          const url = new URL(item.url).pathname;
          return (
            <li
              key={item.id}
              className="flex justify-between items-center pb-4"
            >
              <button
                onClick={() => goToSubMenu(item)}
                className="flex-1 text-left text-primary text-[18px] outfit"
              >
                {item.title}
              </button>
              {item.items?.length > 0 && <img src={greyArrow} alt="arrow" />}
            </li>
          );
        })}
      </ul>
      <div className="flex justify-between px-10 items-center py-4 border [border-image-source:linear-gradient(90deg,rgba(255,255,255,0)_9.58%,#fff_50.38%,rgba(255,255,255,0)_91.18%)] [border-image-slice:1]">
        <Suspense fallback={<div>Loading</div>}>
          <Await resolve={isLoggedIn}>
            {(resolvedIsLoggedIn) =>
              resolvedIsLoggedIn ? (
                <Link
                  to="/account"
                  onClick={close}
                  className="flex items-center text-primary outfit text-[12px] font-light"
                >
                  <img src={profileIcon} alt="profile" className="pr-2" />
                  PROFILE
                </Link>
              ) : (
                <button
                  onClick={() => {
                    close();
                    handleOpenModal();
                  }}
                  className="flex items-center text-primary outfit text-[12px] font-light"
                >
                  <img src={profileIcon} alt="profile" className="pr-2" />
                  SIGN IN
                </button>
              )
            }
          </Await>
        </Suspense>
        <Link
          to="/wishlist"
          onClick={close}
          className="flex items-center text-primary outfit text-[12px] font-light"
        >
          <img src={heartImg} alt="favorite" className="pr-2" />
          FAVORITE
        </Link>
      </div>
      <div className="mt-9 space-y-5 text-primary text-[13px] ff outfit font-light">
        <a href="tel:212-845-8222" className="flex items-center mb-2">
          <img src={phoneIcon} alt="phone" className="mr-2" />
          212-845-8222
        </a>
        {/* <button className="flex items-center mb-2">
          <img src={chatIcon} alt="phone" className="mr-2" />
          CHAT
        </button> */}
        <a href="/appointmentbooking" target="_blank" rel="noopener noreferrer">
          <button className="flex items-center mb-2">
            <img src={clockIcon} alt="phone" className="mr-2 w-[20px]" />
            Appointment
          </button>
        </a>
        <a href="mailto:info@bellodiamonds.com" className="flex items-center">
          <img src={mailImg} alt="email" className="mr-2" />
           info@bellodiamonds.com
        </a>
      </div>

    </>
  );

  const renderSubMenu = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className='flex items-center'>
          <button
            onClick={goBack}
            className="flex outfit font-light text-[13px] items-center text-primary"
          >
            <img src={backIcon} alt="arrow" className="w-[17px] pr-1" /> Back
          </button>
          <h2 className="text-primary text-[18px] outfit font-medium ml-5">
            {activeMenu?.title}
          </h2>
        </div>
        
      </div>
      <ul className="space-y-4">
        {activeMenu?.items.map((sub: any) => {
          const subUrl = sub.url ? new URL(sub.url).pathname : '#';
          return (
            <li key={sub.id}>
              <Link
                to={subUrl}
                onClick={close}
                prefetch="intent"
                className="flex justify-between items-center overflow-hidden"
              >
                <div className="flex items-center">
                  {sub.resource?.image?.url && (
                    <img
                      src={sub.resource.image.url}
                      alt={sub.title}
                      className="w-16 h-16 object-cover rounded-[5px]"
                      loading="lazy"
                    />
                  )}
                  <span className="text-primary text-[18px] outfit font-normal ml-4">
                    {sub.title}
                  </span>
                </div>
                <img src={greyArrow} alt="arrow" />
              </Link>
            </li>
          );
        })}
      </ul>
      {/* <div className="mt-6 relative">
        <img
          src={activeMenu?.resource?.image?.url || ringBanner}
          alt="Banner"
          className="w-full h-40 object-cover rounded"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 text-white max-w-[200px]">
          <h4 className="leading-[20px] text-[18px] playfairsb">
            Design Your Own Engagement Ring
          </h4>
        </div>
        <Link
          to={new URL(activeMenu.url).pathname}
          className="absolute bottom-4 flex items-center space-x-2 left-4 text-[13px] outfit font-light text-white"
        >
          <span>Shop all</span>
          <img src={moreIcon} alt="arrow" />
        </Link>
      </div> */}
    </>
  );

  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="">
        <div className="bg-white h-[calc(100vh-64px)] p-6 overflow-y-auto">
          {activeMenu ? renderSubMenu() : renderMainMenu()}
        </div>
      </Aside>
    )
  );
}



// Memoize the WishlistCount component to prevent unnecessary re-renders
const WishlistCount = memo(() => {
  const { getWishlistCount } = useWishlist();
  const count = getWishlistCount();

  if (count === 0) return null;

  return (
    <span className="ml-1 bg-[#09090A] text-white text-xs h-[18px] w-[18px] rounded-full flex items-center justify-center absolute top-[-8px] right-0">
      {count}
    </span>
  );
});
WishlistCount.displayName = 'WishlistCount';

const AssistanceModal = ({
  isOpenAssistance,
  setIsOpenAssistance,
}: AssistanceModalProps) => {
  if (!isOpenAssistance) return null;

  const Assistance = useMemo(() => [
    { type: 'text', placeholder: 'First Name', name: 'firstName' },
    { type: 'text', placeholder: 'Last Name', name: 'lastName' },
    { type: 'email', placeholder: 'Email', name: 'email' },
    { type: 'tel', placeholder: 'Phone Number (optional)', name: 'phone' },
    { type: 'textarea', placeholder: 'Message', name: 'message' },
  ], []);

  const contactItems = useMemo(() => [
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
  ], []);

  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = useMemo(() => async (e: React.FormEvent<HTMLFormElement>) => {
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
  }, []);

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
                    'linear-gradient(231.68deg, rgba(255, 255, 255, 0.01) 4.33%, rgba(255, 255,255, 0.5) 51.55%, rgba(255, 255, 255, 0) 100.77%)',
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
                  <button
                    type="submit"
                    className="w-full max-w-[242px] min-w-[242px] h-[48px] text-[15px] md:text-[16px] bg-[#09090A] text-white text-center footer-btn tracking-[-2%] outfit font-bold rounded-[8px]"
                    disabled={contactLoading}
                  >
                    <span>
                      {contactLoading ? 'Sending...' : 'Request Assistance'}
                    </span>
                  </button>
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
                <a
                  href="/faq"
                  className="outfit text-[13px] text-primary hover:text-primary font-light leading-[140%]"
                >
                  View FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderComponent = ({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) => {
  const { shop: shopName, menu } = header;
  const { open } = useAside();
  const { publish, shop, cart: cartData, prevCart } = useAnalytics();
  const [isRingModalOpen, setIsRingModalOpen] = useState<boolean>(false);
  const [isPandentModalOpen, setIsPandentRingModalOpen] =
    useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Add state for AssistanceModal
  const [isOpenAssistance, setIsOpenAssistance] = useState(false);
  const setIsOpenAssistanceMemo = useMemo(() => (open: boolean) => setIsOpenAssistance(open), []);

  const openModal = useMemo(() => (): void => {
    setIsRingModalOpen(true);
    setActiveDropdown(null); // Close dropdown when opening ring modal
  }, []);
  
  const closeModal = useMemo(() => (): void => setIsRingModalOpen(false), []);
  
  const openPandentModal = useMemo(() => (): void => {
    setIsPandentRingModalOpen(true);
    setActiveDropdown(null); // Close dropdown when opening pendant modal
  }, []);
  
  const closePandentModal = useMemo(() => (): void => setIsPandentRingModalOpen(false), []);
  const publishCartView = useMemo(() => (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      open('cart');
      publish('cart_viewed', {
        cart: cartData,
        prevCart,
        shop,
        url: window.location.href || '',
      } as CartViewPayload);
    });
  }, [open, publish, cartData, prevCart, shop]);

  const { openDrawer } = useDrawer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useMemo(() => () => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useMemo(() => () => {
    setIsModalOpen(false);
  }, []);

  const toggleDropdown = useMemo(() => (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  }, [activeDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => {
    return (
      menu?.items
        ?.map((item: any) => {
          if (!item.url) return null;

          const domain = shopName?.primaryDomain?.url;
          const url = item.url.includes(domain || '')
            ? new URL(item.url).pathname
            : item.url;

          return {
            id: item.id,
            title: item.title,
            url,
            items: item.items,
            resource: item.resource,
          };
        })
        .filter(Boolean) || []
    );
  }, [menu?.items, shopName?.primaryDomain?.url]);

  return (
    <>
      <header className="hidden md:flex w-full bg-transparent absolute top-0 z-10">
        <div className="container max-w-[1350px] mx-auto px-[15px] flex flex-col justify-between items-center">
          <div className="hidden md:flex items-center justify-between w-full py-4">
            <div className="flex items-center">
              <a
                className="flex items-center text-[14px] lg:pr-4 md:pr-2 text-primary outfit font-light"
                href="tel:212-845-8222"
              >
                <img className="pr-2" src={phoneIcon} alt="phone" />
                212-845-8222
              </a>
              <NavLink
                className="flex items-center text-[12px] lg:px-4 md:px-2 text-white outfit font-light uppercase"
                to="/appointmentbooking"
              >
                <img className="pr-2" src={stopWatch} alt="booking" />
              </NavLink>
              {/* <a
                className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light"
                href="mailto:BD@gmail.com"
              > */}
                <button 
                  className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light"
                  onClick={() => setIsOpenAssistanceMemo(true)}
                >
                  <img className="pr-2" src={mailImg} alt="email" />
                </button>
              {/* </a> */}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => openDrawer()}
                className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light"
              >
                <img className="pr-2" src={searchIcon} alt="search" />
                Search
              </button>
              <Suspense fallback={<div>Loading</div>}>
                <Await resolve={isLoggedIn}>
                  {(resolvedIsLoggedIn) =>
                    resolvedIsLoggedIn ? (
                      <NavLink
                        to="/account"
                        className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light"
                      >
                        <img className="pr-2" src={profileIcon} alt="profile" />
                        Profile
                      </NavLink>
                    ) : (
                      <button
                        onClick={handleOpenModal}
                        className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light"
                      >
                        <img className="pr-2" src={profileIcon} alt="profile" />
                        Sign In
                      </button>
                    )
                  }
                </Await>
              </Suspense>
              <NavLink
                className="flex items-center text-[14px] lg:px-4 md:px-2 text-primary outfit font-light relative"
                to="/wishlist"
              >
                <img className="pr-2" src={heartImg} alt="favourite" />
                Favorites
                <WishlistCount />
              </NavLink>
              <button
                className="flex items-center text-[14px] lg:pl-6 md:pl-2 text-primary outfit font-light"
                onClick={publishCartView}
              >
                <div className="relative">
                  <img className="pr-2" src={cartIcon} alt="cart" />
                  <Suspense fallback={<span className="text-xs">...</span>}>
                    <Await resolve={cart}>
                      {(resolvedCart) => (
                        <span className="ml-1 bg-[#09090A] text-white text-xs h-[18px] w-[18px] rounded-full flex items-center justify-center absolute top-[-8px] right-0">
                          {resolvedCart?.totalQuantity ?? 0}
                        </span>
                      )}
                    </Await>
                  </Suspense>
                </div>
                Cart
              </button>
            </div>
          </div>
          <div
            className="hidden md:flex w-full justify-center text-center lg:pt-[35px] md:pt-[22px] lg:pb-2 border-t-[1px] border-solid"
            style={{
              borderImageSource:
                'linear-gradient(to right, rgba(255,255,255,0), #fff, rgba(255,255,255,0))',
              borderImageSlice: 1,
            }}
          >
            <Link to="/" className="cursor-pointer">
              <img
                src={logo}
                alt="Bellodiamonds"
                className="md: max-w-[300px]"
                loading="lazy"
              />
            </Link>
          </div>
          <div
            className="hidden md:flex items-center mt-4 pb-2 w-full justify-center relative"
            ref={dropdownRef}
          >
            {menuItems.map((item: any) => {
              return (
                <div key={item.id} className="group">
                  {item.items?.length > 0 ? (
                    <button
                      className="mx-6 flex space-x-1 cursor-pointer text-[20px] pb-5 text-primary outfit font-normal"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <span className="gradient-bordernew transition-all duration-300">
                        {item.title}
                      </span>
                      <img src={downchev} alt="" />
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      className="mx-6 cursor-pointer text-[20px] flex pb-5 text-primary outfit font-normal"
                    >
                      <span className="gradient-bordernew transition-all duration-300">
                        {item.title}
                      </span>
                    </a>
                  )}
                  {item.items?.length > 0 && (
                    <div
                      className={`
                        absolute top-full left-0 
                        ${activeDropdown === item.id ? 'flex' : 'hidden'}
                        bg-white px-4 pt-4 pb-10 shadow-lg rounded-md 
                        w-full 
                        z-60
                      `}
                    >
                      {item.items.length !== 2 && (
                        <div className="relative w-1/4 flex flex-col justify-start">
                          {item.items.length === 6 ? (
                            <div className="bg-white p-4 rounded-lg h-full flex flex-col">
                              <a
                                href={item.url}
                                className="outfit mb-4"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <h4 className="text-black font-medium mb-3">
                                  {item.title}
                                </h4>
                                <p className="text-black/60 font-light text-[16px] mb-4 leading-[18px]">
                                  💎 From Everyday Icons to Statement Diamonds —
                                  Jewelry for Every Style.
                                </p>
                                <span className="text-[#000000] text-[13px] font-light">
                                  Shop all →
                                </span>
                              </a>
                              <img
                                src={diamondBanner}
                                alt={`${item.title} Banner`}
                                className="w-full h-[220px] object-cover rounded-md"
                                loading="lazy"
                              />
                            </div>
                          ) : item.items.length === 4 ? (
                            <div className="flex flex-col items-center relative">
                              <img
                                src={ringNavBanner}
                                alt={`${item.title} Banner`}
                                className="rounded-[8px]"
                                loading="lazy"
                              />
                              <a
                                href={item.url}
                                className="mt-3 outfit absolute bottom-1 left-0 px-4"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <h4 className="text-black font-medium mb-3">
                                  Rings
                                </h4>
                                <p className="text-black/60 font-light text-[16px] leading-[18px] mb-2">
                                  💎 Expertly designed and hand-finished, our
                                  rings deliver lasting beauty that shines for a
                                  lifetime.
                                </p>
                                <span className="text-[#000000] text-[13px] font-light">
                                  Shop all →
                                </span>
                              </a>
                            </div>
                          ) : item.items.length === 2 ? (
                            <div className="">
                              {/* {item.items.map((sub: any) => {
        const subUrl = sub.url.includes(shopName?.primaryDomain?.url || '')
          ? new URL(sub.url).pathname
          : sub.url;

        return (
          <NavLink
            key={sub.id}
            to={subUrl}
            className="rounded-md overflow-hidden text-primary transition block"
            onClick={() => setActiveDropdown(null)}
          >
            <img
              src={sub?.resource?.image?.url || womenWeddings}
              alt={sub.title}
              className="jk"
              loading="lazy"
            />
            <div className="p-3 text-primary capitalize text-[17px] playfairsb">
              {sub.title}
            </div>
          </NavLink>
        );
      })} */}
                            </div>
                          ) : null}
                        </div>
                      )}

                      <div
                        className={`
                          w-3/4 grid gap-4 pl-4
                          ${item.items.length === 4 ? 'grid-cols-4' : ''}
                          ${item.items.length === 2 ? 'grid-cols-4' : ''}
                          ${item.items.length === 6 ? 'grid-cols-3' : ''}
                        `}
                      >
                        {item.items.map((sub: any) => {
                          const subUrl = sub.url.includes(
                            shopName?.primaryDomain?.url || '',
                          )
                            ? new URL(sub.url).pathname
                            : sub.url;

                          return (
                            <div
                              key={sub.id}
                              className="relative group/item w-full"
                            >
                              <a
                                href={subUrl}
                                className="rounded-md overflow-hidden text-primary transition block"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <img
                                  src={
                                    sub?.resource?.image?.url || womenWeddings
                                  }
                                  alt={item.title}
                                  className="jk"
                                  loading="lazy"
                                />
                                <div className="p-3 text-primary ll hover:text-primary capitalize flex items-center justify-between text-[17px] playfairsb">
                                  {sub.title}
                                  {(sub.title === 'Engagement rings' ||
                                    sub.title === 'Pendants') && (
                                      <ArrowRight size={16} />
                                    )}
                                </div>
                              </a>

                              {(sub.title === 'Engagement rings' ||
                                sub.title === 'Pendants') && (
                                  <div className="hidden group-hover/item:block text-primary rounded-md mt-1 z-60">
                                    <span className="block px-4 py-2 text-[18px] playfairsb">
                                      {sub.title === 'Engagement rings' && (
                                        <ul>
                                          <li
                                            onClick={() => {
                                              openModal();
                                              setActiveDropdown(null);
                                            }}
                                            className="cursor-pointer"
                                          >
                                            Create Your Own Ring
                                          </li>
                                          <li className="cursor-pointer">
                                            <NavLink
                                              to="/collections/pre-set-rings"
                                              onClick={() =>
                                                setActiveDropdown(null)
                                              }
                                            >
                                              Ready-to-Wear
                                            </NavLink>
                                          </li>
                                        </ul>
                                      )}
                                      {sub.title === 'Pendants' && (
                                        <ul>
                                          <li
                                            onClick={() => {
                                              openPandentModal();
                                              setActiveDropdown(null);
                                            }}
                                            className="cursor-pointer"
                                          >
                                            Create Your Own Pendant
                                          </li>
                                        </ul>
                                      )}
                                    </span>
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {isRingModalOpen && <RingBuilder closeModal={closeModal} />}
          {isPandentModalOpen && (
            <RingBuilder closeModal={closePandentModal} pendant={true} />
          )}
        </div>
      </header>
      <div className="sm:block md:hidden w-full bg-transparent absolute top-0 z-10 py-4">
        <div className="container max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="cursor-pointer">
                <img src={mobileLogo} alt="Bellodiamonds" loading="lazy" />
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <NavLink
                className="flex items-center text-xs text-primary outfit font-light"
                to="tel:212-845-8222"
              >
                <img className="pr-2 w-[24px]" src={phoneIcon} alt="cart" />

              </NavLink>
              <a
                href="mailto:bd@gmail.com"
                className="flex items-center text-xs text-primary outfit font-light"
              >
                <img className="pr-2 w-[26px]" src={mailImg} alt="mail" />

              </a>
              <NavLink
                className="flex items-center text-xs text-primary outfit font-light"
                to=""
                onClick={publishCartView}
              >
                <img className="pr-2" src={cartIcon} alt="cart" />
                Cart
              </NavLink>
              <button
                onClick={() => startTransition(() => open('mobile'))}
                className="cursor-pointer"
              >
                <img src={toggleIcon} alt="menu toggle" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileMenuAside 
        header={header} 
        publicStoreDomain={publicStoreDomain} 
        isLoggedIn={isLoggedIn}
        handleOpenModal={handleOpenModal}
      />
      <AssistanceModal
        isOpenAssistance={isOpenAssistance}
        setIsOpenAssistance={setIsOpenAssistanceMemo}
      />
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default memo(HeaderComponent);
