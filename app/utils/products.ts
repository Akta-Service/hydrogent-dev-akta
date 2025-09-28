export const allFilteredProducts: any[] = [];

// Utility functions for product filtering and manipulation can be added here
export const filterProductsByTag = (products: any[], tag: string) => {
  return products.filter((product) => product.tags.includes(tag));
};

export const sortProductsByPrice = (products: any[], ascending = true) => {
  return products.sort((a, b) => {
    const priceA = Number.parseFloat(a.priceRange.minVariantPrice.amount);
    const priceB = Number.parseFloat(b.priceRange.minVariantPrice.amount);
    return ascending ? priceA - priceB : priceB - priceA;
  });
};
