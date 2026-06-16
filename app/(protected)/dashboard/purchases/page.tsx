'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { Loader2, Plus } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import Link from 'next/link';

export default function PurchasesPage() {
  const { purchases, loading, error, refetchPurchases } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const filteredPurchases = purchases.filter((purchase) => {
    const searchMatch =
      !searchTerm ||
      purchase.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !statusFilter || purchase.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleCreatePurchase = async (formData) => {
    console.log('Creating purchase:', formData);
    setIsModalOpen(false);
    refetchPurchases();
  };

  const handleUpdatePurchase = async (formData) => {
    console.log('Updating purchase:', formData);
    setIsModalOpen(false);
    refetchPurchases();
  };

  const handleDeletePurchase = async (id) => {
    if (confirm('Are you sure you want to delete this purchase?')) {
      console.log('Deleting purchase:', id);
      refetchPurchases();
    }
  };

  const columns = [
    { accessorKey: 'po_number', header: 'PO #' },
    { accessorKey: 'supplier_name', header: 'Supplier' },
    { accessorKey: 'order_date', header: 'Order Date' },
    { accessorKey: 'expected_delivery', header: 'Expected Delivery' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'total_amount', header: 'Total Amount' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/purchases/${row.original.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedPurchase(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeletePurchase(row.original.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground">Manage purchase orders and supplier invoices</p>
        </div>
        <Button onClick={() => {
          setSelectedPurchase(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading purchases: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>View and manage all purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search by PO # or supplier..."
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
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredPurchases} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedPurchase ? 'Edit Purchase' : 'Create Purchase'}
        onSubmit={selectedPurchase ? handleUpdatePurchase : handleCreatePurchase}
        fields={[
          { name: 'po_number', label: 'PO Number', required: true },
          { name: 'supplier_id', label: 'Supplier', type: 'select', required: true },
          { name: 'order_date', label: 'Order Date', type: 'date' },
          { name: 'expected_delivery', label: 'Expected Delivery', type: 'date' },
          { name: 'status', label: 'Status', type: 'select' },
          { name: 'total_amount', label: 'Total Amount', type: 'number' },
        ]}
        defaultValues={selectedPurchase}
      />
    </div>
  );
}
