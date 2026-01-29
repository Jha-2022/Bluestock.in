import React, { useState } from 'react';
import { Stock } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TradePanelProps {
  stock: Stock | null;
  onTrade?: (type: 'buy' | 'sell', shares: number, price: number) => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ stock, onTrade }) => {
  const [shares, setShares] = useState<string>('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const numShares = parseFloat(shares) || 0;
  const price = orderType === 'limit' ? parseFloat(limitPrice) || 0 : stock?.price || 0;
  const total = numShares * price;

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!stock || numShares <= 0) {
      toast.error('Please enter a valid number of shares');
      return;
    }
    if (orderType === 'limit' && !limitPrice) {
      toast.error('Please enter a limit price');
      return;
    }

    onTrade?.(type, numShares, price);
    toast.success(
      `${type === 'buy' ? 'Bought' : 'Sold'} ${numShares} shares of ${stock.symbol} at $${price.toFixed(2)}`,
      {
        description: `Total: $${total.toFixed(2)}`,
      }
    );
    setShares('');
    setLimitPrice('');
  };

  if (!stock) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="text-center text-muted-foreground py-8">
          <p className="text-lg font-medium">Select a stock to trade</p>
          <p className="text-sm mt-1">Choose from the list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold text-foreground">
            ${stock.price.toFixed(2)}
          </p>
          <p
            className={cn(
              'text-sm font-medium',
              stock.change >= 0 ? 'text-gain' : 'text-loss'
            )}
          >
            {stock.change >= 0 ? '+' : ''}
            {stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <Tabs defaultValue="market" onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market">Market Order</TabsTrigger>
          <TabsTrigger value="limit">Limit Order</TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Shares</label>
            <Input
              type="number"
              placeholder="0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="font-mono text-lg h-12"
            />
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Market Price</span>
              <span className="font-mono text-foreground">${stock.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Estimated Total</span>
              <span className="font-mono font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="limit" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Shares</label>
            <Input
              type="number"
              placeholder="0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="font-mono text-lg h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Limit Price</label>
            <Input
              type="number"
              placeholder={stock.price.toFixed(2)}
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="font-mono text-lg h-12"
            />
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Limit Price</span>
              <span className="font-mono text-foreground">
                ${(parseFloat(limitPrice) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Estimated Total</span>
              <span className="font-mono font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleTrade('buy')}
          className="h-12 text-base font-semibold bg-gain hover:bg-gain/90 text-gain-foreground"
        >
          Buy
        </Button>
        <Button
          onClick={() => handleTrade('sell')}
          className="h-12 text-base font-semibold bg-loss hover:bg-loss/90 text-loss-foreground"
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default TradePanel;
