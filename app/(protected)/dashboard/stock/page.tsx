'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function StockPage() {
  const { t } = useI18n();

  const { stock, loading, error } = useInventoryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  const getProductSku = (item: any) => {
    return item.product_sku ?? item.sku ?? '';
  };

  const getProductName = (item: any) => {
    return item.product_name ?? '';
  };

  const getWarehouseName = (item: any) => {
    return item.warehouse_name ?? '';
  };

  const getLocationName = (item: any) => {
    return item.location_name ?? item.location ?? '';
  };

  const getQuantityOnHand = (item: any) => {
    return Number(item.quantity_on_hand ?? item.quantity ?? 0);
  };

  const getQuantityReserved = (item: any) => {
    return Number(item.quantity_reserved ?? item.reserved_quantity ?? 0);
  };

  const getAvailableQuantity = (item: any) => {
    const onHand = getQuantityOnHand(item);
    const reserved = getQuantityReserved(item);

    return Number(item.available_quantity ?? onHand - reserved);
  };

  const getMinimumStock = (item: any) => {
    return Number(item.min_stock ?? item.reorder_level ?? 10);
  };

  const getStockStatus = (item: any) => {
    const available = getAvailableQuantity(item);
    const minimumStock = getMinimumStock(item);

    if (available <= 0) {
      return {
        label: t('inventory.outOfStock'),
        variant: 'destructive' as const,
      };
    }

    if (available < minimumStock) {
      return {
        label: t('inventory.lowStock'),
        variant: 'secondary' as const,
      };
    }

    return {
      label: t('inventory.inStock'),
      variant: 'default' as const,
    };
  };

  const filteredStock = stock.filter((item: any) => {
    const search = searchTerm.toLowerCase();

    const searchMatch =
      !searchTerm ||
      getProductName(item).toLowerCase().includes(search) ||
      getProductSku(item).toLowerCase().includes(search);

    const warehouseMatch =
      !warehouseFilter || item.warehouse_id === warehouseFilter;

    return searchMatch && warehouseMatch;
  });

  const totalSkus = stock.length;

  const outOfStockCount = stock.filter(
    (item: any) => getAvailableQuantity(item) <= 0
  ).length;

  const lowStockCount = stock.filter((item: any) => {
    const available = getAvailableQuantity(item);

    return available > 0 && available < getMinimumStock(item);
  }).length;

  const columns = [
    {
      id: 'sku',
      header: t('fields.sku'),
      cell: ({ row }: { row: { original: any } }) =>
        getProductSku(row.original),
    },
    {
      id: 'product_name',
      header: t('fields.product'),
      cell: ({ row }: { row: { original: any } }) =>
        getProductName(row.original),
    },
    {
      id: 'warehouse_name',
      header: t('fields.warehouse'),
      cell: ({ row }: { row: { original: any } }) =>
        getWarehouseName(row.original),
    },
    {
      id: 'location',
      header: t('fields.location'),
      cell: ({ row }: { row: { original: any } }) =>
        getLocationName(row.original),
    },
    {
      id: 'quantity_on_hand',
      header: t('fields.onHand'),
      cell: ({ row }: { row: { original: any } }) =>
        getQuantityOnHand(row.original),
    },
    {
      id: 'quantity_reserved',
      header: t('fields.reserved'),
      cell: ({ row }: { row: { original: any } }) =>
        getQuantityReserved(row.original),
    },
    {
      id: 'available',
      header: t('fields.available'),
      cell: ({ row }: { row: { original: any } }) =>
        getAvailableQuantity(row.original),
    },
    {
      id: 'status',
      header: t('fields.status'),
      cell: ({ row }: { row: { original: any } }) => {
        const status = getStockStatus(row.original);

        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('inventory.stockTitle')}
        </h1>
        <p className="text-muted-foreground">
          {t('inventory.stockSubtitle')}
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingStock')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.stockLevels')}</CardTitle>
          <CardDescription>
            {t('inventory.stockLevelsDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchStock')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />

              <Search className="text-muted-foreground h-4 w-4 mt-3" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredStock} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t('inventory.totalSkus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkus}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t('inventory.outOfStock')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t('inventory.lowStockItems')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}