import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimePeriod } from "@/contexts/DashboardContext";
import { subDays, subMonths } from "date-fns";

function getDateFilter(period: TimePeriod): string {
  const now = new Date();
  let date: Date;
  switch (period) {
    case "30d": date = subDays(now, 30); break;
    case "90d": date = subDays(now, 90); break;
    case "12m": date = subMonths(now, 12); break;
  }
  return date.toISOString();
}

export function useInstitutionalLeads(period: TimePeriod) {
  const since = getDateFilter(period);
  return useQuery({
    queryKey: ["institutional-leads", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutional_leads")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useStrategicSignals() {
  return useQuery({
    queryKey: ["strategic-signals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategic_signals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
}

export function useNarrativeMetrics(period: TimePeriod) {
  const since = getDateFilter(period);
  return useQuery({
    queryKey: ["narrative-metrics", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("narrative_metrics")
        .select("*")
        .gte("recorded_at", since)
        .order("recorded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCommunityMembers(period: TimePeriod) {
  const since = getDateFilter(period);
  return useQuery({
    queryKey: ["community-members", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_members")
        .select("*")
        .gte("joined_at", since)
        .order("joined_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
