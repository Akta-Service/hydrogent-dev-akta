import type { LoaderFunctionArgs } from "@shopify/remix-oxygen"
import { json } from "@shopify/remix-oxygen"
import { PRODUCTS_BY_CARAT_QUERY } from "~/queries/product.queries"

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context
  const url = new URL(request.url)
  const caratValue = url.searchParams.get("caratValue")
  const first = Number.parseInt(url.searchParams.get("first") || "8")

  if (!caratValue) {
    return json({ error: "Carat value is required" }, { status: 400 })
  }

  try {
    // Add caching to improve performance
    const result = await storefront.query(PRODUCTS_BY_CARAT_QUERY, {
      variables: {
        caratValue,
        first,
      },
      // Add cache control for better performance
      cache: storefront.CacheShort(),
    })

    return json({
      products: result.products?.nodes || [],
    }, {
      // Add cache headers for better performance
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=300",
      }
    })
  } catch (error) {
    console.error("Error fetching products by carat:", error)
    return json({ error: "Failed to fetch products" }, { status: 500 })
  }
}