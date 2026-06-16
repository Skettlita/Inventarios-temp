'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';

export default function StockPage() {
  const { stock, loading, error } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  const filteredStock = stock.filter((item) => {
    const searchMatch =
      !searchTerm ||
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const warehouseMatch = !warehouseFilter || item.warehouse_id === warehouseFilter;
    return searchMatch && warehouseMatch;
  });

  const columns = [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'warehouse_name', header: 'Warehouse' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'quantity_on_hand', header: 'On Hand' },
    { accessorKey: 'quantity_reserved', header: 'Reserved' },
    {
      id: 'available',
      header: 'Available',
      cell: ({ row }) => row.original.quantity_on_hand - (row.original.quantity_reserved || 0),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const available = row.original.quantity_on_hand - (row.original.quantity_reserved || 0);
        if (available <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (available < (row.original.reorder_level || 10))
          return <Badge variant="outline">Low Stock</Badge>;
        return <Badge variant="secondary">In Stock</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Current Stock</h1>
        <p className="text-muted-foreground">Real-time inventory levels across all locations</p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading stock data: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory across all warehouses and locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stock.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stock.filter((s) => s.quantity_on_hand === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stock.filter((s) => s.quantity_on_hand > 0 && s.quantity_on_hand < (s.reorder_level || 10)).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
