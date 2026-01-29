import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import StockCard from '@/components/StockCard';
import CandlestickChart from '@/components/CandlestickChart';
import TradePanel from '@/components/TradePanel';
import PortfolioSummary from '@/components/PortfolioSummary';
import StockStats from '@/components/StockStats';
import { mockStocks, generateCandleData, mockPortfolio } from '@/data/mockStocks';
import { Stock, CandleData } from '@/types/stock';
import { Activity, BarChart3, Clock } from 'lucide-react';

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(mockStocks[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (selectedStock) {
      setCandleData(generateCandleData(selectedStock.price));
    }
  }, [selectedStock]);

  const filteredStocks = useMemo(() => {
    if (!searchQuery) return mockStocks;
    const query = searchQuery.toLowerCase();
    return mockStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleTrade = (type: 'buy' | 'sell', shares: number, price: number) => {
    console.log(`${type} ${shares} shares at $${price}`);
  };

  const marketSummary = useMemo(() => {
    const gainers = mockStocks.filter((s) => s.change > 0).length;
    const losers = mockStocks.filter((s) => s.change < 0).length;
    return { gainers, losers };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Market Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gain/10">
              <Activity className="w-5 h-5 text-gain" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gainers</p>
              <p className="text-2xl font-bold text-gain">{marketSummary.gainers}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-lg bg-loss/10">
              <BarChart3 className="w-5 h-5 text-loss" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Losers</p>
              <p className="text-2xl font-bold text-loss">{marketSummary.losers}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Status</p>
              <p className="text-lg font-bold text-gain">Open</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stock List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Stocks</h2>
              <span className="text-xs text-muted-foreground">
                {filteredStocks.length} results
              </span>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin">
              {filteredStocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => setSelectedStock(stock)}
                  isSelected={selectedStock?.symbol === stock.symbol}
                />
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-6 space-y-4">
            {selectedStock && (
              <>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedStock.symbol}
                      </h2>
                      <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-3xl font-bold text-foreground">
                        ${selectedStock.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          selectedStock.change >= 0 ? 'text-gain' : 'text-loss'
                        }`}
                      >
                        {selectedStock.change >= 0 ? '+' : ''}
                        {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <CandlestickChart data={candleData} />
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Key Statistics
                  </h3>
                  <StockStats stock={selectedStock} />
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <TradePanel stock={selectedStock} onTrade={handleTrade} />
            <PortfolioSummary holdings={mockPortfolio} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
