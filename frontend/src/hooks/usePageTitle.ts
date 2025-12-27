import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

export const usePageTitle = (titleKey: string) => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.title = t(titleKey);
  }, [titleKey, t, location]);
};
