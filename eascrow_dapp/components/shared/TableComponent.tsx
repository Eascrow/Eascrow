import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

type Props = {};

const TableComponent = (props: Props) => {
  return (
    <ScrollArea className="h-full w-full" type="always">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-sm font-bold">Description</TableHead>
            <TableHead className="text-sm font-bold">Date</TableHead>
            <TableHead className="text-sm font-bold">Type</TableHead>
            <TableHead className="text-sm font-bold">With</TableHead>
            <TableHead className="text-sm font-bold">Status</TableHead>
            <TableHead className="text-sm font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="text-xs">
            <TableCell>Limited Hoodie</TableCell>
            <TableCell>06/04/2024</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>john@gmail.com</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <Link href="/transactions">Details</Link>
            </TableCell>
          </TableRow>
          <TableRow className="text-xs">
            <TableCell>Interior design</TableCell>
            <TableCell>03/04/2024</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>john@gmail.com</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <Link href="/transactions">Details</Link>
            </TableCell>
          </TableRow>
          <TableRow className="text-xs">
            <TableCell>Logo creation</TableCell>
            <TableCell>01/04/2024</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>john@gmail.com</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <Link href="/transactions">Details</Link>
            </TableCell>
          </TableRow>
          <TableRow className="text-xs">
            <TableCell>Web development</TableCell>
            <TableCell>15/02/2024</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>f.imbert4@gmail.com</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <Link href="/transactions">Details</Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TableComponent;
