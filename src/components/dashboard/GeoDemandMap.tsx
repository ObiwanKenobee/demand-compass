import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";

const regions = [
  { name: "East Africa", leads: 14, demos: 8, pilots: 3, x: 58, y: 52 },
  { name: "European Climate Funds", leads: 22, demos: 15, pilots: 6, x: 50, y: 28 },
  { name: "North America", leads: 19, demos: 12, pilots: 4, x: 22, y: 32 },
  { name: "Southeast Asia", leads: 11, demos: 6, pilots: 2, x: 74, y: 50 },
  { name: "South America", leads: 8, demos: 4, pilots: 1, x: 28, y: 62 },
];

const GeoDemandMap = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Geographic Intelligence
        </span>
      </div>
      <h3 className="text-lg font-display text-secondary-foreground mb-6">
        Global Institutional Demand
      </h3>

      <div className="relative w-full aspect-[2/1] rounded-lg bg-muted/30 border border-border overflow-hidden">
        {/* Simplified world map grid */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-primary/30" style={{ top: `${(i + 1) * 11.1}%` }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-primary/30" style={{ left: `${(i + 1) * 7.7}%` }} />
          ))}
        </div>

        {regions.map((region, i) => (
          <motion.div
            key={region.name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
            className="absolute cursor-pointer group"
            style={{ left: `${region.x}%`, top: `${region.y}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHovered(region.name)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 w-8 h-8 -m-1 rounded-full bg-primary/20 animate-radar-pulse" />
            <div className="relative w-6 h-6 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-primary" />
            </div>

            {hovered === region.name && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-card border border-border p-3 shadow-lg"
              >
                <div className="text-sm font-display font-semibold text-foreground mb-2">{region.name}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Institutional Leads</span>
                    <span className="text-primary font-medium">{region.leads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demo Requests</span>
                    <span className="text-accent font-medium">{region.demos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pilot Projects</span>
                    <span className="text-success font-medium">{region.pilots}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GeoDemandMap;
