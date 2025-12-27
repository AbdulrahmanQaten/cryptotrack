import { useQuery } from '@tanstack/react-query';

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
    atl_date: { usd: string };
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
  };
  market_cap_rank: number;
}

export interface ChartData {
  prices: [number, number][];
}

const fetchCoinDetails = async (coinId: string): Promise<CoinDetails> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch coin details');
  }
  
  return response.json();
};

const fetchChartData = async (coinId: string, days: number): Promise<ChartData> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch chart data');
  }
  
  return response.json();
};

export const useCoinDetails = (coinId: string) => {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => fetchCoinDetails(coinId),
    enabled: !!coinId,
    staleTime: 60000,
  });
};

export const useCoinChart = (coinId: string, days: number = 7) => {
  return useQuery({
    queryKey: ['coinChart', coinId, days],
    queryFn: () => fetchChartData(coinId, days),
    enabled: !!coinId,
    staleTime: 60000,
  });
};
