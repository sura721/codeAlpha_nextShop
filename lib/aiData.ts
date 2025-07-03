import { getCategories, getProducts } from "./actions/product.actions";


export async function fetchProductAndCategoryData(userQuery: string) {
  // Fetch categories
  const categories = await getCategories();

  // Attempt to extract category from userQuery
  let matchedCategorySlug: string | undefined = undefined;
  const lowerQuery = userQuery.toLowerCase();
  for (const cat of categories) {
    if (lowerQuery.includes(cat.name.toLowerCase())) {
      matchedCategorySlug = cat.slug;
      break;
    }
  }

  // Fetch products using extracted query and category if matched
  const products = await getProducts({
    query: userQuery,
    category: matchedCategorySlug ?? undefined,
  });

  // Format for AI context injection
  const formattedProducts = products.slice(0, 5).map((p) => ({
    title: p.title,
    category: p.category.name,
    priceRange: p.variants.length
      ? `${p.variants[0].price} ETB - ${p.variants[p.variants.length - 1].price} USD`
      : "Price not available",
    url: `https://ping-shop.vercel.app/${p.id}`, 
  }));

  return { categories, products: formattedProducts };
}
