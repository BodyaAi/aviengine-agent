import { createContext, useContext, useState, type ReactNode } from "react";

export type AppTheme = "light" | "dark";
export type SubscriptionStatus =
  | "free"
  | "trial_limits"
  | "trial_ended"
  | "lite"
  | "pro"
  | "expired";

interface AppContextValue {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  subscriptionStatus: SubscriptionStatus;
  setSubscriptionStatus: (s: SubscriptionStatus) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>("light");
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("free");

  return (
    <AppContext.Provider value={{ theme, setTheme, subscriptionStatus, setSubscriptionStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
