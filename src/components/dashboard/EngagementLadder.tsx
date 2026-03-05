import { motion } from "framer-motion";
import { FileText, Users, Monitor, Beaker, ShieldCheck } from "lucide-react";

const steps = [
  { label: "Whitepaper Downloads", count: 342, icon: FileText },
  { label: "Research Collaboration Inquiries", count: 128, icon: Users },
  { label: "Policy Simulation Demos", count: 67, icon: Monitor },
  { label: "Enterprise Product Demos", count: 41, icon: Beaker },
  { label: "Verification Pilots", count: 18, icon: ShieldCheck },
];

const EngagementLadder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-success" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Engagement Depth
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Institutional Engagement Ladder
      </h3>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const widthPct = Math.max(20, (step.count / steps[0].count) * 100);
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground truncate">{step.label}</span>
                  <span className="text-sm font-display font-semibold text-primary ml-2">
                    {step.count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(174, 72%, 46%), hsl(152, 60%, 42%))`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 italic">
        Curiosity → Partnership depth progression
      </p>
    </motion.div>
  );
};

export default EngagementLadder;
