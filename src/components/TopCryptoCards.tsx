import React from "react";
import { Loader2 } from "lucide-react";
import { useCryptoAssets } from "@/hooks/useCrypto";
import { formatPrice } from "@/data/cryptoData";
import Sparkline from "./Sparkline";

const TopCryptoCards: React.FC = () => {
  const { data, isLoading } = useCryptoAssets();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 flex items-center justify-center h-[160px]">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  const top = (data ?? []).slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {top.map((coin, i) => {
        const isPositive = coin.change24h >= 0;
        return (
          <div key={coin.id} className={`glass-card rounded-xl p-5 ${i === 0 ? "glow-green" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" loading="lazy" width={24} height={24} decoding="async" />
                <div>
                  <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                  <p className="font-semibold">{coin.name}</p>
                </div>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded ${isPositive ? "text-gain bg-gain/10" : "text-loss bg-loss/10"}`}>
                {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-2xl font-bold font-mono mb-3">{formatPrice(coin.price)}</p>
            {coin.sparkline.length > 0 && (
              <Sparkline data={coin.sparkline} positive={isPositive} width={200} height={50} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopCryptoCards;
