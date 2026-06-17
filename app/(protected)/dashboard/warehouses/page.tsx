'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function WarehousesPage() {
  const { t } = useI18n();

  const { warehouses, loading, error, refetchWarehouses } = useInventoryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);

  const getWarehouseLocation = (warehouse: any) => {
    return warehouse.location ?? warehouse.address ?? '';
  };

  const getWarehouseManager = (warehouse: any) => {
    return warehouse.manager ?? warehouse.responsible_name ?? '';
  };

  const getWarehouseCapacity = (warehouse: any) => {
    return warehouse.capacity ?? '';
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const search = searchTerm.toLowerCase();

    return (
      warehouse.name?.toLowerCase().includes(search) ||
      getWarehouseLocation(warehouse).toLowerCase().includes(search) ||
      getWarehouseManager(warehouse).toLowerCase().includes(search)
    );
  });

  const handleCreateWarehouse = async (formData: any) => {
    // TODO: Implementar creación real con Supabase
    console.log('Creating warehouse:', formData);
    setIsModalOpen(false);
    refetchWarehouses();
  };

  const handleUpdateWarehouse = async (formData: any) => {
    // TODO: Implementar actualización real con Supabase
    console.log('Updating warehouse:', formData);
    setIsModalOpen(false);
    refetchWarehouses();
  };

  const handleDeleteWarehouse = async (id: string) => {
    // TODO: Implementar eliminación real con Supabase
    if (confirm(t('common.confirmDelete'))) {
      console.log('Deleting warehouse:', id);
      refetchWarehouses();
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: t('fields.warehouseName'),
    },
    {
      id: 'location',
      header: t('fields.location'),
      cell: ({ row }: { row: { original: any } }) =>
        getWarehouseLocation(row.original),
    },
    {
      id: 'manager',
      header: t('fields.manager'),
      cell: ({ row }: { row: { original: any } }) =>
        getWarehouseManager(row.original),
    },
    {
      id: 'capacity',
      header: t('fields.capacity'),
      cell: ({ row }: { row: { original: any } }) =>
        getWarehouseCapacity(row.original),
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Link href="/dashboard/warehouse-locations">
            <Button size="sm" variant="outline">
              {t('inventory.viewLocations')}
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedWarehouse(row.original);
              setIsModalOpen(true);
            }}
          >
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteWarehouse(row.original.id)}
          >
            {t('common.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('inventory.warehousesTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('inventory.warehousesSubtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedWarehouse(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('inventory.newWarehouse')}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingWarehouses')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.warehouseList')}</CardTitle>
          <CardDescription>
            {t('inventory.warehouseListDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchWarehouse')}
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
              <DataTable columns={columns} data={filteredWarehouses} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          selectedWarehouse
            ? t('inventory.editWarehouse')
            : t('inventory.createWarehouse')
        }
        onSubmit={
          selectedWarehouse
            ? handleUpdateWarehouse
            : handleCreateWarehouse
        }
        fields={[
          {
            name: 'name',
            label: t('fields.warehouseName'),
            type: 'text',
            required: true,
          },
          {
            name: 'location',
            label: t('fields.location'),
            type: 'text',
          },
          {
            name: 'manager',
            label: t('fields.manager'),
            type: 'text',
          },
          {
            name: 'capacity',
            label: t('fields.capacity'),
            type: 'number',
          },
        ]}
        defaultValues={selectedWarehouse}
      />
    </div>
  );
}