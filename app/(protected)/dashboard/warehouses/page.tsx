'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Loader2, Plus } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';

export default function WarehousesPage() {
  const { warehouses, loading, error, refetchWarehouses } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [expandedWarehouse, setExpandedWarehouse] = useState(null);

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWarehouse = async (formData) => {
    console.log('Creating warehouse:', formData);
    setIsModalOpen(false);
    refetchWarehouses();
  };

  const handleUpdateWarehouse = async (formData) => {
    console.log('Updating warehouse:', formData);
    setIsModalOpen(false);
    refetchWarehouses();
  };

  const handleDeleteWarehouse = async (id) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      console.log('Deleting warehouse:', id);
      refetchWarehouses();
    }
  };

  const columns = [
    { accessorKey: 'name', header: 'Warehouse Name' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'manager_name', header: 'Manager' },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
      cell: ({ row }) => `${row.original.current_stock_level || 0}/${row.original.capacity || 0}`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpandedWarehouse(row.original.id)}
          >
            View Locations
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedWarehouse(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteWarehouse(row.original.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations and capacity</p>
        </div>
        <Button onClick={() => {
          setSelectedWarehouse(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Warehouse
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading warehouses: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
          <CardDescription>View and manage all warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by warehouse name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

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

      {expandedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Locations</CardTitle>
            <CardDescription>Locations and bins for the selected warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Warehouse locations view coming soon</p>
            <Button
              variant="outline"
              onClick={() => setExpandedWarehouse(null)}
              className="mt-4"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedWarehouse ? 'Edit Warehouse' : 'Create Warehouse'}
        onSubmit={selectedWarehouse ? handleUpdateWarehouse : handleCreateWarehouse}
        fields={[
          { name: 'name', label: 'Warehouse Name', required: true },
          { name: 'location', label: 'Location Address' },
          { name: 'capacity', label: 'Capacity', type: 'number' },
          { name: 'manager_id', label: 'Manager' },
        ]}
        defaultValues={selectedWarehouse}
      />
    </div>
  );
}
