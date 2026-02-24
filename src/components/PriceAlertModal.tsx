import React, { useState } from "react";
import { X, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { CryptoAsset } from "@/data/cryptoData";

interface PriceAlertModalProps {
  open: boolean;
  onClose: () => void;
  coins: CryptoAsset[];
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ open, onClose, coins }) => {
  const { user } = useAuth();
  const [coinId, setCoinId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const selectedCoin = coins.find((c) => c.id === coinId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCoin) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        coin_id: selectedCoin.id,
        coin_name: selectedCoin.name,
        symbol: selectedCoin.symbol,
        target_price: parseFloat(targetPrice),
        direction,
      });
      if (error) throw error;
      toast.success(`Alert set! You'll be notified when ${selectedCoin.name} goes ${direction} $${targetPrice}`);
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Set Price Alert</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Coin</label>
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              required
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">Select a coin</option>
              {coins.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol}) — ${c.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Alert when price goes</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDirection("above")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "above" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/50 border border-border/50 text-muted-foreground"}`}
              >
                Above ↑
              </button>
              <button
                type="button"
                onClick={() => setDirection("below")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "below" ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-muted/50 border border-border/50 text-muted-foreground"}`}
              >
                Below ↓
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Target Price (USD)</label>
            <input
              type="number"
              step="any"
              min="0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              placeholder={selectedCoin ? `Current: $${selectedCoin.price}` : "Enter price"}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !coinId}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Setting alert..." : "Set Alert"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
