import { getPage } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const page = getPage('about');

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{page.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-body text-base bg-transparent p-0">{page.content}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
