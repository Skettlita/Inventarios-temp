// Core Schema Types
export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  branch_id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  company_id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  changes?: Record<string, any>;
  created_at: string;
}

// Inventory Schema Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  branch_id: string;
  name: string;
  sku: string;
  category_id?: string;
  brand_id?: string;
  unit_id?: string;
  unit_price: number;
  reorder_level?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  company_id: string;
  branch_id: string;
  name: string;
  location?: string;
  capacity?: number;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseLocation {
  id: string;
  warehouse_id: string;
  aisle: string;
  shelf: string;
  bin: string;
  max_capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: string;
  product_id: string;
  warehouse_id: string;
  location_id?: string;
  quantity_on_hand: number;
  quantity_reserved?: number;
  last_counted?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  company_id: string;
  branch_id: string;
  product_id: string;
  asset_tag: string;
  serial_number?: string;
  status: 'active' | 'inactive' | 'damaged' | 'retired';
  location?: string;
  warehouse_id?: string;
  assigned_to?: string;
  purchase_date?: string;
  depreciation_value?: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  company_id: string;
  branch_id: string;
  po_number: string;
  supplier_id: string;
  order_date: string;
  expected_delivery?: string;
  status: 'draft' | 'pending' | 'received' | 'cancelled';
  total_amount?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  received_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface Movement {
  id: string;
  company_id: string;
  branch_id: string;
  movement_type: 'transfer_out' | 'transfer_in' | 'adjustment' | 'sale' | 'return';
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  movement_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MovementItem {
  id: string;
  movement_id: string;
  product_id: string;
  quantity: number;
  from_location_id?: string;
  to_location_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Kit {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface KitItem {
  id: string;
  kit_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Warranty {
  id: string;
  product_id?: string;
  asset_id?: string;
  warranty_type: string;
  start_date: string;
  end_date: string;
  provider?: string;
  created_at: string;
  updated_at: string;
}
