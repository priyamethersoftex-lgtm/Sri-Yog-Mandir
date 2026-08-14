import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Column<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  emptyState?: React.ReactNode;
  loading?: boolean;
  
  // Pagination
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
}

/* ─── Table header cell ─────────────────────────────────────── */
function TH({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <th 
      className={`py-4 px-4 text-[12px] font-extrabold uppercase tracking-widest whitespace-nowrap text-brand-dark ${className}`} 
    >
      {children}
    </th>
  );
}

/* ─── Pagination button ─────────────────────────────────────── */
function PgBtn({ children, active, disabled, onClick }: { children: React.ReactNode, active?: boolean, disabled?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-muted active:scale-95",
        active 
          ? "bg-primary text-white shadow-sm"
          : "bg-transparent border border-border text-text-secondary hover:text-text"
      )}
    >
      {children}
    </button>
  );
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  className,
  emptyState,
  loading = false,
  page = 1,
  pageSize = 10,
  totalRecords = data.length,
  onPageChange
}: DataTableProps<T>) {
  
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const pageNums = (() => {
    const t = totalPages;
    if (t <= 5) return Array.from({ length: t }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= t - 2) return [t - 4, t - 3, t - 2, t - 1, t];
    return [page - 2, page - 1, page, page + 1, page + 2];
  })();
  const firstEntry = totalRecords > 0 ? (page - 1) * pageSize + 1 : 0;
  const lastEntry = Math.min(page * pageSize, totalRecords);

  return (
    <div 
      className={cn("rounded-card overflow-hidden bg-surface border border-border shadow-card", className)} 
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr className="bg-surface border-b border-border">
              {columns.map((col, idx) => (
                <TH key={idx} className={col.className}>
                  {col.header}
                </TH>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="skeleton h-3.5 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-surface-muted border border-dashed border-border" 
                    >
                      <AlertCircle size={24} className="text-text-muted" />
                    </div>
                    <p className="text-[15px] font-semibold text-text">No Data Found</p>
                    <p className="text-[13px] text-text-muted">{emptyState || "Try adjusting your filters"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, i) => {
                return (
                  <tr
                    key={keyExtractor(item)}
                    className={cn(
                      "border-b border-border transition-colors hover:bg-surface-muted/30 bg-surface"
                    )}
                  >
                    {columns.map((col, idx) => (
                      <td key={idx} className={cn("py-4 px-4 text-[13.5px] font-medium text-text", col.className)}>
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? (item[col.accessorKey] as React.ReactNode)
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalRecords > 0 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-border">
          <p className="text-[13px] text-text-muted">
            Showing{' '}
            <span className="font-bold text-text">{firstEntry}</span>–
            <span className="font-bold text-text">{lastEntry}</span> of{' '}
            <span className="font-bold text-text">{totalRecords}</span> records
            <span className="ml-2 opacity-50">· Page {page} of {totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <PgBtn disabled={page === 1 || loading} onClick={() => onPageChange(1)}>«</PgBtn>
            <PgBtn disabled={page === 1 || loading} onClick={() => onPageChange(page - 1)}><ChevronLeft size={15} /></PgBtn>
            {pageNums.map(n => <PgBtn key={n} active={page === n} disabled={loading} onClick={() => onPageChange(n)}>{n}</PgBtn>)}
            <PgBtn disabled={page >= totalPages || loading} onClick={() => onPageChange(page + 1)}><ChevronRight size={15} /></PgBtn>
            <PgBtn disabled={page >= totalPages || loading} onClick={() => onPageChange(totalPages)}>»</PgBtn>
          </div>
        </div>
      )}
    </div>
  );
}
