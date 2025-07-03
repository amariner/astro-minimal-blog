import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Astro Minimal Blog. All rights reserved.</p>
        <p className="text-sm mt-2">Powered by Next.js and Decap CMS</p>
      </div>
    </footer>
  );
};

export default Footer;
