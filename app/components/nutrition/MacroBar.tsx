import { IMacroGrams, macroEnergyShares } from '@/app/utils/helpers';

import { cn } from '@/app/lib';

interface IProps extends IMacroGrams {
  /** Tailwind height class; defaults to `h-2.5`. */
  heightClassName?: string;
  className?: string;
}

const SEGMENTS = [
  { macro: 'protein', className: 'bg-protein' },
  { macro: 'carbs', className: 'bg-carbs' },
  { macro: 'fat', className: 'bg-fat' },
] as const;

/** Protein, carbs and fat stacked by their share of the energy. Decorative. */
const MacroBar = ({
  heightClassName = 'h-2.5',
  className,
  ...grams
}: IProps) => {
  const shares = macroEnergyShares(grams);

  return (
    <div
      aria-hidden
      className={cn(
        'flex gap-0.5 overflow-hidden rounded-full bg-muted',
        heightClassName,
        className,
      )}
    >
      {SEGMENTS.filter(({ macro }) => shares[macro] > 0).map(
        ({ macro, className: segment }) => (
          <div
            key={macro}
            className={cn('h-full', segment)}
            style={{ flexGrow: shares[macro] }}
          />
        ),
      )}
    </div>
  );
};

export default MacroBar;
