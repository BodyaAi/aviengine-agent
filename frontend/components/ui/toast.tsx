"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

// ══════════════════════════════════════════════
// ── Types ──
// ══════════════════════════════════════════════

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (options: { title: string; description?: string; variant?: ToastVariant }) => void;
};

// ══════════════════════════════════════════════
// ── Context ──
// ══════════════════════════════════════════════

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ══════════════════════════════════════════════
// ── Provider ──
// ══════════════════════════════════════════════

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>((options) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "success",
    };
    setToasts(prev => [...prev, item]);
    setTimeout(() => remove(id), 5000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

// ══════════════════════════════════════════════
// ── Toaster (renders toasts) ──
// ══════════════════════════════════════════════

function Toaster({ toasts, onClose }: { toasts: ToastItem[]; onClose: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex flex-col items-center gap-3 px-4">
      {toasts.map(item => (
        <ToastCard key={item.id} item={item} onClose={() => onClose(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const Icon = item.variant === "success" ? CheckCircle2 : item.variant === "error" ? AlertCircle : Info;
  const accent =
    item.variant === "success"
      ? "text-success"
      : item.variant === "error"
        ? "text-danger"
        : "text-primary-500";

  return (
    <div
      className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_60px_rgba(4,18,54,0.22)] ring-1 ring-black/5 animate-in"
      style={{ animation: "toast-in 0.3s ease-out" }}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${accent}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink-900">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 text-sm text-ink-500">{item.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
