import { motion } from "framer-motion";
import { Code2, Microscope, Leaf, BookMarked } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDashboard } from "@/contexts/DashboardContext";
import { useCommunityMembers as useLiveCommunity } from "@/hooks/use-dashboard-data";
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
  const { data: liveCommunity, isLoading } = useLiveCommunity(period);
  const hasLive = liveCommunity && liveCommunity.totals.some(t => t.value > 0);
  const totals = hasLive ? liveCommunity.totals : getCommunityTotals(period);
  const chartData = getCommunityData(period); // Always use mock for chart trend (need historical)
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Ecosystem {hasLive && <span className="text-primary">● Live</span>}
          </span>
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
            <LineChart data={chartData}>
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
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totals.map((t, i) => (
                <TableRow key={t.label}>
                  <TableCell className="text-foreground">{t.label}</TableCell>
                  <TableCell className="font-semibold" style={{ color: iconConfigs[i].color }}>{t.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasLive && liveCommunity.raw.length > 0 && (
            <>
              <h4 className="text-sm font-display text-secondary-foreground">Recent Members</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Organization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveCommunity.raw.slice(0, 10).map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-foreground">{m.name || "—"}</TableCell>
                      <TableCell className="text-primary capitalize">{m.member_type.replace("_", " ")}</TableCell>
                      <TableCell className="text-muted-foreground">{m.organization || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </DrillDownModal>
    </>
  );
};

export default CommunityGrowth;
