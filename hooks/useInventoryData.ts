'use client';
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  getProducts,
  getAssets,
  getWarehouses,
  getWarehouseLocations,
  getStock,
  getPurchases,
  getMovements,
  getPurchaseItems,
  getMovementItems,
} from '@/lib/db-queries';
import type {
  Product,
  Asset,
  Warehouse,
  WarehouseLocation,
  Stock,
  Purchase,
  Movement,
  PurchaseItem,
  MovementItem,
} from '@/types/database';

// useProducts Hook
export function useProducts(branchId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// useAssets Hook
export function useAssets(branchId?: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
}

// useWarehouses Hook
export function useWarehouses(branchId?: string) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    
    fetchWarehouses();
    
  }, [fetchWarehouses]);

  return { warehouses, loading, error, refetch: fetchWarehouses };
}

// useWarehouseLocations Hook
export function useWarehouseLocations(warehouseId?: string) {
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWarehouseLocations(warehouseId);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchLocations();
    
  }, [fetchLocations]);

  return { locations, loading, error, refetch: fetchLocations };
}

// useStock Hook
export function useStock(warehouseId?: string) {
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStock(warehouseId);
      setStock(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock');
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchStock();
  }, [warehouseId, fetchStock]);

  return { stock, loading, error, refetch: fetchStock };
}

// usePurchases Hook
export function usePurchases(branchId?: string) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchPurchases();
    
  }, [fetchPurchases]);

  return { purchases, loading, error, refetch: fetchPurchases };
}

// usePurchaseItems Hook
export function usePurchaseItems(purchaseId: string) {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchaseItems(purchaseId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase items');
    } finally {
      setLoading(false);
    }
  }, [purchaseId]);

  useEffect(() => {
    if (purchaseId) {
      fetchItems();
    }
  }, [purchaseId, fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

// useMovements Hook
export function useMovements(branchId?: string) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovements();
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movements');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchMovements(); 
  }, [fetchMovements]);

  return { movements, loading, error, refetch: fetchMovements };
}

// useMovementItems Hook
export function useMovementItems(movementId: string) {
  const [items, setItems] = useState<MovementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovementItems(movementId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movement items');
    } finally {
      setLoading(false);
    }
  }, [movementId]);

  useEffect(() => {
    if (movementId) {
      fetchItems();
    }
  }, [movementId, fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}
export function useInventoryData() {
  const productsState = useProducts('');
  const assetsState = useAssets('');
  const warehousesState = useWarehouses('');
  const locationsState = useWarehouseLocations('');
  const stockState = useStock();
  const purchasesState = usePurchases('');
  const movementsState = useMovements('');

  const loading =
    productsState.loading ||
    assetsState.loading ||
    warehousesState.loading ||
    locationsState.loading ||
    stockState.loading ||
    purchasesState.loading ||
    movementsState.loading;

  const error =
    productsState.error ||
    assetsState.error ||
    warehousesState.error ||
    locationsState.error ||
    stockState.error ||
    purchasesState.error ||
    movementsState.error;

  return {
    products: productsState.products,
    assets: assetsState.assets,
    warehouses: warehousesState.warehouses,
    warehouseLocations: locationsState.locations,
    stock: stockState.stock,
    purchases: purchasesState.purchases,
    movements: movementsState.movements,

    loading,
    error,

    refetchProducts: productsState.refetch,
    refetchAssets: assetsState.refetch,
    refetchWarehouses: warehousesState.refetch,
    refetchLocations: locationsState.refetch,
    refetchStock: stockState.refetch,
    refetchPurchases: purchasesState.refetch,
    refetchMovements: movementsState.refetch,
  };
}