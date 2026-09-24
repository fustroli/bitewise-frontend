import { EUnit } from '@/app/(modules)/[lang]/dashboard/(modules)/ingredients/enums';
import { cn } from '@/app/lib';

interface IProps {
  unit: EUnit;
}
const Unit = ({ unit }: IProps) => {
  const grammClasses = 'bg-success/15 text-success';
  const pieceClasses = 'bg-secondary text-secondary-foreground';

  const isPiece = unit === EUnit.PIECE;
  return (
    <div
      className={cn(
        'w-fit rounded-full px-2 py-0.5 text-xs font-semibold uppercase',
        isPiece ? pieceClasses : grammClasses,
      )}
    >
      {unit}
    </div>
  );
};

export default Unit;
