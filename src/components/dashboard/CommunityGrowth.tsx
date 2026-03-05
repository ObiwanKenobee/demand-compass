import { motion } from "framer-motion";
import { Code2, Microscope, Leaf, BookMarked } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDashboard } from "@/contexts/DashboardContext";
import { getCommunityData, getCommunityTotals } from "@/lib/dashboard-data";
import { useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const iconConfigs = [
  { icon: Code2, color: "hsl(174, 72%, 46%)" },
  { icon: Microscope, color: "hsl(38, 90%, 58%)" },
  { icon: Leaf, color: "hsl(152, 60%, 42%)" },
  { icon: BookMarked, color: "hsl(280, 60%, 55%)" },
];

const CommunityGrowth = () => {
  const { period } = useDashboard();
  const data = getCommunityData(period);
  const totals = getCommunityTotals(period);
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Ecosystem</span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Community Growth</h3>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {totals.map((c, i) => {
            const Icon = iconConfigs[i].icon;
            return (
              <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }} className="text-center">
                <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: iconConfigs[i].color }} />
                <motion.div key={`${c.value}-${period}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-display font-bold text-foreground">{c.value}</motion.div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip contentStyle={{ background: "hsl(220, 22%, 9%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "8px", color: "hsl(200, 20%, 90%)", fontSize: "11px" }} />
              <Line type="monotone" dataKey="devs" stroke="hsl(174, 72%, 46%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="researchers" stroke="hsl(38, 90%, 58%)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="orgs" stroke="hsl(152, 60%, 42%)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="contributors" stroke="hsl(280, 60%, 55%)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Community Growth — Detail">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Month</TableHead>
              <TableHead className="text-muted-foreground">Developers</TableHead>
              <TableHead className="text-muted-foreground">Researchers</TableHead>
              <TableHead className="text-muted-foreground">Orgs</TableHead>
              <TableHead className="text-muted-foreground">Contributors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month}>
                <TableCell className="text-foreground">{row.month}</TableCell>
                <TableCell className="text-primary">{row.devs}</TableCell>
                <TableCell className="text-accent">{row.researchers}</TableCell>
                <TableCell className="text-success">{row.orgs}</TableCell>
                <TableCell className="text-secondary-foreground">{row.contributors}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DrillDownModal>
    </>
  );
};

export default CommunityGrowth;
