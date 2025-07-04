import { getAllPages, getPage } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  const pages = getAllPages();
  const dynamicPages = pages.filter((page) => page.slug !== 'about');
  return dynamicPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = getPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const pageUrl = `${baseUrl}/${page.slug}`;

  const description = page.meta_description || page.content.substring(0, 160).replace(/\n/g, ' ');

  return {
    title: page.meta_title || page.title,
    description: description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: page.meta_title || page.title,
      description: description,
      url: pageUrl,
    },
    twitter: {
       title: page.meta_title || page.title,
       description: description,
    }
  };
}


export default function Page({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-8 text-center">{page.title}</h1>
      <div className="prose dark:prose-invert max-w-none text-lg">
        <p className="whitespace-pre-wrap font-body leading-relaxed">{page.content}</p>
      </div>
    </div>
  );
}
