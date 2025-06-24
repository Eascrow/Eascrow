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
import { Horizon } from '@stellar/stellar-sdk';

const TableComponent = ({
  transactions = [],
}: {
  transactions?: Horizon.ServerApi.TransactionRecord[];
}) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Helper function to get transaction type
  const getTransactionType = (tx: Horizon.ServerApi.TransactionRecord) => {
    // Check if it's a contract call or regular payment
    if (tx.memo && tx.memo !== '') {
      return 'Contract';
    }
    return 'Payment';
  };

  // Helper function to get description
  const getDescription = (tx: Horizon.ServerApi.TransactionRecord) => {
    if (tx.memo && tx.memo !== '') {
      return tx.memo;
    }
    return `Transaction ${tx.hash.substring(0, 8)}...`;
  };

  // Helper function to get status
  const getStatus = (tx: Horizon.ServerApi.TransactionRecord) => {
    return tx.successful ? 'Completed' : 'Failed';
  };

  return (
    <ScrollArea className="h-full w-full" type="always">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-sm font-bold">Description</TableHead>
            <TableHead className="text-sm font-bold">Date</TableHead>
            <TableHead className="text-sm font-bold">Type</TableHead>
            <TableHead className="text-sm font-bold">Hash</TableHead>
            <TableHead className="text-sm font-bold">Status</TableHead>
            <TableHead className="text-sm font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow className="text-xs">
              <TableCell colSpan={6} className="text-center text-gray-500">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.slice(0, 10).map((transaction, index) => (
              <TableRow key={transaction.id || index} className="text-xs">
                <TableCell>{getDescription(transaction)}</TableCell>
                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                <TableCell>{getTransactionType(transaction)}</TableCell>
                <TableCell>{transaction.hash.substring(0, 12)}...</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      transaction.successful
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getStatus(transaction)}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://stellar.expert/explorer/testnet/tx/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TableComponent;
