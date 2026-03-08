import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Trash2, UserPlus } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

interface UserWithRole {
  user_id: string;
  email: string;
  display_name: string | null;
  role: string;
  role_id: string;
}

const AdminManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("user");
  const [adding, setAdding] = useState(false);

  const { data: usersWithRoles = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get all roles (admin can see all via RLS policy)
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role");
      if (rolesError) throw rolesError;

      // Get profiles for those users
      const userIds = [...new Set(roles?.map((r) => r.user_id) || [])];
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return (roles || []).map((r) => ({
        user_id: r.user_id,
        email: profileMap.get(r.user_id)?.display_name || r.user_id.slice(0, 8),
        display_name: profileMap.get(r.user_id)?.display_name || null,
        role: r.role,
        role_id: r.id,
      })) as UserWithRole[];
    },
    enabled: isAdmin,
  });

  const handleAddRole = async () => {
    if (!newEmail.trim()) return;
    setAdding(true);
    try {
      // Look up user by checking profiles - we need a way to find users
      // Since we can't query auth.users, we'll use an edge function approach
      // For now, allow adding by user_id directly or create a simpler flow
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name")
        .ilike("display_name", newEmail.trim())
        .maybeSingle();

      if (!profile) {
        toast({ title: "User not found", description: "No user with that display name was found.", variant: "destructive" });
        setAdding(false);
        return;
      }

      const { error } = await supabase.from("user_roles" as any).insert({
        user_id: profile.id,
        role: newRole,
      } as any);
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already assigned", description: "This user already has this role.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Role assigned", description: `${newRole} role assigned to ${profile.display_name}.` });
        setNewEmail("");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
      toast({ title: "Role removed" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (authLoading || roleLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Admin Management
          </h1>

          {/* Add role form */}
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Assign Role
            </h2>
            <div className="flex gap-3">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="User display name"
                className="flex-1"
              />
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddRole} disabled={adding}>
                {adding ? "..." : "Assign"}
              </Button>
            </div>
          </div>

          {/* Users list */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-foreground mb-4">Current Role Assignments</h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : usersWithRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No role assignments found.</p>
            ) : (
              <div className="space-y-3">
                {usersWithRoles.map((ur) => (
                  <div key={ur.role_id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{ur.display_name || ur.user_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ur.role}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRole(ur.role_id)}
                      disabled={ur.user_id === user?.id && ur.role === "admin"}
                      title={ur.user_id === user?.id ? "Can't remove your own admin role" : "Remove role"}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminManagement;
