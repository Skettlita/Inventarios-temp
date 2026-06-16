'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

type DataTableColumn<T> = {
  id?: string;
  accessorKey?: Extract<keyof T, string> | string;
  label?: React.ReactNode;
  header?: React.ReactNode;
  sortable?: boolean;
  render?: (row: T, value: unknown) => React.ReactNode;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  searchKey?: Extract<keyof T, string> | string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

function getColumnKey<T>(column: DataTableColumn<T>, index: number): string {
  return String(column.id ?? column.accessorKey ?? `column-${index}`);
}

function getColumnHeader<T>(column: DataTableColumn<T>): React.ReactNode {
  if (column.label !== undefined) return column.label;
  if (column.header !== undefined) return column.header;
  if (column.id !== undefined) return String(column.id);
  if (column.accessorKey !== undefined) return String(column.accessorKey);
  return '';
}

function getCellValue<T extends Record<string, unknown>>(
  row: T,
  column: DataTableColumn<T>
): unknown {
  const key = column.accessorKey ?? column.id;

  if (!key) return undefined;

  return row[key as keyof T];
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchKey,
  onEdit,
  onDelete,
  actions,
}: DataTableProps<T>) {
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredData = useMemo(() => {
    if (!search || !searchKey) return data;

    return data.filter((row) =>
      String(row[searchKey] ?? '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      return aValue < bValue
        ? sortConfig.direction === 'asc'
          ? -1
          : 1
        : sortConfig.direction === 'asc'
          ? 1
          : -1;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (column: DataTableColumn<T>, index: number) => {
    const key = String(column.accessorKey ?? column.id ?? `column-${index}`);

    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return { key, direction: 'asc' };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const hasActionsColumn = Boolean(onEdit || onDelete || actions);

  return (
    <div className="space-y-4">
      {searchKey && (
        <Input
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => {
                const columnKey = getColumnKey(column, index);
                const sortableKey = String(column.accessorKey ?? column.id ?? '');

                return (
                  <TableHead
                    key={columnKey}
                    onClick={() => column.sortable && handleSort(column, index)}
                    className={column.sortable ? 'cursor-pointer select-none' : ''}
                  >
                    <div className="flex items-center gap-2">
                      <span>{getColumnHeader(column)}</span>

                      {column.sortable && sortConfig?.key === sortableKey && (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </TableHead>
                );
              })}

              {hasActionsColumn && (
                <TableHead key="table-actions">
                  {t('common.actions')}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActionsColumn ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  {t('common.noData')}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => {
                const rowKey = String(row.id ?? row.uuid ?? rowIndex);

                return (
                  <TableRow key={rowKey}>
                    {columns.map((column, columnIndex) => {
                      const columnKey = getColumnKey(column, columnIndex);
                      const value = getCellValue(row, column);

                      return (
                        <TableCell key={`${rowKey}-${columnKey}`}>
                          {column.cell
                            ? column.cell({ row: { original: row } })
                            : column.render
                              ? column.render(row, value)
                              : value === null || value === undefined
                                ? ''
                                : String(value)}
                        </TableCell>
                      );
                    })}

                    {hasActionsColumn && (
                      <TableCell key={`${rowKey}-actions`}>
                        <div className="flex items-center gap-2">
                          {actions && actions(row)}

                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(row)}
                            >
                              {t('common.edit')}
                            </Button>
                          )}

                          {onDelete && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => onDelete(row)}
                            >
                              {t('common.delete')}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}