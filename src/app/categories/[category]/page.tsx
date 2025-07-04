import { getPostsByCategory, getCategory, getAllCategories } from '@/lib/content';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: slugify(category.title),
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryData = getCategory(params.category);
  const categoryName = categoryData?.title || params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const description = categoryData?.meta_description || categoryData?.description || `Posts filed under the "${categoryName}" category.`;
  
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const pageUrl = `${baseUrl}/categories/${params.category}`;

  return {
    title: categoryData?.meta_title || categoryName,
    description: description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: categoryData?.meta_title || categoryName,
      description: description,
      url: pageUrl,
    }
  };
}


export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getPostsByCategory(params.category);
  const categoryData = getCategory(params.category);
  const categoryName = categoryData?.title || params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const categoryDescription = categoryData?.description;

  if (posts.length === 0 && !categoryData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">Category: {categoryName}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {categoryDescription || `Posts filed under the "${categoryName}" category.`}
        </p>
      </div>
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
         <p className="text-center text-muted-foreground">No posts found in this category yet.</p>
      )}
      {categoryData?.content && (
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="prose dark:prose-invert max-w-none text-lg">
            <p className="whitespace-pre-wrap font-body leading-relaxed">{categoryData.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
