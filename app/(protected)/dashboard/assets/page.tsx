'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';

export default function AssetsPage() {
  const { assets, loading, error, refetchAssets } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = assets.filter(
    (asset) =>
      (asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!statusFilter || asset.status === statusFilter)
  );

  const handleCreateAsset = async (formData) => {
    // TODO: Implement actual asset creation with Supabase
    console.log('Creating asset:', formData);
    setIsModalOpen(false);
    refetchAssets();
  };

  const handleUpdateAsset = async (formData) => {
    // TODO: Implement actual asset update with Supabase
    console.log('Updating asset:', formData);
    setIsModalOpen(false);
    refetchAssets();
  };

  const handleDeleteAsset = async (id) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      console.log('Deleting asset:', id);
      refetchAssets();
    }
  };

  const columns = [
    { accessorKey: 'asset_tag', header: 'Asset Tag' },
    { accessorKey: 'serial_number', header: 'Serial Number' },
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'purchase_date', header: 'Purchase Date' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedAsset(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteAsset(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Track and manage company assets</p>
        </div>
        <Button onClick={() => {
          setSelectedAsset(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Asset
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading assets: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>View and manage all tracked assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search by asset tag or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="damaged">Damaged</option>
                <option value="retired">Retired</option>
              </select>
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
        title={selectedAsset ? 'Edit Asset' : 'Create Asset'}
        onSubmit={selectedAsset ? handleUpdateAsset : handleCreateAsset}
        fields={[
          { name: 'asset_tag', label: 'Asset Tag', required: true },
          { name: 'serial_number', label: 'Serial Number' },
          { name: 'product_id', label: 'Product', type: 'select' },
          { name: 'location', label: 'Location' },
          { name: 'status', label: 'Status', type: 'select' },
          { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
        ]}
        defaultValues={selectedAsset}
      />
    </div>
  );
}
