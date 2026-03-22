'use client';

import { useI18nStore } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18nStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-zinc-400 hover:text-white flex items-center gap-2"
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase text-xs font-bold">{language}</span>
    </Button>
  );
}
