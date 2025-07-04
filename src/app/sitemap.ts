import { getAllPages, posts, getAllCategories, getAllTags } from '@/lib/content';
import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const pageUrls = getAllPages().map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(), // Pages don't have a date, use current
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const categoryUrls = getAllCategories().map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  const tagUrls = getAllTags().map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postUrls,
    ...pageUrls,
    ...categoryUrls,
    ...tagUrls
  ];
}
