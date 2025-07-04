import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/content';
import { Calendar, Folder, Tag } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const summary = post.content.substring(0, 150) + '...';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`}>
        <CardHeader>
          {post.thumbnail && (
            <div className="relative aspect-video mb-4">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint="blog post"
              />
            </div>
          )}
          <CardTitle className="text-2xl font-headline leading-tight">{post.title}</CardTitle>
        </CardHeader>
      </Link>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-4 space-y-2">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <Link href={`/categories/${slugify(post.category)}`} className="hover:text-primary">{post.category}</Link>
            </div>
        </div>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link key={tag} href={`/tags/${slugify(tag)}`}>
            <Badge variant="secondary" className="hover:bg-accent transition-colors">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
            </Badge>
          </Link>
        ))}
      </CardFooter>
    </Card>
  );
}
