// =======================================================
// CORE TYPES
// =======================================================

export interface Company {
  id: string;
  name: string;
  nit?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  full_name: string;
  document_number?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// =======================================================
// INVENTORY TYPES
// =======================================================

export type ProductTrackingType = 'none' | 'serial' | 'lot';

export type ProductType =
  | 'equipment'
  | 'accessory'
  | 'consumable'
  | 'tool'
  | 'service'
  | 'kit';

export type EntityStatus = 'active' | 'inactive';

export interface Category {
  id: string;
  company_id: string;
  parent_id?: string | null;
  name: string;
  description?: string | null;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  company_id: string;
  name: string;
  description?: string | null;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  company_id: string;
  name: string;
  symbol: string;
  unit_type: 'unit' | 'length' | 'weight' | 'volume' | 'package';
}

export interface Product {
  id: string;
  company_id: string;

  category_id?: string | null;
  brand_id?: string | null;
  unit_id?: string | null;

  sku?: string | null;
  name: string;
  model?: string | null;
  description?: string | null;

  tracking_type: ProductTrackingType;
  product_type: ProductType;

  min_stock: number;
  cost_price: number;
  sale_price: number;

  status: EntityStatus;

  created_at: string;
  updated_at: string;

  // Campos normalizados para mostrar en tablas
  category?: string;
  brand?: string;
  unit?: string;

  // Alias temporal para pantallas generadas por v0
  unit_price?: number;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
}

export interface Warehouse {
  id: string;
  company_id: string;
  branch_id?: string | null;
  name: string;
  warehouse_type: 'main' | 'branch' | 'technician' | 'vehicle' | 'damaged' | 'virtual';
  address?: string | null;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface WarehouseLocation {
  id: string;
  warehouse_id: string;
  name: string;
  description?: string | null;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  nit?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: string;
  company_id: string;
  product_id: string;
  warehouse_id: string;
  location_id?: string | null;

  quantity: number;
  reserved_quantity: number;
  available_quantity: number;

  updated_at: string;

  // Campos normalizados para mostrar en tablas
  product_name?: string;
  product_sku?: string;
  min_stock?: number;
  warehouse_name?: string;
  location_name?: string;

  // Alias temporales para pantallas generadas por v0
  quantity_on_hand?: number;
  quantity_reserved?: number;
}

export type AssetStatus =
  | 'available'
  | 'reserved'
  | 'in_transit'
  | 'assigned'
  | 'installed'
  | 'sold'
  | 'loaned'
  | 'maintenance'
  | 'damaged'
  | 'returned'
  | 'lost'
  | 'retired';

export type OwnershipType =
  | 'company_owned'
  | 'customer_owned'
  | 'rented'
  | 'loaned'
  | 'sold';

export interface Asset {
  id: string;
  company_id: string;
  product_id: string;
  warehouse_id?: string | null;
  location_id?: string | null;

  serial_number?: string | null;
  mac_address?: string | null;
  imei?: string | null;
  asset_code?: string | null;

  status: AssetStatus;
  ownership_type: OwnershipType;

  purchase_date?: string | null;
  cost_price: number;
  sale_price: number;

  warranty_start?: string | null;
  warranty_end?: string | null;

  current_customer_id?: string | null;
  current_branch_id?: string | null;

  notes?: string | null;

  created_at: string;
  updated_at: string;

  // Campos normalizados para mostrar en tablas
  product_name?: string;
  warehouse_name?: string;
  location_name?: string;

  // Alias temporal para pantallas generadas por v0
  asset_tag?: string;
}

export type PurchaseStatus = 'draft' | 'received' | 'partial' | 'cancelled';

export interface Purchase {
  id: string;
  company_id: string;
  branch_id?: string | null;
  supplier_id?: string | null;

  purchase_number?: string | null;
  invoice_number?: string | null;
  purchase_date: string;

  total_amount: number;
  status: PurchaseStatus;

  notes?: string | null;
  created_by?: string | null;

  created_at: string;
  updated_at: string;

  suppliers?: {
    name?: string;
  } | null;

  branches?: {
    name?: string;
  } | null;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  warehouse_id?: string | null;
  location_id?: string | null;

  quantity: number;
  unit_cost: number;
  total_cost: number;

  notes?: string | null;
  created_at: string;

  products?: {
    name?: string;
    sku?: string | null;
  } | null;
}

export type MovementType =
  | 'purchase_in'
  | 'sale_out'
  | 'transfer_out'
  | 'transfer_in'
  | 'adjustment_in'
  | 'adjustment_out'
  | 'reservation'
  | 'reservation_release'
  | 'installation_out'
  | 'technician_out'
  | 'technician_return'
  | 'warranty_out'
  | 'warranty_return'
  | 'damage'
  | 'retirement';

export type MovementStatus = 'draft' | 'completed' | 'cancelled';

export interface Movement {
  id: string;
  company_id: string;
  branch_id?: string | null;

  movement_type: MovementType;

  reference_type?: string | null;
  reference_id?: string | null;

  warehouse_from_id?: string | null;
  warehouse_to_id?: string | null;

  status: MovementStatus;

  reason?: string | null;
  created_by?: string | null;
  created_at: string;

  warehouses_from?: {
    name?: string;
  } | null;

  warehouses_to?: {
    name?: string;
  } | null;
}

export interface MovementItem {
  id: string;
  movement_id: string;
  product_id: string;
  asset_id?: string | null;

  warehouse_id?: string | null;
  location_id?: string | null;

  quantity: number;
  unit_cost: number;

  stock_before?: number | null;
  stock_after?: number | null;

  notes?: string | null;

  products?: {
    name?: string;
    sku?: string | null;
  } | null;
}

export interface Kit {
  id: string;
  company_id: string;
  name: string;
  description?: string | null;
  sale_price: number;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface KitItem {
  id: string;
  kit_id: string;
  product_id: string;
  quantity: number;
  required: boolean;
  notes?: string | null;
}

export interface Warranty {
  id: string;
  company_id: string;
  asset_id?: string | null;
  product_id?: string | null;
  supplier_id?: string | null;
  customer_id?: string | null;

  warranty_type: 'supplier' | 'customer' | 'internal';

  start_date: string;
  end_date: string;

  status: 'active' | 'expired' | 'claimed' | 'void';

  notes?: string | null;

  created_at: string;
  updated_at: string;
}