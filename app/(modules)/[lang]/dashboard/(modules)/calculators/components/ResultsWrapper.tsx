import React, { PropsWithChildren } from 'react';

import { Button } from '@/app/components/ui/button';
import { ListRestart } from 'lucide-react';

interface IProps extends PropsWithChildren {
  reset: () => void;
  transition: boolean;
}
const ResultsWrapper = ({ children, reset, transition }: IProps) => {
  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        transition ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}
    >
      <div className="absolute bottom-0 left-0 z-10 flex h-[97%] w-full flex-col items-center justify-center gap-8 rounded-lg bg-card">
        {children}
        <Button variant="outline" onClick={reset}>
          <ListRestart /> Calculate again
        </Button>
      </div>
    </div>
  );
};

export default ResultsWrapper;
