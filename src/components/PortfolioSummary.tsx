import React from 'react';
import { PortfolioHolding } from '@/types/stock';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioSummaryProps {
  holdings: PortfolioHolding[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ holdings }) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalGain = holdings.reduce((sum, h) => sum + h.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Portfolio</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="font-mono text-2xl font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
          <p
            className={cn(
              'font-mono text-2xl font-bold',
              totalGain >= 0 ? 'text-gain' : 'text-loss'
            )}
          >
            {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p
            className={cn(
              'text-sm font-medium',
              totalGain >= 0 ? 'text-gain' : 'text-loss'
            )}
          >
            {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Holdings</span>
        </div>
        <div className="space-y-2">
          {holdings.map((holding) => (
            <div
              key={holding.symbol}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-xs text-primary">
                    {holding.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{holding.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-foreground">
                  ${holding.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div
                  className={cn(
                    'flex items-center justify-end gap-1 text-xs font-medium',
                    holding.gain >= 0 ? 'text-gain' : 'text-loss'
                  )}
                >
                  {holding.gain >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {holding.gain >= 0 ? '+' : ''}
                    {holding.gainPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
