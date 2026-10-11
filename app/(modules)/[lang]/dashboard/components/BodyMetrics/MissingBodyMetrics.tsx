import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

interface IProps {
  message: string;
  linkLabel: string;
  href: string;
}

/** What a card shows until the Profile has what it needs. */
const MissingBodyMetrics = ({ message, linkLabel, href }: IProps) => (
  <div className="flex flex-col items-start gap-4">
    <p className="text-sm text-muted-foreground">{message}</p>
    <Button variant="outline" asChild>
      <Link href={href}>{linkLabel}</Link>
    </Button>
  </div>
);

export default MissingBodyMetrics;
