import { posts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const latestPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="text-center flex flex-col items-center pt-8 md:pt-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight max-w-4xl">
          A Minimal Blog for Modern Times
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Thoughts, stories, and ideas on technology, lifestyle, and travel, presented in a clean, modern, and distraction-free design.
        </p>
      </section>

      {latestPost && (
        <section>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center mb-12">Latest Post</h2>
            <Link href={`/blog/${latestPost.slug}`}>
                <div className="group grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {latestPost.thumbnail && (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image 
                            src={latestPost.thumbnail} 
                            alt={latestPost.title} 
                            fill 
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="technology abstract"
                            priority
                            />
                        </div>
                    )}
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{new Date(latestPost.date).toLocaleDateString()}</p>
                        <h3 className="text-3xl font-headline font-bold">{latestPost.title}</h3>
                        <p className="text-muted-foreground">{latestPost.content.substring(0, 180)}...</p>
                        <span className="text-primary font-semibold inline-block mt-2">Read more &rarr;</span>
                    </div>
                </div>
            </Link>
        </section>
      )}

      <section>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center mb-12">All Posts</h2>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
