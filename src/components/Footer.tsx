import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                <h4 className="font-headline font-semibold">Astro Minimal Blog</h4>
                 <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="space-y-4">
                <h4 className="font-headline font-semibold">Content</h4>
                <ul className="space-y-2">
                    <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-background">Categories</Link></li>
                    <li><Link href="/tags" className="text-sm text-muted-foreground hover:text-background">Tags</Link></li>
                </ul>
            </div>
            <div className="space-y-4">
                 <h4 className="font-headline font-semibold">Info</h4>
                 <ul className="space-y-2">
                    <li><Link href="/about" className="text-sm text-muted-foreground hover:text-background">About</Link></li>
                 </ul>
            </div>
            <div className="space-y-4">
                 <h4 className="font-headline font-semibold">Legal</h4>
                 <ul className="space-y-2">
                    <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-background">Privacy Policy</Link></li>
                    <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-background">Terms of Service</Link></li>
                    <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-background">Cookie Policy</Link></li>
                 </ul>
            </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
             <p>Powered by Next.js and Decap CMS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
