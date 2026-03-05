import NorthStarPanel from "@/components/dashboard/NorthStarPanel";
import DemandEnginePanel from "@/components/dashboard/DemandEnginePanel";
import EngagementLadder from "@/components/dashboard/EngagementLadder";
import NarrativeReach from "@/components/dashboard/NarrativeReach";
import GeoDemandMap from "@/components/dashboard/GeoDemandMap";
import ConversionFunnel from "@/components/dashboard/ConversionFunnel";
import CommunityGrowth from "@/components/dashboard/CommunityGrowth";
import StrategicSignalsFeed from "@/components/dashboard/StrategicSignalsFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Atlas Sanctum
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Institutional Demand Radar — Is the idea spreading among the institutions that matter?
          </p>
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
  );
};

export default Index;
