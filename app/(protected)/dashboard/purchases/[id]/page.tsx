'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseDetailsPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const [purchase, setPurchase] = useState(null);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPurchaseDetails = async () => {
      try {
        setLoading(true);
        // TODO: Load purchase details and line items from Supabase when credentials are available
        console.log('Loading purchase:', purchaseId);
        setPurchase(null);
        setPurchaseItems([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load purchase');
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseDetails();
  }, [purchaseId]);

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

  const itemColumns = [
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'quantity_ordered', header: 'Quantity Ordered' },
    { accessorKey: 'quantity_received', header: 'Quantity Received' },
    { accessorKey: 'unit_price', header: 'Unit Price' },
    {
      id: 'line_total',
      header: 'Line Total',
      cell: ({ row }) =>
        (row.original.quantity_ordered * row.original.unit_price).toFixed(2),
    },
  ];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/purchases">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchases
        </Button>
      </Link>

      {purchase && (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchase {purchase.po_number}</h1>
            <p className="text-muted-foreground">View and manage purchase order details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">PO Number</p>
                  <p className="font-medium">{purchase.po_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="font-medium">{purchase.supplier_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={purchase.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Order Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-medium">{purchase.order_date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Delivery</p>
                  <p className="font-medium">{purchase.expected_delivery}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${purchase.total_amount?.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Products included in this purchase order</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={itemColumns} data={purchaseItems} />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button>Mark as Received</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Cancel Purchase</Button>
          </div>
        </>
      )}
    </div>
  );
}
