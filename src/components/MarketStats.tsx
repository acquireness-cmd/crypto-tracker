import React from "react";
import { TrendingUp, BarChart3, Activity, Loader2 } from "lucide-react";
import { useMarketGlobal } from "@/hooks/useCrypto";
import { formatMarketCap } from "@/data/cryptoData";

const MarketStats: React.FC = () => {
  const { data, isLoading } = useMarketGlobal();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-card rounded-lg p-5 flex items-center justify-center h-[88px]">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Total Market Cap", value: data ? formatMarketCap(data.totalMarketCap) : "--", change: data ? `${data.marketCapChange24h >= 0 ? "+" : ""}${data.marketCapChange24h.toFixed(1)}%` : "--", positive: (data?.marketCapChange24h ?? 0) >= 0, icon: TrendingUp },
    { label: "24h Volume", value: data ? formatMarketCap(data.totalVolume) : "--", change: "", positive: true, icon: BarChart3 },
    { label: "BTC Dominance", value: data ? `${data.btcDominance.toFixed(1)}%` : "--", change: "", positive: true, icon: Activity },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold font-mono">{stat.value}</span>
              {stat.change && (
                <span className={`text-sm font-mono ${stat.positive ? "text-gain" : "text-loss"}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
