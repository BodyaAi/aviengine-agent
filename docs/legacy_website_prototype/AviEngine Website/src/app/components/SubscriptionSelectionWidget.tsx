import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Plus, Star, Zap, Copy } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** DEV: called when user selects a plan (applies it to global state) */
  onSelectPlan?: (plan: "lite" | "pro") => void;
}

export function SubscriptionSelectionWidget({ isOpen, onClose, onSelectPlan }: Props) {
  const [proPeriod, setProPeriod] = useState<"1"|"3">("3");
  if (!isOpen) return null;

  const liteFeatures = [
    "До 10 активных аккаунтов",
    "AI-Контент: Уникальные заголовки и описания",
    "Smart-Уникализация: Тасовка городов, уникализация фото",
    "Анти-Бан: Мониторинг лимитов и безопасные интервалы",
    "Облачный запуск: Настроил шаблон — и пошел пить кофе",
    "Автообновление объявлений: AI автоматически обновляет объявления, выбирая оптимальный момент для повышения эффективности.",
  ];

  const proExclusiveFeatures = [
    { icon: <Star size={14} color="#FBBF24" fill="#FBBF24" />, text: "До 20 активных аккаунтов" },
    { icon: <Zap size={14} color="rgba(255,255,255,0.9)" />, text: "Кнопка «РЕШИТЬ ЧЕРЕЗ AI»: Решение ошибок AI агентом" },
    { icon: <Copy size={14} color="rgba(255,255,255,0.9)" />, text: "Smart-Миграция: ИИ сам копирует лучшие объявления по аккаунтам" },
  ];

  return createPortal(
    <div
      data-subscription-zone="true"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 860, maxHeight: "95vh", backgroundColor: "#fff", borderRadius: 32, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
      >
        {/* Close */}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 20 }}>
          <button onClick={onClose} aria-label="Закрыть" style={{ width: 40, height: 40, borderRadius: 20, border: "1px solid rgba(18,68,245,0.12)", background: "rgba(18,68,245,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} color="#6b7890" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "52px 20px 28px", scrollbarWidth: "none" as "none" }}>
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#1244F5", letterSpacing: "-0.5px" }}>Avify</div>
            <div style={{ height: 6 }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a2060", lineHeight: 1.3 }}>Хватит нянчиться с выкладчиками.<br /><span style={{ color: "#1244F5" }}>Переходи на AI-автопилот.</span></div>
            <div style={{ height: 10 }} />
            <div style={{ fontSize: 14, color: "#6b7890" }}>Для тех, кто хочет освободить время</div>
            <div style={{ height: 16 }} />
            <div style={{ display: "inline-flex", alignItems: "center", padding: "8px 18px", borderRadius: 20, backgroundColor: "#FFFBEB", border: "1px solid #FEF3C7" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#D97706" }}>10 мест раннего доступа. Далее цена выше.</span>
            </div>
          </div>

          <div style={{ height: 24 }} />

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "stretch" }}>

            {/* LITE Card */}
            <div style={{ borderRadius: 28, padding: 24, background: "linear-gradient(135deg,#c026d3 0%,#38bdf8 100%)", display: "flex", flexDirection: "column", color: "white", boxShadow: "0 8px 24px rgba(192,38,211,0.28)" }}>
              <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 12px", borderRadius: 999, marginBottom: 16, backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "white" }}>Подписка LITE</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>19 999</span>
                  <span style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>₽</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", display: "block", marginTop: 4 }}>ежемесячный платеж</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {liteFeatures.map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={11} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 13, color: "white", lineHeight: "1.45" }}>{feat}</span>
                  </div>
                ))}
              </div>
              <button
                className="avify-cta-btn"
                onClick={() => { onSelectPlan?.("lite"); onClose(); }}
                style={{ width: "100%", padding: "14px", border: "none", borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}
              >
                Выбрать Lite
              </button>
            </div>

            {/* PRO Card */}
            <div style={{ borderRadius: 28, padding: 24, position: "relative", background: "linear-gradient(145deg,#0a192f 0%,#112240 20%,#1e3a8a 40%,#3b82f6 50%,#1e3a8a 60%,#112240 80%,#0a192f 100%)", display: "flex", flexDirection: "column", color: "white", border: "1px solid rgba(255,255,255,0.1)", isolation: "isolate" as "isolate", boxShadow: "0 8px 32px rgba(30,58,138,0.38)" }}>
              <div style={{ position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none", background: "linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 40%,rgba(255,255,255,0.07) 100%)", borderRadius: 28 }} />
              <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 12px", borderRadius: 999, marginBottom: 16, backgroundColor: "rgba(59,130,246,0.3)", border: "1px solid rgba(147,197,253,0.3)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "white" }}>Подписка PRO</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", background: "linear-gradient(to bottom,#ffffff,#bbdefb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {proPeriod === "3" ? "89 999" : "34 999"}
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>₽</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{proPeriod === "3" ? "29 999 ₽ в месяц" : "Оплата помесячно"}</span>
                  {proPeriod === "3" && <span style={{ backgroundColor: "#F59E0B", color: "#78350F", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em", textTransform: "uppercase" as "uppercase" }}>Выгоднее</span>}
                </div>
              </div>

              {/* Period toggle */}
              <div style={{ marginBottom: 20, display: "flex", background: "rgba(0,0,0,0.28)", borderRadius: 12, padding: 3, gap: 3 }}>
                {(["1","3"] as const).map(p => (
                  <button key={p} onClick={() => setProPeriod(p)} style={{ flex: 1, padding: "8px 12px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", background: proPeriod === p ? "rgba(255,255,255,0.15)" : "transparent", color: proPeriod === p ? "white" : "rgba(255,255,255,0.45)", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                    {p === "1" ? "1 МЕСЯЦ" : "3 МЕСЯЦА"}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {proExclusiveFeatures.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: "1.45" }}>{item.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: 0.7 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><Plus size={11} color="white" /></div>
                  <span style={{ fontSize: 13, color: "white", lineHeight: "1.45", fontStyle: "italic" }}>Все функции тарифа LITE включены</span>
                </div>
              </div>

              <button
                className="avify-cta-btn"
                onClick={() => { onSelectPlan?.("pro"); onClose(); }}
                style={{ width: "100%", padding: "14px", border: "none", borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}
              >
                Активировать Pro
              </button>
            </div>
          </div>

          <div style={{ height: 20 }} />
          <div style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#99A2AD", opacity: 0.55 }}>
            Avify • Премиальный AI-Инструмент для бизнеса
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
