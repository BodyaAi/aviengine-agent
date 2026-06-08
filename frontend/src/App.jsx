import { useState } from "react";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import { AppProvider, useAppContext, SubscriptionStatus } from "./context/AppContext";
import { MainTab } from "./components/MainTab";
import { WorkTab } from "./components/WorkTab";
import { SubscriptionSelectionWidget } from "./components/SubscriptionSelectionWidget";

function AppInner() {
  const { theme, subscriptionStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState("main");
  const [liveTasks, setLiveTasks] = useState([]);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [freeToastVisible, setFreeToastVisible] = useState(false);

  const isLocked =
    subscriptionStatus === SubscriptionStatus.FREE ||
    subscriptionStatus === SubscriptionStatus.TRIAL_ENDED ||
    subscriptionStatus === SubscriptionStatus.EXPIRED;

  const handleContentClick = (e) => {
    if (!isLocked) return;
    let el = e.target;
    while (el) {
      if (el.getAttribute("data-subscription-zone") === "true") return;
      el = el.parentElement;
    }
    e.stopPropagation();
    if (subscriptionStatus === SubscriptionStatus.FREE) {
      setFreeToastVisible(true);
      setTimeout(() => setFreeToastVisible(false), 2500);
    } else {
      setAccessModalOpen(true);
    }
  };

  const addTask = (task) => {
    setLiveTasks((prev) => [{ ...task, id: Date.now() }, ...prev]);
  };

  const removeTask = (id) => {
    setLiveTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllTasks = () => setLiveTasks([]);

  return (
    <ConfigProvider appearance={theme}>
      <AdaptivityProvider>
        <AppRoot mode="full" style={{ background: "transparent" }}>
          <div
            style={{
              position: "relative",
              minHeight: "100dvh",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              background: "var(--vkui--color_background)",
            }}
          >
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "var(--vkui--color_background)",
                opacity: 0.55,
                zIndex: 0,
              }}
            />
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
                {[
                  {
                    id: "main",
                    label: "Главная",
                    icon: (active) => (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path
                          d="M3 9.5L11 3L19 9.5V19C19 19.55 18.55 20 18 20H14V14H8V20H4C3.45 20 3 19.55 3 19V9.5Z"
                          fill={active ? "var(--vkui--color_accent_blue)" : "none"}
                          stroke={active ? "var(--vkui--color_accent_blue)" : "var(--vkui--color_icon_secondary)"}
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                  {
                    id: "tasks",
                    label: "Публикация",
                    icon: (active) => (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <rect
                          x="3"
                          y="3"
                          width="16"
                          height="16"
                          rx="3"
                          stroke={active ? "var(--vkui--color_accent_blue)" : "var(--vkui--color_icon_secondary)"}
                          strokeWidth="1.8"
                          fill={active ? "var(--vkui--color_background_accent_themed)" : "none"}
                        />
                        <path
                          d="M7 8H15M7 11H15M7 14H11"
                          stroke={active ? "var(--vkui--color_accent_blue)" : "var(--vkui--color_icon_secondary)"}
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    ),
                  },
                ].map((tab) => (
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
                        color:
                          activeTab === tab.id ? "var(--vkui--color_accent_blue)" : "var(--vkui--color_text_secondary)",
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

        <SubscriptionSelectionWidget
          isOpen={accessModalOpen}
          onClose={() => setAccessModalOpen(false)}
          appearance={theme}
        />

        {freeToastVisible && (
          <div
            style={{
              position: "fixed",
              bottom: 90,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9998,
              backgroundColor: "var(--vkui--color_background_contrast, #1C1C1E)",
              color: "var(--vkui--color_text_contrast, white)",
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
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}