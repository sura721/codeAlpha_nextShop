
import { MetadataRoute } from 'next';
import {
  getAllProductsForSitemap,
  getAllCategoriesForSitemap,
} from '@/lib/actions/product.actions';

type SitemapEntry = {
  slug: string;
  updatedAt: Date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://ping-shop.vercel.app';


  const products: SitemapEntry[] = await getAllProductsForSitemap();
  const categories: SitemapEntry[] = await getAllCategoriesForSitemap();

  const productEntries: MetadataRoute.Sitemap = products.map(({ slug, updatedAt }) => ({
    url: `${siteUrl}/product/${slug}`,
    lastModified: updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map(({ slug, updatedAt }) => ({
    // I am assuming your category URLs look like this. Adjust if they don't.
    url: `${siteUrl}/products?category=${slug}`, 
    lastModified: updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
     {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...staticPages, ...categoryEntries, ...productEntries];
}