
-- Create table for institutional leads
CREATE TABLE public.institutional_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('government', 'climate_fund', 'enterprise', 'research_institution', 'ngo', 'academic')),
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'interested', 'qualified', 'demo', 'pilot', 'contract')),
  source_channel TEXT NOT NULL CHECK (source_channel IN ('thought_leadership', 'strategic_partnerships', 'conferences', 'inbound_institutional', 'academic_collaborations', 'developer_ecosystem')),
  region TEXT NOT NULL,
  engagement_level TEXT DEFAULT 'curiosity' CHECK (engagement_level IN ('curiosity', 'whitepaper', 'inquiry', 'demo_request', 'pilot', 'partnership')),
  contact_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for strategic signals / events
CREATE TABLE public.strategic_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('pilot', 'inquiry', 'collaboration', 'enterprise', 'demo')),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for narrative reach metrics
CREATE TABLE public.narrative_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('research_citation', 'policy_discussion', 'media_coverage', 'academic_collaboration')),
  title TEXT,
  source TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for community members
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_type TEXT NOT NULL CHECK (member_type IN ('developer', 'researcher', 'climate_org', 'contributor')),
  name TEXT,
  organization TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.institutional_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narrative_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Public read policies (dashboard is read-only for viewers)
CREATE POLICY "Anyone can view leads" ON public.institutional_leads FOR SELECT USING (true);
CREATE POLICY "Anyone can view signals" ON public.strategic_signals FOR SELECT USING (true);
CREATE POLICY "Anyone can view metrics" ON public.narrative_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can view community" ON public.community_members FOR SELECT USING (true);

-- Authenticated users can insert/update
CREATE POLICY "Auth users can insert leads" ON public.institutional_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update leads" ON public.institutional_leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can insert signals" ON public.strategic_signals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can insert metrics" ON public.narrative_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can insert community" ON public.community_members FOR INSERT TO authenticated WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.institutional_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
