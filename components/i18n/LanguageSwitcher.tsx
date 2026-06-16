'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from './LanguageProvider';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-md border bg-white p-1">
      <Button
        type="button"
        size="sm"
        variant={language === 'es' ? 'default' : 'ghost'}
        onClick={() => setLanguage('es')}
        className="h-8 px-3"
      >
        ES
      </Button>

      <Button
        type="button"
        size="sm"
        variant={language === 'en' ? 'default' : 'ghost'}
        onClick={() => setLanguage('en')}
        className="h-8 px-3"
      >
        EN
      </Button>
    </div>
  );
}
