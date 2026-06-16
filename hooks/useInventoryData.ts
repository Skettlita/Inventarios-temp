'use client';

import { useState, useCallback, useEffect } from 'react';
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
export function useProducts(branchId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(branchId);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchProducts();
    }
  }, [branchId, fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// useAssets Hook
export function useAssets(branchId: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssets(branchId);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchAssets();
    }
  }, [branchId, fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
}

// useWarehouses Hook
export function useWarehouses(branchId: string) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWarehouses(branchId);
      setWarehouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchWarehouses();
    }
  }, [branchId, fetchWarehouses]);

  return { warehouses, loading, error, refetch: fetchWarehouses };
}

// useWarehouseLocations Hook
export function useWarehouseLocations(warehouseId: string) {
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
    if (warehouseId) {
      fetchLocations();
    }
  }, [warehouseId, fetchLocations]);

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
export function usePurchases(branchId: string) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchases(branchId);
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchPurchases();
    }
  }, [branchId, fetchPurchases]);

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
export function useMovements(branchId: string) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovements(branchId);
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movements');
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchMovements();
    }
  }, [branchId, fetchMovements]);

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
