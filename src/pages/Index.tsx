import React, { useState } from "react";
import { Activity, Bell, LogOut, LogIn, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCryptoAssets } from "@/hooks/useCrypto";
import MarketStats from "@/components/MarketStats";
import TopCryptoCards from "@/components/TopCryptoCards";
import CryptoTable from "@/components/CryptoTable";
import FloatingActions from "@/components/FloatingActions";
import PriceAlertModal from "@/components/PriceAlertModal";
import { toast } from "sonner";

const Index: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: coins } = useCryptoAssets();
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  const handleAlertClick = () => {
    setAlertOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">CryptoTracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <button
              onClick={handleAlertClick}
              className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </button>
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <MarketStats />
        <TopCryptoCards />
        <CryptoTable />
      </main>

      <FloatingActions />
      <PriceAlertModal open={alertOpen} onClose={() => setAlertOpen(false)} coins={coins ?? []} />
    </div>
  );
};

export default Index;
