import { getAllCategories } from '@/lib/content';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">All Categories</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Browse posts by category.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Badge variant="secondary" className="text-lg py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors">
              {category.title}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
