///login/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { useI18n } from '@/components/i18n/LanguageProvider';

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {t('auth.dontHaveAccount')}{' '}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              {t('auth.createOne')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}