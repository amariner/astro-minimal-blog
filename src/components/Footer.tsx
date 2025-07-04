import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
          <Link href="/privacy-policy" className="text-sm hover:text-primary">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-sm hover:text-primary">Terms of Service</Link>
          <Link href="/cookie-policy" className="text-sm hover:text-primary">Cookie Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Astro Minimal Blog. All rights reserved.</p>
        <p className="text-sm mt-2">Powered by Next.js and Decap CMS</p>
      </div>
    </footer>
  );
};

export default Footer;
