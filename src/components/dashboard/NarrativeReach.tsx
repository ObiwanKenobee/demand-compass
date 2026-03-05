import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Radio, GraduationCap } from "lucide-react";

const metrics = [
  { label: "Research Citations", value: 189, change: "+23", icon: BookOpen },
  { label: "Policy Discussions", value: 47, change: "+8", icon: MessageSquare },
  { label: "Media Coverage", value: 34, change: "+12", icon: Radio },
  { label: "Academic Collaborations", value: 26, change: "+5", icon: GraduationCap },
];

const NarrativeReach = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Narrative Intelligence
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Idea Propagation Signals
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-lg bg-muted/50 border border-border p-4"
            >
              <Icon className="w-4 h-4 text-muted-foreground mb-3" />
              <div className="text-2xl font-display font-bold text-foreground">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
              <div className="text-xs text-success font-medium mt-1">{m.change} this month</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NarrativeReach;
