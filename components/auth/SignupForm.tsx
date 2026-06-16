//SignupForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/LanguageProvider';

export function SignupForm() {
  const router = useRouter();
  const { t } = useI18n();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password.length < 6) {
      setError(t('auth.passwordMin'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      setSuccessMessage(t('auth.accountCreated'));
    } catch (err) {
      setError(t('auth.genericSignupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-gray-700">
          {t('auth.fullName')}
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-1 text-gray-700">
          {t('auth.companyName')}
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
          {t('auth.email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
          {t('auth.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-700">
          {t('auth.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {successMessage && <div className="text-green-700 text-sm">{successMessage}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
      </Button>

      <div className="text-center text-sm text-gray-600">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          {t('auth.signInLink')}
        </Link>
      </div>
    </form>
  );
}