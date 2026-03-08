import NorthStarPanel from "@/components/dashboard/NorthStarPanel";
import DemandEnginePanel from "@/components/dashboard/DemandEnginePanel";
import EngagementLadder from "@/components/dashboard/EngagementLadder";
import NarrativeReach from "@/components/dashboard/NarrativeReach";
import GeoDemandMap from "@/components/dashboard/GeoDemandMap";
import ConversionFunnel from "@/components/dashboard/ConversionFunnel";
import CommunityGrowth from "@/components/dashboard/CommunityGrowth";
import StrategicSignalsFeed from "@/components/dashboard/StrategicSignalsFeed";
import TimePeriodFilter from "@/components/dashboard/TimePeriodFilter";
import AdminPanel from "@/components/dashboard/AdminPanel";
import ExportButton from "@/components/dashboard/ExportButton";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useRealtimeSubscriptions } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardContent = () => {
  useRealtimeSubscriptions();
  return null;
};

const Index = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  return (
    <DashboardProvider>
      <DashboardContent />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                Atlas Sanctum
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Institutional Demand Radar
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ExportButton />
              {isAdmin && <AdminPanel />}
              <TimePeriodFilter />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Account">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-3 h-3 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* North Star */}
          <div className="mb-6">
            <NorthStarPanel />
          </div>

          {/* Demand + Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DemandEnginePanel />
            <EngagementLadder />
          </div>

          {/* Narrative + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <NarrativeReach />
            <GeoDemandMap />
          </div>

          {/* Funnel + Community */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ConversionFunnel />
            <CommunityGrowth />
          </div>

          {/* Strategic Signals */}
          <StrategicSignalsFeed />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Measuring the formation of belief in a new economic architecture
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Index;
