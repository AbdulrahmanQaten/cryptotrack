import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { CryptoCard } from "@/components/CryptoCard";
import { StatCard } from "@/components/StatCard";
import { useCryptoData, useGlobalData } from "@/hooks/useCryptoData";
import { formatNumber } from "@/lib/cryptoData";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Coins,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  usePageTitle("title.home");
  const { t } = useLanguage();
  const { data: cryptoData, isLoading: cryptoLoading } = useCryptoData();
  const { data: globalData, isLoading: globalLoading } = useGlobalData();

  const topCoins = cryptoData?.slice(0, 5) || [];
  const gainers = cryptoData
    ? [...cryptoData].sort((a, b) => b.change24h - a.change24h).slice(0, 3)
    : [];
  const losers = cryptoData
    ? [...cryptoData].sort((a, b) => a.change24h - b.change24h).slice(0, 3)
    : [];

  const isLoading = cryptoLoading || globalLoading;

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          {t("home.title")}
        </h1>
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {t("home.subtitle")}
        </p>
        <Link to="/market">
          <Button
            size="lg"
            className="flat-button font-bold animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {t("home.explore")}
            <ArrowRight className="w-5 h-5 ms-2" />
          </Button>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <StatCard
              title={t("home.marketCap")}
              value={"$" + formatNumber(globalData?.total_market_cap || 0)}
              icon={<DollarSign className="w-6 h-6" />}
            />
            <StatCard
              title={t("home.volume")}
              value={"$" + formatNumber(globalData?.total_volume || 0)}
              icon={<BarChart3 className="w-6 h-6" />}
            />
            <StatCard
              title={t("home.dominance")}
              value={(globalData?.btc_dominance || 0).toFixed(1) + "%"}
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <StatCard
              title={t("home.coins")}
              value={(
                globalData?.active_cryptocurrencies || 0
              ).toLocaleString()}
              icon={<Coins className="w-6 h-6" />}
            />
          </>
        )}
      </section>

      {/* Trending Coins */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">{t("home.trending")}</h2>
          <Link
            to="/market"
            className="text-primary font-medium hover:underline flex items-center gap-1"
          >
            {t("common.seeAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {cryptoLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCoins.map((crypto, index) => (
              <div
                key={crypto.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CryptoCard crypto={crypto} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gainers & Losers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Gainers */}
        <div>
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-success" />
            {t("home.topGainers")}
          </h2>
          {cryptoLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {gainers.map((crypto, index) => (
                <div
                  key={crypto.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CryptoCard crypto={crypto} showRank={false} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Losers */}
        <div>
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-destructive rotate-180" />
            {t("home.topLosers")}
          </h2>
          {cryptoLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {losers.map((crypto, index) => (
                <div
                  key={crypto.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CryptoCard crypto={crypto} showRank={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
