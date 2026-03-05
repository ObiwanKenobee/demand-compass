import { motion } from "framer-motion";

const channels = [
  { name: "Thought Leadership", leads: 28, qualified: 19, pct: 68 },
  { name: "Strategic Partnerships", leads: 22, qualified: 16, pct: 73 },
  { name: "Climate & Tech Conferences", leads: 18, qualified: 11, pct: 61 },
  { name: "Inbound Institutional", leads: 15, qualified: 13, pct: 87 },
  { name: "Academic Collaborations", leads: 12, qualified: 9, pct: 75 },
  { name: "Developer Ecosystem", leads: 9, qualified: 6, pct: 67 },
];

const maxLeads = Math.max(...channels.map((c) => c.leads));

const DemandEnginePanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Demand Engine
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Institutional Lead Sources
      </h3>

      <div className="space-y-4">
        {channels.map((ch, i) => (
          <motion.div
            key={ch.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">{ch.name}</span>
              <span className="text-xs text-muted-foreground">
                {ch.qualified}/{ch.leads} qualified ({ch.pct}%)
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(ch.leads / maxLeads) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }}
                className="absolute inset-y-0 left-0 rounded-full bg-secondary"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(ch.qualified / maxLeads) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded bg-secondary" />
          Total Leads
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded bg-primary/80" />
          Qualified
        </div>
      </div>
    </motion.div>
  );
};

export default DemandEnginePanel;
