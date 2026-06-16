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

const inventory = () => supabase.schema('inventory');

function normalizeProduct(row: any): Product {
  return {
    ...row,
    category: row.categories?.name ?? '',
    brand: row.brands?.name ?? '',
    unit: row.units?.symbol ?? row.units?.name ?? '',
    unit_price: Number(row.sale_price ?? 0),
  };
}

function normalizeAsset(row: any): Asset {
  return {
    ...row,
    product_name: row.products?.name ?? '',
    warehouse_name: row.warehouses?.name ?? '',
    location_name: row.warehouse_locations?.name ?? '',
    asset_tag: row.asset_code ?? '',
  };
}

function normalizeStock(row: any): Stock {
  return {
    ...row,
    product_name: row.products?.name ?? '',
    product_sku: row.products?.sku ?? '',
    min_stock: Number(row.products?.min_stock ?? 0),
    warehouse_name: row.warehouses?.name ?? '',
    location_name: row.warehouse_locations?.name ?? '',
    quantity_on_hand: Number(row.quantity ?? 0),
    quantity_reserved: Number(row.reserved_quantity ?? 0),
    available_quantity: Number(row.available_quantity ?? 0),
  };
}

// Products
export async function getProducts() {
  const { data, error } = await inventory()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeProduct) as Product[];
}

export async function getProductById(productId: string) {
  const { data, error } = await inventory()
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return normalizeProduct(data) as Product;
}

export async function createProduct(product: Partial<Product>) {
  const payload = {
    company_id: product.company_id,
    category_id: product.category_id || null,
    brand_id: product.brand_id || null,
    unit_id: product.unit_id || null,
    sku: product.sku,
    name: product.name,
    model: product.model || null,
    description: product.description || null,
    tracking_type: product.tracking_type || 'none',
    product_type: product.product_type || 'equipment',
    min_stock: product.min_stock ?? 0,
    cost_price: product.cost_price ?? 0,
    sale_price: product.sale_price ?? product.unit_price ?? 0,
    status: product.status || 'active',
  };

  const { data, error } = await inventory()
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(productId: string, updates: Partial<Product>) {
  const payload: any = { ...updates };

  delete payload.category;
  delete payload.brand;
  delete payload.unit;
  delete payload.unit_price;

  const { data, error } = await inventory()
    .from('products')
    .update(payload)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(productId: string) {
  const { error } = await inventory().from('products').delete().eq('id', productId);
  if (error) throw error;
}

// Assets
export async function getAssets() {
  const { data, error } = await inventory()
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeAsset) as Asset[];
}

export async function getAssetById(assetId: string) {
  const { data, error } = await inventory()
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (error) throw error;
  return normalizeAsset(data) as Asset;
}

export async function createAsset(asset: Partial<Asset>) {
  const { data, error } = await inventory()
    .from('assets')
    .insert([asset])
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function updateAsset(assetId: string, updates: Partial<Asset>) {
  const { data, error } = await inventory()
    .from('assets')
    .update(updates)
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

export async function deleteAsset(assetId: string) {
  const { error } = await inventory().from('assets').delete().eq('id', assetId);
  if (error) throw error;
}

// Warehouses
export async function getWarehouses(branchId?: string) {
  let query = inventory()
    .from('warehouses')
    .select('*')
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Warehouse[];
}

export async function getWarehouseById(warehouseId: string) {
  const { data, error } = await inventory()
    .from('warehouses')
    .select('*')
    .eq('id', warehouseId)
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function createWarehouse(warehouse: Partial<Warehouse>) {
  const { data, error } = await inventory()
    .from('warehouses')
    .insert([warehouse])
    .select()
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function updateWarehouse(warehouseId: string, updates: Partial<Warehouse>) {
  const { data, error } = await inventory()
    .from('warehouses')
    .update(updates)
    .eq('id', warehouseId)
    .select()
    .single();

  if (error) throw error;
  return data as Warehouse;
}

export async function deleteWarehouse(warehouseId: string) {
  const { error } = await inventory().from('warehouses').delete().eq('id', warehouseId);
  if (error) throw error;
}

// Warehouse Locations
export async function getWarehouseLocations(warehouseId?: string) {
  let query = inventory()
    .from('warehouse_locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (warehouseId) {
    query = query.eq('warehouse_id', warehouseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as WarehouseLocation[];
}

export async function getWarehouseLocationById(locationId: string) {
  const { data, error } = await inventory()
    .from('warehouse_locations')
    .select('*')
    .eq('id', locationId)
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function createWarehouseLocation(location: Partial<WarehouseLocation>) {
  const { data, error } = await inventory()
    .from('warehouse_locations')
    .insert([location])
    .select()
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function updateWarehouseLocation(locationId: string, updates: Partial<WarehouseLocation>) {
  const { data, error } = await inventory()
    .from('warehouse_locations')
    .update(updates)
    .eq('id', locationId)
    .select()
    .single();

  if (error) throw error;
  return data as WarehouseLocation;
}

export async function deleteWarehouseLocation(locationId: string) {
  const { error } = await inventory().from('warehouse_locations').delete().eq('id', locationId);
  if (error) throw error;
}

// Stock
export async function getStock(warehouseId?: string) {
  let query = inventory()
    .from('stock')
    .select('*')

  if (warehouseId) {
    query = query.eq('warehouse_id', warehouseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(normalizeStock) as Stock[];
}

export async function getStockByProduct(productId: string) {
  const { data, error } = await inventory()
    .from('stock')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;
  return (data ?? []).map(normalizeStock) as Stock[];
}

export async function updateStock(stockId: string, updates: Partial<Stock>) {
  const payload: any = {
    quantity: updates.quantity ?? updates.quantity_on_hand,
    reserved_quantity: updates.reserved_quantity ?? updates.quantity_reserved,
  };

  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  const { data, error } = await inventory()
    .from('stock')
    .update(payload)
    .eq('id', stockId)
    .select()
    .single();

  if (error) throw error;
  return data as Stock;
}

// Purchases
export async function getPurchases(branchId?: string) {
  let query = inventory()
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Purchase[];
}

export async function getPurchaseById(purchaseId: string) {
  const { data, error } = await inventory()
    .from('purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function createPurchase(purchase: Partial<Purchase>) {
  const { data, error } = await inventory()
    .from('purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function updatePurchase(purchaseId: string, updates: Partial<Purchase>) {
  const { data, error } = await inventory()
    .from('purchases')
    .update(updates)
    .eq('id', purchaseId)
    .select()
    .single();

  if (error) throw error;
  return data as Purchase;
}

export async function deletePurchase(purchaseId: string) {
  const { error } = await inventory().from('purchases').delete().eq('id', purchaseId);
  if (error) throw error;
}

// Purchase Items
export async function getPurchaseItems(purchaseId: string) {
  const { data, error } = await inventory()
    .from('purchase_items')
    .select('*')
    .eq('purchase_id', purchaseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PurchaseItem[];
}

export async function createPurchaseItem(item: Partial<PurchaseItem>) {
  const { data, error } = await inventory()
    .from('purchase_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseItem;
}

export async function updatePurchaseItem(itemId: string, updates: Partial<PurchaseItem>) {
  const { data, error } = await inventory()
    .from('purchase_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseItem;
}

export async function deletePurchaseItem(itemId: string) {
  const { error } = await inventory().from('purchase_items').delete().eq('id', itemId);
  if (error) throw error;
}

// Movements
export async function getMovements(branchId?: string) {
  let query = inventory()
    .from('movements')
    .select('*')
    .order('created_at', { ascending: false });

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Movement[];
}

export async function getMovementById(movementId: string) {
  const { data, error } = await inventory()
    .from('movements')
    .select('*')
    .eq('id', movementId)
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function createMovement(movement: Partial<Movement>) {
  const { data, error } = await inventory()
    .from('movements')
    .insert([movement])
    .select()
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function updateMovement(movementId: string, updates: Partial<Movement>) {
  const { data, error } = await inventory()
    .from('movements')
    .update(updates)
    .eq('id', movementId)
    .select()
    .single();

  if (error) throw error;
  return data as Movement;
}

export async function deleteMovement(movementId: string) {
  const { error } = await inventory().from('movements').delete().eq('id', movementId);
  if (error) throw error;
}

// Movement Items
export async function getMovementItems(movementId: string) {
  const { data, error } = await inventory()
    .from('movement_items')
    .select('*')
    .eq('movement_id', movementId);

  if (error) throw error;
  return data as MovementItem[];
}

export async function createMovementItem(item: Partial<MovementItem>) {
  const { data, error } = await inventory()
    .from('movement_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as MovementItem;
}

export async function updateMovementItem(itemId: string, updates: Partial<MovementItem>) {
  const { data, error } = await inventory()
    .from('movement_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data as MovementItem;
}

export async function deleteMovementItem(itemId: string) {
  const { error } = await inventory().from('movement_items').delete().eq('id', itemId);
  if (error) throw error;
}
