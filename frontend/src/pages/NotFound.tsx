import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page "{location.pathname}" doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button className="flat-button">
              <Home className="w-4 h-4 me-2" />
              {t('nav.home')}
            </Button>
          </Link>
          <Button variant="outline" className="flat-button" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 me-2" />
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
