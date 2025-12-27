import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCryptoNews } from "@/hooks/useCryptoNews";
import {
  Newspaper,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const CRYPTO_FILTERS = [
  { id: "all", label: "All", labelAr: "الكل" },
  { id: "BTC", label: "Bitcoin", labelAr: "بيتكوين" },
  { id: "ETH", label: "Ethereum", labelAr: "إيثيريوم" },
  { id: "XRP", label: "Ripple", labelAr: "ريبل" },
  { id: "SOL", label: "Solana", labelAr: "سولانا" },
  { id: "BNB", label: "BNB", labelAr: "BNB" },
  { id: "DOGE", label: "Dogecoin", labelAr: "دوجكوين" },
];

const News = () => {
  usePageTitle("title.news");
  const { t, language } = useLanguage();
  const {
    data: newsArticles,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useCryptoNews();
  const [activeFilter, setActiveFilter] = useState("all");

  const formatTimeAgo = (timestampSeconds: number) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = now - timestampSeconds;

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (minutes < 1) return language === "ar" ? "الآن" : "Just now";
    if (minutes < 60)
      return language === "ar" ? `منذ ${minutes} دقيقة` : `${minutes} min ago`;
    if (hours < 24)
      return language === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`;
    if (days < 7) return language === "ar" ? `منذ ${days} يوم` : `${days}d ago`;

    const date = new Date(timestampSeconds * 1000);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const filteredNews = newsArticles?.filter((article) => {
    if (activeFilter === "all") return true;
    return (
      article.categories?.toUpperCase().includes(activeFilter) ||
      article.tags?.toUpperCase().includes(activeFilter)
    );
  });

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{t("common.error")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("news.title")}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flat-button"
          >
            <RefreshCw
              className={`w-4 h-4 me-2 ${isFetching ? "animate-spin" : ""}`}
            />
            {language === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
        <p className="text-muted-foreground">{t("news.subtitle")}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {language === "ar"
            ? "يتم التحديث تلقائياً كل 5 دقائق"
            : "Auto-refreshes every 5 minutes"}
        </p>
      </section>

      {/* Filters */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          {CRYPTO_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id ? "" : "flat-button"}
            >
              {language === "ar" ? filter.labelAr : filter.label}
            </Button>
          ))}
        </div>
      </section>

      {/* News List */}
      <section>
        {filteredNews && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((article, index) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="block h-full"
              >
                <article
                  className="flat-card p-5 h-full flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Categories */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {article.categories
                      ?.split("|")
                      .slice(0, 2)
                      .map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {/* Body */}
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-1 mb-4">
                    {article.body}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      {article.source}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="flat-card">
            <CardContent className="py-12 text-center">
              <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "لا توجد أخبار لهذا الفلتر"
                  : "No news found for this filter"}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default News;
