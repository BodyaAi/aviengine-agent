import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { User, ChevronRight, Trash2, Plus, X, CheckSquare2, Search } from "lucide-react";
import avifyLogo from "figma:asset/83ad018e457e6e4bb595c06474fa13375d08f06e.png";
import type { LiveTask } from "../App";
import { SubscriptionStatusSwitcher } from "./SubscriptionStatusSwitcher";
import { useAppContext } from "../context/AppContext";

// ─── Design tokens ────────────────────────────────────────
const GLASS_SHADOW = [
  "inset 0 1.5px 0 rgba(255,255,255,1)",
  "inset 0 -0.5px 0 rgba(18,68,245,0.07)",
  "inset 1px 0 0 rgba(255,255,255,0.45)",
  "inset -1px 0 0 rgba(255,255,255,0.25)",
  "0 24px 60px rgba(18,68,245,0.15)",
  "0 4px 16px rgba(0,0,0,0.06)",
].join(", ");

const C = {
  primary: "#1244F5",
  text: "#1a2060",
  textSec: "#6b7890",
  border: "rgba(255,255,255,0.75)",
  sep: "rgba(18,68,245,0.07)",
  bgLight: "rgba(255,255,255,0.55)",
  card: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(64px) saturate(200%) brightness(1.06)",
    WebkitBackdropFilter: "blur(64px) saturate(200%) brightness(1.06)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.82)",
    boxShadow: GLASS_SHADOW,
  } as React.CSSProperties,
};

// ─── Primitives ───────────────────────────────────────────
function ProgressBar({ value, color = C.primary }: { value: number; color?: string }) {
  return (
    <div style={{ height: 5, background: "rgba(18,68,245,0.1)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, value))}%`, background: color, borderRadius: 3, transition: "width 0.4s ease", boxShadow: `0 0 8px ${color}66` }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "secondary", size = "m", style, disabled, className }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "s" | "m" | "l"; style?: React.CSSProperties; disabled?: boolean; className?: string;
}) {
  const base: React.CSSProperties = { border: "none", cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" };
  const sizes = {
    s: { padding: "7px 14px", fontSize: 13, borderRadius: 11 },
    m: { padding: "10px 18px", fontSize: 14, borderRadius: 13 },
    l: { padding: "14px 26px", fontSize: 15, borderRadius: 15 },
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(170deg, rgba(80,140,255,0.9) 0%, rgba(18,70,255,1) 50%, rgba(10,48,210,1) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1.5px 0 rgba(0,0,150,0.25), 0 8px 28px rgba(18,68,245,0.5)",
      textShadow: "0 1px 3px rgba(0,0,100,0.3)",
    },
    secondary: {
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      color: C.primary,
      border: "1px solid rgba(255,255,255,0.7)",
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -0.5px 0 rgba(18,68,245,0.08), 0 4px 16px rgba(18,68,245,0.12)",
    },
    ghost: { background: "transparent", color: C.textSec },
    danger: {
      background: "rgba(239,68,68,0.08)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.2)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    },
  };
  return <button onClick={onClick} disabled={disabled} className={className} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>;
}

// ─── Types ────────────────────────────────────────────────
type Account = { id: number; name: string; subtitle: string; email: string; status: string; ads: number };
type AgentAction = "idle" | "running" | "paused" | "finished" | "pending";
type TaskItem = { id: number; brand: string; task: string; pct: number; count: number; done: number; queued?: boolean; errorMessage?: string };

// ─── Static data ──────────────────────────────────────────
const initialAccounts: Account[] = [
  { id: 1, name: "Applexis", subtitle: "Apple Store", email: "applexis@avito-seller.ru", status: "active", ads: 127 },
  { id: 2, name: "MotoDrive", subtitle: "Автозапчасти", email: "motodrive.seller@gmail.com", status: "active", ads: 84 },
  { id: 3, name: "HomeCraft", subtitle: "Мебель и интерьер", email: "homecraft.avito@yandex.ru", status: "active", ads: 56 },
  { id: 4, name: "TechMarket", subtitle: "Электроника и гаджеты", email: "techmarket.store@gmail.com", status: "active", ads: 0 },
  { id: 5, name: "FashionPoint", subtitle: "Одежда и аксессуары", email: "fashionpoint.shop@yandex.ru", status: "active", ads: 87 },
  { id: 6, name: "PetWorld", subtitle: "Товары для животных", email: "petworld.avito@mail.ru", status: "active", ads: 23 },
  { id: 7, name: "AutoPartsPro", subtitle: "Запчасти и расходники", email: "autoparts.pro@yandex.ru", status: "paused", ads: 112 },
  { id: 8, name: "GreenGarden", subtitle: "Сад и огород", email: "greengarden.store@gmail.com", status: "active", ads: 12 },
  { id: 9, name: "Гончие псы", subtitle: "Приют для собак", email: "gonchiepsi@gmail.com", status: "active", ads: 69 },
  { id: 10, name: "Гопники", subtitle: "Строительная компания", email: "gangstile@gmail.com", status: "active", ads: 13 },
  { id: 11, name: "Технологии Касперского", subtitle: "TechHub", email: "KasperskyTechHub@gmail.com", status: "active", ads: 93 },
  { id: 12, name: "Технологии Касперского", subtitle: "TechHub", email: "KasperskyTechHub2@gmail.com", status: "active", ads: 15 },
];

const statusColors: Record<string, string> = { active: "#22c55e", paused: "#f59e0b", error: "#ef4444" };
const statusLabels: Record<string, string> = { active: "Подключен", paused: "В ожидании", error: "Ошибка" };
const accountIcons: Record<number, string> = { 1:"🍎",2:"🚗",3:"🏡",4:"📱",5:"👗",6:"🐾",7:"🔧",8:"🌿" };

const baseInProgress: TaskItem[] = [
  { id: 101, brand: "Applexis", task: "Публикация AirPods Pro", pct: 60, count: 30, done: 18 },
  { id: 102, brand: "Applexis", task: "Обновление описаний", pct: 66, count: 50, done: 33, errorMessage: "Ошибка авторизации: сессия истекла, выполните повторный вход в аккаунт" },
  { id: 103, brand: "HomeCraft", task: "Публикация кресел", pct: 35, count: 20, done: 7 },
  { id: 104, brand: "MotoDrive, Applexis, HomeCraft, TechStore, AutoParts Pro, MotoShop, GarageKing", task: "Загрузка запчастей Toyota", pct: 27, count: 45, done: 12, queued: true, errorMessage: "Ошибка API Авито: превышен лимит запросов (429 Too Many Requests). Повтор через 30 мин." },
];
const BASE_IDS = baseInProgress.map(t => t.id);

// ─── Support Menu ─────────────────────────────────────────
function SupportMenu({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const ic = dark ? "rgba(255,255,255,0.7)" : C.primary;
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: dark ? "rgba(255,255,255,0.1)" : "rgba(18,68,245,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={ic} strokeWidth="1.4" /><path d="M6 6.2C6 5.1 6.9 4.2 8 4.2C9.1 4.2 10 5.1 10 6.2C10 7.1 9.4 7.8 8.6 8.1C8.2 8.2 8 8.5 8 8.9V9.4" stroke={ic} strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="11.2" r="0.7" fill={ic} /></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, borderRadius: 16, overflow: "hidden", zIndex: 100, minWidth: 186, background: "#fff", boxShadow: "0 8px 32px rgba(18,68,245,0.15)", border: `1px solid ${C.border}` }}>
          <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${C.sep}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.textSec }}>Поддержка</span>
          </div>
          <a href="https://t.me/AvifyAI" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg,#2AABEE,#229ED9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.944 2.643a1.5 1.5 0 0 0-1.54-.217L2.408 9.936A1.5 1.5 0 0 0 2.5 12.7l4.3 1.486 1.697 5.432a1 1 0 0 0 1.72.344l2.496-2.67 4.913 3.619a1.5 1.5 0 0 0 2.346-.934l2.952-16.35a1.5 1.5 0 0 0-.98-1.984zM10.2 14.98l-.98 3.14-1.22-3.9L18.5 5.74 10.2 14.98z" fill="white" /></svg>
            </div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Telegram</div><div style={{ fontSize: 11, color: C.textSec }}>@AvifyAI</div></div>
          </a>
          <div style={{ height: 1, background: C.sep, margin: "0 14px" }} />
          <a href="https://vk.ru/club236643107" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg,#2787F5,#0055CB)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="11" viewBox="0 0 20 12" fill="none"><path d="M10.37 12H11.9C11.9 12 12.36 11.948 12.594 11.695C12.81 11.462 12.803 11.023 12.803 11.023C12.803 11.023 12.774 9.116 13.655 8.838C14.524 8.564 15.641 10.677 16.826 11.504C17.717 12.129 18.396 11.992 18.396 11.992L21.53 11.949C21.53 11.949 23.169 11.848 22.38 10.534C22.316 10.427 21.923 9.564 19.957 7.725C17.9 5.8 18.172 6.103 20.633 2.802C22.128 0.793 22.71 -0.388 22.531 -0.893C22.361 -1.376 21.302 -1.25 21.302 -1.25L17.785 -1.228C17.785 -1.228 17.52 -1.264 17.325 -1.147C17.134 -1.032 17.01 -0.764 17.01 -0.764C17.01 -0.764 16.444 1.237 15.683 2.938C14.08 6.509 13.448 6.692 13.191 6.529C12.59 6.148 12.738 4.975 12.738 4.144C12.738 1.566 13.12 0.494 11.979 0.218C11.604 0.128 11.327 0.07 10.379 0.06C9.168 0.047 8.147 0.063 7.573 0.353C7.191 0.545 6.897 0.971 7.08 0.994C7.306 1.023 7.822 1.134 8.097 1.511C8.451 1.994 8.438 3.08 8.438 3.08C8.438 3.08 8.641 6.176 7.937 6.551C7.455 6.806 6.795 6.285 5.368 2.906C4.632 1.224 4.081 -0.584 4.081 -0.584C4.081 -0.584 3.969 -0.843 3.781 -0.982C3.552 -1.148 3.232 -1.2 3.232 -1.2L-0.113 -1.178C-0.113 -1.178 -0.617 -1.163 -0.806 -0.948C-0.974 -0.755 -0.794 -0.354 -0.794 -0.354C-0.794 -0.354 1.884 6.195 4.929 9.495C7.722 12.522 10.37 12 10.37 12Z" fill="white" transform="translate(0,1)" /></svg>
            </div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>ВКонтакте</div><div style={{ fontSize: 11, color: C.textSec }}>club236643107</div></div>
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Agent Controls ───────────────────────────────────────
function AgentControls({ action, onAction }: { action: AgentAction; onAction: (a: AgentAction) => void }) {
  if (action === "idle") return (
    <Btn variant="primary" size="s" onClick={() => onAction("running")} className="avify-cta-btn" style={{ borderRadius: 10, gap: 7 }}>
      <svg width="8" height="9" viewBox="0 0 8 9" fill="none"><path d="M1 1L7 4.5L1 8V1Z" fill="white" /></svg>
      Запустить AI агента
    </Btn>
  );
  if (action === "pending") return (
    <Btn variant="primary" size="s" disabled className="avify-cta-btn" style={{ borderRadius: 10 }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "avify-spin 0.75s linear infinite" }} />
      Запуск…
    </Btn>
  );
  if (action === "finished") return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "5px 10px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.25)" }}>Завершён</span>
      <Btn variant="secondary" size="s" onClick={() => onAction("idle")}>Готово</Btn>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {action === "running" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e", flexShrink: 0 }} />}
      <Btn variant="secondary" size="s" onClick={() => onAction(action === "running" ? "paused" : "running")} style={{ background: action === "running" ? "rgba(245,158,11,0.1)" : "rgba(18,68,245,0.08)", color: action === "running" ? "#f59e0b" : C.primary, border: `1px solid ${action === "running" ? "rgba(245,158,11,0.3)" : "rgba(18,68,245,0.22)"}` }}>
        {action === "running" ? "Пауза" : "Продолжить"}
      </Btn>
      <Btn variant="danger" size="s" onClick={() => onAction("finished")}>Завершить</Btn>
    </div>
  );
}

// ─── KPI row ──────────────────────────────────────────────
function KpiRow({ avgPct, activeCount, errorsCount }: { avgPct: number; activeCount: number; errorsCount: number }) {
  const items = [
    { label: "Выполнено:", value: `${avgPct}%`, color: C.primary },
    { label: "Активных задач:", value: String(activeCount), color: C.text },
    { label: "Ошибки:", value: String(errorsCount), color: errorsCount > 0 ? "#ef4444" : "#22c55e" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "9px 16px", borderBottom: `1px solid ${C.sep}`, gap: 0, overflowX: "auto" }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <span style={{ color: "#c8d8f0", margin: "0 9px", fontSize: 12 }}>·</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: C.textSec, whiteSpace: "nowrap" }}>{item.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Agent Timeline ───────────────────────────────────────
function AgentTimeline({ action, totalMin = 90 }: { action: AgentAction; totalMin?: number }) {
  const elapsed = action === "running" ? 45 : action === "paused" ? 32 : action === "finished" ? totalMin : 0;
  const remaining = Math.max(0, totalMin - elapsed);
  const pct = Math.min(100, (elapsed / totalMin) * 100);
  if (action === "idle") return null;
  const color = action === "finished" ? "#22c55e" : action === "paused" ? "#f59e0b" : C.primary;
  const text = action === "finished" ? "Агент завершил работу" : action === "paused" ? `Пауза · осталось ~${remaining} минут` : `Агент работает · осталось ~${remaining} минут`;
  return (
    <div style={{ padding: "10px 16px 13px", borderBottom: `1px solid ${C.sep}` }}>
      <ProgressBar value={pct} color={color} />
      <div style={{ height: 8 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color, display: "block" }}>{text}</span>
    </div>
  );
}

// ─── Accounts Popover Button ──────────────────────────────
function AccountsPopoverButton({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [maxListHeight, setMaxListHeight] = useState(222);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const parts = brand.split(", ").filter(Boolean);
  const calcPosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 50;
    setMaxListHeight(Math.max(37, Math.min(222, spaceBelow)));
    setPopoverStyle({ position: "fixed", top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right), minWidth: 190, zIndex: 9999 });
  }, []);
  useEffect(() => {
    if (!open) return;
    calcPosition();
    const h = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node) && popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    window.addEventListener("scroll", calcPosition, true);
    window.addEventListener("resize", calcPosition);
    return () => { document.removeEventListener("mousedown", h); window.removeEventListener("scroll", calcPosition, true); window.removeEventListener("resize", calcPosition); };
  }, [open, calcPosition]);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button ref={btnRef} onClick={e => { e.stopPropagation(); setOpen(v => !v); }} style={{ display: "flex", alignItems: "center", gap: 3, background: open ? C.bgLight : "#f4f8ff", border: `1px solid ${open ? "rgba(18,68,245,0.3)" : C.border}`, borderRadius: 7, padding: "2px 7px 2px 6px", cursor: "pointer" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: open ? C.primary : C.textSec, whiteSpace: "nowrap" }}>Аккаунты</span>
        {parts.length > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: open ? C.primary : C.textSec, background: open ? "rgba(18,68,245,0.12)" : "rgba(18,68,245,0.07)", borderRadius: 5, padding: "0 4px" }}>{parts.length}</span>}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M2 3.5L5 6.5L8 3.5" stroke={open ? C.primary : C.textSec} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && createPortal(
        <div ref={popoverRef} style={{ ...popoverStyle, background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: "0 8px 32px rgba(18,68,245,0.15)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ maxHeight: maxListHeight, overflowY: "auto" }}>
            {parts.map((name, i) => (
              <div key={name + i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderTop: i > 0 ? `1px solid ${C.sep}` : "none", minHeight: 37 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap" }}>{name}</span>
              </div>
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); setOpen(false); }} style={{ width: "100%", padding: "7px 12px", background: C.bgLight, border: "none", borderTop: `1px solid ${C.sep}`, color: C.primary, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Свернуть</button>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Error Task Card ──────────────────────────────────────
function ErrorTaskCard({ item, onDelete, borderTop, aiState, isResolved }: { item: TaskItem; onDelete: (id: number) => void; borderTop?: boolean; aiState?: "idle"|"working"|"done"; isResolved?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const showAi = aiState === "done";
  const dotColor = showAi && isResolved ? "#22c55e" : "#ef4444";
  const textColor = showAi && isResolved ? "#22c55e" : "#ef4444";
  return (
    <div style={{ padding: "9px 14px 10px 16px", borderTop: borderTop ? `1px solid ${C.sep}` : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0, boxShadow: `0 0 5px ${dotColor}88`, marginTop: 5, transition: "background 0.3s" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{item.task}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              {showAi
                ? <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 6, background: isResolved ? "rgba(34,197,94,0.1)" : "rgba(129,140,153,0.1)", color: isResolved ? "#22c55e" : C.textSec, border: `1px solid ${isResolved ? "rgba(34,197,94,0.25)" : "rgba(129,140,153,0.2)"}`, whiteSpace: "nowrap" }}>{isResolved ? "Решено" : "Не решено"}</span>
                : <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 6, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", whiteSpace: "nowrap" }}>Ошибка</span>
              }
              <AccountsPopoverButton brand={item.brand} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 11, color: textColor, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, transition: "color 0.3s" }}>{item.errorMessage}</span>
            <button onClick={() => setExpanded(v => !v)} style={{ fontSize: 10, fontWeight: 600, color: textColor, background: "none", border: "none", cursor: "pointer", padding: "1px 4px", flexShrink: 0, textDecoration: "underline dotted" }}>
              {expanded ? "Скрыть" : "Подробнее"}
            </button>
          </div>
          {expanded && <div style={{ marginTop: 8, maxHeight: 140, overflowY: "auto", background: showAi && isResolved ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", borderRadius: 10, border: `1px solid ${showAi && isResolved ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)"}`, padding: "10px 12px" }}><span style={{ fontSize: 12, color: C.text, lineHeight: 1.65, wordBreak: "break-word", whiteSpace: "pre-wrap", display: "block" }}>{item.errorMessage}</span></div>}
        </div>
        <button onClick={() => onDelete(item.id)} style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 7, background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.18)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trash2 size={13} color="#ef4444" />
        </button>
      </div>
    </div>
  );
}

// ─── Errors Section ───────────────────────────────────────
const AI_ANALYSIS = [
  "Требуется обновление токена авторизации для устранения блокировки сессии.",
  "Обнаружено превышение квот API Авито. Рекомендуется увеличить интервал между запросами до 45 секунд.",
  "Конфликтов в данных «Toyota» не обнаружено, проблема носит исключительно технический характер доступа.",
];

function ErrorsSection({ tasks, onDelete }: { tasks: TaskItem[]; onDelete: (id: number) => void }) {
  const [showAll, setShowAll] = useState(false);
  const [aiState, setAiState] = useState<"idle"|"working"|"done">("idle");
  const MAX_VISIBLE = 2;
  const visible = showAll ? tasks : tasks.slice(0, MAX_VISIBLE);
  const extra = tasks.length - MAX_VISIBLE;
  if (tasks.length === 0) return null;
  const resolvedIds = new Set([102]);
  const handleAiClick = () => { if (aiState !== "idle") return; setAiState("working"); setTimeout(() => setAiState("done"), 3000); };
  return (
    <div style={{ borderTop: `1px solid ${C.sep}`, background: "linear-gradient(180deg,#f0f6ff 0%,#f7fbff 100%)", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 6px", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "block", flexShrink: 0, boxShadow: "0 0 5px rgba(239,68,68,0.5)" }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ef4444" }}>Ошибки</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "1px 6px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)" }}>{tasks.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {aiState === "done" && <Btn variant="secondary" size="s" onClick={() => setAiState("idle")} style={{ borderRadius: 10 }}>Готово</Btn>}
          <Btn variant="primary" size="s" disabled={aiState === "done"} onClick={handleAiClick} className="avify-cta-btn" style={{ borderRadius: 10, gap: 6 }}>
            {aiState === "working" ? <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "avify-spin 0.75s linear infinite" }} /> : <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5L11 5 9 3l2.5-2.5C10.5.3 9.2.6 8.4 1.5 7.6 2.4 7.4 3.7 7.9 4.8L2.3 10.4a1.5 1.5 0 0 0 2.1 2.1l5.6-5.5c1.1.5 2.4.3 3.3-.5.9-.8 1.2-2.1.7-3.2z" fill="white" /></svg>}
            {aiState === "working" ? "В работе" : "AI решение"}
          </Btn>
        </div>
      </div>
      {visible.map((item, i) => <ErrorTaskCard key={item.id} item={item} onDelete={onDelete} borderTop={i > 0} aiState={aiState} isResolved={resolvedIds.has(item.id)} />)}
      {!showAll && extra > 0 && <div style={{ padding: "2px 16px 12px" }}><button onClick={() => setShowAll(true)} style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>...и ещё {extra}</button></div>}
      {showAll && extra > 0 && <div style={{ padding: "2px 16px 12px" }}><button onClick={() => setShowAll(false)} style={{ fontSize: 11, color: C.textSec, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Свернуть</button></div>}
      <div style={{ margin: "6px 14px 14px", borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(135deg,rgba(18,68,245,0.05) 0%,rgba(18,68,245,0.02) 100%)", border: `1px solid rgba(18,68,245,0.1)` }}>
        <svg width="80" height="80" viewBox="0 0 20 20" fill="none" style={{ position: "absolute", right: 8, top: 6, opacity: 0.06, pointerEvents: "none" }}><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={C.primary} /></svg>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px 8px" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2 L11.2 8.8 L18 10 L11.2 11.2 L10 18 L8.8 11.2 L2 10 L8.8 8.8 Z" fill={C.primary} opacity="0.9" /></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.primary, letterSpacing: "0.01em" }}>AI анализ</span>
        </div>
        <div style={{ padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {AI_ANALYSIS.map((p, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary, flexShrink: 0, marginTop: 6 }} /><span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{p}</span></div>)}
        </div>
        <div style={{ borderTop: `1px solid rgba(18,68,245,0.1)`, padding: "8px 14px 10px" }}><span style={{ fontSize: 12, color: C.primary, fontStyle: "italic", opacity: 0.75 }}>Для реализации — активируйте «AI решение»</span></div>
      </div>
    </div>
  );
}

// ─── Accounts Panel (Desktop Modal) ──────────────────────
function AccountsPanel({ accounts, onClose, onDelete, onAdd }: { accounts: Account[]; onClose: () => void; onDelete: (id: number) => void; onAdd: (l: string, p: string) => void }) {
  const [query, setQuery] = useState("");

  const activeCount = accounts.filter(a => a.status === "active").length;
  const filtered = query.trim()
    ? accounts.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase()))
    : accounts;

  return createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(10,20,80,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 780, maxHeight: "88vh", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(18,68,245,0.25), 0 8px 24px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.5)" }}
      >
        {/* ── Blue header ── */}
        <div className="avify-shimmer" style={{ background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 50%,#4880FF 100%)", padding: "24px 28px 22px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div className="avify-aurora-bg" />
          <div className="avify-mesh-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          {/* Close */}
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <X size={16} color="white" />
          </button>
          {/* Title + stats */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={20} color="white" />
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.3px" }}>Аккаунты</h2>
            </div>
            <div style={{ display: "flex", gap: 16, marginLeft: 52 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <span style={{ fontWeight: 700, color: "white" }}>{activeCount}</span> активных
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <span style={{ fontWeight: 700, color: "white" }}>{accounts.length}</span> всего
              </span>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ background: "#fff", padding: "14px 24px", borderBottom: `1px solid ${C.sep}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
          {/* Search */}
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={15} color={C.textSec} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по имени или email…"
              style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 13, color: C.text, background: C.bgLight, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {/* Connect button */}
          <button onClick={() => onAdd("new_account", "")} className="avify-cta-btn avify-cta-pill" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", flexShrink: 0 }}>
            <Plus size={15} /> Подключить аккаунт
          </button>
        </div>

        {/* ── Accounts grid ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px", background: "#f8fbff" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.textSec, fontSize: 14 }}>
              {query ? "Ничего не найдено" : "Нет подключённых аккаунтов"}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {filtered.map(acc => (
              <div key={acc.id} style={{ background: "#fff", borderRadius: 18, padding: "16px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 14px rgba(18,68,245,0.08)", border: `1px solid ${C.border}`, transition: "box-shadow 0.2s" }}>
                {/* Account header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg, rgba(18,68,245,0.08), rgba(18,68,245,0.04))", border: `1px solid rgba(18,68,245,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {accountIcons[acc.id] ?? "🏪"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.name}</div>
                    <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.email}</div>
                  </div>
                </div>
                {/* Footer row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.sep}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[acc.status] ?? C.textSec, boxShadow: acc.status === "active" ? "0 0 6px rgba(34,197,94,0.5)" : "none", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: statusColors[acc.status] ?? C.textSec }}>{statusLabels[acc.status] ?? acc.status}</span>
                  </div>
                  <button onClick={() => onDelete(acc.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    <X size={12} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── In-Progress Row ──────────────────────────────────────
function InProgressRow({ item, onDelete, borderTop }: { item: TaskItem; onDelete: (id: number) => void; borderTop?: boolean }) {
  return (
    <div style={{ padding: "10px 14px 11px 16px", borderTop: borderTop ? `1px solid ${C.sep}` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {item.queued && <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "1px 5px", borderRadius: 5, border: "1px solid rgba(245,158,11,0.3)", whiteSpace: "nowrap", flexShrink: 0 }}>Очередь</span>}
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{item.task}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <AccountsPopoverButton brand={item.brand} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, whiteSpace: "nowrap" }}>{item.done}/{item.count}</span>
          <button onClick={() => onDelete(item.id)} style={{ borderRadius: 7, width: 26, height: 26, border: "1px solid rgba(239,68,68,0.18)", background: "rgba(239,68,68,0.09)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Trash2 size={12} color="#ef4444" />
          </button>
        </div>
      </div>
      <ProgressBar value={item.pct} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
interface MainTabProps { liveTasks: LiveTask[]; onSwitchTab: () => void; onRemoveTask: (id: number) => void; onClearTasks: () => void }

export function MainTab({ liveTasks, onSwitchTab, onRemoveTask, onClearTasks }: MainTabProps) {
  const [showAccounts, setShowAccounts] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [agentAction, setAgentAction] = useState<AgentAction>("idle");
  const [hiddenBaseIds, setHiddenBaseIds] = useState<Set<number>>(new Set());
  const { theme } = useAppContext();

  const visibleBase = baseInProgress.filter(t => !hiddenBaseIds.has(t.id));
  const allCombined: TaskItem[] = [...liveTasks, ...visibleBase];
  const allInProgress = allCombined.filter(t => !t.errorMessage);
  const errorTasks = allCombined.filter(t => !!t.errorMessage);
  const avgPct = allCombined.length > 0 ? Math.round(allCombined.reduce((s,t) => s + t.pct, 0) / allCombined.length) : 0;
  const errorsCount = errorTasks.length;
  const canClear = agentAction === "idle" || agentAction === "finished";
  const totalTaskCount = allInProgress.length + errorTasks.length;

  const handleDeleteTask = (id: number) => {
    if (BASE_IDS.includes(id)) setHiddenBaseIds(prev => new Set([...prev, id]));
    else onRemoveTask(id);
  };

  return (
    <>
      {showAccounts && <AccountsPanel accounts={accounts} onClose={() => setShowAccounts(false)} onDelete={id => setAccounts(p => p.filter(a => a.id !== id))} onAdd={login => setAccounts(p => [...p, { id: Date.now(), name: login.split("@")[0], subtitle: "Авито", email: login, status: "active", ads: 0 }])} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 20px 40px" }}>

        {/* ── Hero + Accounts Card ── */}
        <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,20,180,0.22)", border: "1px solid rgba(255,255,255,0.55)" }}>
          <div className="avify-shimmer" style={{ background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 45%,#4880FF 100%)", padding: "22px 22px 20px", position: "relative", overflow: "hidden" }}>
            <div className="avify-aurora-bg" />
            <div className="avify-mesh-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(150,200,255,0.4) 0%,transparent 60%)", filter: "blur(24px)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, overflow: "hidden", boxShadow: "0 0 0 1.5px rgba(255,255,255,0.2),0 4px 20px rgba(0,0,0,0.25)" }}>
                <img src={avifyLogo} alt="AviEngine" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: 19, fontWeight: 800, letterSpacing: "-0.4px" }}>AviEngine</div>
                <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 12, marginTop: 3 }}>AI‑агент ведёт ваш Авито: публикует, обновляет, уникализирует</div>
              </div>
              <SupportMenu dark />
            </div>
            <div style={{ marginTop: 16, position: "relative", zIndex: 1 }}><SubscriptionStatusSwitcher /></div>
          </div>
          <div style={{ background: "linear-gradient(180deg,#a8c8ff 0%,#cce0ff 35%,#e4f0ff 70%,#f2f7ff 100%)", padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.55)", border: "1.5px solid rgba(18,68,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
                <User size={16} color={C.primary} />
              </div>
              <div>
                <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.text }}>Аккаунты</span>
                <span style={{ display: "block", fontSize: 12, color: "rgba(18,68,245,0.6)", marginTop: 2 }}>
                  {accounts.length > 0 ? `${accounts.filter(a => a.status === "active").length} активных · ${accounts.length} всего` : "Нет подключённых аккаунтов"}
                </span>
              </div>
            </div>
            <button onClick={() => setShowAccounts(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(18,68,245,0.12)", border: "1.5px solid rgba(18,68,245,0.22)", borderRadius: 10, padding: "7px 13px", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600 }}>
              Открыть <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke={C.primary} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* ── Task Manager ── */}
        <div style={{ ...C.card, borderRadius: 20, overflow: "visible" }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${C.sep}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.bgLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckSquare2 size={16} color={C.primary} />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>Менеджер задач</h3>
            </div>
            <AgentControls action={agentAction} onAction={setAgentAction} />
          </div>
          <KpiRow avgPct={avgPct} activeCount={totalTaskCount} errorsCount={errorsCount} />
          <AgentTimeline action={agentAction} totalMin={90} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.primary }}>В процессе</span>
            </div>
            {canClear && totalTaskCount > 0 && <button onClick={() => { onClearTasks(); setHiddenBaseIds(new Set(BASE_IDS)); }} style={{ fontSize: 12, color: C.textSec, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>Очистить</button>}
          </div>
          {allInProgress.length === 0 && (
            <div style={{ padding: "16px 16px 20px", textAlign: "center" }}>
              <span style={{ color: C.textSec, display: "block", fontSize: 13 }}>Нет активных задач</span>
              <div style={{ height: 8 }} />
              <Btn variant="secondary" size="s" onClick={onSwitchTab} style={{ gap: 6 }}><CheckSquare2 size={14} />Перейти к шаблонам</Btn>
            </div>
          )}
          {allInProgress.map((item, i) => <InProgressRow key={item.id} item={item as TaskItem} onDelete={handleDeleteTask} borderTop={i > 0} />)}
          <ErrorsSection tasks={errorTasks as TaskItem[]} onDelete={handleDeleteTask} />
        </div>

      </div>
    </>
  );
}
