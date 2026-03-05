import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";
import { getRegions } from "@/lib/dashboard-data";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GeoDemandMap = () => {
  const { period } = useDashboard();
  const regions = getRegions(period);
  const [hovered, setHovered] = useState<string | null>(null);
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Geographic Intelligence</span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Global Institutional Demand</h3>

        <div className="relative w-full aspect-[2/1] rounded-lg bg-muted/30 border border-border overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-primary/30" style={{ top: `${(i + 1) * 11.1}%` }} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-primary/30" style={{ left: `${(i + 1) * 7.7}%` }} />
            ))}
          </div>

          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
              className="absolute group"
              style={{ left: `${region.x}%`, top: `${region.y}%`, transform: "translate(-50%, -50%)" }}
              onMouseEnter={(e) => { e.stopPropagation(); setHovered(region.name); }}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="absolute inset-0 w-8 h-8 -m-1 rounded-full bg-primary/20 animate-radar-pulse" />
              <div className="relative w-6 h-6 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-primary" />
              </div>

              {hovered === region.name && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-card border border-border p-3 shadow-lg" onClick={(e) => e.stopPropagation()}>
                  <div className="text-sm font-display font-semibold text-foreground mb-2">{region.name}</div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Institutional Leads</span><span className="text-primary font-medium">{region.leads}</span></div>
                    <div className="flex justify-between"><span>Demo Requests</span><span className="text-accent font-medium">{region.demos}</span></div>
                    <div className="flex justify-between"><span>Pilot Projects</span><span className="text-success font-medium">{region.pilots}</span></div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Geographic Demand — Detail">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Region</TableHead>
              <TableHead className="text-muted-foreground">Leads</TableHead>
              <TableHead className="text-muted-foreground">Demos</TableHead>
              <TableHead className="text-muted-foreground">Pilots</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="text-foreground">{r.name}</TableCell>
                <TableCell className="text-primary font-semibold">{r.leads}</TableCell>
                <TableCell className="text-accent">{r.demos}</TableCell>
                <TableCell className="text-success">{r.pilots}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrillDownModal>
    </>
  );
};

export default GeoDemandMap;
