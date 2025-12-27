import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-foreground/10 bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                ₿
              </div>
              <span className="text-xl font-bold">{t('home.title')}</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/market" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.market')}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.portfolio')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-muted-foreground space-y-2">
          <p>© {currentYear} Blockchain Tracker. {t('footer.rights')}.</p>
          <p className="text-sm">
            {t('footer.madeBy')}{' '}
            <span className="font-semibold text-foreground">
              {t('footer.creatorName')}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
