import { useQuery } from '@tanstack/react-query';

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: number;
  categories: string;
  tags: string;
  guid: string;
}

const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  // Using CryptoCompare News API (free, no API key required for basic usage)
  const response = await fetch(
    'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest'
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  const data = await response.json();
  
  if (data.Response === 'Error') {
    throw new Error(data.Message || 'Failed to fetch news');
  }
  
  return data.Data.map((article: any) => ({
    id: String(article.id),
    title: article.title,
    body: article.body,
    url: article.url,
    imageUrl: article.imageurl,
    source: article.source_info?.name || article.source,
    publishedAt: article.published_on, // Keep as seconds, convert in component
    categories: article.categories,
    tags: article.tags,
    guid: article.guid,
  }));
};

export const useCryptoNews = () => {
  return useQuery({
    queryKey: ['cryptoNews'],
    queryFn: fetchCryptoNews,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    retry: 2,
  });
};

export const useNewsArticle = (id: string) => {
  const { data: allNews, isLoading, error } = useCryptoNews();
  
  const article = allNews?.find((a) => a.id === id);
  
  return {
    data: article,
    isLoading,
    error,
  };
};