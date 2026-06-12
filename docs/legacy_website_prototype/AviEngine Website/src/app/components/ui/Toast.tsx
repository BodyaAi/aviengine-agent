import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
  duration?: number;
  type?: "success" | "error" | "info";
}

export function Toast({ message, visible, onDone, duration = 4500, type = "success" }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 350);
      }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, onDone]);

  const colors = {
    success: { bg: "#1a1a2e", icon: "#22c55e", border: "rgba(34,197,94,0.2)" },
    error:   { bg: "#1a0505", icon: "#ef4444", border: "rgba(239,68,68,0.2)" },
    info:    { bg: "#0a1628", icon: "#0077FF", border: "rgba(0,119,255,0.2)" },
  };
  const c = colors[type];

  const icons = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c.icon} fillOpacity="0.15" stroke={c.icon} strokeWidth="1.4"/>
        <path d="M5 8L7 10L11 6" stroke={c.icon} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c.icon} fillOpacity="0.15" stroke={c.icon} strokeWidth="1.4"/>
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke={c.icon} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c.icon} fillOpacity="0.15" stroke={c.icon} strokeWidth="1.4"/>
        <path d="M8 7V11M8 5.5V5" stroke={c.icon} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div
      style={{
        position: "fixed",
        top: show ? 16 : -80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        transition: "top 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        maxWidth: 380,
        width: "calc(100% - 32px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 16,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {icons[type]}
        <span style={{ color: "white", fontSize: 14, fontWeight: 500, flex: 1 }}>{message}</span>
        <button
          onClick={() => { setShow(false); setTimeout(onDone, 350); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
