import React, { PropsWithChildren } from 'react';

import { TableCell, TableRow } from '@/app/components/ui/table';

import { Inbox } from 'lucide-react';

interface IProps extends PropsWithChildren {
  colSpan: number;
}

const EmptyTable = ({ children, colSpan }: IProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Inbox />
          </div>
          <h6 className="text-center text-base font-medium">{children}</h6>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyTable;
