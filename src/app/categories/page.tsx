import { getAllCategories } from '@/lib/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Folder } from 'lucide-react';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-4xl mx-auto">
       <Card>
        <CardHeader>
          <CardTitle className="text-4xl">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <div className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  <span className="font-medium">{category.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
