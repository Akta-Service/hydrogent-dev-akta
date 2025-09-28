/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchStorefront } from "~/utils/shopifyClient"
import { debounce } from "lodash"
import { GET_PRODUCTS_BY_TAG, GET_PRODUCTS_BY_COLLECTION } from "./productFilteringQueries"

interface FilterParams {
  selectedShape: string | null
  selectedStyle: string | null
  selectedColor: string[] | string | null
  selectedClarity: string | null
  allFiltersData: Record<string, CategoricalFilterData | NumericFilterData>
  isFrameFlow: boolean | undefined
  selectedFrameVariant: any
  selectedFrame: any
  selectedDiamond: any
  shouldFetchProducts?: boolean
  isPendants: boolean
}

interface CategoricalFilterData {
  type: "categorical"
  label: string
  selectedOptions: { value: string; label: string }[]
  range: [number, number]
  minValue: string
  maxValue: string
  allSelectedValues: string[]
  allSelectedLabels: string[]
}

interface NumericFilterData {
  type: "numeric"
  label: string
  range: [number, number]
  minValue: number
  maxValue: number
  config: {
    min: number
    max: number
    step: number
    decimals?: number
    suffix?: string
  }
}

interface FetchProductsResult {
  products: any[]
  pageInfo: {
    hasPreviousPage: boolean
    hasNextPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
}

const PRODUCTS_PER_PAGE = 250
const API_CALL_DELAY = 500

const metafieldKeyMap: Record<string, string> = {
  Carat: "carat",
  Color: "diamondColor",
  Cut: "cut",
  Clarity: "clarity",
  "Depth %": "depth",
  Polish: "polish",
  "LW Ratio": "lwRatio",
  Fluorescence: "fluorescence",
  "Table %": "table",
  Symmetry: "symmetry",
  Report: "report",
  Certification: "certification",
  Style: "style",
}

const diamondSpecificFilterLabels = [
  "Carat",
  "Cut",
  "Color",
  "Clarity",
  "Depth %",
  "Polish",
  "LW Ratio",
  "Fluorescence",
  "Table %",
  "Symmetry",
  "Report",
  "Certification",
  "Price",
]

const frameSpecificFilterLabels = ["Metal Color", "Style", "Price"]

/**
 * Maps raw product edge data from GraphQL response to standardized product objects
 * @param productsData - Array of product edges from GraphQL response
 * @returns Array of mapped product objects with standardized structure
 */
const mapProductsData = (productsData: any[]): any[] => {
  return productsData?.map((edge: any) => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    featuredImage: edge.node.featuredImage,
    priceRange: edge.node.priceRange,
    carat: edge.node.caratMetafield?.value || null,
    videoUrl: edge.node.videoUrlMetafield?.value || null,
    shape: edge.node.shapeMetafield?.value || null,
    diamondColor: edge.node.diamondColorMetafield?.value || null,
    cut: edge.node.cutMetafield?.value || null,
    clarity: edge.node.clarityMetafield?.value || null,
    depth: edge.node.depthMetafield?.value || null,
    polish: edge.node.polishMetafield?.value || null,
    lwRatio: edge.node.lwRatioMetafield?.value || null,
    fluorescence: edge.node.fluorescenceMetafield?.value || null,
    report: edge.node.reportMetafield?.value || null,
    table: edge.node.tableMetafield?.value || null,
    symmetry: edge.node.symmetryMetafield?.value || null,
    showOnCollection: edge.node.showOnCollectionMetafield?.value || null,
    sizeProductOption: edge.node.sizeProductOptionMetafield?.value || null,
    certification: edge.node.certificationMetafield?.value || null,
    style: edge.node.styleMetafield?.value || null,
    sliderEnable: edge.node.sliderEnableMetafield?.value || null,
    pinned: edge.node.pinnedMetafield?.value || null,
    description: edge.node.description,
    productType: edge.node.productType,
    vendor: edge.node.vendor,
    tags: edge.node.tags,
    createdAt: edge.node.createdAt,
    updatedAt: edge.node.updatedAt,
    publishedAt: edge.node.publishedAt,
    onlineStoreUrl: edge.node.onlineStoreUrl,
    images: edge.node.images?.edges.map((imgEdge: any) => ({
      id: imgEdge.node.id,
      altText: imgEdge.node.altText,
      url: imgEdge.node.url,
      width: imgEdge.node.width,
      height: imgEdge.node.height,
    })) || [],
    variants: edge.node.variants.edges.map((variantEdge: any) => ({
      ...variantEdge.node,
      options: variantEdge.node.selectedOptions.reduce((acc: any, option: any) => {
        acc[option.name] = option.value
        return acc
      }, {}),
    })) || [],
    options: edge.node.options?.map((option: any) => ({
      name: option.name,
      optionValues: option.optionValues?.map((optionValue: any) => ({
        name: optionValue.name,
        firstSelectableVariant: optionValue.firstSelectableVariant
          ? {
              id: optionValue.firstSelectableVariant.id,
              title: optionValue.firstSelectableVariant.title,
              sku: optionValue.firstSelectableVariant.sku,
              price: optionValue.firstSelectableVariant.price,
              availableForSale: optionValue.firstSelectableVariant.availableForSale,
              selectedOptions: optionValue.firstSelectableVariant.selectedOptions,
              image: optionValue.firstSelectableVariant.image,
            }
          : null,
        swatch: optionValue.swatch
          ? {
              color: optionValue.swatch.color,
              image: optionValue.swatch.image ? { url: optionValue.swatch.image.previewImage?.url } : null,
            }
          : null,
      })) || [],
    })) || [],
  })) || []
}

export const useProductFiltering = ({
  selectedShape,
  selectedStyle,
  selectedColor,
  selectedClarity,
  allFiltersData,
  isFrameFlow,
  selectedDiamond,
  selectedFrame,
  selectedFrameVariant,
  isPendants,
  shouldFetchProducts = true
}: FilterParams) => {
  const [products, setProducts] = useState<any[]>([])
  const [apiFetchedProducts, setApiFetchedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0, isComplete: false })
  const [error, setError] = useState<string | null>(null)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  const priceFilter =
    allFiltersData["Price"]?.type === "numeric" ? (allFiltersData["Price"] as NumericFilterData) : null
  const priceMin = priceFilter?.minValue ?? null
  const priceMax = priceFilter?.maxValue ?? null
  
  const fetchFrameProducts = useCallback(
  async (cursor: string | null = null, signal?: AbortSignal): Promise<FetchProductsResult> => {
    const filters: any[] = []
    let collectionHandle = ""

    // Handle logic based on conditions
    if (isPendants) {
      collectionHandle = "pendant-frames"
    } else if (!selectedStyle && !selectedShape) {
      collectionHandle = "only-frames"
    } else {
      collectionHandle = selectedStyle || ""
    }

    // Price filter
    if (priceMin !== null && priceMax !== null) {
      filters.push({
        price: {
          min: priceMin,
          max: priceMax,
        },
      })
    }

    // Variant filters
    const variantFilters: {
      variantOption: {
        name: string
        value: string
      }
    }[] = []

    if (selectedColor) {
      const colorsArray = Array.isArray(selectedColor) ? selectedColor : [selectedColor]
      colorsArray.forEach((handle) => {
        let formattedValue

        if (handle.includes("-")) {
          const parts = handle.split("-")
          formattedValue = `${parts[0].toUpperCase()} ${capitalize(parts[1])}`
        } else {
          formattedValue = capitalize(handle)
        }

        variantFilters.push({
          variantOption: {
            name: "Metal Color",
            value: formattedValue,
          },
        })
      })

      function capitalize(str: any) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    }

    if (variantFilters.length > 0) {
      filters.push(...variantFilters)
    }

    const queryVariables = {
      handle: collectionHandle,
      filters,
      first: PRODUCTS_PER_PAGE,
      after: cursor,
    }

    const query = GET_PRODUCTS_BY_COLLECTION

    try {
      const data = await fetchStorefront(query, queryVariables, signal)

      if (data.errors) {
        console.warn("Query errors:", data.errors)
        setError("Error fetching frame products from Shopify.")
        return {
          products: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }
      }

      const productsData = data.collection?.products?.edges || []
      const fetchedProducts = mapProductsData(productsData)

      const pageInfo = data.collection?.products?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      }

      return { products: fetchedProducts, pageInfo }

    } catch (err) {
      console.error("Frame fetch error:", err)
      setError("An error occurred while fetching frame products. Please try again.")
      return {
        products: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      }
    }
  },
  [selectedStyle, selectedShape, priceMin, priceMax, selectedColor, isPendants]
)

  const fetchDiamondProducts = useCallback(
  async (cursor: string | null = null, signal?: AbortSignal): Promise<FetchProductsResult> => {
    const filters: any[] = []
    let collectionHandle = ""

    // Determine collection handle (no tags anymore)
    if (!selectedShape && !selectedStyle) {
      if (isPendants) {
        collectionHandle = "pendant-frames"
      } else if (!selectedDiamond) {
        collectionHandle = "only-diamonds"
      } else {
        collectionHandle = "only-frames"
      }
    } else {
      collectionHandle = selectedShape || ""
    }

    // Price filter
    if (priceMin !== null && priceMax !== null) {
      filters.push({
        price: {
          min: priceMin,
          max: priceMax,
        },
      })
    }

    // Clarity metafield filter
    if (selectedClarity) {
      filters.push({
        productMetafields: {
          namespace: "custom",
          key: "clarity",
          value: selectedClarity,
          condition: "EQ",
        },
      })
    }

    // Always use GET_PRODUCTS_BY_COLLECTION
    const queryVariables = {
      handle: collectionHandle,
      filters,
      first: PRODUCTS_PER_PAGE,
      after: cursor,
    }

    const query = GET_PRODUCTS_BY_COLLECTION

    try {
      const data = await fetchStorefront(query, queryVariables, signal)

      if (data.errors) {
        console.warn("Query errors:", data.errors)
        setError("Error fetching diamond products from Shopify.")
        return {
          products: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        }
      }

      const productsData = data.collection?.products?.edges || []

      const fetchedProducts = productsData.map((edge: any) => ({
        id: edge.node.id,
        handle: edge.node.handle,
        title: edge.node.title,
        featuredImage: edge.node.featuredImage,
        priceRange: edge.node.priceRange,
        carat: edge.node.caratMetafield?.value || null,
        videoUrl: edge.node.videoUrlMetafield?.value || null,
        shape: edge.node.shapeMetafield?.value || null,
        diamondColor: edge.node.diamondColorMetafield?.value || null,
        cut: edge.node.cutMetafield?.value || null,
        clarity: edge.node.clarityMetafield?.value || null,
        depth: edge.node.depthMetafield?.value || null,
        polish: edge.node.polishMetafield?.value || null,
        lwRatio: edge.node.lwRatioMetafield?.value || null,
        fluorescence: edge.node.fluorescenceMetafield?.value || null,
        report: edge.node.reportMetafield?.value || null,
        table: edge.node.tableMetafield?.value || null,
        symmetry: edge.node.symmetryMetafield?.value || null,
        showOnCollection: edge.node.showOnCollectionMetafield?.value || null,
        sizeProductOption: edge.node.sizeProductOptionMetafield?.value || null,
        certification: edge.node.certificationMetafield?.value || null,
        style: edge.node.styleMetafield?.value || null,
        sliderEnable: edge.node.sliderEnableMetafield?.value || null,
        pinned: edge.node.pinnedMetafield?.value || null,
        description: edge.node.description,
        productType: edge.node.productType,
        vendor: edge.node.vendor,
        tags: edge.node.tags,
        createdAt: edge.node.createdAt,
        updatedAt: edge.node.updatedAt,
        publishedAt: edge.node.publishedAt,
        onlineStoreUrl: edge.node.onlineStoreUrl,
        images: edge.node.images?.edges.map((imgEdge: any) => ({
          id: imgEdge.node.id,
          altText: imgEdge.node.altText,
          url: imgEdge.node.url,
          width: imgEdge.node.width,
          height: imgEdge.node.height,
        })) || [],
        variants: edge.node.variants.edges.map((variantEdge: any) => ({
          ...variantEdge.node,
          options: variantEdge.node.selectedOptions.reduce((acc: any, option: any) => {
            acc[option.name] = option.value
            return acc
          }, {}),
        })) || [],
        options: edge.node.options?.map((option: any) => ({
          name: option.name,
          optionValues: option.optionValues?.map((optionValue: any) => ({
            name: optionValue.name,
            firstSelectableVariant: optionValue.firstSelectableVariant
              ? {
                  id: optionValue.firstSelectableVariant.id,
                  title: optionValue.firstSelectableVariant.title,
                  sku: optionValue.firstSelectableVariant.sku,
                  price: optionValue.firstSelectableVariant.price,
                  availableForSale: optionValue.firstSelectableVariant.availableForSale,
                  selectedOptions: optionValue.firstSelectableVariant.selectedOptions,
                  image: optionValue.firstSelectableVariant.image,
                }
              : null,
            swatch: optionValue.swatch
              ? {
                  color: optionValue.swatch.color,
                  image: optionValue.swatch.image ? { url: optionValue.swatch.image.previewImage?.url } : null,
                }
              : null,
          })) || [],
        })) || [],
      })) || []

      const pageInfo = data.collection?.products?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      }

      return { products: fetchedProducts, pageInfo }

    } catch (err) {
      console.error("Diamond fetch error:", err)
      setError("An error occurred while fetching diamond products. Please try again.")
      return {
        products: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      }
    }
  },
  [selectedShape, selectedStyle, selectedDiamond, priceMin, priceMax, selectedClarity, isPendants],
)


  const applyClientSideFilters = useCallback(
    (productsToFilter: any[]) => {
      let tempProducts = productsToFilter

      if (isFrameFlow) {
        Object.entries(allFiltersData).forEach(([label, filterData]) => {
          if (label === "Price ") return
          if (!frameSpecificFilterLabels.includes(label)) return

          const metafieldKey = metafieldKeyMap[label]
          if (!metafieldKey) return

          if (filterData.type === "numeric") {
            const numericFilter = filterData as NumericFilterData
            tempProducts = tempProducts.filter((product) => {
              const productValue = Number.parseFloat(product[metafieldKey])
              return (
                !isNaN(productValue) && productValue >= numericFilter.minValue && productValue <= numericFilter.maxValue
              )
            })
          } else if (filterData.type === "categorical") {
            const categoricalFilter = filterData as CategoricalFilterData
            if (categoricalFilter.allSelectedValues.length > 0) {
              tempProducts = tempProducts.filter((product) => {
                const productValue = product[metafieldKey]
                if (productValue === null || productValue === undefined) return false
                let parsedProductValue: string | string[] = productValue
                try {
                  if (typeof productValue === "string" && productValue.startsWith("[") && productValue.endsWith("]")) {
                    const parsed = JSON.parse(productValue)
                    if (Array.isArray(parsed)) {
                      parsedProductValue = parsed as string[]
                    }
                  }
                } catch (e: any) {
                  console.warn(`Failed to parse product metafield ${metafieldKey}: ${productValue}`, e)
                }
                if (Array.isArray(parsedProductValue)) {
                  return categoricalFilter.allSelectedValues.some((selectedValue) =>
                    parsedProductValue.includes(selectedValue),
                  )
                } else {
                  return categoricalFilter.allSelectedValues.includes(parsedProductValue)
                }
              })
            }
          }
        })
      } else {
        if (selectedClarity) {
          tempProducts = tempProducts.filter((product) => product.clarity === selectedClarity)
        }
        Object.entries(allFiltersData).forEach(([label, filterData]) => {
          if (label === "Price ") return
          if (!diamondSpecificFilterLabels.includes(label)) return
          const metafieldKey = metafieldKeyMap[label]
          if (!metafieldKey) return

          if (filterData.type === "numeric") {
            const numericFilter = filterData as NumericFilterData
            tempProducts = tempProducts.filter((product) => {
              const productValue = Number.parseFloat(product[metafieldKey])
              return (
                !isNaN(productValue) && productValue >= numericFilter.minValue && productValue <= numericFilter.maxValue
              )
            })
          } else if (filterData.type === "categorical") {
            const categoricalFilter = filterData as CategoricalFilterData
            if (categoricalFilter.allSelectedValues.length > 0) {
              tempProducts = tempProducts.filter((product) => {
                const productValue = product[metafieldKey]
                if (productValue === null || productValue === undefined) return false
                let parsedProductValue: string | string[] = productValue
                try {
                  if (typeof productValue === "string" && productValue.startsWith("[") && productValue.endsWith("]")) {
                    const parsed = JSON.parse(productValue)
                    if (Array.isArray(parsed)) {
                      parsedProductValue = parsed as string[]
                    }
                  }
                } catch (e: any) {
                  console.warn(`Failed to parse product metafield ${metafieldKey}: ${productValue}`, e)
                }
                if (Array.isArray(parsedProductValue)) {
                  return categoricalFilter.allSelectedValues.some((selectedValue) =>
                    parsedProductValue.includes(selectedValue),
                  )
                } else {
                  return categoricalFilter.allSelectedValues.includes(parsedProductValue)
                }
              })
            }
          }
        })
      }
      return tempProducts
    },
    [allFiltersData, isFrameFlow, selectedClarity],
  )

 useEffect(() => {
  if (isFrameFlow === undefined || !shouldFetchProducts) return;

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchProductsFromApi = async () => {
    setIsLoading(true);
    setError(null);
    setApiFetchedProducts([]);
    setProducts([]);
    setLoadingProgress({ current: 0, total: 0, isComplete: false });

    let allFetchedProducts: any[] = [];
    let currentCursor: string | null = null;
    let hasMore = true;
    let pageCount = 0;

    try {
      const fetchFunction = isFrameFlow ? fetchFrameProducts : fetchDiamondProducts;

      while (hasMore) {
        const { products: fetchedPage, pageInfo } = await fetchFunction(currentCursor, signal); // 👈 pass signal

        allFetchedProducts = [...allFetchedProducts, ...fetchedPage];
        pageCount++;

        setApiFetchedProducts([...allFetchedProducts]);

        setLoadingProgress((prev) => ({
          ...prev,
          current: pageCount,
          total: pageInfo.hasNextPage ? pageCount + 1 : pageCount,
        }));

        hasMore = pageInfo.hasNextPage;
        currentCursor = pageInfo.endCursor;

        if (hasMore) {
          await delay(API_CALL_DELAY);
        }
      }

      setLoadingProgress((prev) => ({
        ...prev,
        isComplete: true,
        total: pageCount,
      }));
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; 
      }

      console.error('Error fetching products:', err);
      setError('Failed to load products from API.');
      setApiFetchedProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchProductsFromApi, 300);
  debouncedFetch();

  return () => {
    debouncedFetch.cancel();
    controller.abort(); // Cancel previous request
  };
}, [
  selectedShape,
  selectedStyle,
  isFrameFlow,
  priceMin,
  priceMax,
  selectedColor,
  selectedDiamond,
  selectedClarity,
  fetchFrameProducts,
  fetchDiamondProducts,
  shouldFetchProducts,
]);


  useEffect(() => {
    if (apiFetchedProducts.length > 0) {
      const filtered = applyClientSideFilters(apiFetchedProducts)
      setProducts(filtered)
    } else if (!isLoading) {
      setProducts([])
    }
  }, [apiFetchedProducts, selectedClarity, allFiltersData, applyClientSideFilters, isLoading])

  return {
    products,
    isLoading,
    loadingProgress,
    error,
    setError,
  }
}