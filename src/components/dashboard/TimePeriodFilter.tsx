import { useDashboard, TimePeriod } from "@/contexts/DashboardContext";
import { motion } from "framer-motion";

const periods: { value: TimePeriod; label: string }[] = [
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "12m", label: "12 Months" },
];

const TimePeriodFilter = () => {
  const { period, setPeriod } = useDashboard();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => setPeriod(p.value)}
          className="relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
        >
          {period === p.value && (
            <motion.div
              layoutId="period-indicator"
              className="absolute inset-0 rounded-md bg-card border border-border"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span
            className={`relative z-10 ${
              period === p.value ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {p.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TimePeriodFilter;
