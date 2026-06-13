import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Plus, X, Search } from "lucide-react";
import avifyLogo from "figma:asset/83ad018e457e6e4bb595c06474fa13375d08f06e.png";
import { SubscriptionStatusSwitcher } from "./SubscriptionStatusSwitcher";

// ─── Tokens (local) ───────────────────────────────────────
const C = {
  primary: "#1244F5",
  text: "#1a2060",
  textSec: "#6b7890",
  border: "rgba(255,255,255,0.75)",
  sep: "rgba(18,68,245,0.07)",
  bgLight: "rgba(255,255,255,0.55)",
};

// ─── Types + data ─────────────────────────────────────────
type Account = { id: number; name: string; subtitle: string; email: string; status: string; ads: number };

const initialAccounts: Account[] = [
  { id: 1, name: "Applexis",                subtitle: "Apple Store",           email: "applexis@avito-seller.ru",      status: "active", ads: 127 },
  { id: 2, name: "MotoDrive",               subtitle: "Автозапчасти",          email: "motodrive.seller@gmail.com",    status: "active", ads: 84  },
  { id: 3, name: "HomeCraft",               subtitle: "Мебель и интерьер",     email: "homecraft.avito@yandex.ru",     status: "active", ads: 56  },
  { id: 4, name: "TechMarket",              subtitle: "Электроника и гаджеты", email: "techmarket.store@gmail.com",    status: "active", ads: 0   },
  { id: 5, name: "FashionPoint",            subtitle: "Одежда и аксессуары",   email: "fashionpoint.shop@yandex.ru",  status: "active", ads: 87  },
  { id: 6, name: "PetWorld",                subtitle: "Товары для животных",   email: "petworld.avito@mail.ru",        status: "active", ads: 23  },
  { id: 7, name: "AutoPartsPro",            subtitle: "Запчасти и расходники", email: "autoparts.pro@yandex.ru",       status: "paused", ads: 112 },
  { id: 8, name: "GreenGarden",             subtitle: "Сад и огород",          email: "greengarden.store@gmail.com",   status: "active", ads: 12  },
  { id: 9, name: "Гончие псы",              subtitle: "Приют для собак",       email: "gonchiepsi@gmail.com",           status: "active", ads: 69  },
  { id: 10, name: "Гопники",               subtitle: "Строительная компания", email: "gangstile@gmail.com",            status: "active", ads: 13  },
  { id: 11, name: "Технологии Касперского", subtitle: "TechHub",               email: "KasperskyTechHub@gmail.com",    status: "active", ads: 93  },
  { id: 12, name: "Технологии Касперского", subtitle: "TechHub",               email: "KasperskyTechHub2@gmail.com",   status: "active", ads: 15  },
];

const statusColors: Record<string, string> = { active: "#22c55e", paused: "#f59e0b", error: "#ef4444" };
const statusLabels: Record<string, string>  = { active: "Подключен", paused: "В ожидании", error: "Ошибка" };
const accountIcons: Record<number, string>  = { 1:"🍎",2:"🚗",3:"🏡",4:"📱",5:"👗",6:"🐾",7:"🔧",8:"🌿" };

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

// ─── Accounts Panel (Desktop Modal) ──────────────────────
function AccountsPanel({ accounts, onClose, onDelete, onAdd }: {
  accounts: Account[]; onClose: () => void;
  onDelete: (id: number) => void; onAdd: (l: string, p: string) => void;
}) {
  const [query, setQuery] = useState("");
  const activeCount = accounts.filter(a => a.status === "active").length;
  const filtered = query.trim()
    ? accounts.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase()))
    : accounts;

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(10,20,80,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 780, maxHeight: "88vh", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(18,68,245,0.25), 0 8px 24px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.5)" }}>
        <div className="avify-shimmer" style={{ background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 50%,#4880FF 100%)", padding: "24px 28px 22px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div className="avify-aurora-bg" />
          <div className="avify-mesh-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <X size={16} color="white" />
          </button>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={20} color="white" />
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.3px" }}>Аккаунты</h2>
            </div>
            <div style={{ display: "flex", gap: 16, marginLeft: 52 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}><span style={{ fontWeight: 700, color: "white" }}>{activeCount}</span> активных</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}><span style={{ fontWeight: 700, color: "white" }}>{accounts.length}</span> всего</span>
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", padding: "14px 24px", borderBottom: `1px solid ${C.sep}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={15} color={C.textSec} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по имени или email…" style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 13, color: C.text, background: C.bgLight, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={() => onAdd("new_account", "")} className="avify-cta-btn avify-cta-pill" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", flexShrink: 0 }}>
            <Plus size={15} /> Подключить аккаунт
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px", background: "#f8fbff" }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: C.textSec, fontSize: 14 }}>{query ? "Ничего не найдено" : "Нет подключённых аккаунтов"}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {filtered.map(acc => (
              <div key={acc.id} style={{ background: "#fff", borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 14px rgba(18,68,245,0.08)", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,rgba(18,68,245,0.08),rgba(18,68,245,0.04))", border: "1px solid rgba(18,68,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{accountIcons[acc.id] ?? "🏪"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.name}</div>
                    <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.sep}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[acc.status] ?? C.textSec, boxShadow: acc.status === "active" ? "0 0 6px rgba(34,197,94,0.5)" : "none", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: statusColors[acc.status] ?? C.textSec }}>{statusLabels[acc.status] ?? acc.status}</span>
                  </div>
                  <button onClick={() => onDelete(acc.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

// ─── HeroBlock ─────────────────────────────────────────────
export function HeroBlock() {
  const [showAccounts, setShowAccounts] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const activeCount = accounts.filter(a => a.status === "active").length;

  return (
    <div style={{ padding: "16px 28px 0" }}>
      {showAccounts && (
        <AccountsPanel
          accounts={accounts}
          onClose={() => setShowAccounts(false)}
          onDelete={id => setAccounts(p => p.filter(a => a.id !== id))}
          onAdd={login => setAccounts(p => [...p, { id: Date.now(), name: login.split("@")[0], subtitle: "Авито", email: login, status: "active", ads: 0 }])}
        />
      )}

      {/* Glass hero card */}
      <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,20,180,0.25)", border: "1px solid rgba(255,255,255,0.55)" }}>

        {/* Blue gradient header */}
        <div className="avify-shimmer" style={{ background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 45%,#4880FF 100%)", padding: "20px 22px 18px", position: "relative", overflow: "hidden" }}>
          <div className="avify-aurora-bg" />
          <div className="avify-mesh-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(150,200,255,0.4) 0%,transparent 60%)", filter: "blur(24px)", pointerEvents: "none" }} />

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, overflow: "hidden", boxShadow: "0 0 0 1.5px rgba(255,255,255,0.2),0 4px 20px rgba(0,0,0,0.25)" }}>
              <img src={avifyLogo} alt="AviEngine" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1.1 }}>AviEngine</div>
              <div style={{ color: "rgba(255,255,255,0.58)", fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>AI‑агент ведёт ваш Авито: публикует, обновляет, уникализирует</div>
            </div>
            <SupportMenu dark />
          </div>

          {/* Subscription status */}
          <div style={{ marginTop: 14, position: "relative", zIndex: 1 }}>
            <SubscriptionStatusSwitcher />
          </div>
        </div>

        {/* Accounts row — gradient bridge */}
        <div style={{ background: "linear-gradient(180deg,#a8c8ff 0%,#cce0ff 35%,#e4f0ff 70%,#f2f7ff 100%)", padding: "13px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.55)", border: "1.5px solid rgba(18,68,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
              <User size={16} color={C.primary} />
            </div>
            <div>
              <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.text }}>Аккаунты</span>
              <span style={{ display: "block", fontSize: 12, color: "rgba(18,68,245,0.6)", marginTop: 1 }}>
                {accounts.length > 0 ? `${activeCount} активных · ${accounts.length} всего` : "Нет подключённых аккаунтов"}
              </span>
            </div>
          </div>
          <button onClick={() => setShowAccounts(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(18,68,245,0.12)", border: "1.5px solid rgba(18,68,245,0.22)", borderRadius: 10, padding: "7px 14px", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
            Открыть
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke={C.primary} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
