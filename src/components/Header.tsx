"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold font-headline">
            <span>Astro Minimal Blog</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
           <div className="hidden md:block">
            <Button asChild variant="outline">
                <a href="/admin">Login</a>
            </Button>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
