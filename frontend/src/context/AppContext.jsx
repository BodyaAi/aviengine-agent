import { createContext, useContext, useState, useEffect } from "react";
import bridge from '@vkontakte/vk-bridge';

export const AppTheme = {
  LIGHT: "light",
  DARK: "dark",
};

export const SubscriptionStatus = {
  FREE: "free",
  TRIAL_LIMITS: "trial_limits",
  TRIAL_ENDED: "trial_ended",
  LITE: "lite",
  PRO: "pro",
  EXPIRED: "expired",
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(AppTheme.LIGHT);
  const [subscriptionStatus, setSubscriptionStatus] = useState(SubscriptionStatus.PRO);

  useEffect(() => {
    bridge.send('VKWebAppInit');

    const handleUpdateConfig = (event) => {
      if (event.detail.type === 'VKWebAppUpdateConfig') {
        const { appearance } = event.detail.data;
        setTheme(appearance === 'dark' ? AppTheme.DARK : AppTheme.LIGHT);
      }
    };

    bridge.subscribe(handleUpdateConfig);
    return () => {
      bridge.unsubscribe(handleUpdateConfig);
    };
  }, []);

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

