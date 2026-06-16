'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Warehouse,
  TrendingUp,
  ShoppingCart,
  ArrowRightLeft,
  Lock,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Inventory Dashboard',
    href: '/dashboard/inventory',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: 'Assets',
    href: '/dashboard/assets',
    icon: <Boxes className="w-5 h-5" />,
  },
  {
    label: 'Warehouses',
    href: '/dashboard/warehouses',
    icon: <Warehouse className="w-5 h-5" />,
  },
  {
    label: 'Current Stock',
    href: '/dashboard/stock',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: 'Purchases',
    href: '/dashboard/purchases',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    label: 'Movements',
    href: '/dashboard/movements',
    icon: <ArrowRightLeft className="w-5 h-5" />,
  },
];

const comingSoonItems: NavItem[] = [
  {
    label: 'WISP/ISP',
    href: '#',
    icon: <Lock className="w-5 h-5" />,
    disabled: true,
  },
  {
    label: 'SNMP Monitoring',
    href: '#',
    icon: <Lock className="w-5 h-5" />,
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-slate-400 text-sm mt-1">Management System</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs uppercase text-slate-400 font-semibold px-3 py-2 mb-4">
          Main
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="text-xs uppercase text-slate-400 font-semibold px-3 py-2 mt-8 mb-4">
          Coming Soon
        </div>
        {comingSoonItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 cursor-not-allowed opacity-50"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">v1.0.0</div>
      </div>
    </aside>
  );
}
