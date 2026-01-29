import { Stock, CandleData, PortfolioHolding } from '@/types/stock';

export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.42,
    change: 2.35,
    changePercent: 1.34,
    volume: 52847621,
    marketCap: '$2.8T',
    high52Week: 199.62,
    low52Week: 164.08,
    pe: 28.4,
    sector: 'Technology',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: -1.23,
    changePercent: -0.86,
    volume: 18234567,
    marketCap: '$1.8T',
    high52Week: 153.78,
    low52Week: 115.35,
    pe: 24.8,
    sector: 'Technology',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.91,
    change: 4.56,
    changePercent: 1.22,
    volume: 21456789,
    marketCap: '$2.8T',
    high52Week: 420.82,
    low52Week: 309.45,
    pe: 35.2,
    sector: 'Technology',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    change: 3.12,
    changePercent: 1.78,
    volume: 34567890,
    marketCap: '$1.9T',
    high52Week: 201.20,
    low52Week: 118.35,
    pe: 62.5,
    sector: 'Consumer Cyclical',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: 45678901,
    marketCap: '$2.2T',
    high52Week: 974.00,
    low52Week: 373.56,
    pe: 68.9,
    sector: 'Technology',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 505.95,
    change: -3.45,
    changePercent: -0.68,
    volume: 12345678,
    marketCap: '$1.3T',
    high52Week: 542.81,
    low52Week: 274.38,
    pe: 27.3,
    sector: 'Technology',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: -5.67,
    changePercent: -2.23,
    volume: 78901234,
    marketCap: '$790B',
    high52Week: 299.29,
    low52Week: 138.80,
    pe: 72.4,
    sector: 'Consumer Cyclical',
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 198.45,
    change: 1.89,
    changePercent: 0.96,
    volume: 8901234,
    marketCap: '$572B',
    high52Week: 215.85,
    low52Week: 135.19,
    pe: 11.8,
    sector: 'Financial Services',
  },
];

export const generateCandleData = (basePrice: number, days: number = 90): CandleData[] => {
  const data: CandleData[] = [];
  let currentPrice = basePrice * 0.85;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02 + Math.random() * 0.03;
    const trend = (basePrice - currentPrice) / basePrice * 0.1;
    const change = (Math.random() - 0.45 + trend) * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
    const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
    const volume = Math.floor(Math.random() * 50000000) + 10000000;
    
    data.push({
      date,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
};

export const mockPortfolio: PortfolioHolding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    avgPrice: 165.32,
    currentPrice: 178.42,
    totalValue: 8921,
    gain: 655,
    gainPercent: 7.93,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    shares: 15,
    avgPrice: 720.45,
    currentPrice: 875.28,
    totalValue: 13129.2,
    gain: 2322.45,
    gainPercent: 21.49,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    shares: 25,
    avgPrice: 350.12,
    currentPrice: 378.91,
    totalValue: 9472.75,
    gain: 719.75,
    gainPercent: 8.23,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 30,
    avgPrice: 148.56,
    currentPrice: 141.80,
    totalValue: 4254,
    gain: -202.8,
    gainPercent: -4.55,
  },
];
