import { Card, CardContent } from '@/app/components/ui/card';

interface IProps {
  title: string;
  icon: React.ReactNode;
  value: number;
}
const StatisticsCard = ({ title, value, icon }: IProps) => {
  return (
    <Card className="w-full border-none shadow-soft">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground [&>svg]:size-6">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
