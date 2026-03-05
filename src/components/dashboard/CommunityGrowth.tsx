import { motion } from "framer-motion";
import { Code2, Microscope, Leaf, BookMarked } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { month: "Sep", devs: 120, researchers: 45, orgs: 18, contributors: 32 },
  { month: "Oct", devs: 148, researchers: 52, orgs: 22, contributors: 41 },
  { month: "Nov", devs: 175, researchers: 61, orgs: 27, contributors: 53 },
  { month: "Dec", devs: 210, researchers: 74, orgs: 31, contributors: 62 },
  { month: "Jan", devs: 258, researchers: 88, orgs: 38, contributors: 78 },
  { month: "Feb", devs: 312, researchers: 102, orgs: 44, contributors: 91 },
];

const communities = [
  { label: "Developers", value: 312, icon: Code2, color: "hsl(174, 72%, 46%)" },
  { label: "Researchers", value: 102, icon: Microscope, color: "hsl(38, 90%, 58%)" },
  { label: "Climate Orgs", value: 44, icon: Leaf, color: "hsl(152, 60%, 42%)" },
  { label: "Contributors", value: 91, icon: BookMarked, color: "hsl(280, 60%, 55%)" },
];

const CommunityGrowth = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-success" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Ecosystem
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Community Growth
      </h3>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {communities.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className="text-center"
            >
              <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: c.color }} />
              <div className="text-xl font-display font-bold text-foreground">{c.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{c.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{
                background: "hsl(220, 22%, 9%)",
                border: "1px solid hsl(220, 15%, 16%)",
                borderRadius: "8px",
                color: "hsl(200, 20%, 90%)",
                fontSize: "11px",
              }}
            />
            <Line type="monotone" dataKey="devs" stroke="hsl(174, 72%, 46%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="researchers" stroke="hsl(38, 90%, 58%)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="orgs" stroke="hsl(152, 60%, 42%)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="contributors" stroke="hsl(280, 60%, 55%)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CommunityGrowth;
