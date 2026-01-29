import React from 'react';
import { Stock } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
  isSelected?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick, isSelected }) => {
  const isPositive = stock.change >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:border-primary/30',
        isSelected
          ? 'bg-primary/10 border-primary shadow-lg trading-glow'
          : 'bg-card border-border hover:bg-card/80'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">{stock.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {stock.sector.split(' ')[0]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate max-w-[140px]">
            {stock.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-lg text-foreground">
            ${stock.price.toFixed(2)}
          </p>
          <div
            className={cn(
              'flex items-center justify-end gap-1 text-sm font-medium',
              isPositive ? 'text-gain' : 'text-loss'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
          <span>Cap: {stock.marketCap}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
