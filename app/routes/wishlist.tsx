import React from 'react'
import { Link } from '@remix-run/react';
import { useWishlist } from '~/hooks/useWishlist';
import WishlistItem from '~/components/WishlistItem';
import BasicCard from '~/components/ui/cards/basicCard';
import ringsImg from '~/assets/images/demo/rings.png';

const Wishlist = () => {
    const { state, loadWishlist } = useWishlist();
    const { items, loading, error, isInitialized } = state;

    const handleRefresh = () => {
        loadWishlist();
    };

    if (!isInitialized && loading) {
        return (
            <div className='About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white min-h-screen'>
                <div className="container max-w-[1350px] mx-auto px-[15px]">
                    <h4 className='text-[24px] playfairsb font-medium text-primary mb-8'>Wishlist</h4>
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 outfit">Loading your wishlist...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className='About pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white'>
                <div className="container max-w-[1350px] mx-auto px-[15px]">

                </div>
            </div>
            <div className='w-full bg-white'>
                <div className="container max-w-[1350px] mx-auto px-[15px]">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className='text-[24px] playfairsb font-medium text-primary'>
                            Wishlist {items.length > 0 && `(${items.length} item${items.length !== 1 ? 's' : ''})`}
                        </h4>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex outfit items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 outfit text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg
                                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-700 font-medium outfit">Error loading wishlist</p>
                            </div>
                            <p className="text-red-600 mt-1 outfit text-sm">{error}</p>
                        </div>
                    )}

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {items.map((item) => (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    showRemoveButton={true}
                                />
                            ))}
                        </div>
                    ) : (
                        
                        <div className="bg-[url('/bello-transparent.png')] bg-no-repeat bg-center md:bg-auto bg-[length:50%_50%] md:py-16 py-12 px-4 text-center mb-12 rounded-lg">
                            <div className="max-w-lg mx-auto">
                                <div className="mb-6">
                                    <svg className="w-16 h-16 mx-auto text-primary/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h4 className='text-primary mb-4 playfairsb md:text-[24px] text-[18px]'>Your wishlist is empty</h4>
                                <p className='md:text-[16px] text-[13px] outfit font-light text-primary max-w-[594px] w-full mx-auto mb-8'>
                                    Start adding your favorite items to your wishlist. Browse our collections and click the heart icon on products you love.
                                </p>
                                <div className='text-primary w-full outfit font-semibold mx-auto text-[15px] md:text-[16px] uppercase flex md:flex-row flex-col items-center justify-center md:space-x-4 space-y-2 md:space-y-0'>
                                    <Link to="/collections/all" className=' w-full text-center block border border-[#09090a] bg-transparent py-[12px] px-6 text-primary hover:bg-primary hover:text-white transition-colors duration-300'>
                                        <span>Browse Collections</span>
                                    </Link>
                                    <Link to="/" className=' w-full text-center block border border-[#09090a]  bg-transparent py-[12px] px-6 text-primary hover:bg-primary hover:text-white transition-colors duration-300'>
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className='py-8 wishlistitems'>
                        <h4 className='text-primary mb-4 text-center playfairsb md:text-[24px] text-[18px]'>You May Also Like</h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <BasicCard
                                    key={index}
                                    media={{
                                        edges: [
                                            {
                                                node: {
                                                    __typename: 'MediaImage',
                                                    id: `${index}`,
                                                    mediaContentType: 'IMAGE',
                                                    image: {
                                                        url: ringsImg,
                                                        altText: 'Engagement Rings'
                                                    }
                                                }
                                            }
                                        ]
                                    }}
                                    title='Engagement Rings'
                                    price="$1,000"
                                    handle="engagement-rings"
                                />
                            ))}
                        </div>
                    </div> */}
                </div>

            </div>

        </>
    )
}

export default Wishlist;
