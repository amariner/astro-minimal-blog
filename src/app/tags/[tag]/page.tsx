import { getAllTags, getPostsByTag } from '@/lib/content';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getPostsByTag(params.tag);
  const tagName = params.tag.charAt(0).toUpperCase() + params.tag.slice(1);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">Tag: {tagName}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Posts tagged with &quot;{tagName}&quot;.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
