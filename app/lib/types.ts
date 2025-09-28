// Reusable Metafield type for consistency
interface Metafield {
  value: string | null;
}

// Media types
export interface Media {
  __typename: string;
  id: string;
  mediaContentType: string;
  alt?: string | null;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
}

// Product types
export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  media: {
    edges: Array<{
      node: Media;
    }> | null;
  };
}

export interface ProductEdge {
  node: Product;
}

// Collection types
export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
  products: {
    edges: Array<ProductEdge>;
  };
  displayInTabs?: Metafield | null;
  defineShapeStyle?: Metafield | null; 
}

export interface CollectionEdge {
  node: Collection;
}

// Blog types
export interface Blog {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
  publishedAt: string;
  metafield?: Metafield | null; // Align with Metafield type
}

export interface BlogEdge {
  node: Blog;
}

// Query response types
export interface CollectionsData {
  collections: {
    edges: Array<CollectionEdge>;
  };
}

export interface BlogsData {
  blogs: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        articles: {
          edges: Array<BlogEdge>;
        };
      };
    }> | null;
  };
}

export interface FreshFineCollectionData {
  collection: Collection | null;
}

declare global {
  interface Window {
    fbq: (action: string, event: string, parameters?: Record<string, any>) => void;
  }
}