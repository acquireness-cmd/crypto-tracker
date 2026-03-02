import React, { useState } from "react";
import { Bot, UserCheck } from "lucide-react";
import AIChatDrawer from "./AIChatDrawer";
import AdvisorContact from "./AdvisorContact";

const FloatingActions: React.FC = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  const openFeature = (cb: () => void) => {
    cb();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        <button
          onClick={() => openFeature(() => setAdvisorOpen(true))}
          className="group relative w-14 h-14 rounded-full bg-secondary border border-border/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          title="Discuss with a Professional"
        >
          <UserCheck className="w-6 h-6 text-secondary-foreground" />
          <span className="absolute right-full mr-3 bg-card border border-border/50 text-card-foreground text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Discuss with me
          </span>
        </button>

        <button
          onClick={() => openFeature(() => setAiOpen(true))}
          className="group relative w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
          title="AI Investment Advisor"
        >
          <Bot className="w-6 h-6 text-primary-foreground" />
          <span className="absolute right-full mr-3 bg-card border border-border/50 text-card-foreground text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Advisor
          </span>
        </button>
      </div>

      <AIChatDrawer open={aiOpen} onClose={() => setAiOpen(false)} />
      <AdvisorContact open={advisorOpen} onClose={() => setAdvisorOpen(false)} />
    </>
  );
};

export default FloatingActions;
