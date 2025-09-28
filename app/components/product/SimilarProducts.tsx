import { Link } from "@remix-run/react"
import type { Product } from "@shopify/hydrogen/storefront-api-types"
import { ProductPrice } from "~/components/ProductPrice"

interface SimilarProductsProps {
  products: Product[]
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} to={`/products/${product.handle}`} className="group">
          <div className="relative overflow-hidden rounded-sm border flex items-center h-[318px] gg border-[#d1d1d1]">
            <img
              src={product.images?.edges[0]?.node.url || "/placeholder.png"}
              alt={product.images?.edges[0]?.node.altText || product.title}
              className="w-full bb"
            />
          </div>
          <h5 className="mt-2 text-[16px] playfairsb text-primary">{product.title}</h5>
          <div className="text-[14px] outfit font-light text-[#09090a]">
            <ProductPrice
              price={product.selectedOrFirstAvailableVariant?.price}
              compareAtPrice={product.selectedOrFirstAvailableVariant?.compareAtPrice}
            />
          </div>
        </Link> 
      ))}
    </div>
  )
}
