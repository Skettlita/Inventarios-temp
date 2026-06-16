import { supabase } from './supabase';
import type {
  Product,
  Asset,
  Warehouse,
  WarehouseLocation,
  Stock,
  Purchase,
  PurchaseItem,
  Movement,
  MovementItem,
} from '@/types/database';

// Products
export async function getProducts(branchId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(productId: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}

// Assets
export async function getAssets(branchId: string) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

export async function getAssetById(assetId: string) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function createAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('assets')
    .insert([asset])
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function updateAsset(assetId: string, updates: Partial<Asset>) {
  const { data, error } = await supabase
    .from('assets')
    .update(updates)
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function deleteAsset(assetId: string) {
  const { error } = await supabase.from('assets').delete().eq('id', assetId);
  if (error) throw error;
}

// Warehouses
export async function getWarehouses(branchId: string) {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Warehouse[];
}

export async function getWarehouseById(warehouseId: string) {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', warehouseId)
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function createWarehouse(warehouse: Omit<Warehouse, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('warehouses')
    .insert([warehouse])
    .select()
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function updateWarehouse(warehouseId: string, updates: Partial<Warehouse>) {
  const { data, error } = await supabase
    .from('warehouses')
    .update(updates)
    .eq('id', warehouseId)
    .select()
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function deleteWarehouse(warehouseId: string) {
  const { error } = await supabase.from('warehouses').delete().eq('id', warehouseId);
  if (error) throw error;
}

// Warehouse Locations
export async function getWarehouseLocations(warehouseId: string) {
  const { data, error } = await supabase
    .from('warehouse_locations')
    .select('*')
    .eq('warehouse_id', warehouseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WarehouseLocation[];
}

export async function getWarehouseLocationById(locationId: string) {
  const { data, error } = await supabase
    .from('warehouse_locations')
    .select('*')
    .eq('id', locationId)
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function createWarehouseLocation(location: Omit<WarehouseLocation, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('warehouse_locations')
    .insert([location])
    .select()
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function updateWarehouseLocation(locationId: string, updates: Partial<WarehouseLocation>) {
  const { data, error } = await supabase
    .from('warehouse_locations')
    .update(updates)
    .eq('id', locationId)
    .select()
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function deleteWarehouseLocation(locationId: string) {
  const { error } = await supabase.from('warehouse_locations').delete().eq('id', locationId);
  if (error) throw error;
}

// Stock
export async function getStock(warehouseId?: string) {
  let query = supabase.from('stock').select('*');
  
  if (warehouseId) {
    query = query.eq('warehouse_id', warehouseId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Stock[];
}

export async function getStockByProduct(productId: string) {
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;
  return data as Stock[];
}

export async function updateStock(stockId: string, updates: Partial<Stock>) {
  const { data, error } = await supabase
    .from('stock')
    .update(updates)
    .eq('id', stockId)
    .select()
    .single();

  if (error) throw error;
  return data as Stock;
}

// Purchases
export async function getPurchases(branchId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Purchase[];
}

export async function getPurchaseById(purchaseId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function createPurchase(purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function updatePurchase(purchaseId: string, updates: Partial<Purchase>) {
  const { data, error } = await supabase
    .from('purchases')
    .update(updates)
    .eq('id', purchaseId)
    .select()
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function deletePurchase(purchaseId: string) {
  const { error } = await supabase.from('purchases').delete().eq('id', purchaseId);
  if (error) throw error;
}

// Purchase Items
export async function getPurchaseItems(purchaseId: string) {
  const { data, error } = await supabase
    .from('purchase_items')
    .select('*')
    .eq('purchase_id', purchaseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PurchaseItem[];
}

export async function createPurchaseItem(item: Omit<PurchaseItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('purchase_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseItem;
}

export async function updatePurchaseItem(itemId: string, updates: Partial<PurchaseItem>) {
  const { data, error } = await supabase
    .from('purchase_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseItem;
}

export async function deletePurchaseItem(itemId: string) {
  const { error } = await supabase.from('purchase_items').delete().eq('id', itemId);
  if (error) throw error;
}

// Movements
export async function getMovements(branchId: string) {
  const { data, error } = await supabase
    .from('movements')
    .select('*')
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Movement[];
}

export async function getMovementById(movementId: string) {
  const { data, error } = await supabase
    .from('movements')
    .select('*')
    .eq('id', movementId)
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function createMovement(movement: Omit<Movement, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('movements')
    .insert([movement])
    .select()
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function updateMovement(movementId: string, updates: Partial<Movement>) {
  const { data, error } = await supabase
    .from('movements')
    .update(updates)
    .eq('id', movementId)
    .select()
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function deleteMovement(movementId: string) {
  const { error } = await supabase.from('movements').delete().eq('id', movementId);
  if (error) throw error;
}

// Movement Items
export async function getMovementItems(movementId: string) {
  const { data, error } = await supabase
    .from('movement_items')
    .select('*')
    .eq('movement_id', movementId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MovementItem[];
}

export async function createMovementItem(item: Omit<MovementItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('movement_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as MovementItem;
}

export async function updateMovementItem(itemId: string, updates: Partial<MovementItem>) {
  const { data, error } = await supabase
    .from('movement_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data as MovementItem;
}

export async function deleteMovementItem(itemId: string) {
  const { error } = await supabase.from('movement_items').delete().eq('id', itemId);
  if (error) throw error;
}
