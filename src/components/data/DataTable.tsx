import React from 'react';
import { cn } from '../../utils/cn';

// Minimal custom column definition to replace tanstack/react-table v8 types
export type ColumnDef<T, V = any> = {
  id?: string;
  accessorKey?: keyof T | string;
  header?: string | React.ReactNode;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
};

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  className,
}: DataTableProps<TData>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-secondary uppercase bg-background border-b border-theme/50">
          <tr>
            {columns.map((col, idx) => (
              <th key={col.id || idx} className="px-4 py-3 font-medium tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-theme/50 last:border-0 hover:bg-background/50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={col.id || colIdx} className="px-4 py-3 text-text-primary whitespace-nowrap">
                    {col.cell ? col.cell({ row: { original: row } }) : (col.accessorKey ? (row as any)[col.accessorKey] : '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-text-secondary">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
