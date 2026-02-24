import React from "react";
import { Activity } from "lucide-react";
import MarketStats from "@/components/MarketStats";
import TopCryptoCards from "@/components/TopCryptoCards";
import CryptoTable from "@/components/CryptoTable";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">CryptoTracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <MarketStats />
        <TopCryptoCards />
        <CryptoTable />
      </main>
    </div>
  );
};

export default Index;
