'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n/LanguageProvider';

export function LoginForm() {
  const { t } = useI18n();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const resolveLoginEmail = async (loginIdentifier: string) => {
    const cleanIdentifier = loginIdentifier.trim();

    const { data, error } = await supabase
      .schema('core')
      .rpc('resolve_login_identifier', {
        p_identifier: cleanIdentifier,
      });

    if (error) {
      console.error('Error resolving login identifier:', error);
      return cleanIdentifier;
    }

    return data || cleanIdentifier;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginEmail = await resolveLoginEmail(identifier);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.session) {
        setError(t('auth.loginFailed'));
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.genericLoginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          {t('auth.loginIdentifier')}
        </label>

        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={t('auth.loginIdentifierPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
          autoComplete="username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
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
          autoComplete="current-password"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('auth.signingIn') : t('auth.signIn')}
      </Button>
    </form>
  );
}