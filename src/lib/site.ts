export const siteConfig = {
  name: 'Astro Minimal Blog',
  description: 'A minimal blog built with Next.js and Decap CMS.',
  url:
    process.env.FIREBASE_APP_HOSTING_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'http://localhost:9002',
};
