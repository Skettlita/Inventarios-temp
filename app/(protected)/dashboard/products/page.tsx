'use client';

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
import { Loader2, Plus, Search } from 'lucide-react';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function ProductsPage() {
  const { t } = useI18n();

  const { products, loading, error, refetchProducts } = useInventoryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (formData: any) => {
    // TODO: Implement actual product creation with Supabase
    console.log('Creating product:', formData);
    setIsModalOpen(false);
    refetchProducts();
  };

  const handleUpdateProduct = async (formData: any) => {
    // TODO: Implement actual product update with Supabase
    console.log('Updating product:', formData);
    setIsModalOpen(false);
    refetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    // TODO: Implement actual product deletion with Supabase
    if (confirm(t('common.confirmDelete'))) {
      console.log('Deleting product:', id);
      refetchProducts();
    }
  };

  const columns = [
    { accessorKey: 'sku', header: t('fields.sku') },
    { accessorKey: 'name', header: t('fields.productName') },
    { accessorKey: 'category', header: t('fields.category') },
    { accessorKey: 'brand', header: t('fields.brand') },
    { accessorKey: 'unit', header: t('fields.unit') },
    { accessorKey: 'unit_price', header: t('fields.unitPrice') },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProduct(row.original);
              setIsModalOpen(true);
            }}
          >
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteProduct(row.original.id)}
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
            {t('inventory.productsTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('inventory.productsSubtitle')}
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('inventory.newProduct')}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {t('errors.loadingProducts')}: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.productCatalog')}</CardTitle>
          <CardDescription>
            {t('inventory.productCatalogDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('inventory.searchProduct')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Search className="text-muted-foreground h-4 w-4 mt-3" />
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
        title={
          selectedProduct
            ? t('inventory.editProduct')
            : t('inventory.createProduct')
        }
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        fields={[
          { name: 'sku', label: t('fields.sku'), required: true },
          { name: 'name', label: t('fields.productName'), required: true },
          { name: 'category', label: t('fields.category') },
          { name: 'brand', label: t('fields.brand') },
          { name: 'unit', label: t('fields.unit') },
          { name: 'unit_price', label: t('fields.unitPrice'), type: 'number' },
        ]}
        defaultValues={selectedProduct}
      />
    </div>
  );
}