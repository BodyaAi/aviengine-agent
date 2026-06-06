import { useState, useEffect } from "react";

const sheetAccounts = [
  { id: 1, name: "Applexis", subtitle: "Apple Store", icon: "🍎", status: "active" },
  { id: 2, name: "MotoDrive", subtitle: "Автозапчасти", icon: "🚗", status: "active" },
  { id: 3, name: "HomeCraft", subtitle: "Мебель и интерьер", icon: "🏡", status: "paused" },
];

interface PromoteSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (accountIds: number[]) => void;
  title?: string;
}

export function PromoteSheet({ open, onClose, onConfirm, title = "Продвижение объявлений" }: PromoteSheetProps) {
  const [selected, setSelected] = useState<number[]>([1, 2, 3]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  if (!open && !visible) return null;

  const toggle = (id: number) => {
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const statusColor: Record<string, string> = { active: "#22c55e", paused: "#f59e0b" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        maxWidth: 430,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "24px 24px 0 0",
          padding: "0 0 24px",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#e0e0e8" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "0 20px 16px", borderBottom: "1px solid #f5f5fa" }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>{title}</p>
          <p style={{ fontSize: 12, color: "#8c8c9e", marginTop: 2 }}>
            Выберите аккаунты для продвижения
          </p>
        </div>

        {/* Account list */}
        <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {sheetAccounts.map((acc) => {
            const isSel = selected.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggle(acc.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: `1.5px solid ${isSel ? "#0077FF" : "#f0f0f5"}`,
                  backgroundColor: isSel ? "#EEF4FF" : "white",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 20, height: 20,
                  borderRadius: 6,
                  border: `2px solid ${isSel ? "#0077FF" : "#d0d0d8"}`,
                  backgroundColor: isSel ? "#0077FF" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.18s",
                }}>
                  {isSel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 20 }}>{acc.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{acc.name}</p>
                  <p style={{ fontSize: 11, color: "#8c8c9e" }}>{acc.subtitle}</p>
                </div>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor[acc.status], flexShrink: 0 }} />
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ padding: "0 20px" }}>
          <button
            onClick={() => { onConfirm(selected); onClose(); }}
            disabled={selected.length === 0}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 16,
              background: selected.length === 0 ? "#f0f0f5" : "linear-gradient(135deg, #0077FF, #00AAFF)",
              color: selected.length === 0 ? "#c0c0cc" : "white",
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              cursor: selected.length === 0 ? "default" : "pointer",
              boxShadow: selected.length === 0 ? "none" : "0 6px 20px rgba(0,119,255,0.3)",
              transition: "all 0.2s",
            }}
          >
            {selected.length === 0
              ? "Выберите аккаунты"
              : `⚡ Запустить продвижение (${selected.length} акк.)`}
          </button>
        </div>
      </div>
    </div>
  );
}
