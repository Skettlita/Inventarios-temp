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
import { useI18n } from '@/components/i18n/LanguageProvider';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    labelKey: 'nav.inventory',
    href: '/dashboard/inventory',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.products',
    href: '/dashboard/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.assets',
    href: '/dashboard/assets',
    icon: <Boxes className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.warehouses',
    href: '/dashboard/warehouses',
    icon: <Warehouse className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.stock',
    href: '/dashboard/stock',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.purchases',
    href: '/dashboard/purchases',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    labelKey: 'nav.movements',
    href: '/dashboard/movements',
    icon: <ArrowRightLeft className="w-5 h-5" />,
  },
];

const comingSoonItems: NavItem[] = [
  {
    labelKey: 'nav.wisp',
    href: '#',
    icon: <Lock className="w-5 h-5" />,
    disabled: true,
  },
  {
    labelKey: 'nav.monitoring',
    href: '#',
    icon: <Lock className="w-5 h-5" />,
    disabled: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">{t('nav.inventory')}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {t('common.managementSystem')}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs uppercase text-slate-400 font-semibold px-3 py-2 mb-4">
          {t('common.main')}
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
            <span className="text-sm font-medium">{t(item.labelKey)}</span>
          </Link>
        ))}

        <div className="text-xs uppercase text-slate-400 font-semibold px-3 py-2 mt-8 mb-4">
          {t('common.comingSoon')}
        </div>

        {comingSoonItems.map((item) => (
          <div
            key={item.labelKey}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 cursor-not-allowed opacity-50"
          >
            {item.icon}
            <span className="text-sm font-medium">{t(item.labelKey)}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">v1.0.0</div>
      </div>
    </aside>
  );
}