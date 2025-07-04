import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/content';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col h-full overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block mb-4">
        {post.thumbnail && (
          <div className="relative aspect-video overflow-hidden rounded-md border">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="blog post"
            />
          </div>
        )}
      </Link>
      <div className="text-sm text-muted-foreground mb-2">
          <Link href={`/categories/${post.category.slug}`} className="hover:text-primary uppercase tracking-wider font-semibold text-xs">{post.category.title}</Link>
      </div>
      <Link href={`/blog/${post.slug}`} className="block">
        <h3 className="text-xl font-headline font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
      </Link>
      
      <p className="text-muted-foreground text-sm flex-grow mb-4">{post.content.substring(0, 100)}...</p>

      <footer className="text-sm text-muted-foreground">
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </footer>
    </article>
  );
}
