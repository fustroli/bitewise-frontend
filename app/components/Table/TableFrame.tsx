import React, { PropsWithChildren } from 'react';

import { Table } from '@/app/components/ui/table';

interface IProps extends PropsWithChildren {
  addModal: React.ReactNode;
  title: string;
  tableHead: React.ReactNode;
}
const TableFrame = async ({ title, children, tableHead, addModal }: IProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-soft">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <h6 className="text-lg font-semibold text-foreground">{title}</h6>
        {addModal}
      </div>
      <Table aria-label={title}>
        {tableHead}
        {children}
      </Table>
    </div>
  );
};

export default TableFrame;
