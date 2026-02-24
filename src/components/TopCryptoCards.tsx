import React from "react";
import { cryptoAssets, formatPrice } from "@/data/cryptoData";
import Sparkline from "./Sparkline";

const TopCryptoCards: React.FC = () => {
  const top = cryptoAssets.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {top.map((coin) => {
        const isPositive = coin.change24h >= 0;
        return (
          <div key={coin.id} className={`glass-card rounded-xl p-5 ${coin.id === "bitcoin" ? "glow-green" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                <p className="font-semibold">{coin.name}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded ${isPositive ? "text-gain bg-gain/10" : "text-loss bg-loss/10"}`}>
                {isPositive ? "+" : ""}{coin.change24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-2xl font-bold font-mono mb-3">{formatPrice(coin.price)}</p>
            <Sparkline data={coin.sparkline} positive={isPositive} width={200} height={50} />
          </div>
        );
      })}
    </div>
  );
};

export default TopCryptoCards;
