import { getAllPages, posts, getAllCategories, getAllTags } from '@/lib/content';
import { slugify } from '@/lib/utils';
import { MetadataRoute } from 'next';

// IMPORTANT: Replace with your actual site URL
const baseUrl = 'https://your-site-url.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: `${baseUrl}/categories/${slugify(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  const tagUrls = getAllTags().map((tag) => ({
    url: `${baseUrl}/tags/${slugify(tag)}`,
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
