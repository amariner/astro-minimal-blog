import { getPostBySlug, posts } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { siteConfig } from '@/lib/site';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug:string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.thumbnail ? (post.thumbnail.startsWith('/') ? `${baseUrl}${post.thumbnail}` : `${baseUrl}/placeholder.png`) : `${baseUrl}/placeholder.png`;

  const description = post.meta_description || post.content.substring(0, 160).replace(/\n/g, ' ');

  return {
    title: post.meta_title || post.title,
    description: description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: description,
      url: postUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
     twitter: {
       card: 'summary_large_image',
       title: post.meta_title || post.title,
       description: description,
       images: [imageUrl],
    }
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.thumbnail ? (post.thumbnail.startsWith('/') ? `${baseUrl}${post.thumbnail}` : post.thumbnail) : `${baseUrl}/placeholder.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    image: imageUrl,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`, 
      },
    },
    description: post.content.substring(0, 160).replace(/\n/g, ' '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto py-8">
        <header className="mb-8">
          <div className="text-center mb-4">
              <Link href={`/categories/${post.category.slug}`} className="hover:text-primary text-sm font-semibold uppercase tracking-wider">{post.category.title}</Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-4 text-center">{post.title}</h1>
          <div className="text-muted-foreground text-center">
              <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          {post.thumbnail && (
            <div className="relative aspect-video mt-8 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={post.thumbnail} 
                alt={post.title} 
                fill
                className="object-cover" 
                data-ai-hint="blog post" 
                priority 
              />
            </div>
          )}
        </header>

        <div className="prose dark:prose-invert max-w-none text-lg">
           <p className="whitespace-pre-wrap font-body leading-relaxed">{post.content}</p>
        </div>

        <footer className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-headline font-semibold mb-4">Tags</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                 <Badge variant="outline" className="font-normal">
                  {tag.title}
                </Badge>
              </Link>
            ))}
          </div>
        </footer>
      </article>
    </>
  );
}
