import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCoinDetails, useCoinChart } from '@/hooks/useCoinDetails';
import { formatPrice, formatNumber, formatPercentage } from '@/lib/cryptoData';
import { 
  ArrowLeft, TrendingUp, TrendingDown, ExternalLink, 
  Loader2, Globe, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

const timeRanges = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
];

const CoinDetails = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const { t, language } = useLanguage();
  const [selectedRange, setSelectedRange] = useState(7);
  
  const { data: coin, isLoading: coinLoading } = useCoinDetails(coinId || '');
  const { data: chartData, isLoading: chartLoading } = useCoinChart(coinId || '', selectedRange);

  if (coinLoading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="page-container text-center py-20">
        <h1 className="text-2xl font-bold mb-4">{t('coinDetails.notFound')}</h1>
        <Link to="/market">
          <Button>{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  const formattedChartData = chartData?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: selectedRange <= 1 ? '2-digit' : undefined,
    }),
    price,
  })) || [];

  const StatItem = ({ label, value, isChange = false }: { label: string; value: string | number; isChange?: boolean }) => (
    <div className="flat-card p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {isChange ? (
        <p className={`text-lg font-bold ${Number(value) >= 0 ? 'text-success' : 'text-destructive'}`}>
          {formatPercentage(Number(value))}
        </p>
      ) : (
        <p className="text-lg font-bold">{value}</p>
      )}
    </div>
  );

  return (
    <div className="page-container">
      {/* Back Button */}
      <Link to="/market" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('common.back')}
      </Link>

      {/* Header */}
      <section className="flat-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={coin.image.large} 
              alt={coin.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{coin.name}</h1>
                <span className="text-lg text-muted-foreground uppercase">{coin.symbol}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                  #{coin.market_cap_rank}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {coin.links.homepage[0] && (
                  <a 
                    href={coin.links.homepage[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {t('coinDetails.website')}
                  </a>
                )}
                {coin.links.blockchain_site[0] && (
                  <a 
                    href={coin.links.blockchain_site[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {t('coinDetails.explorer')}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-start md:text-end">
            <p className="text-4xl font-bold">{formatPrice(coin.market_data.current_price.usd)}</p>
            <div className={`flex items-center gap-1 mt-1 md:justify-end ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-lg font-medium">{formatPercentage(priceChange)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="flat-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{t('coinDetails.priceChart')}</h2>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.days}
                onClick={() => setSelectedRange(range.days)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedRange === range.days
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        {chartLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedChartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [formatPrice(value), t('coinDetails.price')]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Market Stats */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('coinDetails.marketStats')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem 
            label={t('coinDetails.marketCap')} 
            value={`$${formatNumber(coin.market_data.market_cap.usd)}`} 
          />
          <StatItem 
            label={t('coinDetails.volume24h')} 
            value={`$${formatNumber(coin.market_data.total_volume.usd)}`} 
          />
          <StatItem 
            label={t('coinDetails.high24h')} 
            value={formatPrice(coin.market_data.high_24h.usd)} 
          />
          <StatItem 
            label={t('coinDetails.low24h')} 
            value={formatPrice(coin.market_data.low_24h.usd)} 
          />
        </div>
      </section>

      {/* Price Changes */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('coinDetails.priceChanges')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem 
            label={t('coinDetails.change24h')} 
            value={coin.market_data.price_change_percentage_24h} 
            isChange 
          />
          <StatItem 
            label={t('coinDetails.change7d')} 
            value={coin.market_data.price_change_percentage_7d} 
            isChange 
          />
          <StatItem 
            label={t('coinDetails.change30d')} 
            value={coin.market_data.price_change_percentage_30d} 
            isChange 
          />
          <StatItem 
            label={t('coinDetails.change1y')} 
            value={coin.market_data.price_change_percentage_1y || 0} 
            isChange 
          />
        </div>
      </section>

      {/* Supply Info */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('coinDetails.supplyInfo')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatItem 
            label={t('coinDetails.circulatingSupply')} 
            value={formatNumber(coin.market_data.circulating_supply)} 
          />
          <StatItem 
            label={t('coinDetails.totalSupply')} 
            value={coin.market_data.total_supply ? formatNumber(coin.market_data.total_supply) : '∞'} 
          />
          <StatItem 
            label={t('coinDetails.maxSupply')} 
            value={coin.market_data.max_supply ? formatNumber(coin.market_data.max_supply) : '∞'} 
          />
        </div>
      </section>

      {/* ATH / ATL */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">{t('coinDetails.athAtl')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flat-card p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('coinDetails.ath')}</p>
            <p className="text-2xl font-bold text-success">{formatPrice(coin.market_data.ath.usd)}</p>
            <p className="text-sm text-destructive">{formatPercentage(coin.market_data.ath_change_percentage.usd)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(coin.market_data.ath_date.usd).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </p>
          </div>
          <div className="flat-card p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('coinDetails.atl')}</p>
            <p className="text-2xl font-bold text-destructive">{formatPrice(coin.market_data.atl.usd)}</p>
            <p className="text-sm text-success">{formatPercentage(coin.market_data.atl_change_percentage.usd)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(coin.market_data.atl_date.usd).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      {coin.description.en && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('coinDetails.about')} {coin.name}</h2>
          <div 
            className="flat-card p-6 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: coin.description.en.slice(0, 1000) + '...' }}
          />
        </section>
      )}
    </div>
  );
};

export default CoinDetails;
