'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import Link from 'next/link';

export default function MovementsPage() {
  const { movements, loading, error, refetchMovements } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const movementTypes = ['transfer_out', 'transfer_in', 'adjustment', 'sale', 'return'];

  const filteredMovements = movements.filter((movement) => {
    const searchMatch =
      !searchTerm ||
      movement.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.from_warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.to_warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = !typeFilter || movement.type === typeFilter;
    return searchMatch && typeMatch;
  });

  const handleCreateMovement = async (formData) => {
    console.log('Creating movement:', formData);
    setIsModalOpen(false);
    refetchMovements();
  };

  const handleUpdateMovement = async (formData) => {
    console.log('Updating movement:', formData);
    setIsModalOpen(false);
    refetchMovements();
  };

  const handleDeleteMovement = async (id) => {
    if (confirm('Are you sure you want to delete this movement?')) {
      console.log('Deleting movement:', id);
      refetchMovements();
    }
  };

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'transfer_out':
        return 'bg-orange-100 text-orange-800';
      case 'transfer_in':
        return 'bg-green-100 text-green-800';
      case 'adjustment':
        return 'bg-blue-100 text-blue-800';
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'return':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { accessorKey: 'reference_number', header: 'Reference #' },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className={getMovementTypeColor(row.original.type)}>
          {row.original.type.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    { accessorKey: 'from_warehouse_name', header: 'From Warehouse' },
    { accessorKey: 'to_warehouse_name', header: 'To Warehouse' },
    { accessorKey: 'movement_date', header: 'Date' },
    { accessorKey: 'quantity_moved', header: 'Quantity' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/movements/${row.original.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedMovement(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteMovement(row.original.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Inventory Movements</h1>
          <p className="text-muted-foreground">Track stock transfers, adjustments, and other movements</p>
        </div>
        <Button onClick={() => {
          setSelectedMovement(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Movement
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading movements: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
          <CardDescription>View all inventory movements and transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search by reference number or warehouse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="">All Types</option>
                {movementTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredMovements} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedMovement ? 'Edit Movement' : 'Create Movement'}
        onSubmit={selectedMovement ? handleUpdateMovement : handleCreateMovement}
        fields={[
          { name: 'reference_number', label: 'Reference Number' },
          { name: 'type', label: 'Movement Type', type: 'select', required: true },
          { name: 'from_warehouse_id', label: 'From Warehouse', type: 'select' },
          { name: 'to_warehouse_id', label: 'To Warehouse', type: 'select' },
          { name: 'movement_date', label: 'Date', type: 'date' },
          { name: 'notes', label: 'Notes' },
        ]}
        defaultValues={selectedMovement}
      />
    </div>
  );
}
