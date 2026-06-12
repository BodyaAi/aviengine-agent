import { useState } from "react";
import { AppProvider, useAppContext, type SubscriptionStatus } from "./context/AppContext";
import { MainTab } from "./components/MainTab";
import { WorkTab } from "./components/WorkTab";
import { SubscriptionSelectionWidget } from "./components/SubscriptionSelectionWidget";
import avifyLogo from "figma:asset/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

export type LiveTask = {
  id: number; brand: string; task: string; pct: number; count: number; done: number;
  queued?: boolean; errorMessage?: string; templateId?: number;
};

type Tab = "main" | "tasks";

const SUB_LABELS: Record<SubscriptionStatus, string> = {
  free: "Free", trial_limits: "Trial (лимиты)", trial_ended: "Trial закончился",
  lite: "Lite", pro: "Pro", expired: "Истекла",
};
const SUB_ORDER: SubscriptionStatus[] = ["free","trial_limits","trial_ended","lite","pro","expired"];

function AppInner() {
  const { subscriptionStatus, setSubscriptionStatus } = useAppContext();
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

  const addTask = (t: Omit<LiveTask, "id">) => setLiveTasks(p => [{ ...t, id: Date.now() }, ...p]);
  const removeTask = (id: number) => setLiveTasks(p => p.filter(t => t.id !== id));
  const cycleSubscription = () => { const i = SUB_ORDER.indexOf(subscriptionStatus); setSubscriptionStatus(SUB_ORDER[(i+1) % SUB_ORDER.length]); };

  const SIDEBAR_W = 252;

  return (
    <div style={{ display: "flex", height: "100dvh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Page background */}
      <div style={{ position: "fixed", inset: 0, zIndex: -2, background: "linear-gradient(145deg, #1040f5 0%, #1850ff 28%, #2060ff 55%, #0a35e0 100%)" }} />
      <div style={{ position: "fixed", right: -120, top: -80, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,160,255,0.45) 0%, transparent 65%)", filter: "blur(60px)", zIndex: -1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", left: SIDEBAR_W - 40, bottom: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,100,255,0.35) 0%, transparent 65%)", filter: "blur(70px)", zIndex: -1, pointerEvents: "none" }} />

      {/* Sidebar */}
      <aside style={{ width: SIDEBAR_W, flexShrink: 0, position: "fixed", left: 0, top: 0, height: "100dvh", background: "rgba(6,20,100,0.42)", backdropFilter: "blur(64px) saturate(200%) brightness(1.1)", WebkitBackdropFilter: "blur(64px) saturate(200%) brightness(1.1)", borderRight: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06), 4px 0 32px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: "26px 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 4px 18px rgba(0,0,0,0.3)", overflow: "hidden" }}>
              <img src={avifyLogo} alt="Avify" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Avify</div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 2 }}>AI-автопилот для Авито</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", padding: "2px 10px 10px" }}>Меню</div>
          {([
            { id: "main" as Tab, label: "Главная", icon: <svg width="17" height="17" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3L19 9.5V19C19 19.55 18.55 20 18 20H14V14H8V20H4C3.45 20 3 19.55 3 19V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg> },
            { id: "tasks" as Tab, label: "Публикация", icon: <svg width="17" height="17" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M7 8H15M7 11H15M7 14H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg> },
          ]).map(({ id, label, icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 14, border: active ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent", cursor: "pointer", background: active ? "rgba(255,255,255,0.14)" : "transparent", backdropFilter: active ? "blur(20px)" : "none", WebkitBackdropFilter: active ? "blur(20px)" : "none", boxShadow: active ? "inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -0.5px 0 rgba(0,0,100,0.1), 0 4px 16px rgba(0,0,0,0.08)" : "none", marginBottom: 4, transition: "all 0.2s", textAlign: "left", color: active ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.42)" }}>
                {icon}
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>
                {active && <div style={{ marginLeft: "auto", width: 3, height: 16, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />}
              </button>
            );
          })}
        </nav>

        {/* DevTools */}
        <div style={{ padding: "12px 10px 22px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 13, padding: "9px 11px 11px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 7 }}>Dev Tools</div>
            <button onClick={cycleSubscription} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 9px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.06)", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500 }}>
              <span><span style={{ color: "rgba(255,255,255,0.28)", marginRight: 4 }}>Статус:</span>{SUB_LABELS[subscriptionStatus]}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 2L9 4.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 7.5L6 10L9 7.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main onClickCapture={handleContentClick} style={{ marginLeft: SIDEBAR_W, flex: 1, overflowY: "auto", height: "100dvh", minWidth: 0 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {activeTab === "main"
            ? <MainTab liveTasks={liveTasks} onSwitchTab={() => setActiveTab("tasks")} onRemoveTask={removeTask} onClearTasks={() => setLiveTasks([])} />
            : <WorkTab addTask={addTask} liveTasks={liveTasks} />}
        </div>
      </main>

      <SubscriptionSelectionWidget isOpen={accessModalOpen} onClose={() => setAccessModalOpen(false)} />

      {freeToastVisible && (
        <div style={{ position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 9998, backgroundColor: "rgba(10,30,120,0.92)", backdropFilter: "blur(12px)", color: "white", borderRadius: 14, padding: "12px 22px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 4px 24px rgba(0,0,0,0.25)", pointerEvents: "none", border: "1px solid rgba(255,255,255,0.12)", animation: "avify-fadein 0.2s ease" }}>
          Начните пробный период
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
