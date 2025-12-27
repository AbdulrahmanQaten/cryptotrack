import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNewsArticle } from '@/hooks/useCryptoNews';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  Copy,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, dir } = useLanguage();
  const { data: article, isLoading, error } = useNewsArticle(id || '');

  const formatTimeAgo = (timestampSeconds: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestampSeconds;
    
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    
    if (minutes < 1) return language === 'ar' ? 'الآن' : 'Just now';
    if (minutes < 60) return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes} min ago`;
    if (hours < 24) return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
    if (days < 7) return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
    
    const date = new Date(timestampSeconds * 1000);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied!' });
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page-container">
        <Card className="flat-card border-destructive">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive mb-4">
              {language === 'ar' ? 'الخبر غير موجود' : 'Article not found'}
            </p>
            <Link to="/news">
              <Button variant="outline" className="flat-button">
                <ArrowLeft className="w-4 h-4 me-2" />
                {language === 'ar' ? 'العودة للأخبار' : 'Back to News'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container" dir={dir}>
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 me-2" />
            {language === 'ar' ? 'العودة للأخبار' : 'Back to News'}
          </Button>
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {article.categories?.split('|').map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">{article.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="flat-button">
              <Copy className="w-4 h-4 me-2" />
              {language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
            </Button>
          </div>
        </header>

        {/* Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden flat-card p-0">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-auto max-h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flat-card p-6 md:p-8 mb-8">
          <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
            {article.body}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="flat-button">
              {language === 'ar' ? 'قراءة المقال الكامل' : 'Read Full Article'}
              <ExternalLink className="w-4 h-4 ms-2" />
            </Button>
          </a>
        </div>
      </article>
    </div>
  );
};

export default NewsDetails;
