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

export interface PortfolioAsset {
  id: string;
  coinId: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  source: string;
  date: string;
  image: string;
  url: string;
}

// Mock cryptocurrency data
export const cryptocurrencies: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.00,
    change24h: 2.45,
    change7d: 5.12,
    marketCap: 847000000000,
    volume24h: 28500000000,
    image: '₿',
    sparkline: [42000, 42500, 43000, 42800, 43100, 43250],
  },
  {
    id: 'ethereum',
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2280.50,
    change24h: -1.23,
    change7d: 3.45,
    marketCap: 274000000000,
    volume24h: 15200000000,
    image: 'Ξ',
    sparkline: [2300, 2250, 2280, 2260, 2290, 2280],
  },
  {
    id: 'tether',
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    change24h: 0.01,
    change7d: 0.02,
    marketCap: 91000000000,
    volume24h: 42000000000,
    image: '₮',
    sparkline: [1, 1, 1, 1, 1, 1],
  },
  {
    id: 'bnb',
    rank: 4,
    name: 'BNB',
    symbol: 'BNB',
    price: 312.80,
    change24h: 1.87,
    change7d: -2.15,
    marketCap: 48000000000,
    volume24h: 890000000,
    image: '◆',
    sparkline: [305, 310, 308, 315, 310, 312],
  },
  {
    id: 'solana',
    rank: 5,
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change24h: 5.67,
    change7d: 12.34,
    marketCap: 42000000000,
    volume24h: 2100000000,
    image: '◎',
    sparkline: [90, 93, 95, 94, 97, 98],
  },
  {
    id: 'xrp',
    rank: 6,
    name: 'XRP',
    symbol: 'XRP',
    price: 0.62,
    change24h: -0.45,
    change7d: 1.23,
    marketCap: 34000000000,
    volume24h: 1200000000,
    image: '✕',
    sparkline: [0.60, 0.61, 0.63, 0.62, 0.61, 0.62],
  },
  {
    id: 'cardano',
    rank: 7,
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.58,
    change24h: 3.21,
    change7d: 7.89,
    marketCap: 20000000000,
    volume24h: 520000000,
    image: '₳',
    sparkline: [0.54, 0.55, 0.56, 0.57, 0.58, 0.58],
  },
  {
    id: 'dogecoin',
    rank: 8,
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.089,
    change24h: -2.34,
    change7d: -5.67,
    marketCap: 12500000000,
    volume24h: 450000000,
    image: 'Ð',
    sparkline: [0.095, 0.092, 0.090, 0.088, 0.087, 0.089],
  },
  {
    id: 'polygon',
    rank: 9,
    name: 'Polygon',
    symbol: 'MATIC',
    price: 0.92,
    change24h: 4.56,
    change7d: 8.90,
    marketCap: 9200000000,
    volume24h: 380000000,
    image: '⬡',
    sparkline: [0.85, 0.87, 0.89, 0.90, 0.91, 0.92],
  },
  {
    id: 'avalanche',
    rank: 10,
    name: 'Avalanche',
    symbol: 'AVAX',
    price: 38.75,
    change24h: 6.78,
    change7d: 15.23,
    marketCap: 14500000000,
    volume24h: 620000000,
    image: '△',
    sparkline: [34, 35, 36, 37, 38, 38.75],
  },
];

// Mock news data
export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Surges Past $43,000 as Institutional Interest Grows',
    titleAr: 'البيتكوين يتجاوز 43,000 دولار مع تزايد الاهتمام المؤسسي',
    summary: 'Bitcoin has seen a significant price increase as major financial institutions continue to show interest in cryptocurrency investments.',
    summaryAr: 'شهد البيتكوين ارتفاعًا كبيرًا في السعر حيث تستمر المؤسسات المالية الكبرى في إظهار اهتمامها بالاستثمارات في العملات الرقمية.',
    source: 'CryptoNews',
    date: '2024-01-15',
    image: '/news1.jpg',
    url: '#',
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Upgrade Shows Promising Results',
    titleAr: 'ترقية إيثيريوم 2.0 تظهر نتائج واعدة',
    summary: 'The latest Ethereum upgrade has significantly improved transaction speeds and reduced gas fees for users.',
    summaryAr: 'أدت أحدث ترقية للإيثيريوم إلى تحسين سرعات المعاملات بشكل كبير وتقليل رسوم الغاز للمستخدمين.',
    source: 'BlockchainDaily',
    date: '2024-01-14',
    image: '/news2.jpg',
    url: '#',
  },
  {
    id: '3',
    title: 'DeFi Total Value Locked Reaches New All-Time High',
    titleAr: 'إجمالي القيمة المقفلة في DeFi يصل إلى أعلى مستوى على الإطلاق',
    summary: 'Decentralized finance protocols have collectively locked over $100 billion in assets, marking a new milestone.',
    summaryAr: 'قامت بروتوكولات التمويل اللامركزي بإغلاق أكثر من 100 مليار دولار من الأصول بشكل جماعي، مما يمثل علامة فارقة جديدة.',
    source: 'DeFiWatch',
    date: '2024-01-13',
    image: '/news3.jpg',
    url: '#',
  },
  {
    id: '4',
    title: 'Major Banks Announce Blockchain Integration Plans',
    titleAr: 'البنوك الكبرى تعلن عن خطط تكامل البلوكتشين',
    summary: 'Several leading banks have announced plans to integrate blockchain technology for faster cross-border transactions.',
    summaryAr: 'أعلنت العديد من البنوك الرائدة عن خطط لدمج تقنية البلوكتشين لمعاملات عبر الحدود أسرع.',
    source: 'FinanceToday',
    date: '2024-01-12',
    image: '/news4.jpg',
    url: '#',
  },
  {
    id: '5',
    title: 'NFT Market Shows Signs of Recovery',
    titleAr: 'سوق NFT يظهر علامات الانتعاش',
    summary: 'After months of decline, the NFT market is showing renewed interest with increased trading volumes.',
    summaryAr: 'بعد أشهر من الانخفاض، يظهر سوق NFT اهتمامًا متجددًا مع زيادة أحجام التداول.',
    source: 'NFTWorld',
    date: '2024-01-11',
    image: '/news5.jpg',
    url: '#',
  },
];

export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

export function formatPrice(price: number): string {
  if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + price.toFixed(6);
}

export function formatPercentage(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return sign + percent.toFixed(2) + '%';
}
