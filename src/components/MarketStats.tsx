import React from "react";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

const stats = [
  { label: "Total Market Cap", value: "$3.42T", change: "+2.1%", positive: true, icon: TrendingUp },
  { label: "24h Volume", value: "$148.7B", change: "+8.4%", positive: true, icon: BarChart3 },
  { label: "BTC Dominance", value: "55.8%", change: "-0.3%", positive: false, icon: Activity },
];

const MarketStats: React.FC = () => {
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
              <span className={`text-sm font-mono ${stat.positive ? "text-gain" : "text-loss"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
