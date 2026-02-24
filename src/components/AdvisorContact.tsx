import React, { useState } from "react";
import { X, UserCheck, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AdvisorContactProps {
  open: boolean;
  onClose: () => void;
}

const AdvisorContact: React.FC<AdvisorContactProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        user_id: user.id,
        subject,
        message,
        budget: budget || null,
      });
      if (error) throw error;
      toast.success("Your request has been submitted! A professional advisor will contact you soon.");
      setSubject("");
      setMessage("");
      setBudget("");
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
            <UserCheck className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Consult a Professional</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Submit your investment query and a certified crypto advisor will get back to you. Pay only for the advice you need.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              maxLength={200}
              placeholder="e.g., Portfolio diversification advice"
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Your Question / Requirements</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              rows={4}
              placeholder="Describe what investment advice you're looking for..."
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Budget (optional)</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">Select your budget</option>
              <option value="$25 - $50">$25 - $50</option>
              <option value="$50 - $100">$50 - $100</option>
              <option value="$100 - $250">$100 - $250</option>
              <option value="$250+">$250+</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvisorContact;
