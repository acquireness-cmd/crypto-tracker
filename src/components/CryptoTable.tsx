import React, { useState } from "react";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import { useCryptoAssets } from "@/hooks/useCrypto";
import { formatPrice, formatMarketCap, type CryptoAsset } from "@/data/cryptoData";
import Sparkline from "./Sparkline";

type SortField = "rank" | "price" | "change24h" | "marketCap";

const CryptoTable: React.FC = () => {
  const { data, isLoading } = useCryptoAssets();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(field === "rank"); }
  };

  const filtered = (data ?? [])
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = a[sortField] - b[sortField];
      return sortAsc ? diff : -diff;
    });

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Market Overview</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-muted/50 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-5 py-3"><SortHeader field="rank">#</SortHeader></th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-right px-5 py-3"><SortHeader field="price">Price</SortHeader></th>
                <th className="text-right px-5 py-3"><SortHeader field="change24h">24h %</SortHeader></th>
                <th className="text-right px-5 py-3 hidden md:table-cell"><SortHeader field="marketCap">Market Cap</SortHeader></th>
                <th className="text-right px-5 py-3 hidden lg:table-cell">Volume (24h)</th>
                <th className="text-right px-5 py-3 hidden lg:table-cell">Last 7d</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin) => (
                <CryptoRow key={coin.id} coin={coin} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CryptoRow: React.FC<{ coin: CryptoAsset }> = ({ coin }) => {
  const isPositive = coin.change24h >= 0;
  return (
    <tr className="border-t border-border/30 hover:bg-accent/30 transition-colors">
      <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{coin.rank}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" loading="lazy" width={32} height={32} decoding="async" />
          <div>
            <span className="font-medium text-sm">{coin.name}</span>
            <span className="text-xs text-muted-foreground ml-2">{coin.symbol}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-right font-mono text-sm">{formatPrice(coin.price)}</td>
      <td className="px-5 py-4 text-right">
        <span className={`font-mono text-sm px-2 py-0.5 rounded ${isPositive ? "text-gain bg-gain/10" : "text-loss bg-loss/10"}`}>
          {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
        </span>
      </td>
      <td className="px-5 py-4 text-right font-mono text-sm text-muted-foreground hidden md:table-cell">{formatMarketCap(coin.marketCap)}</td>
      <td className="px-5 py-4 text-right font-mono text-sm text-muted-foreground hidden lg:table-cell">{formatMarketCap(coin.volume24h)}</td>
      <td className="px-5 py-4 text-right hidden lg:table-cell">
        <div className="flex justify-end">
          {coin.sparkline.length > 0 && <Sparkline data={coin.sparkline} positive={isPositive} />}
        </div>
      </td>
    </tr>
  );
};

export default CryptoTable;
