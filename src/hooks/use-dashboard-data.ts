import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimePeriod } from "@/contexts/DashboardContext";
import { subDays, subMonths, format, startOfMonth, parseISO } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";

function getDateFilter(period: TimePeriod): string {
  const now = new Date();
  switch (period) {
    case "30d": return subDays(now, 30).toISOString();
    case "90d": return subDays(now, 90).toISOString();
    case "12m": return subMonths(now, 12).toISOString();
  }
}

// ===== Institutional Leads =====
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

// ===== North Star computed metrics =====
export function useNorthStarMetrics(period: TimePeriod) {
  const { data: leads, isLoading } = useInstitutionalLeads(period);
  
  const qualifiedStatuses = ["qualified", "demo", "pilot", "contract"];
  const qualifiedLeads = leads?.filter(l => qualifiedStatuses.includes(l.status)) ?? [];
  const totalQIL = qualifiedLeads.length;

  // Monthly trend from all leads in period
  const trendMap = new Map<string, number>();
  qualifiedLeads.forEach(lead => {
    const month = format(parseISO(lead.created_at), "MMM");
    trendMap.set(month, (trendMap.get(month) ?? 0) + 1);
  });
  
  // Build cumulative trend
  const trendData = Array.from(trendMap.entries()).map(([month, value]) => ({ month, value }));
  
  // Growth: compare last month vs previous
  const now = new Date();
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const twoMonthsAgo = startOfMonth(subMonths(now, 2));
  const lastMonthLeads = qualifiedLeads.filter(l => {
    const d = parseISO(l.created_at);
    return d >= lastMonthStart;
  }).length;
  const prevMonthLeads = qualifiedLeads.filter(l => {
    const d = parseISO(l.created_at);
    return d >= twoMonthsAgo && d < lastMonthStart;
  }).length;
  const growthRate = prevMonthLeads > 0
    ? `+${((lastMonthLeads - prevMonthLeads) / prevMonthLeads * 100).toFixed(1)}%`
    : totalQIL > 0 ? "+100%" : "0%";

  return { totalQIL, growthRate, trendData, isLoading, allLeads: leads ?? [] };
}

// ===== Demand Engine: leads by channel =====
export function useDemandEngine(period: TimePeriod) {
  const { data: leads, isLoading } = useInstitutionalLeads(period);
  const qualifiedStatuses = ["qualified", "demo", "pilot", "contract"];
  
  const channelMap: Record<string, { name: string; leads: number; qualified: number }> = {
    thought_leadership: { name: "Thought Leadership", leads: 0, qualified: 0 },
    strategic_partnerships: { name: "Strategic Partnerships", leads: 0, qualified: 0 },
    conferences: { name: "Climate & Tech Conferences", leads: 0, qualified: 0 },
    inbound_institutional: { name: "Inbound Institutional", leads: 0, qualified: 0 },
    academic_collaborations: { name: "Academic Collaborations", leads: 0, qualified: 0 },
    developer_ecosystem: { name: "Developer Ecosystem", leads: 0, qualified: 0 },
  };

  leads?.forEach(lead => {
    const ch = channelMap[lead.source_channel];
    if (ch) {
      ch.leads++;
      if (qualifiedStatuses.includes(lead.status)) ch.qualified++;
    }
  });

  const channels = Object.values(channelMap)
    .map(ch => ({ ...ch, pct: ch.leads > 0 ? Math.round((ch.qualified / ch.leads) * 100) : 0 }))
    .sort((a, b) => b.leads - a.leads);

  return { channels, isLoading };
}

// ===== Engagement Ladder: leads by engagement level =====
export function useEngagementLadder(period: TimePeriod) {
  const { data: leads, isLoading } = useInstitutionalLeads(period);
  
  const levels = [
    { key: "whitepaper", label: "Whitepaper Downloads" },
    { key: "inquiry", label: "Research Collaboration Inquiries" },
    { key: "demo_request", label: "Policy Simulation Demos" },
    { key: "pilot", label: "Enterprise Product Demos" },
    { key: "partnership", label: "Verification Pilots" },
  ];

  const steps = levels.map(level => {
    const count = leads?.filter(l => l.engagement_level === level.key).length ?? 0;
    return { label: level.label, count };
  });

  // Regional breakdown
  const regions = ["Europe", "East Africa", "North America", "Southeast Asia"];
  const stepsWithBreakdown = steps.map(step => ({
    ...step,
    breakdown: regions.map(region => ({
      region,
      count: leads?.filter(l => l.engagement_level === levels.find(lv => lv.label === step.label)?.key && l.region === region).length ?? 0,
    })),
  }));

  return { steps: stepsWithBreakdown, isLoading };
}

// ===== Geographic demand =====
export function useGeoDemand(period: TimePeriod) {
  const { data: leads, isLoading } = useInstitutionalLeads(period);
  
  const regionCoords: Record<string, { x: number; y: number }> = {
    "East Africa": { x: 58, y: 52 },
    "Europe": { x: 50, y: 28 },
    "North America": { x: 22, y: 32 },
    "Southeast Asia": { x: 74, y: 50 },
    "South America": { x: 28, y: 62 },
  };

  const regionMap = new Map<string, { leads: number; demos: number; pilots: number }>();
  leads?.forEach(lead => {
    const r = regionMap.get(lead.region) ?? { leads: 0, demos: 0, pilots: 0 };
    r.leads++;
    if (lead.status === "demo") r.demos++;
    if (lead.status === "pilot") r.pilots++;
    regionMap.set(lead.region, r);
  });

  const regions = Array.from(regionMap.entries()).map(([name, data]) => ({
    name,
    ...data,
    ...(regionCoords[name] ?? { x: 50, y: 50 }),
  }));

  return { regions, isLoading };
}

// ===== Conversion Funnel =====
export function useConversionFunnel(period: TimePeriod) {
  const { data: leads, isLoading } = useInstitutionalLeads(period);
  
  const statusOrder = ["prospect", "interested", "qualified", "demo", "pilot", "contract"];
  const labelMap: Record<string, string> = {
    prospect: "Idea Exposure",
    interested: "Institutional Interest",
    qualified: "Qualified Lead",
    demo: "Product Demonstration",
    pilot: "Pilot Program",
    contract: "Contract",
  };

  // Cumulative: each stage includes all leads at that stage or deeper
  const total = leads?.length ?? 0;
  const stages = statusOrder.map((status, i) => {
    const atOrBeyond = leads?.filter(l => statusOrder.indexOf(l.status) >= i).length ?? 0;
    return { label: labelMap[status], count: i === 0 ? total : atOrBeyond };
  });

  return { stages, isLoading };
}

// ===== Narrative Metrics =====
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
      
      const typeMap: Record<string, { label: string; count: number }> = {
        research_citation: { label: "Research Citations", count: 0 },
        policy_discussion: { label: "Policy Discussions", count: 0 },
        media_coverage: { label: "Media Coverage", count: 0 },
        academic_collaboration: { label: "Academic Collaborations", count: 0 },
      };

      data?.forEach(m => {
        if (typeMap[m.metric_type]) typeMap[m.metric_type].count++;
      });

      return Object.values(typeMap);
    },
  });
}

// ===== Community Members =====
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

      const typeMap: Record<string, number> = {
        developer: 0, researcher: 0, climate_org: 0, contributor: 0,
      };
      data?.forEach(m => {
        if (typeMap[m.member_type] !== undefined) typeMap[m.member_type]++;
      });

      return {
        totals: [
          { label: "Developers", value: typeMap.developer },
          { label: "Researchers", value: typeMap.researcher },
          { label: "Climate Orgs", value: typeMap.climate_org },
          { label: "Contributors", value: typeMap.contributor },
        ],
        raw: data ?? [],
      };
    },
  });
}

// ===== Strategic Signals =====
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

// ===== Real-time Subscriptions =====
export function useRealtimeSubscriptions() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels = [
      supabase
        .channel("leads-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "institutional_leads" }, () => {
          queryClient.invalidateQueries({ queryKey: ["institutional-leads"] });
        })
        .subscribe(),
      supabase
        .channel("signals-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "strategic_signals" }, () => {
          queryClient.invalidateQueries({ queryKey: ["strategic-signals"] });
        })
        .subscribe(),
      supabase
        .channel("narrative-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "narrative_metrics" }, () => {
          queryClient.invalidateQueries({ queryKey: ["narrative-metrics"] });
        })
        .subscribe(),
      supabase
        .channel("community-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "community_members" }, () => {
          queryClient.invalidateQueries({ queryKey: ["community-members"] });
        })
        .subscribe(),
    ];

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [queryClient]);
}
