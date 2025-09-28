"use client"
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen"
import { useLoaderData, useNavigate, type MetaFunction, useFetcher } from "@remix-run/react"
import type { Product as ShopifyProduct } from "@shopify/hydrogen/storefront-api-types"
import type { Product } from "~/components/ui/ring-Visulizer/types"
import { useState, useEffect } from "react"
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from "@shopify/hydrogen"
import ProductBreadcrumbs from "~/components/product/ProductBreadcrumbs"
import ProductGallery from "~/components/product/ProductGallery"
import ProductInfo from "~/components/product/ProductInfo"
import SimilarProducts from "~/components/product/SimilarProducts"
import ProductsByCaratGrid from "~/components/product/ProductsByCaratGrid"

interface ProductLoaderData {
  product: ShopifyProduct
  similarProducts: ShopifyProduct[]
}

import { PRODUCT_QUERY, SIMILAR_PRODUCTS_QUERY } from "~/queries/product.queries"
import PaymentOptions from "~/components/product/PaymentOptions"
// import { use } from "framer-motion/client"
// import { fetchStorefront } from "~/utils/shopifyClient"

// Declare global window type
declare global {
  interface Window {
    judgeMeLoaded?: boolean;
    jdgm?: any;
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.product.title ?? ""}` },
    {
      rel: "canonical",
      href: `/products/${data?.product.handle}`,
    },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args)
  const criticalData = await loadCriticalData(args)
  return {
    ...deferredData,
    ...criticalData,
  } as ProductLoaderData
}

async function loadCriticalData({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params
  const { storefront } = context

  if (!handle) {
    throw new Error("Expected product handle to be defined")
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
  ])

  if (!product?.id) {
    throw new Response(null, { status: 404 })
  }

  const collectionHandle = product.collections?.nodes[0]?.handle || "rings"

  const similarProductsResult = await storefront.query(SIMILAR_PRODUCTS_QUERY, {
    variables: {
      collectionHandle,
      first: 5,
    },
  })

  const similarProducts = similarProductsResult.collection?.products.nodes
    .filter((p: any) => p.handle !== handle)
    .slice(0, 4)

  return {
    product,
    similarProducts: similarProducts || [],
    skuSearchMatch: null,
  }
}

function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  return {}
}

function JudgeMeScript() {
  useEffect(() => {
    const loadJudgeMeScript = () => {
      window.jdgm = window.jdgm || {};
      window.jdgm.SHOP_DOMAIN = 'azt0aw-u9.myshopify.com';
      window.jdgm.PLATFORM = 'shopify';
      window.jdgm.PUBLIC_TOKEN = 'cjMJ7p22gOY6t_vL0gej7y60PBI';

      if (!document.querySelector('script[src*="widget_preloader.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdnwidget.judge.me/widget_preloader.js';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-cfasync', 'false');
        script.type = 'text/javascript';
        
        script.onload = () => {
          setTimeout(() => {
            if (window.jdgm && window.jdgm.customInitialize) {
              window.jdgm.customInitialize();
            }
          }, 500);
        };
        
        document.head.appendChild(script);
      } else {
        setTimeout(() => {
          if (window.jdgm && window.jdgm.customInitialize) {
            window.jdgm.customInitialize();
          }
        }, 300);
      }
    };

    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        loadJudgeMeScript();
      }
    }, 3000); 

    const handleUserInteraction = () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined') {
        loadJudgeMeScript();
      }
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('scroll', handleUserInteraction, { once: true });
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return null;
}

function JudgeMeStarRating({ productId }: { productId: string }) {
  useEffect(() => {
    const initializeStarRating = () => {
      const existingBadges = document.querySelectorAll('.jdgm-preview-badge');
      existingBadges.forEach(badge => {
        if (badge.innerHTML) {
          badge.innerHTML = '';
        }
      });

      setTimeout(() => {
        if (window.jdgm && window.jdgm.customInitialize) {
          window.jdgm.customInitialize();
        }
        
        if (window.jdgm && window.jdgm.reloadWidgets) {
          window.jdgm.reloadWidgets();
        }
      }, 800);
    };

    initializeStarRating();
  }, [productId]);

  return (
    <div 
      className="jdgm-widget jdgm-preview-badge" 
      data-id={productId}
      style={{ display: 'inline-block', marginLeft: '8px' }}
      key={`star-${productId}`}
    />
  );
}

function JudgeMeReviews({ productId, product }: { productId: string, product: any }) {
  useEffect(() => {
    const initializeReviews = () => {
      const existingReviews = document.querySelectorAll('.jdgm-review-widget');
      existingReviews.forEach(review => {
        if (review.innerHTML) {
          review.innerHTML = '';
        }
      });

      setTimeout(() => {
        if (window.jdgm && window.jdgm.customInitialize) {
          window.jdgm.customInitialize();
        }
        
        if (window.jdgm) {
          if (window.jdgm.reloadWidgets) {
            window.jdgm.reloadWidgets();
          }
          if (window.jdgm.initialize) {
            window.jdgm.initialize();
          }
        }
      }, 1500);
    };

    initializeReviews();
  }, [productId]);

  const getImageUrl = () => {
    if (product?.images?.nodes?.[0]?.url) {
      return product.images.nodes[0].url;
    }
    if (product?.featuredImage?.url) {
      return product.featuredImage.url;
    }
    return 'https://via.placeholder.com/300x300?text=Product+Image';
  };

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/products/${product?.handle || ''}`;
    }
    return `/products/${product?.handle || ''}`;
  };

  return (
    <div className="reviews-section py-8 bg-gray-50">
      <div className="container max-w-[1350px] px-[15px] mx-auto">
        {/* <h3 className="text-2xl font-semibold mb-6 text-primary"></h3> */}
        <div 
          id="judgeme_product_reviews"
          className="jdgm-widget jdgm-review-widget"
          data-id={productId}
          data-name={product?.title || 'Product'}
          data-url={getUrl()}
          data-image-url={getImageUrl()}
          data-from-snippet="false"
          data-product-title={product?.title || 'Product'}
          data-product-handle={product?.handle || ''}
          key={`reviews-${productId}`}
        />
      </div>
    </div>
  );
}

// Reviews Carousel Component - Force refresh on navigation
function JudgeMeCarousel({ productId }: { productId: string }) {
  useEffect(() => {
    const initializeCarousel = () => {
      // Clear existing carousel widgets
      const existingCarousels = document.querySelectorAll('.jdgm-carousel');
      existingCarousels.forEach(carousel => {
        if (carousel.innerHTML) {
          carousel.innerHTML = '';
        }
      });

      // Force Judge.me to reinitialize carousel with longer delay
      setTimeout(() => {
        if (window.jdgm && window.jdgm.customInitialize) {
          window.jdgm.customInitialize();
        }
        
        // Try alternative methods
        if (window.jdgm) {
          if (window.jdgm.reloadWidgets) {
            window.jdgm.reloadWidgets();
          }
          if (window.jdgm.initialize) {
            window.jdgm.initialize();
          }
        }
      }, 2000);
    };

    initializeCarousel();
  }, [productId]);

  return (
    <div className="reviews-carousel py-8">
      <div className="container max-w-[1350px] px-[15px] mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-primary playfairsb text-center">What Our Customers Say</h3>
        <div 
          className="jdgm-carousel-wrapper jdgm-widget jdgm-carousel"
          data-id={productId}
          data-auto-install="false"
          key={`carousel-${productId}`}
        />
      </div>
    </div>
  );
}

export default function ProductComponent() {
  const { product, similarProducts } = useLoaderData<typeof loader>()
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [productsByCarat, setProductsByCarat] = useState<Product[]>([])
  const [skuSearchMatch, setSkuSearchMatch] = useState<{ title: string; imageUrl: string } | undefined>()
  const searchFetcher = useFetcher<any>({ key: 'skuSearch' })
  const navigate = useNavigate()

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant ?? product.variants?.nodes[0],
    getAdjacentAndFirstAvailableVariants(product as any),
  )

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions)

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  })

  // Client-side call to existing /search loader (regular search) with dynamic SKU from er_sku only
  useEffect(() => {
    const dynamicSku = (product as any)?.er_sku?.value
    if (!dynamicSku) return
    searchFetcher.load(`/search?q=${encodeURIComponent(dynamicSku)}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(product as any)?.er_sku?.value])

  useEffect(() => {
    const data = searchFetcher.data as any
    if (!data) return
    // Prefer regular search shape to match homepage loader
    if (data.type === 'regular') {
      const nodes = data.result?.items?.products?.nodes || []
      const preferred = nodes.find((p: any) => Array.isArray(p?.tags) && p.tags.map((t: string) => t.toLowerCase()).includes('matching band')) || nodes[0]
      const title = preferred?.title
      const imageUrl = preferred?.selectedOrFirstAvailableVariant?.image?.url
      if (title || imageUrl) setSkuSearchMatch({ title: title || product.title, imageUrl: imageUrl || '' })
    } else if (data.type === 'predictive') {
      const first = data.result?.items?.products?.[0]
      const title = first?.title
      const imageUrl = first?.selectedOrFirstAvailableVariant?.image?.url
      if (title || imageUrl) setSkuSearchMatch({ title: title || product.title, imageUrl: imageUrl || '' })
    }
  }, [searchFetcher.data, product.title])
  

  const isRingBuilder = product.tags?.includes("Ring Builder")
  const hasRingCarat = Boolean(product.metafield?.value)

  const handleProductsChange = (products: any[]) => {
    const transformedProducts: Product[] = products.map((p: any) => ({
      ...p,
      lwRatio: p.lwRatioMetafield?.value || '',
      table: p.tableMetafield?.value || '',
      depth: p.depthMetafield?.value || '',
      cut: p.cutMetafield?.value || '',
      sku: p.variants?.[0]?.sku || '',
      carat: p.caratMetafield?.value || '',
      diamondColor: p.diamondColorMetafield?.value || '',
      clarity: p.clarityMetafield?.value || '',
      shape: p.shapeMetafield?.value || '',
      polish: p.polishMetafield?.value || '',
      fluorescence: p.fluorescenceMetafield?.value || '',
      symmetry: p.symmetryMetafield?.value || '',
      report: p.reportMetafield?.value || '',
    }));
    setProductsByCarat(transformedProducts);
  };

  // Extract product ID for Judge.me (remove 'gid://shopify/Product/' prefix if present)
  const productIdForJudgeMe = product.id.replace('gid://shopify/Product/', '');

  return (
    <>
      {/* Judge.me Configuration Script */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            window.jdgm = window.jdgm || {};
            window.jdgm.SHOP_DOMAIN = 'azt0aw-u9.myshopify.com';
            window.jdgm.PLATFORM = 'shopify';
            window.jdgm.PUBLIC_TOKEN = 'cjMJ7p22gOY6t_vL0gej7y60PBI';
          `
        }}
      />
      
      {/* Load Judge.me script once */}
      <JudgeMeScript />
      
      <div className="pt-[90px] sm:pt-[100px] md:pt-[235px] bg-white">
        {isRingBuilder ? (
          <div className="productMain">
            <div className="container max-w-[1350px] px-[15px] mx-auto">
              <div className="max-w-[700px] pt-[55px]">
                <h2 className="text-[56px] leading-[65px] playfair font-normal mb-4 text-primary">
                  Design Your Own Engagement Ring
                </h2>
                <p className="text-primary text-[18px] outfit font-normal mb-6">
                  From aquamarine to zircon and everything in between, our gemstone engagement rings feature a brilliant variety of bold colors.
                </p>
              </div>
              <div className="h-[71px] rounded-[8px] p-2 steps bg-[linear-gradient(29.29deg,_#09090A_15.55%,_#535D6E_154.94%)]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[8px] p-2 h-[55px]">
                    <p className="text-[14px] outfit font-light text-primary">Step 1</p>
                    <p className="text-[16px] outfit font-light text-primary">Settings</p>
                  </div>
                  <div className="bg-black rounded-[8px] p-2 h-[55px] shadow-[0px_0px_8px_0px_#FFFFFF66]">
                    <p className="text-[14px] outfit font-light text-primary">Step 1</p>
                    <p className="text-[16px] outfit font-light text-primary">Preview</p>
                  </div>
                </div>
              </div>
              <div className="pb-[20px] pt-4">
                <div className="container max-w-[1350px] px-[15px] mx-auto">
                  <ProductBreadcrumbs product={product} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-transparent">
                  <ProductGallery
                    isRingBuilder={isRingBuilder}
                    product={product}
                    selectedVariant={selectedVariant}
                    thumbsSwiper={thumbsSwiper}
                    setThumbsSwiper={setThumbsSwiper}
                    threeDView="https://inventory.nyc3.cdn.digitaloceanspaces.com/Vision360.html?d=C17143"
                  />
                </div>
                <div className="bg-transparent pb-[50px]">
                  <ProductInfo
                    product={product}
                    selectedVariant={selectedVariant}
                    productOptions={productOptions}
                    hasRingCarat={hasRingCarat}
                    currentProduct={product}
                    onProductsChange={handleProductsChange}
                    navigate={navigate}
                    skuSearchMatch={skuSearchMatch}
                  />
                  
                  {/* Star rating for ring builder products */}
                  <div className="mt-4">
                    <JudgeMeStarRating productId={productIdForJudgeMe} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="pb-[20px] pt-4">
              <div className="container max-w-[1350px] px-[15px] mx-auto">
                <ProductBreadcrumbs product={product} />
              </div>
            </div>
            <div className="productMain">
              <div className="container max-w-[1350px] px-[15px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:h-screen">
                  <div className="md:sticky top-0 md:h-screen bg-transparent">
                    <ProductGallery
                      product={product}
                      selectedVariant={selectedVariant}
                      thumbsSwiper={thumbsSwiper}
                      setThumbsSwiper={setThumbsSwiper}
                    />
                  </div>
                  <div className="md:overflow-y-auto md:h-screen bg-transparent pb-[50px] scrollbar-hide">
                    <ProductInfo
                      product={product}
                      selectedVariant={selectedVariant}
                      productOptions={productOptions}
                      hasRingCarat={hasRingCarat}
                      currentProduct={product}
                      onProductsChange={handleProductsChange}
                      navigate={navigate}
                      skuSearchMatch={skuSearchMatch}
                    />
                    
                    {/* Star rating for regular products */}
                    <div className="mt-4">
                      <JudgeMeStarRating productId={productIdForJudgeMe} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SINGLE Judge.me Product Reviews Section - ONLY INSTANCE */}
        <JudgeMeReviews productId={productIdForJudgeMe} product={product} />

        {/* Judge.me Reviews Carousel - SINGLE INSTANCE */}
        <JudgeMeCarousel productId={productIdForJudgeMe} />

        {/* Similar Products */}
        <div className="similarProducts bg-white py-[45px]">
          <div className="container max-w-[1350px] px-[15px] mx-auto">
            <h4 className="md:text-[24px] text-[18px] playfairsb text-primary pb-6">
              Similar Products
            </h4>
            <SimilarProducts products={similarProducts} />
          </div>
        </div>

        {productsByCarat.length > 0 && (
          <ProductsByCaratGrid
            products={productsByCarat}
            title={`Other ${product.metafield?.value} Carat Rings`}
          />
        )}

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount,
                vendor: product.vendor,
                variantId: selectedVariant?.id,
                variantTitle: selectedVariant?.title,
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </>
  )
}