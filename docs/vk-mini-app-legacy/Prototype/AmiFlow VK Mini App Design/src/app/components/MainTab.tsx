import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Card,
  Box,
  Button,
  Title,
  Text,
  Caption,
  Progress,
  Spacing,
  Separator,
} from "@vkontakte/vkui";
import {
  Icon20UserOutline,
  Icon20ChevronRight,
  Icon20DeleteOutline,
  Icon20Add,
  Icon24ChecksOutline,
  Icon24Dismiss,
  Icon20SunOutline,
  Icon20MoonOutline,
} from "@vkontakte/icons";
import avifyLogo from "figma:asset/83ad018e457e6e4bb595c06474fa13375d08f06e.png";
import type { LiveTask } from "../App";
import { SubscriptionStatusSwitcher } from "./SubscriptionStatusSwitcher";
import { useAppContext } from "../context/AppContext";

// ─── Types ────────────────────────────────────────────────
type Account = {
  id: number;
  name: string;
  subtitle: string;
  email: string;
  status: string;
  ads: number;
};

type AgentAction = "idle" | "running" | "paused" | "finished" | "pending";

type TaskItem = {
  id: number;
  brand: string;
  task: string;
  pct: number;
  count: number;
  done: number;
  queued?: boolean;
  errorMessage?: string;
};

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

const statusColors: Record<string, string> = {
  active: "#22c55e",
  paused: "#f59e0b",
  error: "#ef4444",
};

const statusLabels: Record<string, string> = {
  active: "Подключен",
  paused: "В ожидании",
  error: "Ошибка",
};

const accountIcons: Record<number, string> = {
  1: "🍎", 2: "🚗", 3: "🏡", 4: "📱", 5: "👗", 6: "🐾", 7: "🔧", 8: "🌿",
};

const baseInProgress: TaskItem[] = [
  { id: 101, brand: "Applexis", task: "Публикация AirPods Pro", pct: 60, count: 30, done: 18, queued: false },
  { id: 102, brand: "Applexis", task: "Обновление описаний", pct: 66, count: 50, done: 33, queued: false, errorMessage: "Ошибка авторизации: сессия истекла, выполните повторный вход в аккаунт" },
  { id: 103, brand: "HomeCraft", task: "Публикация кресел", pct: 35, count: 20, done: 7, queued: false },
  { id: 104, brand: "MotoDrive, Applexis, HomeCraft, TechStore, AutoParts Pro, MotoShop, GarageKing", task: "Загрузка запчастей Toyota", pct: 27, count: 45, done: 12, queued: true, errorMessage: "Ошибка API Авито: превышен лимит запросов (429 Too Many Requests). Повтор через 30 мин." },
];

const BASE_IDS = baseInProgress.map((t) => t.id);

// ─── Support Channels (Telegram + VK) ────────────────────
function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21.944 2.643a1.5 1.5 0 0 0-1.54-.217L2.408 9.936A1.5 1.5 0 0 0 2.5 12.7l4.3 1.486 1.697 5.432a1 1 0 0 0 1.72.344l2.496-2.67 4.913 3.619a1.5 1.5 0 0 0 2.346-.934l2.952-16.35a1.5 1.5 0 0 0-.98-1.984zM10.2 14.98l-.98 3.14-1.22-3.9L18.5 5.74 10.2 14.98z" fill="white" />
    </svg>
  );
}

function VKIcon() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
      <path d="M10.37 12H11.9C11.9 12 12.36 11.948 12.594 11.695C12.81 11.462 12.803 11.023 12.803 11.023C12.803 11.023 12.774 9.116 13.655 8.838C14.524 8.564 15.641 10.677 16.826 11.504C17.717 12.129 18.396 11.992 18.396 11.992L21.53 11.949C21.53 11.949 23.169 11.848 22.38 10.534C22.316 10.427 21.923 9.564 19.957 7.725C17.9 5.8 18.172 6.103 20.633 2.802C22.128 0.793 22.71 -0.388 22.531 -0.893C22.361 -1.376 21.302 -1.25 21.302 -1.25L17.785 -1.228C17.785 -1.228 17.52 -1.264 17.325 -1.147C17.134 -1.032 17.01 -0.764 17.01 -0.764C17.01 -0.764 16.444 1.237 15.683 2.938C14.08 6.509 13.448 6.692 13.191 6.529C12.59 6.148 12.738 4.975 12.738 4.144C12.738 1.566 13.12 0.494 11.979 0.218C11.604 0.128 11.327 0.07 10.379 0.06C9.168 0.047 8.147 0.063 7.573 0.353C7.191 0.545 6.897 0.971 7.08 0.994C7.306 1.023 7.822 1.134 8.097 1.511C8.451 1.994 8.438 3.08 8.438 3.08C8.438 3.08 8.641 6.176 7.937 6.551C7.455 6.806 6.795 6.285 5.368 2.906C4.632 1.224 4.081 -0.584 4.081 -0.584C4.081 -0.584 3.969 -0.843 3.781 -0.982C3.552 -1.148 3.232 -1.2 3.232 -1.2L-0.113 -1.178C-0.113 -1.178 -0.617 -1.163 -0.806 -0.948C-0.974 -0.755 -0.794 -0.354 -0.794 -0.354C-0.794 -0.354 1.884 6.195 4.929 9.495C7.722 12.522 10.37 12 10.37 12Z" fill="white" transform="translate(0, 1)" />
    </svg>
  );
}

function SupportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <Button
        mode="tertiary"
        appearance="neutral"
        size="s"
        onClick={() => setOpen((v) => !v)}
        style={{ borderRadius: "50%", minWidth: 34, height: 34, padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="#0077FF" strokeWidth="1.4" />
          <path d="M6 6.2C6 5.1 6.9 4.2 8 4.2C9.1 4.2 10 5.1 10 6.2C10 7.1 9.4 7.8 8.6 8.1C8.2 8.2 8 8.5 8 8.9V9.4" stroke="#0077FF" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="11.2" r="0.7" fill="#0077FF" />
        </svg>
      </Button>

      {open && (
        <Card
          mode="shadow"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 100,
            minWidth: 186,
          }}
        >
          <Box style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--vkui--color_separator_primary, #f5f5fa)" }}>
            <Caption level="1" weight="1" normalize caps style={{ color: "#818C99", letterSpacing: "0.07em" }}>
              Поддержка
            </Caption>
          </Box>
          <a href="https://t.me/AvifyAI" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg, #2AABEE, #229ED9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(42,171,238,0.35)" }}>
              <TelegramIcon />
            </div>
            <div>
              <Text weight="2" normalize style={{ display: "block" }}>Telegram</Text>
              <Caption level="2" normalize style={{ color: "#818C99" }}>@AvifyAI</Caption>
            </div>
          </a>
          <Separator />
          <a href="https://vk.ru/club236643107" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(145deg, #2787F5, #0055CB)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              <VKIcon />
            </div>
            <div>
              <Text weight="2" normalize style={{ display: "block" }}>ВКонтакте</Text>
              <Caption level="2" normalize style={{ color: "#818C99" }}>club236643107</Caption>
            </div>
          </a>
        </Card>
      )}
    </div>
  );
}

// ─── Agent Controls ───────────────────────────────────────
function AgentControls({ action, onAction }: { action: AgentAction; onAction: (a: AgentAction) => void }) {
  if (action === "idle") {
    return (
      <Button
        mode="primary"
        size="s"
        before={<svg width="8" height="9" viewBox="0 0 8 9" fill="none" style={{ flexShrink: 0 }}><path d="M1 1L7 4.5L1 8V1Z" fill="white" /></svg>}
        onClick={() => onAction("running")}
        className="avify-cta-btn"
        style={{ borderRadius: 10 }}
      >
        Запустить AI агента
      </Button>
    );
  }

  if (action === "pending") {
    return (
      <Button
        mode="primary"
        size="s"
        className="avify-cta-btn"
        disabled
        before={
          <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "avify-spin 0.75s linear infinite", flexShrink: 0 }} />
        }
        style={{ borderRadius: 10 }}
      >
        Запуск…
      </Button>
    );
  }

  if (action === "finished") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Caption level="1" weight="2" normalize style={{ color: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", padding: "5px 10px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.25)" }}>
          Завершён
        </Caption>
        <Button mode="secondary" size="s" onClick={() => onAction("idle")}>Готово</Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {action === "running" && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 5px #22c55e", flexShrink: 0 }} />
      )}
      <Button
        mode="secondary"
        size="s"
        appearance={action === "running" ? "neutral" : "accent"}
        onClick={() => onAction(action === "running" ? "paused" : "running")}
        style={{
          backgroundColor: action === "running" ? "rgba(245,158,11,0.12)" : "rgba(0,119,255,0.1)",
          color: action === "running" ? "#f59e0b" : "#0077FF",
          border: `1px solid ${action === "running" ? "rgba(245,158,11,0.3)" : "rgba(0,119,255,0.25)"}`,
        }}
      >
        {action === "running" ? "Пауза" : "Продолжить"}
      </Button>
      <Button
        mode="secondary"
        size="s"
        appearance="negative"
        onClick={() => onAction("finished")}
        style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        Завершить
      </Button>
    </div>
  );
}

// ─── KPI row ──────────────────────────────────────────────
function KpiRow({ avgPct, activeCount, errorsCount }: { avgPct: number; activeCount: number; errorsCount: number }) {
  const items = [
    { label: "Выполнено:", value: `${avgPct}%`, color: "#0077FF" },
    { label: "Активных задач:", value: String(activeCount), color: "var(--vkui--color_text_primary)" },
    { label: "Ошибки:", value: String(errorsCount), color: errorsCount > 0 ? "#ef4444" : "#22c55e" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "9px 16px", borderBottom: "1px solid var(--vkui--color_separator_primary, #f5f5fa)", gap: 0, overflowX: "auto" }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <span style={{ color: "#e0e0ec", margin: "0 9px", fontSize: 12 }}>·</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <Caption level="1" normalize style={{ color: "#818C99", whiteSpace: "nowrap" }}>{item.label}</Caption>
            <Caption level="1" weight="1" normalize style={{ color: item.color }}>{item.value}</Caption>
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

  const appearance = action === "finished" ? "positive" : action === "paused" ? "#f59e0b" : "accent";
  const statusText = action === "finished"
    ? "Агент завершил работу"
    : action === "paused"
      ? `Пауза · осталось ~${remaining} минут`
      : `Агент работает · осталось ~${remaining} минут`;
  const statusColor = action === "finished" ? "#22c55e" : action === "paused" ? "#f59e0b" : "#0077FF";

  return (
    <div style={{ padding: "10px 16px 13px", borderBottom: "1px solid var(--vkui--color_separator_primary, #f5f5fa)" }}>
      <Progress
        value={pct}
        appearance={action === "finished" ? "positive" : action === "paused" ? "#f59e0b" : "accent"}
      />
      <Spacing size={8} />
      <Caption level="1" weight="2" normalize style={{ color: statusColor, display: "block" }}>
        {statusText}
      </Caption>
    </div>
  );
}

// ─── Accounts popover ─────────────────────────────────────
function AccountsPopoverButton({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [maxListHeight, setMaxListHeight] = useState(222);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const parts = brand.split(", ").filter(Boolean);
  const { theme } = useAppContext();

  // Theme-aware colors for the portal (rendered outside ConfigProvider DOM scope)
  const popBg = theme === "dark" ? "#2C2C2E" : "#FFFFFF";
  const popBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "#f0f0f5";
  const popSep = theme === "dark" ? "rgba(255,255,255,0.08)" : "#f5f5fa";
  const popText = theme === "dark" ? "#EBEBF5" : "#1C1C1E";
  const popFootBg = theme === "dark" ? "#1C1C1E" : "#fafafa";

  const calcPosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const ITEM_H = 37;
    const FOOTER_H = 35;
    const MARGIN = 12;
    const IDEAL_LIST_H = ITEM_H * 6;
    const spaceBelow = window.innerHeight - rect.bottom - FOOTER_H - MARGIN;
    const clampedListH = Math.max(ITEM_H, Math.min(IDEAL_LIST_H, spaceBelow));
    const right = Math.max(8, window.innerWidth - rect.right);
    setMaxListHeight(clampedListH);
    setPopoverStyle({ position: "fixed", top: rect.bottom + 6, right, minWidth: 190, zIndex: 9999 });
  }, []);

  useEffect(() => {
    if (!open) return;
    calcPosition();
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current && !btnRef.current.contains(target) && popoverRef.current && !popoverRef.current.contains(target)) {
        setOpen(false);
      }
    };
    const handleScroll = () => calcPosition();
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open, calcPosition]);

  const popoverContent = open
    ? createPortal(
        <div
          ref={popoverRef}
          style={{
            ...popoverStyle,
            backgroundColor: popBg,
            borderRadius: 12,
            border: `1px solid ${popBorder}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ maxHeight: maxListHeight, overflowY: "auto" }}>
            {parts.map((name, i) => (
              <div
                key={name + i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderTop: i > 0 ? `1px solid ${popSep}` : "none",
                  minHeight: 37,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#0077FF", flexShrink: 0, display: "block" }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: popText, whiteSpace: "nowrap" }}>{name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            style={{ width: "100%", padding: "7px 12px", background: popFootBg, border: "none", borderTop: `1px solid ${popSep}`, color: "#0077FF", fontSize: 11, fontWeight: 600, cursor: "pointer", textAlign: "center" }}
          >
            Свернуть
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          background: open ? "#EEF4FF" : "var(--vkui--color_background_secondary, #f5f5fa)",
          border: `1px solid ${open ? "#c7dcff" : "var(--vkui--color_separator_primary, #e8e8f0)"}`,
          borderRadius: 7,
          padding: "2px 7px 2px 6px",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <Caption level="2" weight="2" normalize style={{ color: open ? "#0077FF" : "#818C99", whiteSpace: "nowrap" }}>
          Аккаунты
        </Caption>
        {parts.length > 0 && (
          <span style={{ fontSize: 9, fontWeight: 700, color: open ? "#0077FF" : "#818C99", backgroundColor: open ? "#dce8ff" : "var(--vkui--color_background_tertiary, #eaeaf2)", borderRadius: 5, padding: "0px 4px" }}>
            {parts.length}
          </span>
        )}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke={open ? "#0077FF" : "#818C99"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {popoverContent}
    </div>
  );
}

// ─── Error Task Card ──────────────────────────────────────
function ErrorTaskCard({ item, onDelete, borderTop, aiState, isResolved }: {
  item: TaskItem;
  onDelete: (id: number) => void;
  borderTop?: boolean;
  aiState?: "idle" | "working" | "done";
  isResolved?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const showAiStatus = aiState === "done";
  const dotColor = showAiStatus && isResolved ? "#22c55e" : "#ef4444";
  const dotShadow = showAiStatus && isResolved ? "0 0 5px rgba(34,197,94,0.45)" : "0 0 5px rgba(239,68,68,0.45)";
  const textColor = showAiStatus && isResolved ? "#22c55e" : "#ef4444";

  return (
    <div style={{ padding: "9px 14px 10px 16px", borderTop: borderTop ? "1px solid var(--vkui--color_separator_primary)" : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0, boxShadow: dotShadow, marginTop: 5, transition: "background-color 0.3s, box-shadow 0.3s" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, minWidth: 0 }}>
            <Caption level="1" weight="2" normalize style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
              {item.task}
            </Caption>
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              {showAiStatus ? (
                isResolved ? (
                  <Caption level="2" weight="2" normalize style={{ padding: "2px 6px", borderRadius: 6, backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", whiteSpace: "nowrap" }}>
                    Решено
                  </Caption>
                ) : (
                  <Caption level="2" weight="2" normalize style={{ padding: "2px 6px", borderRadius: 6, backgroundColor: "rgba(129,140,153,0.1)", color: "#818C99", border: "1px solid rgba(129,140,153,0.2)", whiteSpace: "nowrap" }}>
                    Не решено
                  </Caption>
                )
              ) : (
                <Caption level="2" weight="2" normalize style={{ padding: "2px 6px", borderRadius: 6, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", whiteSpace: "nowrap" }}>
                  Ошибка
                </Caption>
              )}
              <AccountsPopoverButton brand={item.brand} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <Caption level="2" normalize style={{ color: textColor, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, lineHeight: 1.4, transition: "color 0.3s" }}>
              {item.errorMessage}
            </Caption>
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{ fontSize: 10, fontWeight: 600, color: textColor, background: "none", border: "none", cursor: "pointer", padding: "1px 4px", flexShrink: 0, textDecoration: "underline", textDecorationStyle: "dotted" }}
            >
              {expanded ? "Скрыть" : "Подробнее"}
            </button>
          </div>
          {expanded && (
            <div style={{ marginTop: 8, maxHeight: 140, overflowY: "auto", backgroundColor: showAiStatus && isResolved ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", borderRadius: 10, border: `1px solid ${showAiStatus && isResolved ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)"}`, padding: "10px 12px" }}>
              <Caption level="1" normalize style={{ color: "var(--vkui--color_text_primary)", lineHeight: 1.65, wordBreak: "break-word", whiteSpace: "pre-wrap", display: "block" }}>
                {item.errorMessage}
              </Caption>
            </div>
          )}
        </div>
        <Button
          mode="tertiary"
          appearance="negative"
          size="s"
          before={<Icon20DeleteOutline style={{ width: 16, height: 16 }} />}
          onClick={() => onDelete(item.id)}
          style={{ borderRadius: 7, minWidth: 28, height: 28, padding: 0, backgroundColor: "rgba(239,68,68,0.1)", flexShrink: 0 }}
        />
      </div>
    </div>
  );
}

// ─── Errors Section ───────────────────────────────────────
function WrenchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M13.5 2.5L11 5 9 3l2.5-2.5C10.5.3 9.2.6 8.4 1.5 7.6 2.4 7.4 3.7 7.9 4.8L2.3 10.4a1.5 1.5 0 0 0 2.1 2.1l5.6-5.5c1.1.5 2.4.3 3.3-.5.9-.8 1.2-2.1.7-3.2z"
        fill="white"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 2 L11.2 8.8 L18 10 L11.2 11.2 L10 18 L8.8 11.2 L2 10 L8.8 8.8 Z" fill="#0077FF" opacity="0.9" />
    </svg>
  );
}

const AI_ANALYSIS = [
  "Требуется обновление токена авторизации для устранения блокировки сессии.",
  "Обнаружено превышение квот API Авито. Рекомендуется увеличить интервал между запросами до 45 секунд.",
  "Конфликтов в данных «Toyota» не обнаружено, проблема носит исключительно технический характер доступа.",
];

function ErrorsSection({ tasks, onDelete }: { tasks: TaskItem[]; onDelete: (id: number) => void }) {
  const [showAll, setShowAll] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "working" | "done">("idle");
  const MAX_VISIBLE = 2;
  const visible = showAll ? tasks : tasks.slice(0, MAX_VISIBLE);
  const extra = tasks.length - MAX_VISIBLE;
  if (tasks.length === 0) return null;

  // IDs that AI can resolve (auth error = resolvable, rate-limit needs time = not resolvable)
  const resolvedIds = new Set([102]);

  const handleAiClick = () => {
    if (aiState !== "idle") return;
    setAiState("working");
    setTimeout(() => setAiState("done"), 3000);
  };

  const handleDone = () => {
    setAiState("idle");
  };

  return (
    <div style={{ borderTop: "1.5px solid var(--vkui--color_separator_primary)", backgroundColor: "var(--vkui--color_background_secondary)", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 6px", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ef4444", display: "block", flexShrink: 0, boxShadow: "0 0 5px rgba(239,68,68,0.5)" }} />
          <Caption level="2" weight="1" normalize caps style={{ color: "#ef4444", letterSpacing: "0.08em" }}>Ошибки</Caption>
          <Caption level="2" weight="2" normalize style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", padding: "1px 6px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)" }}>
            {tasks.length}
          </Caption>
        </div>
        {/* AI button group */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {aiState === "done" && (
            <Button
              mode="secondary"
              size="s"
              onClick={handleDone}
              style={{ borderRadius: 10 }}
            >
              Готово
            </Button>
          )}
          <Button
            mode="primary"
            size="s"
            className="avify-cta-btn"
            disabled={aiState === "done"}
            before={
              aiState === "working" ? (
                <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "avify-spin 0.75s linear infinite", flexShrink: 0 }} />
              ) : (
                <WrenchIcon />
              )
            }
            style={{ borderRadius: 10 }}
            onClick={handleAiClick}
          >
            {aiState === "working" ? "В работе" : "AI решение"}
          </Button>
        </div>
      </div>

      {/* Error items */}
      {visible.map((item, i) => (
        <ErrorTaskCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          borderTop={i > 0}
          aiState={aiState}
          isResolved={resolvedIds.has(item.id)}
        />
      ))}
      {!showAll && extra > 0 && (
        <div style={{ padding: "2px 16px 12px" }}>
          <button onClick={() => setShowAll(true)} style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ...и ещё {extra}
          </button>
        </div>
      )}
      {showAll && extra > 0 && (
        <div style={{ padding: "2px 16px 12px" }}>
          <button onClick={() => setShowAll(false)} style={{ fontSize: 11, color: "#818C99", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Свернуть
          </button>
        </div>
      )}

      {/* AI Analysis block */}
      <div style={{ margin: "6px 14px 14px", borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, rgba(0,119,255,0.06) 0%, rgba(0,170,255,0.04) 100%)", border: "1px solid rgba(0,119,255,0.12)" }}>
        {/* Watermark sparkle */}
        <svg
          width="80" height="80" viewBox="0 0 20 20" fill="none"
          style={{ position: "absolute", right: 8, top: 6, opacity: 0.07, pointerEvents: "none" }}
        >
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#0077FF" />
        </svg>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px 8px" }}>
          <SparkleIcon />
          <Caption level="1" weight="1" normalize style={{ color: "#0077FF", letterSpacing: "0.01em" }}>AI анализ</Caption>
        </div>

        {/* Bullet list */}
        <div style={{ padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {AI_ANALYSIS.map((point, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#0077FF", flexShrink: 0, marginTop: 6 }} />
              <Caption level="1" normalize style={{ color: "var(--vkui--color_text_primary)", lineHeight: 1.5 }}>
                {point}
              </Caption>
            </div>
          ))}
        </div>

        {/* Separator + footer */}
        <div style={{ borderTop: "1px solid rgba(0,119,255,0.12)", padding: "8px 14px 10px" }}>
          <Caption level="1" normalize style={{ color: "#0077FF", fontStyle: "italic", opacity: 0.75, display: "block" }}>
            Для реализации — активируйте «AI решение»
          </Caption>
        </div>
      </div>
    </div>
  );
}

// ─── Accounts Panel ───────────────────────────────────────
function AccountsPanel({ accounts, onClose, onDelete, onAdd }: {
  accounts: Account[];
  onClose: () => void;
  onDelete: (id: number) => void;
  onAdd: (login: string, password: string) => void;
}) {
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, height: "100dvh", background: "var(--vkui--color_background_secondary, #f5f5fa)", display: "flex", flexDirection: "column", zIndex: 50 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--vkui--color_background, white)", borderBottom: "1px solid var(--vkui--color_separator_primary, #f0f0f5)", flexShrink: 0 }}>
        <Button
          mode="tertiary"
          appearance="neutral"
          size="m"
          before={<Icon24Dismiss />}
          onClick={onClose}
          style={{ borderRadius: 12, minWidth: 36, height: 36, padding: 0 }}
          aria-label="Закрыть"
        />
        <Title level="3" weight="2" normalize style={{ flex: 1 }}>Аккаунты</Title>
        <Caption level="1" normalize style={{ color: "#818C99" }}>{accounts.length} подключено</Caption>
      </div>

      {/* Connect account button */}
      <div style={{ background: "var(--vkui--color_background, white)", borderBottom: "1px solid var(--vkui--color_separator_primary, #f0f0f5)", padding: "14px 16px", flexShrink: 0 }}>
        <Button
          mode="primary"
          size="l"
          stretched
          before={<Icon20Add />}
          onClick={() => onAdd("new_account", "")}
          className="avify-cta-btn avify-cta-pill"
        >
          Подключить аккаунт Авито
        </Button>
      </div>

      {/* Accounts list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {accounts.length === 0 && (
          <Text normalize style={{ color: "#818C99", textAlign: "center", padding: "32px 0", display: "block" }}>
            Нет добавленных аккаунтов
          </Text>
        )}
        {accounts.map((acc) => (
          <Card key={acc.id} mode="shadow" style={{ borderRadius: 18 }}>
            <Box style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{accountIcons[acc.id] ?? "🏪"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text weight="2" normalize style={{ display: "block" }}>{acc.name}</Text>
                <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {acc.email}
                </Caption>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: statusColors[acc.status] ?? "#818C99", flexShrink: 0, display: "block" }} />
                  <Caption level="2" weight="2" normalize style={{ color: statusColors[acc.status] ?? "#818C99", whiteSpace: "nowrap" }}>
                    {statusLabels[acc.status] ?? acc.status}
                  </Caption>
                </div>
                <Button
                  mode="tertiary"
                  appearance="negative"
                  size="s"
                  onClick={() => onDelete(acc.id)}
                  style={{ borderRadius: 9, minWidth: 28, height: 28, padding: 0, backgroundColor: "#FFF0F0" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </Button>
              </div>
            </Box>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── In-Progress Task Row ─────────────────────────────────
function InProgressRow({ item, onDelete, borderTop }: { item: TaskItem; onDelete: (id: number) => void; borderTop?: boolean }) {
  return (
    <div style={{ padding: "10px 14px 11px 16px", borderTop: borderTop ? "1px solid var(--vkui--color_separator_primary, #f5f5fa)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {item.queued && (
              <Caption level="2" weight="2" normalize style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.12)", padding: "1px 5px", borderRadius: 5, border: "1px solid rgba(245,158,11,0.3)", whiteSpace: "nowrap", flexShrink: 0 }}>
                Очередь
              </Caption>
            )}
            <Caption level="1" weight="2" normalize style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
              {item.task}
            </Caption>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <AccountsPopoverButton brand={item.brand} />
          <Caption level="2" weight="2" normalize style={{ color: "#0077FF", whiteSpace: "nowrap" }}>
            {item.done}/{item.count}
          </Caption>
          <Button
            mode="tertiary"
            appearance="negative"
            size="s"
            before={<Icon20DeleteOutline style={{ width: 14, height: 14 }} />}
            onClick={() => onDelete(item.id)}
            style={{ borderRadius: 7, minWidth: 26, height: 26, padding: 0, backgroundColor: "rgba(239,68,68,0.1)", flexShrink: 0 }}
          />
        </div>
      </div>
      <Progress value={item.pct} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
interface MainTabProps {
  liveTasks: LiveTask[];
  onSwitchTab: () => void;
  onRemoveTask: (id: number) => void;
  onClearTasks: () => void;
}

export function MainTab({ liveTasks, onSwitchTab, onRemoveTask, onClearTasks }: MainTabProps) {
  const [showAccounts, setShowAccounts] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [agentAction, setAgentAction] = useState<AgentAction>("idle");
  const [hiddenBaseIds, setHiddenBaseIds] = useState<Set<number>>(new Set());
  const { theme, setTheme } = useAppContext();

  const visibleBase = baseInProgress.filter((t) => !hiddenBaseIds.has(t.id));
  const allCombined: TaskItem[] = [...liveTasks, ...visibleBase];
  const allInProgress = allCombined.filter((t) => !t.errorMessage);
  const errorTasks = allCombined.filter((t) => !!t.errorMessage);

  const avgPct = allCombined.length > 0
    ? Math.round(allCombined.reduce((s, t) => s + t.pct, 0) / allCombined.length)
    : 0;

  const errorsCount = errorTasks.length;
  const canClear = agentAction === "idle" || agentAction === "finished";
  const totalTaskCount = allInProgress.length + errorTasks.length;

  const handleClear = () => {
    if (!canClear) return;
    onClearTasks();
    setHiddenBaseIds(new Set(BASE_IDS));
  };

  const handleDeleteTask = (id: number) => {
    if (BASE_IDS.includes(id)) {
      setHiddenBaseIds((prev) => new Set([...prev, id]));
    } else {
      onRemoveTask(id);
    }
  };

  const handleDeleteAccount = (id: number) => setAccounts((p) => p.filter((a) => a.id !== id));
  const handleAddAccount = (login: string) => {
    setAccounts((p) => [...p, { id: Date.now(), name: login.split("@")[0], subtitle: "Авито", email: login, status: "active", ads: 0 }]);
  };

  return (
    <>
      {showAccounts && (
        <AccountsPanel
          accounts={accounts}
          onClose={() => setShowAccounts(false)}
          onDelete={handleDeleteAccount}
          onAdd={handleAddAccount}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px 32px" }}>

        {/* ── Welcome Card ── */}
<Card mode="shadow" style={{ borderRadius: 20, overflow: "visible" }}>
  <Box style={{ padding: "15px 15px 13px" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <img
        src={avifyLogo}
        alt="Avify"
        style={{ width: 48, height: 48, borderRadius: 15, objectFit: "cover", flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Title
          level="1"
          weight="1"
          useAccentWeight
          normalize
          style={{
            letterSpacing: "-0.3px",
            display: "block",
            fontWeight: 700,
          }}
        >
          AmiFlow
        </Title>
        <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary, #818C99)", display: "block", marginTop: 4, lineHeight: 1.4 }}>
          AI‑агент ведёт ваш аккаунт Авито: публикует, обновляет и уникализирует.
        </Caption>
      </div>
      {/* Theme toggle */}
      <Button
        mode="tertiary"
        appearance="neutral"
        size="s"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{ borderRadius: "50%", minWidth: 34, height: 34, padding: 0, flexShrink: 0 }}
        aria-label="Переключить тему"
      >
        {theme === "dark"
          ? <Icon20SunOutline style={{ color: "#F59E0B" }} />
          : <Icon20MoonOutline style={{ color: "#6366F1" }} />
        }
      </Button>
      <SupportMenu />
    </div>
    <Spacing size={12} />
    <Separator />
    <Spacing size={10} />
    <SubscriptionStatusSwitcher />
  </Box>
</Card>

        {/* ── Accounts Card ── */}
        <Card mode="shadow" style={{ borderRadius: 16 }}>
          <Box style={{ padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: "rgba(0,119,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon20UserOutline style={{ color: "#0077FF" }} />
              </div>
              <div>
                <Text weight="2" normalize style={{ display: "block" }}>Аккаунты</Text>
                <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 1 }}>
                  {accounts.length > 0
                    ? `${accounts.filter((a) => a.status === "active").length} активных · ${accounts.length} всего`
                    : "Нет подключённых аккаунтов"}
                </Caption>
              </div>
            </div>
            <Button
              mode="secondary"
              size="s"
              after={<Icon20ChevronRight />}
              onClick={() => setShowAccounts(true)}
            >
              Открыть
            </Button>
          </Box>
        </Card>

        {/* ── Task Manager ── */}
        <Card mode="shadow" style={{ borderRadius: 20, overflow: "visible" }}>
          {/* Header */}
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--vkui--color_separator_primary, #f5f5fa)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon24ChecksOutline style={{ color: "#0077FF", width: 18, height: 18 }} />
              </div>
              <Title level="3" weight="2" normalize>Менеджер задач</Title>
            </div>
            <AgentControls action={agentAction} onAction={setAgentAction} />
          </div>

          {/* KPI */}
          <KpiRow avgPct={avgPct} activeCount={totalTaskCount} errorsCount={errorsCount} />

          {/* Timeline */}
          <AgentTimeline action={agentAction} totalMin={90} />

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#0077FF", display: "block", flexShrink: 0 }} />
              <Caption level="2" weight="1" normalize caps style={{ color: "#0077FF", letterSpacing: "0.08em" }}>В процессе</Caption>
            </div>
            {canClear && totalTaskCount > 0 && (
              <Button mode="link" size="s" onClick={handleClear} style={{ color: "#818C99" }}>
                Очистить
              </Button>
            )}
          </div>

          {/* In-progress tasks */}
          {allInProgress.length === 0 && (
            <div style={{ padding: "16px 16px 20px", textAlign: "center" }}>
              <Caption level="1" normalize style={{ color: "#818C99", display: "block" }}>Нет активных задач</Caption>
              <Spacing size={8} />
              <Button mode="secondary" size="s" before={<Icon24ChecksOutline style={{ width: 18, height: 18 }} />} onClick={onSwitchTab}>
                Перейти к шаблонам
              </Button>
            </div>
          )}
          {allInProgress.map((item, i) => (
            <InProgressRow key={item.id} item={item as TaskItem} onDelete={handleDeleteTask} borderTop={i > 0} />
          ))}

          {/* Errors */}
          <ErrorsSection tasks={errorTasks as TaskItem[]} onDelete={handleDeleteTask} />
        </Card>

      </div>
    </>
  );
}