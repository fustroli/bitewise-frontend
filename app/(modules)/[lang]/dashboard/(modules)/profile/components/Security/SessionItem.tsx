import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import { Button } from '@/app/components/ui/button';
import Typography from '@/app/components/Typography';

interface IProps {
  isCurrent?: boolean;
}
const SessionItem = ({ isCurrent }: IProps) => {
  return (
    <Card className="flex items-center justify-between pr-6">
      <CardHeader className="flex flex-col">
        <CardTitle>Chrome</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {isCurrent ? (
            <Typography variant="small" className="font-medium text-primary">
              Current session
            </Typography>
          ) : (
            <Typography variant="small">Last seen 30 minutes ago</Typography>
          )}{' '}
          - <Typography variant="small">Location</Typography>
        </CardDescription>
      </CardHeader>
      <Button variant="outline">Sign out</Button>
    </Card>
  );
};

export default SessionItem;
