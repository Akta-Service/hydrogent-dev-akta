import {
  Suspense,
  useId,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {Await, Link, useNavigate} from '@remix-run/react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';

import { WishlistProvider } from '~/hooks/useWishlist';
import Drawer from './ui/drawer/Drawer';
import HeaderComponent from './ui/headerComponent';
import FooterComponnet from '~/components/ui/footerComponent';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import { SEARCH_ENDPOINT } from '~/helpers/constants';
import {
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import GradientBorderButton from './ui/buttons/GradientBorderButton';

// Define interface for drawer state management for search
interface DrawerState {
  isOpen: boolean;
}

// export async function action({ request, context }: ActionFunctionArgs) {
//   const formData = await request.formData()
//   const email = formData.get("email")?.toString()

//   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return json({ error: "A valid email is required" }, { status: 400 })
//   }
// // @ts-expect-error: KLAVIYO_API_KEY is injected by Oxygen environment
//   const apiKey = context.env.KLAVIYO_API_KEY

//   if (!apiKey) {
//     return json({ error: "Server configuration error" }, { status: 500 })
//   }

//   try {
//     // Step 1: Create a profile in Klaviyo
//     const profileResponse = await fetch("https://a.klaviyo.com/api/profiles/", {
//       method: "POST",
//       headers: {
//         Authorization: `Klaviyo-API-Key ${apiKey}`,
//         "Content-Type": "application/vnd.api+json",
//         Accept: "application/vnd.api+json",
//         revision: "2025-04-15",
//       },
//       body: JSON.stringify({
//         data: {
//           type: "profile",
//           attributes: {
//             email,
//           },
//         },
//       }),
//     })

//     if (!profileResponse.ok) {
//       const errorText = await profileResponse.text()
//       return json({ error: `Failed to create profile: ${errorText}` }, { status: profileResponse.status })
//     }

//     // Return success response
//     return json({
//       success: "Thank you for entering the giveaway!",
//       data: { email },
//     })
//   } catch (err) {
//     console.error("Klaviyo fetch exception:", err)
//     return json({ error: "Unexpected error occurred" }, { status: 500 })
//   }
// }

const searchMenu = [
  {
    key: "Rings",
    options: [
      {
        label: "Engagement Rings",
        link: "/collections/engagement-ring",
      },
      {
        label: "Women Wedding Bands",
        link: "/collections/women-wedding-bands",
      },
      {
        label: "Men Wedding Bands",
        link: "/collections/men-wedding-bands",
      },
      {
        label: "Eternity Bands and More",
        link: "/collections/eternity-bands-more",
      },
    ],
  },
  {
    key: "Jewelry",
    options: [
      {
        label: "Earrings",
        link: "/collections/earring",
      },
      {
        label: "Pendants",
        link: "/collections/pendants",
      },
      {
        label: "Necklace",
        link: "/collections/necklace",
      },
      {
        label: "Bracelets",
        link: "/collections/bracelet-1",
      },
      {
        label: "Men's Jewelry",
        link: "/collections/mens-jewelry-1",
      },
      {
        label: "Eternity Rings and More",
        link: "/collections/eternity-rings-and-more",
      },
    ],
  },
];


const DrawerContext = createContext<{
  openDrawer: () => void;
  closeDrawer: () => void;
  drawerState: DrawerState;
} | null>(null);

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: boolean;
  publicStoreDomain: string;
  children?: React.ReactNode;
  shop?: any;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  shop,
}: PageLayoutProps) {
  const [drawerState, setDrawerState] = useState<DrawerState>({isOpen: false});

  const openDrawer = () => {
    setDrawerState({isOpen: true});
  };

  const closeDrawer = () => {
    setDrawerState({isOpen: false});
  };

  return (
    <WishlistProvider>
      <DrawerContext.Provider value={{openDrawer, closeDrawer, drawerState}}>
        <Aside.Provider>
          <CartAside cart={cart} />
          <MobileMenuAside
            header={header}
            publicStoreDomain={publicStoreDomain}
          />

          {header && (
            <div className="">
              {/* <Header
            header={header}
            cart={cart}
            isLoggedIn={isLoggedIn}
            publicStoreDomain={publicStoreDomain}
          /> */}
              <HeaderComponent
                header={header}
                cart={cart}
                isLoggedIn={isLoggedIn}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
          )}
          <div className="">{children}</div>
          <FooterComponnet
            footer={footer}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
          <Drawer
            isOpen={drawerState.isOpen}
            onClose={closeDrawer}
            direction="top"
            className="w-full h-full"
          >
            <SearchDrawer />
          </Drawer>
        </Aside.Provider>
      </DrawerContext.Provider>
    </WishlistProvider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain layout="page" cart={cart} />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchDrawer() {
  const queriesDatalistId = useId();
  const navigate = useNavigate();

  const {closeDrawer} = useDrawer();
  const [searchValue, setSearchValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    setIsClient(true);
    
    // Move body style modification to effect to prevent SSR issues
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const excludeTags = ['Frames', 'Pendant Frames'];

const handleSearchValue = (value: string) => {
  const termQuery = `${value} ${excludeTags.map(tag => `NOT tag:"${tag}"`).join(' ')}`;
  return termQuery;
};

  // Don't render anything until we're on the client to prevent hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <div className="md:mx-0 max-w-[100%] bg-white bg-opacity-50  flex justify-center h-screen w-full ">
      <div className=" w-full">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="w-full flex justify-between items-end md:max-w-[1440px] mx-auto px-[19px] md:px-[25px] py-6 border-b border-[#454545]">
              <div className="w-full">
                <label htmlFor="search" className="mb-2 flex outfit text-[16px]">
                  WHAT ARE YOU LOOKING FOR?
                </label>
                <input
                  id="search"
                  name="q"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);

                    // Update the event's target value to include NOT tags
                    const modifiedEvent = {
                      ...e,
                      target: { ...e.target, value: handleSearchValue(value) }
                    };
                    fetchResults(modifiedEvent);
                  }}
                  onFocus={fetchResults}
                  placeholder="Search Products here..."
                  ref={inputRef}
                  type="search"
                  // list={queriesDatalistId}
                  className="bg-[2px_8px] h-[52px] focus:outline-none rounded-sm border border-[#d1d1d1] text-primary w-full text-[16px] outfit font-light bg-[url(/searchpop.svg)] bg-no-repeat pl-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      e.preventDefault();
                      closeDrawer();
                      navigate(
                        `${SEARCH_ENDPOINT}?q=${encodeURIComponent(searchValue.trim())}`,
                      );
                    }
                  }}
                />
              </div>
              <button
                className="ml-3 px-4 py-3 text-white h-[52px] outfit font-normal text-[14px] bg-[#09090a] rounded"
                onClick={() => {
                  if (searchValue.trim()) {
                    closeDrawer();
                    navigate(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(handleSearchValue(searchValue.trim()))}`);
                  }
                }}
              >
                Search
              </button>
              <button
                className="text-black cursor-pointer p-1 absolute top-1 right-2"
                onClick={() => closeDrawer()}
              >
                ✖
              </button>{' '}
            </div>
          )}
        </SearchFormPredictive>

        <div className="overflow-y-auto md:max-w-[1320px] md:px-[20px] mx-auto h-[600px] pt-4 custom-scroll">
          <div className="grid grid-cols-[20%_80%] gap-4">
            <div className="flex flex-col outfit space-y-2">
              <h6 className="playfairsb text-[24px] mb-4">Navigate to</h6>

              {searchMenu.map((section) => (
                <>
                  <p className="playfairsb text-[20px] text-primary underline">{section.key}</p>
                  {section.options.map((opt) => (
                    <Link key={opt.link} to={opt.link} onClick={closeDrawer}>
                      <p>{opt.label}</p>
                    </Link>
                  ))}
                </>
              ))}             
            </div>
            <SearchResultsPredictive>
              {({items, total, term, state, closeSearch}) => {
                const {articles, collections, pages, products, queries} = items;

                if (state === 'loading' && term.current) {
                  return <div className="text-primary outline mt-5">Loading...</div>;
                }

                if (!total) {
                  return <SearchResultsPredictive.Empty term={term} />;
                }
                const handleResultClick = () => {
                  closeSearch();
                  closeDrawer();
                };
                return total > 0 ? (
                  <>
                    <div className="px-[19px] md:px-0 flex flex-col">
                      <div>
                        <span className="text-primary text-[18px] capitalize playfairsb">
                          Search
                        </span>
                        <span className="text-primary pl-2 text-[18px] playfairsb">
                          Results
                        </span>
                      </div>

                      {/* <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  /> */}
                      <SearchResultsPredictive.Products
                        products={products}
                        closeSearch={handleResultClick}
                        term={term}
                      />
                      {/* <SearchResultsPredictive.Collections
                        collections={collections}
                        closeSearch={handleResultClick}
                        term={term}
                      /> */}
                      {/*  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={handleResultClick}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={handleResultClick}
                    term={term}
                  /> */}

                      {term.current && total ? (
                        // <Link
                        //   onClick={() => {
                        //     closeSearch();
                        //     closeDrawer();
                        //   }}
                        //   to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                        //   className='mt-auto'
                        // >
                        //   <p className="text-primary ">
                        //     View all results for <q>{term.current}</q>→
                        //   </p>
                        // </Link>
                        <GradientBorderButton
                          as="link"
                          to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                          onClick={() => {
                            closeSearch();
                            closeDrawer();
                          }}
                          className="md:mt-auto mt-[20px] w-fit mx-auto mb-[10px] px-[15px] py-[5px]"
                        >
                          View all results for <q>{term.current}</q> →
                        </GradientBorderButton>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <></>
                );
              }}
            </SearchResultsPredictive>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
