'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const links = [
  { href: '/topics', label: 'Topics' },
  { href: '/practice', label: 'Practice' },
  { href: '/ask-companies', label: 'Ask companies' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Link href="/" className="brand" aria-label="Engineering interviews home">
          <span className="brand-mark"><Icon name="code" /></span>
          <span className="brand-name">engineering<span>interviews</span></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
