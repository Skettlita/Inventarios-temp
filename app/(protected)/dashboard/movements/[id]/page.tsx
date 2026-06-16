'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MovementDetailsPage() {
  const params = useParams();
  const movementId = params.id as string;
  const [movement, setMovement] = useState(null);
  const [movementItems, setMovementItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovementDetails = async () => {
      try {
        setLoading(true);
        // TODO: Load movement details and line items from Supabase when credentials are available
        console.log('Loading movement:', movementId);
        setMovement(null);
        setMovementItems([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movement');
      } finally {
        setLoading(false);
      }
    };

    loadMovementDetails();
  }, [movementId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

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

  const itemColumns = [
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'quantity_moved', header: 'Quantity Moved' },
    { accessorKey: 'from_location', header: 'From Location' },
    { accessorKey: 'to_location', header: 'To Location' },
    { accessorKey: 'notes', header: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/movements">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movements
        </Button>
      </Link>

      {movement && (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Movement {movement.reference_number}
            </h1>
            <p className="text-muted-foreground">View and manage movement details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Movement Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Reference Number</p>
                  <p className="font-medium">{movement.reference_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Movement Type</p>
                  <Badge className={getMovementTypeColor(movement.type)}>
                    {movement.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{movement.movement_date}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Warehouse Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">From Warehouse</p>
                  <p className="font-medium">{movement.from_warehouse_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To Warehouse</p>
                  <p className="font-medium">{movement.to_warehouse_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Quantity</p>
                  <p className="font-medium">{movement.quantity_moved}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Products included in this movement</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={itemColumns} data={movementItems} />
            </CardContent>
          </Card>

          {movement.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{movement.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete Movement</Button>
          </div>
        </>
      )}
    </div>
  );
}
