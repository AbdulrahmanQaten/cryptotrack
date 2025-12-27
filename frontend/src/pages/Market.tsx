import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCryptoData } from '@/hooks/useCryptoData';
import { formatPrice, formatPercentage, formatNumber } from '@/lib/cryptoData';
import { Search, TrendingUp, TrendingDown, ArrowUpDown, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'marketCap' | 'volume';
type SortDirection = 'asc' | 'desc';

const Market = () => {
  const { t } = useLanguage();
  const { data: cryptocurrencies, isLoading, refetch, isFetching } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCoins = (cryptocurrencies || [])
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change24h':
          comparison = a.change24h - b.change24h;
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'volume':
          comparison = a.volume24h - b.volume24h;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 font-medium hover:text-primary transition-colors ${
        sortField === field ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
      <ArrowUpDown className="w-4 h-4" />
    </button>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('market.title')}</h1>
        <p className="text-muted-foreground">{t('market.subtitle')}</p>
      </section>

      {/* Search & Refresh */}
      <section className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('market.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10 flat-card-sm"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flat-card-sm"
        >
          <RefreshCw className={`w-4 h-4 me-2 ${isFetching ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </Button>
      </section>

      {/* Table */}
      <section className="flat-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-start p-4">
                    <SortButton field="rank">{t('market.rank')}</SortButton>
                  </th>
                  <th className="text-start p-4">
                    <SortButton field="name">{t('market.name')}</SortButton>
                  </th>
                  <th className="text-end p-4">
                    <SortButton field="price">{t('market.price')}</SortButton>
                  </th>
                  <th className="text-end p-4">
                    <SortButton field="change24h">{t('market.change24h')}</SortButton>
                  </th>
                  <th className="text-end p-4 hidden md:table-cell">
                    <SortButton field="marketCap">{t('market.marketCap')}</SortButton>
                  </th>
                  <th className="text-end p-4 hidden lg:table-cell">
                    <SortButton field="volume">{t('market.volume')}</SortButton>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin, index) => (
                  <Link
                    key={coin.id}
                    to={`/coin/${coin.id}`}
                    className="table-row border-t border-border hover:bg-secondary/30 transition-colors cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <td className="p-4 text-muted-foreground">#{coin.rank}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-bold">{coin.name}</p>
                          <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-end font-medium">{formatPrice(coin.price)}</td>
                    <td className="p-4 text-end">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          coin.change24h >= 0 ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatPercentage(coin.change24h)}
                      </span>
                    </td>
                    <td className="p-4 text-end hidden md:table-cell text-muted-foreground">
                      ${formatNumber(coin.marketCap)}
                    </td>
                    <td className="p-4 text-end hidden lg:table-cell text-muted-foreground">
                      ${formatNumber(coin.volume24h)}
                    </td>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Market;
