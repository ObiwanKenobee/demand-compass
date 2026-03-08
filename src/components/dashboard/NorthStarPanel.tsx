import { motion } from "framer-motion";
import { TrendingUp, Trash2, Search } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useDashboard } from "@/contexts/DashboardContext";
import { useNorthStarMetrics } from "@/hooks/use-dashboard-data";
import { scaleValue, scaleGrowth } from "@/lib/dashboard-data";
import { useMemo, useState } from "react";
import DrillDownModal from "./DrillDownModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getNorthStarTrend as getMockTrend } from "@/lib/dashboard-data";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { toCsv, downloadCsv } from "@/lib/csv-utils";

const NorthStarPanel = () => {
  const { period } = useDashboard();
  const { totalQIL, growthRate, trendData: liveTrend, isLoading, allLeads } = useNorthStarMetrics(period);
  const [drillDown, setDrillDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const { isAdmin } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const qualifiedLeads = allLeads.filter(l => ["qualified", "demo", "pilot", "contract"].includes(l.status));
  
  const uniqueRegions = useMemo(() => [...new Set(qualifiedLeads.map(l => l.region))].sort(), [qualifiedLeads]);

  const filteredLeads = useMemo(() => {
    return qualifiedLeads.filter((l) => {
      const matchesSearch = !searchQuery ||
        l.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.organization_type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesRegion = regionFilter === "all" || l.region === regionFilter;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [qualifiedLeads, searchQuery, statusFilter, regionFilter]);

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("institutional_leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["institutional-leads"] });
      toast({ title: "Lead deleted" });
    }
  };
  // Use live data if available, fallback to mock
  const hasLiveData = allLeads.length > 0;
  const displayValue = hasLiveData ? totalQIL : scaleValue(74, period);
  const displayGrowth = hasLiveData ? growthRate : scaleGrowth(period);
  const trendData = hasLiveData && liveTrend.length > 1 ? liveTrend : getMockTrend(period);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-xl border border-border bg-card p-8 overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
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
              {hasLiveData && <span className="ml-2 text-primary">● Live</span>}
            </span>
          </div>

          <h2 className="text-lg font-display text-secondary-foreground mb-6">Qualified Institutional Leads</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="space-y-1">
              <motion.div key={displayValue} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: "spring" }} className="text-6xl font-display font-bold text-primary">
                {displayValue}
              </motion.div>
              <p className="text-sm text-muted-foreground">Active qualified leads</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-2xl font-display font-semibold text-success">{displayGrowth}</span>
              </div>
              <p className="text-sm text-muted-foreground">Growth rate</p>
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
                  <Tooltip contentStyle={{ background: "hsl(220, 22%, 9%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "8px", color: "hsl(200, 20%, 90%)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(174, 72%, 46%)" strokeWidth={2} fill="url(#northStarGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Qualified Institutional Leads — Detail">
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="northStarGradientFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(215, 12%, 48%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(220, 22%, 9%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "8px", color: "hsl(200, 20%, 90%)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="value" stroke="hsl(174, 72%, 46%)" strokeWidth={2} fill="url(#northStarGradientFull)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {hasLiveData && (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-muted/30 border-border">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="pilot">Pilot</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-muted/30 border-border">
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {uniqueRegions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Organization</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Region</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground w-10" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground py-8">
                        No leads match your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map(lead => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-foreground">{lead.organization_name}</TableCell>
                        <TableCell className="text-muted-foreground capitalize">{lead.organization_type.replace("_", " ")}</TableCell>
                        <TableCell className="text-primary capitalize">{lead.status}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.region}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteLead(lead.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}

          {!hasLiveData && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Month</TableHead>
                  <TableHead className="text-muted-foreground">QILs</TableHead>
                  <TableHead className="text-muted-foreground">MoM Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getMockTrend("12m").map((row, i, arr) => (
                  <TableRow key={row.month}>
                    <TableCell className="text-foreground">{row.month}</TableCell>
                    <TableCell className="text-primary font-semibold">{row.value}</TableCell>
                    <TableCell className="text-success">
                      {i > 0 ? `+${((row.value - arr[i - 1].value) / arr[i - 1].value * 100).toFixed(1)}%` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DrillDownModal>
    </>
  );
};

export default NorthStarPanel;
