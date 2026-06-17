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

export default function MovementsPage() {
  const { t } = useI18n();

  const { movements, loading, error, refetchMovements } = useInventoryData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any | null>(null);

  const getReferenceNumber = (movement: any) => {
    return movement.reference_number ?? movement.reference ?? movement.id ?? '';
  };

  const getMovementType = (movement: any) => {
    return movement.movement_type ?? movement.type ?? '';
  };

  const getMovementTypeLabel = (type?: string | null) => {
    if (!type) return '';

    const key = `movementTypes.${type}`;
    const translated = t(key);

    return translated === key ? type : translated;
  };

  const getFromWarehouse = (movement: any) => {
    return (
      movement.from_warehouse_name ??
      movement.warehouse_from_name ??
      movement.warehouses_from?.name ??
      movement.warehouse_from_id ??
      ''
    );
  };

  const getToWarehouse = (movement: any) => {
    return (
      movement.to_warehouse_name ??
      movement.warehouse_to_name ??
      movement.warehouses_to?.name ??
      movement.warehouse_to_id ??
      ''
    );
  };

  const getMovementDate = (movement: any) => {
    return (
      movement.movement_date ??
      movement.date ??
      movement.created_at ??
      ''
    );
  };

  const getMovementReason = (movement: any) => {
    return movement.reason ?? movement.notes ?? '';
  };

  const getMovementStatus = (movement: any) => {
    return movement.status ?? 'completed';
  };

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '';

    const key = `status.${status}`;
    const translated = t(key);

    return translated === key ? status : translated;
  };

  const getStatusVariant = (status?: string | null) => {
    switch (status) {
      case 'cancelled':
        return 'destructive';
      case 'completed':
      case 'received':
        return 'default';
      case 'pending':
      case 'draft':
      case 'partial':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredMovements = movements.filter((movement: any) => {
    const search = searchTerm.toLowerCase();
    const movementType = getMovementType(movement);

    const searchMatch =
      !searchTerm ||
      getReferenceNumber(movement).toLowerCase().includes(search) ||
      getFromWarehouse(movement).toLowerCase().includes(search) ||
      getToWarehouse(movement).toLowerCase().includes(search) ||
      getMovementReason(movement).toLowerCase().includes(search);

    const typeMatch = !typeFilter || movementType === typeFilter;

    return searchMatch && typeMatch;
  });

  const handleCreateMovement = async (formData: any) => {
    // TODO: Implementar creación real con Supabase
    console.log('Creating movement:', formData);
    setIsModalOpen(false);
    refetchMovements();
  };

  const handleUpdateMovement = async (formData: any) => {
    // TODO: Implementar actualización real con Supabase
    console.log('Updating movement:', formData);
    setIsModalOpen(false);
    refetchMovements();
  };

  const handleDeleteMovement = async (id: string) => {
    // TODO: Implementar eliminación real con Supabase
    if (confirm(t('common.confirmDelete'))) {
      console.log('Deleting movement:', id);
      refetchMovements();
    }
  };

  const columns = [
    {
      id: 'reference_number',
      header: t('fields.referenceNumber'),
      cell: ({ row }: { row: { original: any } }) =>
        getReferenceNumber(row.original),
    },
    {
      id: 'movement_type',
      header: t('fields.movementType'),
      cell: ({ row }: { row: { original: any } }) =>
        getMovementTypeLabel(getMovementType(row.original)),
    },
    {
      id: 'from_warehouse',
      header: t('fields.fromWarehouse'),
      cell: ({ row }: { row: { original: any } }) =>
        getFromWarehouse(row.original),
    },
    {
      id: 'to_warehouse',
      header: t('fields.toWarehouse'),
      cell: ({ row }: { row: { original: any } }) =>
        getToWarehouse(row.original),
    },
    {
      id: 'movement_date',
      header: t('fields.date'),
      cell: ({ row }: { row: { original: any } }) =>
        getMovementDate(row.original),
    },
    {
      id: 'status',
      header: t('fields.status'),
      cell: ({ row }: { row: { original: any } }) => {
        const status = getMovementStatus(row.original);

        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/movements/${row.original.id}`}>
            <Button size="sm" variant="outline">
              {t('common.view')}
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
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteMovement(row.original.id)}
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
            {t('inventory.movementsTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('inventory.movementsSubtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedMovement(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('inventory.newMovement')}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingMovements')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.movementHistory')}</CardTitle>
          <CardDescription>
            {t('inventory.movementHistoryDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchMovement')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-background"
              >
                <option value="">{t('common.allTypes')}</option>
                <option value="purchase">{t('movementTypes.purchase')}</option>
                <option value="sale">{t('movementTypes.sale')}</option>
                <option value="transfer">{t('movementTypes.transfer')}</option>
                <option value="adjustment">{t('movementTypes.adjustment')}</option>
                <option value="return">{t('movementTypes.return')}</option>
                <option value="damage">{t('movementTypes.damage')}</option>
                <option value="installation">{t('movementTypes.installation')}</option>
                <option value="entry">{t('movementTypes.entry')}</option>
                <option value="exit">{t('movementTypes.exit')}</option>
              </select>

              <Search className="text-muted-foreground h-4 w-4 mt-3" />
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
        title={
          selectedMovement
            ? t('inventory.editMovement')
            : t('inventory.createMovement')
        }
        onSubmit={
          selectedMovement
            ? handleUpdateMovement
            : handleCreateMovement
        }
        fields={[
          {
            name: 'reference_number',
            label: t('fields.referenceNumber'),
            type: 'text',
          },
          {
            name: 'movement_type',
            label: t('fields.movementType'),
            type: 'select',
            required: true,
            options: [
              { value: 'purchase', label: t('movementTypes.purchase') },
              { value: 'sale', label: t('movementTypes.sale') },
              { value: 'transfer', label: t('movementTypes.transfer') },
              { value: 'adjustment', label: t('movementTypes.adjustment') },
              { value: 'return', label: t('movementTypes.return') },
              { value: 'damage', label: t('movementTypes.damage') },
              { value: 'installation', label: t('movementTypes.installation') },
              { value: 'entry', label: t('movementTypes.entry') },
              { value: 'exit', label: t('movementTypes.exit') },
            ],
          },
          {
            name: 'warehouse_from_id',
            label: t('fields.fromWarehouse'),
            type: 'text',
          },
          {
            name: 'warehouse_to_id',
            label: t('fields.toWarehouse'),
            type: 'text',
          },
          {
            name: 'movement_date',
            label: t('fields.date'),
            type: 'date',
          },
          {
            name: 'reason',
            label: t('fields.reason'),
            type: 'textarea',
          },
          {
            name: 'status',
            label: t('fields.status'),
            type: 'select',
            options: [
              { value: 'draft', label: t('status.draft') },
              { value: 'pending', label: t('status.pending') },
              { value: 'completed', label: t('status.completed') },
              { value: 'cancelled', label: t('status.cancelled') },
            ],
          },
        ]}
        defaultValues={selectedMovement}
      />
    </div>
  );
}