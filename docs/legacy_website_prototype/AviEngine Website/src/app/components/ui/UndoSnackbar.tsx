import { useEffect, useState, useRef } from "react";

interface UndoSnackbarProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  onDone: () => void;
  duration?: number;
}

export function UndoSnackbar({ visible, message, onUndo, onDone, duration = 5000 }: UndoSnackbarProps) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setProgress(100);
      startRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startRef.current;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining > 0) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);

      timerRef.current = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 350);
      }, duration);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      setShow(false);
    }
  }, [visible, duration, onDone]);

  const handleUndo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setShow(false);
    setTimeout(() => { onUndo(); onDone(); }, 300);
  };

  if (!visible && !show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: show ? 88 : -100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 700,
        transition: "bottom 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        maxWidth: 400,
        width: "calc(100% - 32px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a2e",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.1)" }}>
          <div style={{
            height: "100%",
            backgroundColor: "#ef4444",
            width: `${progress}%`,
            transition: "width 0.1s linear",
            borderRadius: 2,
          }} />
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
        }}>
          <span style={{ fontSize: 16 }}>🗑</span>
          <span style={{ color: "white", fontSize: 13, fontWeight: 500, flex: 1 }}>{message}</span>
          <button
            onClick={handleUndo}
            style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 10,
              color: "#ef4444",
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 14px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}
