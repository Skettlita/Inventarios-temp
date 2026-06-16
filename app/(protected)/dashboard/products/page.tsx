'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';

export default function ProductsPage() {
  const { products, loading, error, refetchProducts } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (formData) => {
    // TODO: Implement actual product creation with Supabase
    console.log('Creating product:', formData);
    setIsModalOpen(false);
    refetchProducts();
  };

  const handleUpdateProduct = async (formData) => {
    // TODO: Implement actual product update with Supabase
    console.log('Updating product:', formData);
    setIsModalOpen(false);
    refetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    // TODO: Implement actual product deletion with Supabase
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', id);
      refetchProducts();
    }
  };

  const columns = [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'brand', header: 'Brand' },
    { accessorKey: 'unit', header: 'Unit' },
    { accessorKey: 'unit_price', header: 'Unit Price' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProduct(row.original);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteProduct(row.original.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading products: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>View and manage all products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Search className="text-muted-foreground h-4 w-4" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={filteredProducts} />
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedProduct ? 'Edit Product' : 'Create Product'}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        fields={[
          { name: 'sku', label: 'SKU', required: true },
          { name: 'name', label: 'Product Name', required: true },
          { name: 'category', label: 'Category' },
          { name: 'brand', label: 'Brand' },
          { name: 'unit', label: 'Unit' },
          { name: 'unit_price', label: 'Unit Price', type: 'number' },
        ]}
        defaultValues={selectedProduct}
      />
    </div>
  );
}
