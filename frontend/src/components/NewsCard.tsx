import { NewsArticle } from '@/lib/cryptoData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ArrowUpRight } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { language, t } = useLanguage();

  const title = language === 'ar' ? article.titleAr : article.title;
  const summary = language === 'ar' ? article.summaryAr : article.summary;

  return (
    <article className="flat-card overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-6xl opacity-50">📰</div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
            {article.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {article.date}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {summary}
        </p>
        <a
          href={article.url}
          className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
        >
          {t('news.readMore')}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}
