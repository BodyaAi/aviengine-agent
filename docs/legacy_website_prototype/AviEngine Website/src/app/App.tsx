import { useState } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { MainTab } from "./components/MainTab";
import { WorkTab } from "./components/WorkTab";
import { HeroBlock } from "./components/HeroBlock";
import { SubscriptionSelectionWidget } from "./components/SubscriptionSelectionWidget";

export type LiveTask = {
  id: number; brand: string; task: string; pct: number; count: number; done: number;
  queued?: boolean; errorMessage?: string; templateId?: number;
};

type Tab = "main" | "tasks";

function AppInner() {
  const { subscriptionStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("main");
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>([]);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [freeToastVisible, setFreeToastVisible] = useState(false);

  const isLocked = subscriptionStatus === "free" || subscriptionStatus === "trial_ended" || subscriptionStatus === "expired";

  const handleContentClick = (e: React.MouseEvent) => {
    if (!isLocked) return;
    let el = e.target as HTMLElement | null;
    while (el) { if (el.getAttribute("data-subscription-zone") === "true") return; el = el.parentElement; }
    e.stopPropagation();
    if (subscriptionStatus === "free") { setFreeToastVisible(true); setTimeout(() => setFreeToastVisible(false), 2500); }
    else setAccessModalOpen(true);
  };

  const addTask = (t: Omit<LiveTask,"id">) => setLiveTasks(p => [{ ...t, id: Date.now() }, ...p]);
  const removeTask = (id: number) => setLiveTasks(p => p.filter(t => t.id !== id));

  const activeTasks = liveTasks.length;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif", overflow: "hidden" }}>

      {/* ── Background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: -3, background: "linear-gradient(145deg, #0e38e8 0%, #1650ff 25%, #1e60ff 55%, #0830d8 100%)" }} />
      <div className="avify-dot-grid" style={{ position: "fixed", inset: 0, zIndex: -2, pointerEvents: "none" }} />
      <div style={{ position: "fixed", right: -100, top: -80, width: 750, height: 750, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,180,255,0.5) 0%, transparent 65%)", filter: "blur(50px)", zIndex: -1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", left: "25%", bottom: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,100,255,0.3) 0%, transparent 65%)", filter: "blur(70px)", zIndex: -1, pointerEvents: "none" }} />

      {/* ════ HERO BLOCK — always visible ════ */}
      <div style={{ flexShrink: 0 }}>
        <HeroBlock />
      </div>

      {/* ════ WIDGET TABS — compact pills ════ */}
      <div style={{ flexShrink: 0, padding: "12px 28px 0", display: "flex", gap: 10, justifyContent: "center" }}>
        {([
          {
            id: "main" as Tab,
            label: "Менеджер задач",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.9" />
                <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            id: "tasks" as Tab,
            label: "Публикация",
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.9" />
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            ),
          },
        ] as const).map(({ id, label, icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px",
                borderRadius: 999,
                cursor: "pointer",
                border: active ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.18)",
                background: active ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.08)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                boxShadow: active
                  ? "inset 0 1.5px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,100,0.1), 0 6px 24px rgba(0,0,0,0.12)"
                  : "inset 0 1px 0 rgba(255,255,255,0.18)",
                transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: active ? "translateY(-1px)" : "translateY(0)",
                color: active ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              {icon}
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>
                {label}
              </span>
              {active && (
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "white", boxShadow: "0 0 8px rgba(255,255,255,0.9)", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ════ TAB CONTENT ════ */}
      <main onClickCapture={handleContentClick} style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {activeTab === "main"
            ? <MainTab liveTasks={liveTasks} onSwitchTab={() => setActiveTab("tasks")} onRemoveTask={removeTask} onClearTasks={() => setLiveTasks([])} />
            : <WorkTab addTask={addTask} liveTasks={liveTasks} />
          }
        </div>
      </main>

      <SubscriptionSelectionWidget isOpen={accessModalOpen} onClose={() => setAccessModalOpen(false)} />

      {freeToastVisible && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: "rgba(6,18,90,0.9)", backdropFilter: "blur(24px)", color: "white", borderRadius: 14, padding: "12px 24px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", pointerEvents: "none", border: "1px solid rgba(255,255,255,0.14)", animation: "avify-fadein 0.2s ease" }}>
          Начните пробный период
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
