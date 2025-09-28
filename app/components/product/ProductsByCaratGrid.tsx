import type { Product } from "~/components/ui/ring-Visulizer/types"
import { Link } from "@remix-run/react"

interface ProductsByCaratGridProps {
  products: Product[]
  title?: string
}

export default function ProductsByCaratGrid({
  products,
  title = "Products with Same Carat",
}: ProductsByCaratGridProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="products-by-carat-grid bg-[#09090A] py-8">
      <div className="container max-w-[1350px] px-[15px] mx-auto">
        <h4 className="md:text-[24px] text-[18px] playfairsb text-white pb-6">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.handle}`} className="group block">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                {product.images?.[0] && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0].url || "/placeholder.svg"}
                      alt={product.images[0].altText || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h5 className="text-white font-medium text-sm mb-2 line-clamp-2">{product.title}</h5>
                  {product.priceRange?.minVariantPrice && (
                    <p className="text-gray-300 text-sm">${product.priceRange.minVariantPrice.amount}</p>
                  )}
                  {product.caratMetafield?.value && (
                    <p className="text-gray-400 text-xs mt-1">{product.caratMetafield.value} Carat</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
