import { Link } from 'react-router-dom';
import { formatPrice, formatPercentage } from '@/lib/cryptoData';
import { Cryptocurrency } from '@/hooks/useCryptoData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  showRank?: boolean;
}

export function CryptoCard({ crypto, showRank = true }: CryptoCardProps) {
  const isPositive = crypto.change24h >= 0;

  return (
    <Link to={`/coin/${crypto.id}`}>
      <div className="flat-card p-4 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showRank && (
              <span className="text-sm font-medium text-muted-foreground w-6">
                #{crypto.rank}
              </span>
            )}
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-bold">{crypto.name}</h3>
              <span className="text-sm text-muted-foreground">{crypto.symbol}</span>
            </div>
          </div>
          <div className="text-end">
            <p className="font-bold">{formatPrice(crypto.price)}</p>
            <div
              className={`flex items-center justify-end gap-1 text-sm font-medium ${
                isPositive ? 'text-success' : 'text-destructive'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatPercentage(crypto.change24h)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
