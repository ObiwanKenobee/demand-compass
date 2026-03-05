import { motion } from "framer-motion";
import { FileText, Users, Monitor, Beaker, ShieldCheck } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { getEngagementDetails } from "@/lib/dashboard-data";
import { useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const icons = [FileText, Users, Monitor, Beaker, ShieldCheck];

const EngagementLadder = () => {
  const { period } = useDashboard();
  const steps = getEngagementDetails(period);
  const maxCount = Math.max(...steps.map((s) => s.count), 1);
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Engagement Depth</span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Institutional Engagement Ladder</h3>

        <div className="space-y-3">
          {steps.map((step, i) => {
            const widthPct = Math.max(20, (step.count / maxCount) * 100);
            const Icon = icons[i];
            return (
              <motion.div key={step.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground truncate">{step.label}</span>
                    <motion.span key={`${step.count}-${period}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-display font-semibold text-primary ml-2">{step.count}</motion.span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div key={`w-${period}`} initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(174, 72%, 46%), hsl(152, 60%, 42%))" }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">Curiosity → Partnership depth progression</p>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Engagement Ladder — Regional Breakdown">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Stage</TableHead>
              <TableHead className="text-muted-foreground">Total</TableHead>
              <TableHead className="text-muted-foreground">Europe</TableHead>
              <TableHead className="text-muted-foreground">Africa</TableHead>
              <TableHead className="text-muted-foreground">N. America</TableHead>
              <TableHead className="text-muted-foreground">Asia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step.label}>
                <TableCell className="text-foreground">{step.label}</TableCell>
                <TableCell className="text-primary font-semibold">{step.count}</TableCell>
                {step.breakdown.map((b) => (
                  <TableCell key={b.region} className="text-secondary-foreground">{b.count}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrillDownModal>
    </>
  );
};

export default EngagementLadder;
