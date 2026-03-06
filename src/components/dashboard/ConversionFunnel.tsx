import { motion } from "framer-motion";
import { useDashboard } from "@/contexts/DashboardContext";
import { useConversionFunnel as useLiveFunnel } from "@/hooks/use-dashboard-data";
import { getFunnelStages } from "@/lib/dashboard-data";
import { useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ConversionFunnel = () => {
  const { period } = useDashboard();
  const { stages: liveStages, isLoading } = useLiveFunnel(period);
  const hasLive = liveStages.some(s => s.count > 0);
  const stages = hasLive ? liveStages : getFunnelStages(period);
  const maxCount = stages[0]?.count || 1;
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Pipeline {hasLive && <span className="text-primary">● Live</span>}
          </span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Conversion Pathway</h3>

        <div className="space-y-2">
          {stages.map((stage, i) => {
            const widthPct = Math.max(12, (stage.count / maxCount) * 100);
            const convRate = i > 0 && stages[i - 1].count > 0
              ? ((stage.count / stages[i - 1].count) * 100).toFixed(0)
              : null;
            return (
              <motion.div key={stage.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.08 }} className="flex items-center gap-3">
                <div className="w-32 text-right"><span className="text-xs text-muted-foreground">{stage.label}</span></div>
                <div className="flex-1 flex items-center gap-2">
                  <motion.div key={`${stage.count}-${period}`} initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 0.8 }}
                    className="h-7 rounded flex items-center justify-end px-2"
                    style={{ background: `linear-gradient(90deg, hsl(174, 72%, 46%, ${0.15 + i * 0.05}), hsl(174, 72%, 46%, ${0.3 + i * 0.1}))`, border: "1px solid hsl(174, 72%, 46%, 0.2)" }}
                  >
                    <span className="text-xs font-display font-semibold text-primary">{stage.count.toLocaleString()}</span>
                  </motion.div>
                  {convRate && <span className="text-[10px] text-muted-foreground flex-shrink-0">{convRate}%</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>→</span>
          <span>Overall: {maxCount > 0 ? ((stages[stages.length - 1].count / maxCount) * 100).toFixed(1) : 0}% awareness-to-contract</span>
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Conversion Pathway — Detail">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Stage</TableHead>
              <TableHead className="text-muted-foreground">Count</TableHead>
              <TableHead className="text-muted-foreground">Stage Conv.</TableHead>
              <TableHead className="text-muted-foreground">Cumulative</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((stage, i) => (
              <TableRow key={stage.label}>
                <TableCell className="text-foreground">{stage.label}</TableCell>
                <TableCell className="text-primary font-semibold">{stage.count.toLocaleString()}</TableCell>
                <TableCell className="text-accent">{i > 0 && stages[i - 1].count > 0 ? `${((stage.count / stages[i - 1].count) * 100).toFixed(1)}%` : "—"}</TableCell>
                <TableCell className="text-success">{maxCount > 0 ? `${((stage.count / maxCount) * 100).toFixed(1)}%` : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrillDownModal>
    </>
  );
};

export default ConversionFunnel;
