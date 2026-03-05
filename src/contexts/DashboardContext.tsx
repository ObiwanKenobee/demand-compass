import { createContext, useContext, useState, ReactNode } from "react";

export type TimePeriod = "30d" | "90d" | "12m";

interface DashboardContextType {
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  period: "12m",
  setPeriod: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [period, setPeriod] = useState<TimePeriod>("12m");
  return (
    <DashboardContext.Provider value={{ period, setPeriod }}>
      {children}
    </DashboardContext.Provider>
  );
};
