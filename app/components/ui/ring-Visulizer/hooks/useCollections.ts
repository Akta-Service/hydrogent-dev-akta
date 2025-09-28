/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useState, useEffect} from 'react';
import {fetchStorefront} from '../../../../utils/shopifyClient';
import type {Collection} from '../types';
import { Product } from '../types';

// Updated Product type to match the query fields
interface CollectionsData {
  tag: string;
  products: any[];
  setProducts: (products: any[]) => void;
}

export const useCollections = ({ tag, products, setProducts }: CollectionsData) => {
  const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setCollectionsLoading(true);
      setIsLoading(true);
      setError(null);

      try {
        const collectionsQuery = `
          query GetAllCollections($first: Int!) {
            collections(first: $first) {
              edges {
                node {
                  id
                  handle
                  title
                  description
                  image {
                    altText
                    url
                  }
                  displayInTabs: metafield(namespace: "custom", key: "display_in_tabs") {
                    value
                  }
                  defineShapeStyle: metafield(namespace: "custom", key: "define_shape_style") {
                    value
                  }
                }
              }
            }
          }
        `;

        const productsQuery = `
          query GetProductsByTag($first: Int!, $tag: String!) {
            products(first: $first, query: $tag) {
              edges {
                node {
                  id
                  handle
                  title
                  featuredImage {
                    id
                    altText
                    url
                    width
                    height
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  caratMetafield: metafield(namespace: "custom", key: "carat") {
                    value
                  }
                  videoUrlMetafield: metafield(namespace: "custom", key: "360_video_url") {
                    value
                  }
                  shapeMetafield: metafield(namespace: "custom", key: "shape") {
                    value
                  }
                  diamondColorMetafield: metafield(namespace: "custom", key: "diamond_color") {
                    value
                  }
                  cutMetafield: metafield(namespace: "custom", key: "cut") {
                    value
                  }
                  clarityMetafield: metafield(namespace: "custom", key: "clarity") {
                    value
                  }
                  depthMetafield: metafield(namespace: "custom", key: "depth") {
                    value
                  }
                  polishMetafield: metafield(namespace: "custom", key: "polish") {
                    value
                  }
                  lwRatioMetafield: metafield(namespace: "custom", key: "l_w_ratio") {
                    value
                  }
                  fluorescenceMetafield: metafield(namespace: "custom", key: "fluorescence") {
                    value
                  }
                  tableMetafield: metafield(namespace: "custom", key: "table") {
                    value
                  }
                  symmetryMetafield: metafield(namespace: "custom", key: "symmetry") {
                    value
                  }
                  showOnCollectionMetafield: metafield(namespace: "custom", key: "show_on_collection") {
                    value
                  }
                  sizeProductOptionMetafield: metafield(namespace: "custom", key: "size_product_option") {
                    value
                  }
                  certificationMetafield: metafield(namespace: "custom", key: "certification") {
                    value
                  }
                  styleMetafield: metafield(namespace: "custom", key: "style") {
                    value
                  }
                  sliderEnableMetafield: metafield(namespace: "custom", key: "slider_enable") {
                    value
                  }
                  pinnedMetafield: metafield(namespace: "custom", key: "pinned") {
                    value
                  }
                  description
                  productType
                  vendor
                  tags
                  createdAt
                  updatedAt
                  publishedAt
                  onlineStoreUrl
                  images(first: 10) {
                    edges {
                      node {
                        id
                        altText
                        url
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        // Fetch collections
        const collectionsData = await fetchStorefront(collectionsQuery, {
          first: 250,
        },null);

        if (collectionsData.errors) {
          console.warn('Collections query errors:', collectionsData.errors);
          setError('Error fetching collections from Shopify.');
          return;
        }

        const fetchedCollections =
          collectionsData.collections?.edges.map((edge: any) => ({
            id: edge.node.id,
            handle: edge.node.handle,
            title: edge.node.title,
            description: edge.node.description,
            image: edge.node.image,
            displayInTabs: edge.node.displayInTabs?.value || null,
            defineShapeStyle: edge.node.defineShapeStyle?.value || null,
          })) || [];

        setCollections(fetchedCollections);

        // Fetch products with "Diamonds" tag
        const productsData = await fetchStorefront(productsQuery, {
          first: 250,
          tag,
        });

        if (productsData.errors) {
          console.warn('Products query errors:', productsData.errors);
          setError('Error fetching products with "Diamonds" tag from Shopify.');
          return;
        }

        const fetchedProducts = productsData.products?.edges.map(
          (edge: any) => ({
            id: edge.node.id,
            handle: edge.node.handle,
            title: edge.node.title,
            sku: edge.node.sku,
            featuredImage: edge.node.featuredImage,
            priceRange: {
              minVariantPrice: edge.node.priceRange.minVariantPrice,
              maxVariantPrice: edge.node.priceRange.maxVariantPrice,
            },
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
            table: edge.node.tableMetafield?.value || null,
            symmetry: edge.node.symmetryMetafield?.value || null,
            showOnCollection:
              edge.node.showOnCollectionMetafield?.value || null,
            sizeProductOption:
              edge.node.sizeProductOptionMetafield?.value || null,
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
            images:
              edge.node.images?.edges.map((imgEdge: any) => ({
                id: imgEdge.node.id,
                altText: imgEdge.node.altText,
                url: imgEdge.node.url,
                width: imgEdge.node.width,
                height: imgEdge.node.height,
              })) || [],
            variants:
              edge.node.variants?.edges.map(
                (variantEdge: any) => variantEdge.node,
              ) || [],
          }),
        );

        // setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to fetch initial data. Please try again.');
      } finally {
        setCollectionsLoading(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return {
    collections, 
    collectionsLoading,
    isLoading,
    error,
    setIsLoading,
    setError,
  };
};
