import { Link } from "@remix-run/react"
import type { Product } from "@shopify/hydrogen/storefront-api-types"

interface ProductBreadcrumbsProps {
  product: Product
}

export default function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <nav className="breadcrum border-b border-[#454545]" aria-label="Breadcrumb">
      <ul className="flex items-center">
        <li className="m-0 text-[14px] outfit font-light text-primary">
          <Link to="/">Home</Link>
        </li>
        {/* <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">/</li> */}
        {/* <li className="m-0 text-[14px] outfit font-light text-primary">
          <Link to="/collections/rings">Catalogue Rings</Link>
        </li> */}
        <li className="mb-0 mx-[5px] text-[14px] outfit font-light text-primary">/</li>
        <li className="m-0 text-[14px] outfit font-light text-primary">{product.title}</li>
      </ul>
    </nav>
  )
}
