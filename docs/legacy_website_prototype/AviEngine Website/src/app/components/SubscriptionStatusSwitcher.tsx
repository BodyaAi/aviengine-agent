import { useState } from "react";
import { Megaphone, RefreshCw, User, FileText, Star } from "lucide-react";
import { SubscriptionSelectionWidget } from "./SubscriptionSelectionWidget";
import { useAppContext } from "../context/AppContext";

type SubState = "trial_start"|"trial_active"|"trial_ended"|"lite_active"|"pro_active"|"expired";

const STATUS_TO_STATE: Record<string, SubState> = {
  free: "trial_start", trial_limits: "trial_active", trial_ended: "trial_ended",
  lite: "lite_active", pro: "pro_active", expired: "expired",
};

const STATES: SubState[] = ["trial_start","trial_active","trial_ended","lite_active","pro_active","expired"];

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: "white", borderRadius: 2 }} />
    </div>
  );
}

export function SubscriptionStatusSwitcher() {
  const { subscriptionStatus } = useAppContext();
  const [localIndex, setLocalIndex] = useState<number | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const derivedState: SubState = STATUS_TO_STATE[subscriptionStatus] ?? "trial_start";
  const currentState: SubState = localIndex !== null ? STATES[localIndex] : derivedState;
  const handleCycle = () => { const i = STATES.indexOf(currentState); setLocalIndex((i+1) % STATES.length); };

  const limits = [
    { name: "5 публикаций", value: "0/5", progress: 0, icon: <Megaphone size={16} color="white" strokeWidth={1.8} /> },
    { name: "10 обновлений", value: "0/10", progress: 0, icon: <RefreshCw size={16} color="white" strokeWidth={1.8} /> },
    { name: "1 аккаунт", value: "0/1", progress: 0, icon: <User size={16} color="white" strokeWidth={1.8} /> },
    { name: "1 шаблон", value: "0/1", progress: 0, icon: <FileText size={16} color="white" strokeWidth={1.8} /> },
  ];

  return (
    <div data-subscription-zone="true" onClick={handleCycle} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%", cursor: "pointer", userSelect: "none" }}>

      {/* trial_start */}
      {currentState === "trial_start" && (
        <div onClick={e => e.stopPropagation()}>
          <button onClick={() => alert("Кнопка «Начать пробный период»")} className="avify-cta-btn avify-cta-pill" style={{ width: "100%", padding: "13px 20px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "white" }}>
            Начать пробный период
          </button>
        </div>
      )}

      {/* trial_active */}
      {currentState === "trial_active" && (
        <div onClick={e => e.stopPropagation()} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "12px 12px 14px", backdropFilter: "blur(8px)" }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "white", marginBottom: 12 }}>Пробный доступ по лимитам</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: "12px 12px" }}>
            {limits.map((item, idx) => (
              <div key={idx} style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, marginBottom: 6, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, overflow: "hidden" }}>
                    {item.icon}
                    <span style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", flexShrink: 0 }}>{item.value}</span>
                </div>
                <ProgressBar value={item.progress} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* trial_ended */}
      {currentState === "trial_ended" && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <button onClick={() => setIsWidgetOpen(true)} className="avify-cta-btn avify-cta-pill" style={{ width: "100%", padding: "13px 20px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "white" }}>
            Оформить подписку
          </button>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "center", display: "block" }}>Пробный период закончился</span>
        </div>
      )}

      {/* lite_active */}
      {currentState === "lite_active" && (
        <div className="avify-lite-badge">
          <svg width="12" height="10" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5 9L12.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Lite — активна до 12.05.26</span>
        </div>
      )}

      {/* pro_active */}
      {currentState === "pro_active" && (
        <div className="avify-pro-badge">
          <Star size={14} color="white" fill="white" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Pro — активна до 12.05.25</span>
        </div>
      )}

      {/* expired */}
      {currentState === "expired" && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <button onClick={() => setIsWidgetOpen(true)} className="avify-cta-btn avify-cta-pill" style={{ width: "100%", padding: "13px 20px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "white" }}>
            Продлить подписку
          </button>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "center", display: "block" }}>Подписка истекла</span>
        </div>
      )}

      <SubscriptionSelectionWidget isOpen={isWidgetOpen} onClose={() => setIsWidgetOpen(false)} />
    </div>
  );
}
