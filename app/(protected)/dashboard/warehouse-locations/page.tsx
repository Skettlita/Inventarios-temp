'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Loader2, Plus } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';

export default function WarehouseLocationsPage() {
  const { warehouseLocations, warehouses, loading, error, refetchLocations } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filteredLocations = warehouseLocations.filter((location) => {
    const warehouseMatch = !warehouseFilter || location.warehouse_id === warehouseFilter;
    const searchMatch =
      !searchTerm ||
      `${location.aisle}${location.shelf}${location.bin}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return warehouseMatch && searchMatch;
  });

  const handleCreateLocation = async (formData) => {
    console.log('Creating location:', formData);
    setIsModalOpen(false);
    refetchLocations();
  };

  const handleUpdateLocation = async (formData) => {
    console.log('Updating location:', formData);
    setIsModalOpen(false);
    refetchLocations();
  };

  const handleDeleteLocation = async (id) => {
    if (confirm('Are you sure you want to delete this location?')) {
      console.log('Deleting location:', id);
      refetchLocations();
    }
  };

  const columns = [
    {
      accessorKey: 'warehouse_name',
      header: 'Warehouse',
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => `${row.original.aisle}-${row.original.shelf}-${row.original.bin}`,
    },
    { accessorKey: 'max_capacity', header: 'Max Capacity' },
    { accessorKey: 'current_stock', header: 'Current Stock' },
    {
      id: 'utilization',
      header: 'Utilization %',
      cell: ({ row }) => {
        const util =
          ((row.original.current_stock || 0) / (row.original.max_capacity || 1)) * 100;
        return `${util.toFixed(1)}%`;
      },
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
              setSelectedLocation(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteLocation(row.original.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Locations</h1>
          <p className="text-muted-foreground">Manage warehouse bins and locations</p>
        </div>
        <Button onClick={() => {
          setSelectedLocation(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Location
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading locations: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Location Inventory</CardTitle>
          <CardDescription>View and manage warehouse bins and locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search by aisle/shelf/bin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Warehouses</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredLocations} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedLocation ? 'Edit Location' : 'Create Location'}
        onSubmit={selectedLocation ? handleUpdateLocation : handleCreateLocation}
        fields={[
          { name: 'warehouse_id', label: 'Warehouse', type: 'select', required: true },
          { name: 'aisle', label: 'Aisle', required: true },
          { name: 'shelf', label: 'Shelf', required: true },
          { name: 'bin', label: 'Bin', required: true },
          { name: 'max_capacity', label: 'Max Capacity', type: 'number' },
        ]}
        defaultValues={selectedLocation}
      />
    </div>
  );
}
