import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Radio, GraduationCap } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useNarrativeMetrics as useLiveNarrative } from "@/hooks/use-dashboard-data";
import { getNarrativeMetrics } from "@/lib/dashboard-data";
import { useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const iconMap = [BookOpen, MessageSquare, Radio, GraduationCap];

const NarrativeReach = () => {
  const { period } = useDashboard();
  const { data: liveMetrics, isLoading } = useLiveNarrative(period);
  const hasLive = liveMetrics && liveMetrics.some(m => m.count > 0);
  const mockMetrics = getNarrativeMetrics(period);
  
  const metrics = hasLive
    ? liveMetrics.map(m => ({ ...m, value: m.count, change: `+${m.count}` }))
    : mockMetrics;

  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Narrative Intelligence {hasLive && <span className="text-primary">● Live</span>}
          </span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Idea Propagation Signals</h3>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m, i) => {
            const Icon = iconMap[i] || BookOpen;
            return (
              <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="rounded-lg bg-muted/50 border border-border p-4">
                <Icon className="w-4 h-4 text-muted-foreground mb-3" />
                <motion.div key={`${m.value}-${period}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold text-foreground">{m.value}</motion.div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                <div className="text-xs text-success font-medium mt-1">{m.change} this period</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Narrative Reach — Detail">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Signal Type</TableHead>
              <TableHead className="text-muted-foreground">Count</TableHead>
              <TableHead className="text-muted-foreground">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m) => (
              <TableRow key={m.label}>
                <TableCell className="text-foreground">{m.label}</TableCell>
                <TableCell className="text-primary font-semibold">{m.value}</TableCell>
                <TableCell className="text-success">{m.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrillDownModal>
    </>
  );
};

export default NarrativeReach;
