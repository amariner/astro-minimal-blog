import { getPage } from '@/lib/content';
import { notFound } from 'next/navigation';

export default function AboutPage() {
  const page = getPage('about');

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-8 text-center">{page.title}</h1>
      <div className="prose dark:prose-invert max-w-none text-lg">
        <p className="whitespace-pre-wrap font-body leading-relaxed">{page.content}</p>
      </div>
    </div>
  );
}
