import { TimePeriod } from "@/contexts/DashboardContext";

// Multiplier for scaling data by period
const periodScale: Record<TimePeriod, number> = {
  "30d": 0.12,
  "90d": 0.35,
  "12m": 1,
};

export function scaleValue(base: number, period: TimePeriod): number {
  return Math.round(base * periodScale[period]);
}

export function scaleGrowth(period: TimePeriod): string {
  const rates: Record<TimePeriod, string> = {
    "30d": "+6.2%",
    "90d": "+12.8%",
    "12m": "+18.4%",
  };
  return rates[period];
}

export function getNorthStarTrend(period: TimePeriod) {
  const full = [
    { month: "Mar", value: 12 }, { month: "Apr", value: 18 },
    { month: "May", value: 22 }, { month: "Jun", value: 28 },
    { month: "Jul", value: 31 }, { month: "Aug", value: 37 },
    { month: "Sep", value: 42 }, { month: "Oct", value: 48 },
    { month: "Nov", value: 56 }, { month: "Dec", value: 61 },
    { month: "Jan", value: 68 }, { month: "Feb", value: 74 },
  ];
  if (period === "30d") return full.slice(-2);
  if (period === "90d") return full.slice(-4);
  return full;
}

export function getChannels(period: TimePeriod) {
  const base = [
    { name: "Thought Leadership", leads: 28, qualified: 19 },
    { name: "Strategic Partnerships", leads: 22, qualified: 16 },
    { name: "Climate & Tech Conferences", leads: 18, qualified: 11 },
    { name: "Inbound Institutional", leads: 15, qualified: 13 },
    { name: "Academic Collaborations", leads: 12, qualified: 9 },
    { name: "Developer Ecosystem", leads: 9, qualified: 6 },
  ];
  return base.map((ch) => ({
    ...ch,
    leads: scaleValue(ch.leads, period),
    qualified: scaleValue(ch.qualified, period),
    pct: Math.round((ch.qualified / ch.leads) * 100),
  }));
}

export function getEngagementSteps(period: TimePeriod) {
  const base = [
    { label: "Whitepaper Downloads", count: 342 },
    { label: "Research Collaboration Inquiries", count: 128 },
    { label: "Policy Simulation Demos", count: 67 },
    { label: "Enterprise Product Demos", count: 41 },
    { label: "Verification Pilots", count: 18 },
  ];
  return base.map((s) => ({ ...s, count: scaleValue(s.count, period) }));
}

export function getNarrativeMetrics(period: TimePeriod) {
  const base = [
    { label: "Research Citations", value: 189, change: 23 },
    { label: "Policy Discussions", value: 47, change: 8 },
    { label: "Media Coverage", value: 34, change: 12 },
    { label: "Academic Collaborations", value: 26, change: 5 },
  ];
  return base.map((m) => ({
    ...m,
    value: scaleValue(m.value, period),
    change: `+${scaleValue(m.change, period)}`,
  }));
}

export function getRegions(period: TimePeriod) {
  const base = [
    { name: "East Africa", leads: 14, demos: 8, pilots: 3, x: 58, y: 52 },
    { name: "European Climate Funds", leads: 22, demos: 15, pilots: 6, x: 50, y: 28 },
    { name: "North America", leads: 19, demos: 12, pilots: 4, x: 22, y: 32 },
    { name: "Southeast Asia", leads: 11, demos: 6, pilots: 2, x: 74, y: 50 },
    { name: "South America", leads: 8, demos: 4, pilots: 1, x: 28, y: 62 },
  ];
  return base.map((r) => ({
    ...r,
    leads: scaleValue(r.leads, period),
    demos: scaleValue(r.demos, period),
    pilots: scaleValue(r.pilots, period),
  }));
}

export function getFunnelStages(period: TimePeriod) {
  const base = [
    { label: "Idea Exposure", count: 1240 },
    { label: "Institutional Interest", count: 384 },
    { label: "Qualified Lead", count: 74 },
    { label: "Product Demonstration", count: 41 },
    { label: "Pilot Program", count: 18 },
    { label: "Contract", count: 7 },
  ];
  return base.map((s) => ({ ...s, count: scaleValue(s.count, period) }));
}

export function getCommunityData(period: TimePeriod) {
  const base = [
    { month: "Sep", devs: 120, researchers: 45, orgs: 18, contributors: 32 },
    { month: "Oct", devs: 148, researchers: 52, orgs: 22, contributors: 41 },
    { month: "Nov", devs: 175, researchers: 61, orgs: 27, contributors: 53 },
    { month: "Dec", devs: 210, researchers: 74, orgs: 31, contributors: 62 },
    { month: "Jan", devs: 258, researchers: 88, orgs: 38, contributors: 78 },
    { month: "Feb", devs: 312, researchers: 102, orgs: 44, contributors: 91 },
  ];
  if (period === "30d") return base.slice(-2);
  if (period === "90d") return base.slice(-4);
  return base;
}

export function getCommunityTotals(period: TimePeriod) {
  const data = getCommunityData(period);
  const last = data[data.length - 1];
  return [
    { label: "Developers", value: last.devs },
    { label: "Researchers", value: last.researchers },
    { label: "Climate Orgs", value: last.orgs },
    { label: "Contributors", value: last.contributors },
  ];
}

// Detailed drill-down data
export function getDemandEngineDetails(period: TimePeriod) {
  const channels = getChannels(period);
  return channels.map((ch) => ({
    ...ch,
    details: [
      { org: `${ch.name} Org A`, status: "Qualified", date: "2026-02-28" },
      { org: `${ch.name} Org B`, status: "In Review", date: "2026-02-15" },
      { org: `${ch.name} Org C`, status: "Qualified", date: "2026-01-20" },
    ].slice(0, Math.max(1, Math.round(ch.qualified / 6))),
  }));
}

export function getEngagementDetails(period: TimePeriod) {
  return getEngagementSteps(period).map((step) => ({
    ...step,
    breakdown: [
      { region: "Europe", count: Math.round(step.count * 0.35) },
      { region: "Africa", count: Math.round(step.count * 0.25) },
      { region: "North America", count: Math.round(step.count * 0.22) },
      { region: "Asia", count: Math.round(step.count * 0.18) },
    ],
  }));
}
