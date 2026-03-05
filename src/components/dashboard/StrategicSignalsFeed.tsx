import { motion } from "framer-motion";
import { Zap, Building2, GraduationCap, Globe, Shield } from "lucide-react";

const signals = [
  {
    icon: Building2,
    title: "UNDP Climate Adaptation Fund",
    description: "Requested pilot program for regenerative asset verification in East Africa",
    time: "2 hours ago",
    type: "pilot",
  },
  {
    icon: Globe,
    title: "German Federal Ministry",
    description: "Inquiry into policy simulation capabilities for carbon market design",
    time: "6 hours ago",
    type: "inquiry",
  },
  {
    icon: GraduationCap,
    title: "MIT Media Lab",
    description: "Research collaboration proposal on ethical AI infrastructure",
    time: "1 day ago",
    type: "collaboration",
  },
  {
    icon: Shield,
    title: "Unilever Sustainability Division",
    description: "Exploring regenerative supply chain verification integration",
    time: "2 days ago",
    type: "enterprise",
  },
  {
    icon: Zap,
    title: "African Development Bank",
    description: "Demo scheduled for ecosystem impact assessment tools",
    time: "3 days ago",
    type: "demo",
  },
];

const typeColors: Record<string, string> = {
  pilot: "bg-success/10 text-success border-success/20",
  inquiry: "bg-accent/10 text-accent border-accent/20",
  collaboration: "bg-primary/10 text-primary border-primary/20",
  enterprise: "bg-primary/10 text-primary border-primary/20",
  demo: "bg-accent/10 text-accent border-accent/20",
};

const StrategicSignalsFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent animate-subtle-glow" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Live Intelligence
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Strategic Signals
      </h3>

      <div className="space-y-3">
        {signals.map((signal, i) => {
          const Icon = signal.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${typeColors[signal.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {signal.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {signal.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {signal.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StrategicSignalsFeed;
