import Link from 'next/link';
import Icon from './Icon';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({
  eyebrow, title, description, backHref = '/', backLabel = 'Back to Home',
}: PageHeaderProps) {
  return (
    <header className="page-heading">
      <Link href={backHref} className="back-link"><Icon name="back" />{backLabel}</Link>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}
