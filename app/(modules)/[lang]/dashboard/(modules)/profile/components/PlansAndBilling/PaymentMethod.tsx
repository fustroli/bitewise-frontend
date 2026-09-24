import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import Typography from '@/app/components/Typography';

const PaymentMethod = () => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Change how you pay for your plan</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="flex justify-between pl-6">
          <div className="flex items-center">
            <div className="rounded-md border border-border px-6 py-4 font-bold italic">
              VISA
            </div>
            <CardContent className="pb-0">
              <Typography variant="large">
                Visa ending in 4242 <Badge variant="outline">Default</Badge>
              </Typography>
              <Typography variant="p">Expires 12/24</Typography>
            </CardContent>
          </div>
          <CardFooter className="justify-end pt-6">
            <Button variant="default">
              Edit <ArrowUpRight />
            </Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
