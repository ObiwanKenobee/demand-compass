import { motion } from "framer-motion";
import { useDashboard } from "@/contexts/DashboardContext";
import { getChannels, getDemandEngineDetails } from "@/lib/dashboard-data";
import { useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const DemandEnginePanel = () => {
  const { period } = useDashboard();
  const channels = getChannels(period);
  const maxLeads = Math.max(...channels.map((c) => c.leads), 1);
  const [drillDown, setDrillDown] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Demand Engine</span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Institutional Lead Sources</h3>

        <div className="space-y-4">
          {channels.map((ch, i) => (
            <motion.div key={ch.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{ch.name}</span>
                <span className="text-xs text-muted-foreground">{ch.qualified}/{ch.leads} qualified ({ch.pct}%)</span>
              </div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                <motion.div key={`t-${period}`} initial={{ width: 0 }} animate={{ width: `${(ch.leads / maxLeads) * 100}%` }} transition={{ duration: 0.8 }} className="absolute inset-y-0 left-0 rounded-full bg-secondary" />
                <motion.div key={`q-${period}`} initial={{ width: 0 }} animate={{ width: `${(ch.qualified / maxLeads) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="absolute inset-y-0 left-0 rounded-full bg-primary/80" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-secondary" />Total Leads</div>
          <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-primary/80" />Qualified</div>
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Demand Engine — Detail">
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channels} layout="vertical">
                <XAxis type="number" stroke="hsl(215, 12%, 48%)" fontSize={11} />
                <YAxis dataKey="name" type="category" width={140} stroke="hsl(215, 12%, 48%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(220, 22%, 9%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "8px", color: "hsl(200, 20%, 90%)", fontSize: "12px" }} />
                <Bar dataKey="leads" fill="hsl(220, 18%, 14%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="qualified" fill="hsl(174, 72%, 46%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Channel</TableHead>
                <TableHead className="text-muted-foreground">Total Leads</TableHead>
                <TableHead className="text-muted-foreground">Qualified</TableHead>
                <TableHead className="text-muted-foreground">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getDemandEngineDetails(period).map((ch) => (
                <TableRow key={ch.name}>
                  <TableCell className="text-foreground">{ch.name}</TableCell>
                  <TableCell className="text-secondary-foreground">{ch.leads}</TableCell>
                  <TableCell className="text-primary font-semibold">{ch.qualified}</TableCell>
                  <TableCell className="text-accent">{ch.pct}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DrillDownModal>
    </>
  );
};

export default DemandEnginePanel;
