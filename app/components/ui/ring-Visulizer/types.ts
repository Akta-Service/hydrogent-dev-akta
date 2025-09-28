export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  image: {
    altText: string | null
    url: string
  } | null
  displayInTabs: string | null
  defineShapeStyle: string | null
}

export interface Product {
  lwRatio: string
  table: string
  depth: string
  cut: string
  id: string
  handle: string
  title: string
  sku: string
  featuredImage: {
    id: string
    altText: string | null
    url: string
    width: number
    height: number
  } | null
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  variants: Array<{
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    availableForSale: boolean
    image?: { id: string; altText: string | null; url: string; width: number; height: number } | null
    sku?: string
    barcode?: string
  }>
  caratMetafield?: { value?: string }
  videoUrlMetafield?: { value?: string }
  shapeMetafield?: { value?: string }
  diamondColorMetafield?: { value?: string }
  cutMetafield?: { value?: string }
  clarityMetafield?: { value?: string }
  reportMetafield?: { value?: string }
  depthMetafield?: { value?: string }
  polishMetafield?: { value?: string }
  lwRatioMetafield?: { value?: string }
  fluorescenceMetafield?: { value?: string }
  tableMetafield?: { value?: string }
  symmetryMetafield?: { value?: string }
  showOnCollectionMetafield?: { value?: string }
  sizeProductOptionMetafield?: { value?: string }
  certificationMetafield?: { value?: string }
  styleMetafield?: { value?: string }
  sliderEnableMetafield?: { value?: string }
  pinnedMetafield?: { value?: string }
  description?: string
  productType?: string
  vendor?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  onlineStoreUrl?: string
  options?: Array<{ name: string; values: string[] }>
  images?: Array<{
    id: string
    altText: string | null
    url: string
    width: number
    height: number
  }>
  videoUrl?: string
  // Properties directly on Product for comparison, derived from metafields
  diamondColor?: string
  clarity?: string
  shape?: string
  carat?: string
  polish?: string
  fluorescence?: string
  symmetry?: string
  report?: string
  sizeProductOption?: string
  settingType?: string
  bandWidth?: string
  profile?: string
  finish?: string
  weight?: string
}

export interface RingBuilderProps {
  closeModal: () => void
  pendent?: boolean
}

// dimond export interface FilterOption {
export interface FilterOption {
  value: string
  label: string
}

export interface CategoricalFilterData {
  type: "categorical"
  label: string
  selectedOptions: FilterOption[]
  range: [number, number]
  minValue: string
  maxValue: string
  allSelectedValues: string[] // Add this
  allSelectedLabels: string[] // Add this
}

export interface NumericRangeConfig {
  min: number
  max: number
  step: number
  decimals?: number
  suffix?: string
}

export interface NumericFilterData {
  type: "numeric"
  label: string
  range: [number, number]
  minValue: number
  maxValue: number
  config: NumericRangeConfig
}

export interface SelectionState {
  diamond: any | null
  frame: any | null
  frameVariant: any | null
  ringSize: string | null
  product: any | null
  pendant: any | null
  pendantVariant: any | null
  pendantSize: string | null
}
