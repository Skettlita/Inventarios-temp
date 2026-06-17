'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function InventoryDashboard() {
  const { t } = useI18n();

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalAssets: 0,
    lowStockItems: 0,
    pendingPurchases: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        setMetrics({
          totalProducts: 0,
          totalAssets: 0,
          lowStockItems: 0,
          pendingPurchases: 0,
        });
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('inventory.dashboardTitle')}
        </h1>
        <p className="text-muted-foreground">
          {t('inventory.dashboardSubtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('inventory.totalProducts')}
            </CardTitle>
            <Badge variant="secondary">{t('nav.products')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.activeProductsInInventory')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('inventory.totalAssets')}
            </CardTitle>
            <Badge variant="secondary">{t('nav.assets')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.trackedAssets')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('inventory.lowStockItems')}
            </CardTitle>
            <Badge variant="destructive">{t('common.alert')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.belowReorderLevel')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('inventory.pendingPurchases')}
            </CardTitle>
            <Badge variant="outline">{t('common.pending')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingPurchases}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.openPurchaseOrders')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.recentActivity')}</CardTitle>
          <CardDescription>
            {t('inventory.latestInventoryMovementsAndUpdates')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('inventory.activityFeedPlaceholder')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}