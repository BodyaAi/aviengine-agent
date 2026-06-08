import { useState } from "react";
import {
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  Tabbar,
  TabbarItem,
} from "@vkontakte/vkui";
import { Icon28HomeOutline, Icon28DocumentOutline } from "@vkontakte/icons";
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

              <Tabbar>
                <TabbarItem
                  selected={activeTab === "main"}
                  onClick={() => setActiveTab("main")}
                  text="Главная"
                >
                  <Icon28HomeOutline />
                </TabbarItem>
                <TabbarItem
                  selected={activeTab === "tasks"}
                  onClick={() => setActiveTab("tasks")}
                  text="Публикация"
                >
                  <Icon28DocumentOutline />
                </TabbarItem>
              </Tabbar>
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