import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2"
      >
        <Plus className="w-4 h-4" /> Add Data
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-foreground">Add Data</h2>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Tabs defaultValue="lead" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="lead" className="flex-1">Lead</TabsTrigger>
                  <TabsTrigger value="signal" className="flex-1">Signal</TabsTrigger>
                  <TabsTrigger value="member" className="flex-1">Member</TabsTrigger>
                </TabsList>

                <TabsContent value="lead">
                  <LeadForm onSuccess={() => { setOpen(false); toast({ title: "Lead added" }); }} />
                </TabsContent>
                <TabsContent value="signal">
                  <SignalForm onSuccess={() => { setOpen(false); toast({ title: "Signal added" }); }} />
                </TabsContent>
                <TabsContent value="member">
                  <MemberForm onSuccess={() => { setOpen(false); toast({ title: "Member added" }); }} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function LeadForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("institutional_leads").insert({
      organization_name: fd.get("org_name") as string,
      organization_type: fd.get("org_type") as string,
      source_channel: fd.get("channel") as string,
      region: fd.get("region") as string,
      status: fd.get("status") as string,
      engagement_level: fd.get("engagement") as string,
      contact_email: (fd.get("email") as string) || null,
      notes: (fd.get("notes") as string) || null,
    });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-foreground">Organization Name</Label>
        <Input name="org_name" required placeholder="e.g. World Bank" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-foreground">Type</Label>
          <Select name="org_type" required>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["government", "climate_fund", "enterprise", "research_institution", "ngo", "academic"].map(v => (
                <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Region</Label>
          <Select name="region" required>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["East Africa", "Europe", "North America", "Southeast Asia", "South America"].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-foreground">Channel</Label>
          <Select name="channel" required>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["thought_leadership", "strategic_partnerships", "conferences", "inbound_institutional", "academic_collaborations", "developer_ecosystem"].map(v => (
                <SelectItem key={v} value={v}>{v.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-foreground">Status</Label>
          <Select name="status" required>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {["prospect", "interested", "qualified", "demo", "pilot", "contract"].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Engagement Level</Label>
        <Select name="engagement" required>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {["curiosity", "whitepaper", "inquiry", "demo_request", "pilot", "partnership"].map(v => (
              <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Contact Email</Label>
        <Input name="email" type="email" placeholder="contact@org.com" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Notes</Label>
        <Textarea name="notes" placeholder="Additional context..." rows={2} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Lead"}
      </Button>
    </form>
  );
}

function SignalForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("strategic_signals").insert({
      title: fd.get("title") as string,
      organization_name: fd.get("org") as string,
      signal_type: fd.get("type") as string,
      description: (fd.get("description") as string) || null,
    });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-foreground">Title</Label>
        <Input name="title" required placeholder="Signal title" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Organization</Label>
        <Input name="org" required placeholder="Organization name" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Signal Type</Label>
        <Select name="type" required>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {["pilot", "inquiry", "collaboration", "enterprise", "demo"].map(v => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Description</Label>
        <Textarea name="description" placeholder="What happened..." rows={3} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Signal"}
      </Button>
    </form>
  );
}

function MemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("community_members").insert({
      member_type: fd.get("type") as string,
      name: (fd.get("name") as string) || null,
      organization: (fd.get("org") as string) || null,
    });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-foreground">Member Type</Label>
        <Select name="type" required>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {["developer", "researcher", "climate_org", "contributor"].map(v => (
              <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Name</Label>
        <Input name="name" placeholder="Full name" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-foreground">Organization</Label>
        <Input name="org" placeholder="Organization (optional)" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Member"}
      </Button>
    </form>
  );
}

export default AdminPanel;
