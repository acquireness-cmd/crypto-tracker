import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Users, User as UserIcon, Mail, Calendar, Hash } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setStatsLoading(true);
      const [countRes, profileRes] = await Promise.all([
        supabase.functions.invoke("get-user-count"),
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!countRes.error && countRes.data) setTotalUsers(countRes.data.total);
      if (profileRes.data) setDisplayName(profileRes.data.display_name);
      setStatsLoading(false);
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  const created = user.created_at ? new Date(user.created_at).toLocaleDateString() : "—";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="font-bold tracking-tight">Dashboard</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Users className="w-4 h-4" />
              Total registered users
            </div>
            <div className="text-3xl font-bold font-mono-num">
              {statsLoading ? "—" : totalUsers ?? "N/A"}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <UserIcon className="w-4 h-4" />
              Signed in as
            </div>
            <div className="text-lg font-semibold truncate">
              {displayName || user.email?.split("@")[0]}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Account details</h2>
          <div className="space-y-3 text-sm">
            <Row icon={<Mail className="w-4 h-4" />} label="Email" value={user.email ?? "—"} />
            <Row icon={<UserIcon className="w-4 h-4" />} label="Display name" value={displayName ?? "—"} />
            <Row icon={<Hash className="w-4 h-4" />} label="User ID" value={user.id} mono />
            <Row icon={<Calendar className="w-4 h-4" />} label="Member since" value={created} />
          </div>
        </div>
      </main>
    </div>
  );
};

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string; mono?: boolean }> = ({
  icon,
  label,
  value,
  mono,
}) => (
  <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3 last:border-0 last:pb-0">
    <div className="flex items-center gap-2 text-muted-foreground shrink-0">
      {icon}
      {label}
    </div>
    <div className={`text-right break-all ${mono ? "font-mono-num text-xs" : ""}`}>{value}</div>
  </div>
);

export default Dashboard;
