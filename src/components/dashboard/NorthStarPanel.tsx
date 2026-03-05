import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const trendData = [
  { month: "Mar", value: 12 },
  { month: "Apr", value: 18 },
  { month: "May", value: 22 },
  { month: "Jun", value: 28 },
  { month: "Jul", value: 31 },
  { month: "Aug", value: 37 },
  { month: "Sep", value: 42 },
  { month: "Oct", value: 48 },
  { month: "Nov", value: 56 },
  { month: "Dec", value: 61 },
  { month: "Jan", value: 68 },
  { month: "Feb", value: 74 },
];

const NorthStarPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative rounded-xl border border-border bg-card p-8 overflow-hidden"
    >
      {/* Radar pulse background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-primary/10 animate-radar-pulse" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-primary/10 animate-radar-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/10 animate-radar-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-subtle-glow" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            North Star Metric
          </span>
        </div>

        <h2 className="text-lg font-display text-secondary-foreground mb-6">
          Qualified Institutional Leads
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div className="space-y-1">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, type: "spring" }}
              className="text-6xl font-display font-bold text-primary"
            >
              74
            </motion.div>
            <p className="text-sm text-muted-foreground">Active qualified leads</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-2xl font-display font-semibold text-success">+18.4%</span>
            </div>
            <p className="text-sm text-muted-foreground">Monthly growth rate</p>
          </div>

          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="northStarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220, 22%, 9%)",
                    border: "1px solid hsl(220, 15%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(200, 20%, 90%)",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(174, 72%, 46%)"
                  strokeWidth={2}
                  fill="url(#northStarGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NorthStarPanel;
