import { getAllTags } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">All Tags</h1>
         <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Browse posts by tag.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag) => (
           <Link key={tag.slug} href={`/tags/${tag.slug}`}>
            <Badge variant="secondary" className="text-md py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors">
              {tag.title}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
