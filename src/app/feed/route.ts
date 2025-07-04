import { NextResponse } from 'next/server';
import RSS from 'rss';
import { posts } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    feed_url: `${baseUrl}/feed`,
    site_url: baseUrl,
    language: 'en-US',
    pubDate: new Date(),
    ttl: 60,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.meta_description || post.content.substring(0, 200) + '...',
      url: `${baseUrl}/blog/${post.slug}`,
      guid: `${baseUrl}/blog/${post.slug}`,
      date: post.date,
      categories: [post.category.title, ...post.tags.map(tag => tag.title)],
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
