import { useQuery } from '@tanstack/react-query';

export interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface Cryptocurrency {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  image: string;
  sparkline?: number[];
}

const fetchCryptoData = async (): Promise<Cryptocurrency[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=7d'
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  const data: CoinGeckoData[] = await response.json();
  
  return data.map((coin) => ({
    id: coin.id,
    rank: coin.market_cap_rank,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    change7d: coin.price_change_percentage_7d_in_currency || 0,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    image: coin.image,
    sparkline: coin.sparkline_in_7d?.price,
  }));
};

export const useCryptoData = () => {
  return useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export interface GlobalData {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  active_cryptocurrencies: number;
}

const fetchGlobalData = async (): Promise<GlobalData> => {
  const response = await fetch('https://api.coingecko.com/api/v3/global');
  
  if (!response.ok) {
    throw new Error('Failed to fetch global data');
  }
  
  const data = await response.json();
  
  return {
    total_market_cap: data.data.total_market_cap.usd,
    total_volume: data.data.total_volume.usd,
    btc_dominance: data.data.market_cap_percentage.btc,
    active_cryptocurrencies: data.data.active_cryptocurrencies,
  };
};

export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
