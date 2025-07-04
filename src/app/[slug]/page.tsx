import { getAllPages, getPage } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
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

  const description = page.meta_description || page.content.substring(0, 160).replace(/\n/g, ' ');

  return {
    title: page.meta_title || page.title,
    description: description,
    openGraph: {
      title: page.meta_title || page.title,
      description: description,
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
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{page.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-body text-base bg-transparent p-0">{page.content}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
