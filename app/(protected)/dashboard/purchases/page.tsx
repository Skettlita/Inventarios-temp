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
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function PurchasesPage() {
  const { t } = useI18n();

  const { purchases, loading, error, refetchPurchases } = useInventoryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);

  const getPurchaseNumber = (purchase: any) => {
    return purchase.purchase_number ?? purchase.po_number ?? purchase.order_number ?? '';
  };

  const getSupplierName = (purchase: any) => {
    return purchase.supplier_name ?? purchase.supplier ?? '';
  };

  const getPurchaseDate = (purchase: any) => {
    return purchase.purchase_date ?? purchase.order_date ?? purchase.created_at ?? '';
  };

  const getExpectedDelivery = (purchase: any) => {
    return purchase.expected_date ?? purchase.expected_delivery ?? '';
  };

  const getTotalAmount = (purchase: any) => {
    return Number(purchase.total_amount ?? purchase.total ?? 0);
  };

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '';

    return t(`status.${status}`);
  };

  const getStatusVariant = (status?: string | null) => {
    switch (status) {
      case 'cancelled':
        return 'destructive';
      case 'received':
      case 'completed':
        return 'default';
      case 'partial':
      case 'pending':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value);
  };

  const filteredPurchases = purchases.filter((purchase: any) => {
    const search = searchTerm.toLowerCase();

    const searchMatch =
      !searchTerm ||
      getPurchaseNumber(purchase).toLowerCase().includes(search) ||
      getSupplierName(purchase).toLowerCase().includes(search);

    const statusMatch = !statusFilter || purchase.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleCreatePurchase = async (formData: any) => {
    // TODO: Implementar creación real con Supabase
    console.log('Creating purchase:', formData);
    setIsModalOpen(false);
    refetchPurchases();
  };

  const handleUpdatePurchase = async (formData: any) => {
    // TODO: Implementar actualización real con Supabase
    console.log('Updating purchase:', formData);
    setIsModalOpen(false);
    refetchPurchases();
  };

  const handleDeletePurchase = async (id: string) => {
    // TODO: Implementar eliminación real con Supabase
    if (confirm(t('common.confirmDelete'))) {
      console.log('Deleting purchase:', id);
      refetchPurchases();
    }
  };

  const columns = [
    {
      id: 'purchase_number',
      header: t('fields.purchaseOrderNumber'),
      cell: ({ row }: { row: { original: any } }) =>
        getPurchaseNumber(row.original),
    },
    {
      id: 'supplier',
      header: t('fields.supplier'),
      cell: ({ row }: { row: { original: any } }) =>
        getSupplierName(row.original),
    },
    {
      id: 'purchase_date',
      header: t('fields.orderDate'),
      cell: ({ row }: { row: { original: any } }) =>
        getPurchaseDate(row.original),
    },
    {
      id: 'expected_delivery',
      header: t('fields.expectedDelivery'),
      cell: ({ row }: { row: { original: any } }) =>
        getExpectedDelivery(row.original),
    },
    {
      id: 'total_amount',
      header: t('fields.totalAmount'),
      cell: ({ row }: { row: { original: any } }) =>
        formatMoney(getTotalAmount(row.original)),
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
          <Link href={`/dashboard/purchases/${row.original.id}`}>
            <Button size="sm" variant="outline">
              {t('common.view')}
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
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeletePurchase(row.original.id)}
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
            {t('inventory.purchasesTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('inventory.purchasesSubtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedPurchase(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('inventory.newPurchase')}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingPurchases')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.purchaseOrders')}</CardTitle>
          <CardDescription>
            {t('inventory.purchaseOrdersDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchPurchase')}
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
                <option value="draft">{t('status.draft')}</option>
                <option value="pending">{t('status.pending')}</option>
                <option value="partial">{t('status.partial')}</option>
                <option value="received">{t('status.received')}</option>
                <option value="completed">{t('status.completed')}</option>
                <option value="cancelled">{t('status.cancelled')}</option>
              </select>

              <Search className="text-muted-foreground h-4 w-4 mt-3" />
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
        title={
          selectedPurchase
            ? t('inventory.editPurchase')
            : t('inventory.createPurchase')
        }
        onSubmit={
          selectedPurchase
            ? handleUpdatePurchase
            : handleCreatePurchase
        }
        fields={[
          {
            name: 'purchase_number',
            label: t('fields.purchaseOrderNumber'),
            type: 'text',
            required: true,
          },
          {
            name: 'supplier_id',
            label: t('fields.supplier'),
            type: 'text',
          },
          {
            name: 'purchase_date',
            label: t('fields.orderDate'),
            type: 'date',
          },
          {
            name: 'expected_date',
            label: t('fields.expectedDelivery'),
            type: 'date',
          },
          {
            name: 'total_amount',
            label: t('fields.totalAmount'),
            type: 'number',
          },
          {
            name: 'status',
            label: t('fields.status'),
            type: 'select',
            options: [
              { value: 'draft', label: t('status.draft') },
              { value: 'pending', label: t('status.pending') },
              { value: 'partial', label: t('status.partial') },
              { value: 'received', label: t('status.received') },
              { value: 'completed', label: t('status.completed') },
              { value: 'cancelled', label: t('status.cancelled') },
            ],
          },
        ]}
        defaultValues={selectedPurchase}
      />
    </div>
  );
}