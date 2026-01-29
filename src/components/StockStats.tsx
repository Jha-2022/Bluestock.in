import React from 'react';
import { Stock } from '@/types/stock';

interface StockStatsProps {
  stock: Stock;
}

const StockStats: React.FC<StockStatsProps> = ({ stock }) => {
  const stats = [
    { label: 'Market Cap', value: stock.marketCap },
    { label: 'P/E Ratio', value: stock.pe.toFixed(2) },
    { label: '52W High', value: `$${stock.high52Week.toFixed(2)}` },
    { label: '52W Low', value: `$${stock.low52Week.toFixed(2)}` },
    { label: 'Volume', value: `${(stock.volume / 1000000).toFixed(2)}M` },
    { label: 'Sector', value: stock.sector },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="p-3 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="font-mono font-semibold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StockStats;
