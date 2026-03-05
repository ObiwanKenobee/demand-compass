import { motion } from "framer-motion";

const stages = [
  { label: "Idea Exposure", count: 1240 },
  { label: "Institutional Interest", count: 384 },
  { label: "Qualified Lead", count: 74 },
  { label: "Product Demonstration", count: 41 },
  { label: "Pilot Program", count: 18 },
  { label: "Contract", count: 7 },
];

const maxCount = stages[0].count;

const ConversionFunnel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Pipeline
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Conversion Pathway
      </h3>

      <div className="space-y-2">
        {stages.map((stage, i) => {
          const widthPct = Math.max(12, (stage.count / maxCount) * 100);
          const convRate = i > 0
            ? ((stage.count / stages[i - 1].count) * 100).toFixed(0)
            : null;

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-32 text-right">
                <span className="text-xs text-muted-foreground">{stage.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.08 }}
                  className="h-7 rounded flex items-center justify-end px-2"
                  style={{
                    background: `linear-gradient(90deg, hsl(174, 72%, 46%, ${0.15 + i * 0.05}), hsl(174, 72%, 46%, ${0.3 + i * 0.1}))`,
                    border: "1px solid hsl(174, 72%, 46%, 0.2)",
                  }}
                >
                  <span className="text-xs font-display font-semibold text-primary">
                    {stage.count.toLocaleString()}
                  </span>
                </motion.div>
                {convRate && (
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {convRate}%
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>→</span>
        <span>Overall: {((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(1)}% awareness-to-contract</span>
      </div>
    </motion.div>
  );
};

export default ConversionFunnel;
