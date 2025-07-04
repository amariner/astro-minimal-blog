import { getAllTags } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/lib/utils';

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/tags/${slugify(tag)}`}>
                <Badge variant="default" className="text-lg py-1 px-3 hover:bg-primary/80 transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
