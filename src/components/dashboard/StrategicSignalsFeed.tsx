import { motion } from "framer-motion";
import { Zap, Building2, GraduationCap, Globe, Shield, Trash2, Search } from "lucide-react";
import { useStrategicSignals } from "@/hooks/use-dashboard-data";
import { useMemo, useState } from "react";
import DrillDownModal from "./DrillDownModal";
import TablePagination from "./TablePagination";
import { usePagination } from "@/hooks/use-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { toCsv, downloadCsv } from "@/lib/csv-utils";

const typeIcons: Record<string, typeof Building2> = {
  pilot: Building2,
  inquiry: Globe,
  collaboration: GraduationCap,
  enterprise: Shield,
  demo: Zap,
};

const typeColors: Record<string, string> = {
  pilot: "bg-success/10 text-success border-success/20",
  inquiry: "bg-accent/10 text-accent border-accent/20",
  collaboration: "bg-primary/10 text-primary border-primary/20",
  enterprise: "bg-primary/10 text-primary border-primary/20",
  demo: "bg-accent/10 text-accent border-accent/20",
};

const fallbackSignals = [
  { id: "1", organization_name: "UNDP Climate Adaptation Fund", signal_type: "pilot", title: "UNDP Climate Adaptation Fund", description: "Requested pilot program for regenerative asset verification in East Africa", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "2", organization_name: "German Federal Ministry", signal_type: "inquiry", title: "German Federal Ministry", description: "Inquiry into policy simulation capabilities for carbon market design", created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: "3", organization_name: "MIT Media Lab", signal_type: "collaboration", title: "MIT Media Lab", description: "Research collaboration proposal on ethical AI infrastructure", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", organization_name: "Unilever Sustainability Division", signal_type: "enterprise", title: "Unilever Sustainability Division", description: "Exploring regenerative supply chain verification integration", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "5", organization_name: "African Development Bank", signal_type: "demo", title: "African Development Bank", description: "Demo scheduled for ecosystem impact assessment tools", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const StrategicSignalsFeed = () => {
  const { data: dbSignals } = useStrategicSignals();
  const signals = dbSignals && dbSignals.length > 0 ? dbSignals : fallbackSignals;
  const [drillDown, setDrillDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { isAdmin } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const matchesSearch = !searchQuery || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === "all" || s.signal_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [signals, searchQuery, typeFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this signal?")) return;
    const { error } = await supabase.from("strategic_signals").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["strategic-signals"] });
      toast({ title: "Signal deleted" });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => setDrillDown(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-subtle-glow" />
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Live Intelligence</span>
        </div>
        <h3 className="text-lg font-display text-secondary-foreground mb-6">Strategic Signals</h3>

        <div className="space-y-3">
          {signals.slice(0, 5).map((signal, i) => {
            const Icon = typeIcons[signal.signal_type] || Zap;
            const colorClass = typeColors[signal.signal_type] || typeColors.demo;
            return (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{signal.title}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{signal.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <DrillDownModal open={drillDown} onOpenChange={setDrillDown} title="Strategic Signals — Full Feed">
        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-border"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px] bg-muted/30 border-border">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="pilot">Pilot</SelectItem>
              <SelectItem value="inquiry">Inquiry</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="demo">Demo</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            disabled={filteredSignals.length === 0}
            onClick={() => {
              const headers = ["title", "signal_type", "organization_name", "description", "created_at"];
              const csv = toCsv(headers, filteredSignals);
              downloadCsv(csv, `strategic_signals_${new Date().toISOString().slice(0, 10)}.csv`);
            }}
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
        <SignalsTable signals={filteredSignals} isAdmin={isAdmin} isLive={!!(dbSignals && dbSignals.length > 0)} onDelete={handleDelete} />
      </DrillDownModal>
    </>
  );
};

export default StrategicSignalsFeed;
