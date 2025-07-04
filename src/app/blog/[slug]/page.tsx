import { getPostBySlug, posts } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Folder, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const description = post.meta_description || post.content.substring(0, 160).replace(/\n/g, ' ');

  return {
    title: post.meta_title || post.title,
    description: description,
    openGraph: {
      title: post.meta_title || post.title,
      description: description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
     twitter: {
       title: post.meta_title || post.title,
       description: description,
       images: post.thumbnail ? [post.thumbnail] : [],
    }
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight mb-4">{post.title}</h1>
        <div className="text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            <Link href={`/categories/${post.category.slug}`} className="hover:text-primary">{post.category.title}</Link>
          </div>
        </div>
        {post.thumbnail && (
          <div className="relative aspect-video mt-8 rounded-lg overflow-hidden">
            <Image src={post.thumbnail} alt={post.title} fill className="object-cover" data-ai-hint="blog post" />
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
         <pre className="whitespace-pre-wrap font-body text-base bg-secondary p-4 rounded-md">{post.content}</pre>
         <p className="text-sm text-muted-foreground mt-4 italic">Note: For a full experience, a markdown rendering library would be required. The content is displayed as plain text.</p>
      </div>

      <footer className="mt-8">
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
               <Badge variant="secondary" className="hover:bg-accent transition-colors">
                <Tag className="w-3 h-3 mr-1" />
                {tag.title}
              </Badge>
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
