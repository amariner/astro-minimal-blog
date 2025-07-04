import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';
import { HeadSnippets, BodyStartSnippets, BodyEndSnippets } from '@/components/CodeInjector';

// IMPORTANT: Replace with your actual site URL for better SEO.
const siteUrl = "https://your-site-url.com";

export const metadata: Metadata = {
  title: {
    default: 'Astro Minimal Blog',
    template: '%s | Astro Minimal Blog',
  },
  description: 'A minimal blog built with Next.js and Decap CMS.',
  openGraph: {
    title: 'Astro Minimal Blog',
    description: 'A minimal blog built with Next.js and Decap CMS.',
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Astro Minimal Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astro Minimal Blog',
    description: 'A minimal blog built with Next.js and Decap CMS.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        <HeadSnippets />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <BodyStartSnippets />
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", user => {
                  if (!user) {
                    window.netlifyIdentity.on("login", () => {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
            `,
          }}
        />
        <BodyEndSnippets />
      </body>
    </html>
  );
}
