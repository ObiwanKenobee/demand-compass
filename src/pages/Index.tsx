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
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useRealtimeSubscriptions } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const DashboardContent = () => {
  useRealtimeSubscriptions();
  return null;
};

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <DashboardProvider>
      <DashboardContent />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                Atlas Sanctum
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Institutional Demand Radar — Is the idea spreading among the institutions that matter?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AdminPanel />
              <TimePeriodFilter />
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="w-4 h-4" />
              </Button>
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
