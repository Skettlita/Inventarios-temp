'use client';

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
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function AssetsPage() {
  const { t } = useI18n();

  const { assets, loading, error, refetchAssets } = useInventoryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '';

    return t(`status.${status}`);
  };

  const getStatusVariant = (status?: string | null) => {
    switch (status) {
      case 'damaged':
      case 'lost':
      case 'retired':
        return 'destructive';
      case 'maintenance':
      case 'reserved':
      case 'assigned':
      case 'installed':
        return 'secondary';
      case 'available':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getAssetCode = (asset: any) => {
    return asset.asset_tag ?? asset.asset_code ?? '';
  };

  const getAssetLocation = (asset: any) => {
    return asset.location_name ?? asset.location ?? asset.warehouse_name ?? '';
  };

  const filteredAssets = assets.filter((asset) => {
    const search = searchTerm.toLowerCase();

    const searchMatch =
      !searchTerm ||
      getAssetCode(asset).toLowerCase().includes(search) ||
      asset.serial_number?.toLowerCase().includes(search) ||
      asset.product_name?.toLowerCase().includes(search);

    const statusMatch = !statusFilter || asset.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleCreateAsset = async (formData: any) => {
    // TODO: Implementar creación real con Supabase
    console.log('Creating asset:', formData);
    setIsModalOpen(false);
    refetchAssets();
  };

  const handleUpdateAsset = async (formData: any) => {
    // TODO: Implementar actualización real con Supabase
    console.log('Updating asset:', formData);
    setIsModalOpen(false);
    refetchAssets();
  };

  const handleDeleteAsset = async (id: string) => {
    // TODO: Implementar eliminación real con Supabase
    if (confirm(t('common.confirmDelete'))) {
      console.log('Deleting asset:', id);
      refetchAssets();
    }
  };

  const columns = [
    {
      id: 'asset_tag',
      header: t('fields.assetTag'),
      cell: ({ row }: { row: { original: any } }) => getAssetCode(row.original),
    },
    {
      accessorKey: 'serial_number',
      header: t('fields.serialNumber'),
    },
    {
      accessorKey: 'product_name',
      header: t('fields.product'),
    },
    {
      id: 'location',
      header: t('fields.location'),
      cell: ({ row }: { row: { original: any } }) => getAssetLocation(row.original),
    },
    {
      accessorKey: 'purchase_date',
      header: t('fields.purchaseDate'),
    },
    {
      accessorKey: 'status',
      header: t('fields.status'),
      cell: ({ row }: { row: { original: any } }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedAsset(row.original);
              setIsModalOpen(true);
            }}
          >
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteAsset(row.original.id)}
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
            {t('inventory.assetsTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('inventory.assetsSubtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedAsset(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('inventory.newAsset')}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingAssets')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.assetInventory')}</CardTitle>
          <CardDescription>
            {t('inventory.assetInventoryDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchAsset')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-background"
              >
                <option value="">{t('common.allStatuses')}</option>
                <option value="available">{t('status.available')}</option>
                <option value="reserved">{t('status.reserved')}</option>
                <option value="assigned">{t('status.assigned')}</option>
                <option value="installed">{t('status.installed')}</option>
                <option value="maintenance">{t('status.maintenance')}</option>
                <option value="damaged">{t('status.damaged')}</option>
                <option value="retired">{t('status.retired')}</option>
              </select>

              <Search className="text-muted-foreground h-4 w-4 mt-3" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredAssets} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          selectedAsset
            ? t('inventory.editAsset')
            : t('inventory.createAsset')
        }
        onSubmit={selectedAsset ? handleUpdateAsset : handleCreateAsset}
        fields={[
          {
            name: 'product_id',
            label: t('fields.product'),
            type: 'text',
            required: true,
          },
          {
            name: 'asset_code',
            label: t('fields.assetCode'),
            type: 'text',
          },
          {
            name: 'serial_number',
            label: t('fields.serialNumber'),
            type: 'text',
          },
          {
            name: 'mac_address',
            label: t('fields.macAddress'),
            type: 'text',
          },
          {
            name: 'warehouse_id',
            label: t('fields.warehouse'),
            type: 'text',
          },
          {
            name: 'location_id',
            label: t('fields.location'),
            type: 'text',
          },
          {
            name: 'status',
            label: t('fields.status'),
            type: 'select',
            options: [
              { value: 'available', label: t('status.available') },
              { value: 'reserved', label: t('status.reserved') },
              { value: 'assigned', label: t('status.assigned') },
              { value: 'installed', label: t('status.installed') },
              { value: 'maintenance', label: t('status.maintenance') },
              { value: 'damaged', label: t('status.damaged') },
              { value: 'retired', label: t('status.retired') },
            ],
          },
          {
            name: 'purchase_date',
            label: t('fields.purchaseDate'),
            type: 'date',
          },
        ]}
        defaultValues={selectedAsset}
      />
    </div>
  );
}