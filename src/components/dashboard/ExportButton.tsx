import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

function toCsv(headers: string[], rows: Record<string, any>[]): string {
  const escape = (v: any) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const ExportButton = () => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportTable = async (table: "institutional_leads" | "strategic_signals" | "narrative_metrics" | "community_members") => {
    setExporting(true);
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      if (!data || data.length === 0) {
        toast({ title: "No data", description: `No records found in ${table.replace(/_/g, " ")}.` });
        return;
      }
      const headers = Object.keys(data[0]);
      const csv = toCsv(headers, data);
      downloadFile(csv, `${table}_${new Date().toISOString().slice(0, 10)}.csv`);
      toast({ title: "Exported", description: `${data.length} records downloaded.` });
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={exporting}>
          <Download className="w-4 h-4" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportTable("institutional_leads")}>
          Institutional Leads
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTable("strategic_signals")}>
          Strategic Signals
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTable("narrative_metrics")}>
          Narrative Metrics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportTable("community_members")}>
          Community Members
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
