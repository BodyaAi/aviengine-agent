import { useState } from "react";
import { ConfigProvider, AdaptivityProvider, AppRoot } from "@vkontakte/vkui";
import {
  Icon20SunOutline,
  Icon20MoonOutline,
  Icon20ChevronRight,
} from "@vkontakte/icons";
import "@vkontakte/vkui/dist/vkui.css";
import { AppProvider, useAppContext, type SubscriptionStatus } from "./context/AppContext";
import { MainTab } from "./components/MainTab";
import { WorkTab } from "./components/WorkTab";
import { SubscriptionSelectionWidget } from "./components/SubscriptionSelectionWidget";

export type LiveTask = {
  id: number;
  brand: string;
  task: string;
  pct: number;
  count: number;
  done: number;
  queued?: boolean;
  errorMessage?: string;
  templateId?: number;
};

type Tab = "main" | "tasks";

// ── Sub-labels for cycle button ──────────────────────────
const SUB_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  free: "Free",
  trial_limits: "Trial (лимиты)",
  trial_ended: "Trial закончился",
  lite: "Lite",
  pro: "Pro",
  expired: "Истекла",
};

const SUB_STATUS_ORDER: SubscriptionStatus[] = [
  "free",
  "trial_limits",
  "trial_ended",
  "lite",
  "pro",
  "expired",
];

// ── DevTools floating widget ─────────────────────────────
// Note: DevToolsPanel does NOT use an inner ConfigProvider — nesting
// ConfigProviders in VKUI causes wrapper-div issues that break position:fixed.
// Light-theme styles are simply hardcoded directly in the panel.
function DevToolsPanel() {
  const { theme, setTheme, subscriptionStatus, setSubscriptionStatus } = useAppContext();
  const [open, setOpen] = useState(true);

  const cycleSubscription = () => {
    const idx = SUB_STATUS_ORDER.indexOf(subscriptionStatus);
    setSubscriptionStatus(SUB_STATUS_ORDER[(idx + 1) % SUB_STATUS_ORDER.length]);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        right: 8,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      {open && (
        <div
          style={{
            background: "var(--vkui--color_background_content)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid var(--vkui--color_separator_primary)",
            borderRadius: 18,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 7,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
            minWidth: 188,
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--vkui--color_text_secondary)",
              paddingBottom: 4,
              borderBottom: "1px solid var(--vkui--color_separator_primary)",
              marginBottom: 1,
            }}
          >
            Figma Dev Tools
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 10px",
              borderRadius: 10,
              border: "1px solid var(--vkui--color_separator_primary)",
              background: "var(--vkui--color_background_secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--vkui--color_text_primary)",
              transition: "background 0.15s",
            }}
          >
            {theme === "dark"
              ? <Icon20SunOutline style={{ flexShrink: 0, color: "#F59E0B" }} />
              : <Icon20MoonOutline style={{ flexShrink: 0, color: "#6366F1" }} />
            }
            {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          </button>

          {/* Subscription cycle */}
          <button
            onClick={cycleSubscription}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "7px 10px",
              borderRadius: 10,
              border: "1px solid var(--vkui--color_separator_primary)",
              background: "var(--vkui--color_background_secondary)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--vkui--color_text_primary)",
              transition: "background 0.15s",
              textAlign: "left",
            }}
          >
            <span>
              <span style={{ color: "var(--vkui--color_text_secondary)", marginRight: 2 }}>Статус:</span>
              {SUB_STATUS_LABELS[subscriptionStatus]}
            </span>
            <Icon20ChevronRight style={{ flexShrink: 0, color: "var(--vkui--color_icon_secondary)" }} />
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#0077FF",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,119,255,0.36)",
          flexShrink: 0,
          transition: "transform 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="4" r="1.5" fill="white" />
          <circle cx="7" cy="7" r="1.5" fill="white" />
          <circle cx="7" cy="10" r="1.5" fill="white" />
        </svg>
      </button>
    </div>
  );
}

// ── Inner App (has access to context) ────────────────────
function AppInner() {
  const { theme, subscriptionStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("main");
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>([]);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [freeToastVisible, setFreeToastVisible] = useState(false);

  const isLocked =
    subscriptionStatus === "free" ||
    subscriptionStatus === "trial_ended" ||
    subscriptionStatus === "expired";

  const handleContentClick = (e: React.MouseEvent) => {
    if (!isLocked) return;
    let el = e.target as HTMLElement | null;
    while (el) {
      if (el.getAttribute("data-subscription-zone") === "true") return;
      el = el.parentElement;
    }
    e.stopPropagation();
    if (subscriptionStatus === "free") {
      setFreeToastVisible(true);
      setTimeout(() => setFreeToastVisible(false), 2500);
    } else {
      setAccessModalOpen(true);
    }
  };

  const addTask = (task: Omit<LiveTask, "id">) => {
    setLiveTasks((prev) => [{ ...task, id: Date.now() }, ...prev]);
  };

  const removeTask = (id: number) => {
    setLiveTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllTasks = () => setLiveTasks([]);

  return (
    <ConfigProvider appearance={theme}>
      <AdaptivityProvider>
        <AppRoot mode="full" style={{ background: "transparent" }}>
          {/* ── Full-screen background ── */}
          <div
            style={{
              position: "relative",
              minHeight: "100dvh",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              background: theme === "dark"
                ? "linear-gradient(135deg, #0d1117 0%, #161b27 50%, #0a0f1a 100%)"
                : "linear-gradient(135deg, #e8edf5 0%, #f0f4fb 50%, #e4eaf4 100%)",
            }}
          >
            {/* Background overlay for readability depending on theme */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: theme === "dark" ? "rgba(28,28,30,0.55)" : "rgba(245,245,250,0.55)",
                zIndex: 0,
              }}
            />
            {/* ── Phone-width container ── */}
            <div
              onClickCapture={handleContentClick}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: 430,
                minHeight: "100dvh",
                background: "transparent",
              }}
            >
              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: "auto", paddingBottom: 72 }}>
                {activeTab === "main" ? (
                  <MainTab
                    liveTasks={liveTasks}
                    onSwitchTab={() => setActiveTab("tasks")}
                    onRemoveTask={removeTask}
                    onClearTasks={clearAllTasks}
                  />
                ) : (
                  <WorkTab addTask={addTask} liveTasks={liveTasks} />
                )}
              </div>

              {/* ── Bottom Tab Bar ── */}
              <div
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  maxWidth: 430,
                  display: "flex",
                  alignItems: "stretch",
                  background: "var(--vkui--color_background)",
                  borderTop: "1px solid var(--vkui--color_separator_primary)",
                  paddingBottom: "env(safe-area-inset-bottom, 8px)",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
                  zIndex: 40,
                }}
              >
                {(
                  [
                    {
                      id: "main" as Tab,
                      label: "Главная",
                      icon: (active: boolean) => (
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                          <path
                            d="M3 9.5L11 3L19 9.5V19C19 19.55 18.55 20 18 20H14V14H8V20H4C3.45 20 3 19.55 3 19V9.5Z"
                            fill={active ? "#0077FF" : "none"}
                            stroke={active ? "#0077FF" : "var(--vkui--color_icon_secondary)"}
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      id: "tasks" as Tab,
                      label: "Публикация",
                      icon: (active: boolean) => (
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                          <rect
                            x="3" y="3" width="16" height="16" rx="3"
                            stroke={active ? "#0077FF" : "var(--vkui--color_icon_secondary)"}
                            strokeWidth="1.8"
                            fill={active ? "#EEF4FF" : "none"}
                          />
                          <path
                            d="M7 8H15M7 11H15M7 14H11"
                            stroke={active ? "#0077FF" : "var(--vkui--color_icon_secondary)"}
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      paddingTop: 10,
                      paddingBottom: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {tab.icon(activeTab === tab.id)}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: activeTab === tab.id
                          ? "#0077FF"
                          : "var(--vkui--color_text_secondary)",
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AppRoot>

        {/* ── Access guard: subscription modal ── */}
        <SubscriptionSelectionWidget
          isOpen={accessModalOpen}
          onClose={() => setAccessModalOpen(false)}
        />

        {/* ── Access guard: free-state toast ── */}
        {freeToastVisible && (
          <div
            style={{
              position: "fixed",
              bottom: 90,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9998,
              backgroundColor: "#1C1C1E",
              color: "white",
              borderRadius: 14,
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              pointerEvents: "none",
              animation: "avify-fadein 0.2s ease",
            }}
          >
            Начните пробный период
          </div>
        )}

        {/* ── DevTools (outside phone container, always on top) ── */}
        <DevToolsPanel />
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

// ── Root export ───────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}