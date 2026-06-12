import { useState, useRef, useEffect } from "react";
import { FileText, Trash2, Plus, X, CheckCircle2 } from "lucide-react";
import type { LiveTask } from "../App";
import { Toast } from "./ui/Toast";

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

// ─── Data ─────────────────────────────────────────────────
const CITIES = ["Москва","Санкт-Петербург","Новосибирск","Екатеринбург","Казань","Нижний Новгород","Челябинск","Самара","Уфа","Ростов-на-Дону","Красноярск","Воронеж","Пермь","Волгоград","Краснодар"];
const accountsList = [
  { id:1, name:"Applexis", email:"applexis@avito-seller.ru", icon:"🍎", status:"active" },
  { id:2, name:"MotoDrive", email:"motodrive.seller@gmail.com", icon:"🚗", status:"active" },
  { id:3, name:"HomeCraft", email:"homecraft.avito@yandex.ru", icon:"🏡", status:"error" },
  { id:4, name:"TechMarket", email:"techmarket.store@gmail.com", icon:"📱", status:"active" },
  { id:5, name:"FashionPoint", email:"fashionpoint.shop@yandex.ru", icon:"👗", status:"active" },
  { id:6, name:"PetWorld", email:"petworld.avito@mail.ru", icon:"🐾", status:"active" },
  { id:7, name:"AutoPartsPro", email:"autoparts.pro@yandex.ru", icon:"🔧", status:"active" },
  { id:8, name:"GreenGarden", email:"greengarden.store@gmail.com", icon:"🌿", status:"active" },
];

interface AdVariant { id: number; name: string; count: number }
interface Template { id: number; name: string; createdAt: string; selectedAccounts: number[]; selectedCities: string[]; mode: "auto"|"manual"; variants: AdVariant[]; autoCount: number }

const sampleTemplates: Template[] = [
  { id:1, name:"Авто — BMW X5", createdAt:"08 апр. 2026", selectedAccounts:[1], selectedCities:["Москва","Санкт-Петербург"], mode:"auto", autoCount:25, variants:[{id:1,name:"Базовый",count:25}] },
  { id:2, name:"Электроника — iPhone 15 Pro", createdAt:"05 апр. 2026", selectedAccounts:[1,2], selectedCities:["Москва"], mode:"manual", autoCount:25, variants:[{id:1,name:"Новый, запечатан",count:25},{id:2,name:"Б/у, идеал",count:15}] },
  { id:3, name:"Мебель — Диван угловой", createdAt:"01 апр. 2026", selectedAccounts:[3], selectedCities:[], mode:"auto", autoCount:5, variants:[{id:1,name:"Базовый",count:5}] },
];

// ─── Primitives ───────────────────────────────────────────
function Btn({ children, onClick, variant="secondary", size="m", style, disabled, className }: { children: React.ReactNode; onClick?: () => void; variant?: "primary"|"secondary"|"ghost"|"danger"; size?: "s"|"m"|"l"; style?: React.CSSProperties; disabled?: boolean; className?: string }) {
  const base: React.CSSProperties = { border: "none", cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" };
  const sz = {
    s: { padding:"7px 14px", fontSize:13, borderRadius:11 },
    m: { padding:"10px 18px", fontSize:14, borderRadius:13 },
    l: { padding:"14px 26px", fontSize:15, borderRadius:15 },
  };
  const vs: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(170deg, rgba(80,140,255,0.9) 0%, rgba(18,70,255,1) 50%, rgba(10,48,210,1) 100%)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      color: "#fff", border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1.5px 0 rgba(0,0,150,0.25), 0 8px 28px rgba(18,68,245,0.5)",
      textShadow: "0 1px 3px rgba(0,0,100,0.3)",
    },
    secondary: {
      background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
      color: C.primary, border: "1px solid rgba(255,255,255,0.7)",
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -0.5px 0 rgba(18,68,245,0.08), 0 4px 16px rgba(18,68,245,0.12)",
    },
    ghost: { background: "transparent", color: C.textSec },
    danger: {
      background: "rgba(239,68,68,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    },
  };
  return <button onClick={onClick} disabled={disabled} className={className} style={{ ...base, ...sz[size], ...vs[variant], ...style }}>{children}</button>;
}

// ─── Pill Multi-Selector ──────────────────────────────────
interface PillItem { id: string; label: string; sublabel?: string }

function PillSelector({ items, selected, onChange, placeholder, searchPlaceholder }: { items: PillItem[]; selected: string[]; onChange: (ids: string[]) => void; placeholder: string; searchPlaceholder: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  const filtered = items.filter(it => it.label.toLowerCase().includes(query.toLowerCase()) && !selected.includes(it.id));
  const MAX_TAGS = 2;
  const visibleTags = selected.slice(0, MAX_TAGS);
  const extra = selected.length - MAX_TAGS;
  const selectedItems = items.filter(it => selected.includes(it.id));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, minHeight: 32 }}>
        {selected.length === 0 ? (
          <button onClick={() => setOpen(true)} style={{ background: "none", border: `1.5px dashed ${C.border}`, borderRadius: 20, padding: "5px 13px", cursor: "pointer", color: C.textSec, fontSize: 13, fontWeight: 500 }}>+ {placeholder}</button>
        ) : (
          <>
            {visibleTags.map(id => {
              const it = items.find(x => x.id === id);
              if (!it) return null;
              return (
                <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(18,68,245,0.1)", border: `1px solid rgba(18,68,245,0.2)`, borderRadius: 20, padding: "4px 10px 4px 12px", fontSize: 13, fontWeight: 500, color: C.primary, whiteSpace: "nowrap" }}>
                  {it.label}
                  <button onClick={e => { e.stopPropagation(); toggle(id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: C.primary, opacity: 0.65 }}>
                    <X size={10} />
                  </button>
                </span>
              );
            })}
            {extra > 0 && <span onClick={() => setOpen(true)} style={{ display: "inline-flex", alignItems: "center", background: "rgba(18,68,245,0.07)", border: `1px solid rgba(18,68,245,0.15)`, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: C.primary, cursor: "pointer" }}>+{extra}</span>}
            <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, padding: "4px 2px" }}>
              {open ? "Скрыть" : "Изменить"}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M2 3.5L5 6.5L8 3.5" stroke={C.primary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>
        )}
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60, background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(18,68,245,0.14)", border: `1px solid rgba(18,68,245,0.1)`, overflow: "hidden" }}>
          <div style={{ padding: "10px 12px 8px", borderBottom: `1px solid ${C.sep}` }}>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={searchPlaceholder} style={{ width: "100%", background: C.bgLight, border: `1px solid rgba(18,68,245,0.1)`, outline: "none", borderRadius: 10, padding: "8px 12px", fontSize: 14, color: C.text, boxSizing: "border-box" }} />
          </div>
          {selectedItems.length > 0 && (
            <div style={{ padding: "8px 12px 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.textSec, display: "block", marginBottom: 6 }}>Выбрано</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {selectedItems.map(it => <span key={it.id} onClick={() => toggle(it.id)} style={{ display: "inline-flex", alignItems: "center", gap: 3, background: C.primary, borderRadius: 20, padding: "3px 9px 3px 11px", fontSize: 12, fontWeight: 600, color: "white", cursor: "pointer" }}>{it.label} <X size={9} /></span>)}
              </div>
              <div style={{ height: 1, background: C.sep, margin: "8px 0 2px" }} />
            </div>
          )}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && <span style={{ display: "block", color: C.textSec, padding: "14px 16px", fontSize: 13 }}>Нет совпадений</span>}
            {filtered.map((it, i) => (
              <button key={it.id} onClick={() => toggle(it.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "none", border: "none", borderTop: i > 0 ? `1px solid ${C.sep}` : "none", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <span style={{ fontSize: 13, color: C.text, display: "block" }}>{it.label}</span>
                  {it.sublabel && <span style={{ fontSize: 11, color: C.textSec, display: "block" }}>{it.sublabel}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.textSec, display: "block", marginBottom: 10 }}>{children}</span>;
}
function SectionDivider() {
  return <div style={{ height: 1, background: C.sep, margin: "0 -16px" }} />;
}

// ─── Variant Rows ─────────────────────────────────────────
function VariantManualRow({ variant, onChangeName, onChangeCount, onDelete, showDelete }: { variant: AdVariant; onChangeName:(id:number,n:string)=>void; onChangeCount:(id:number,c:number)=>void; onDelete:(id:number)=>void; showDelete:boolean }) {
  const [nameVal, setNameVal] = useState(variant.name);
  const [editingName, setEditingName] = useState(false);
  const [countStr, setCountStr] = useState(String(variant.count));
  const [countFocused, setCountFocused] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.75)", border: `1px solid rgba(18,68,245,0.1)`, borderRadius: 12, padding: "11px 12px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <input autoFocus value={nameVal} onChange={e => setNameVal(e.target.value)} onBlur={() => { setEditingName(false); if (nameVal.trim()) onChangeName(variant.id, nameVal.trim()); else setNameVal(variant.name); }} onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: "100%", background: "none", border: "none", borderBottom: `1.5px solid rgba(18,68,245,0.4)`, outline: "none", fontSize: 14, fontWeight: 600, color: C.text, padding: "2px 0", boxSizing: "border-box" }} />
        ) : (
          <span onClick={() => setEditingName(true)} style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", cursor: "text" }}>{variant.name}</span>
        )}
      </div>
      <input type="number" min={1} max={500} value={countStr} onChange={e => { setCountStr(e.target.value); const n = parseInt(e.target.value,10); if (n>=1&&n<=500) onChangeCount(variant.id,n); }} onFocus={() => setCountFocused(true)} onBlur={() => { setCountFocused(false); const n=parseInt(countStr,10); if (isNaN(n)||n<1||n>500) setCountStr(String(variant.count)); }} style={{ width:52, flexShrink:0, background:"rgba(18,68,245,0.06)", border:`1.5px solid ${countFocused?"rgba(18,68,245,0.5)":"rgba(18,68,245,0.14)"}`, borderRadius:9, padding:"5px 8px", fontSize:14, fontWeight:700, color:C.primary, textAlign:"center", outline:"none", appearance:"none" } as React.CSSProperties} />
      {showDelete && <button onClick={() => onDelete(variant.id)} style={{ flexShrink:0, background:"none", border:"none", cursor:"pointer", padding:2, display:"flex", alignItems:"center", opacity:0.45 }}><X size={14} color={C.primary} /></button>}
    </div>
  );
}

function VariantAutoRow({ variant, onChangeName, onDelete, showDelete }: { variant: AdVariant; onChangeName:(id:number,n:string)=>void; onDelete:(id:number)=>void; showDelete:boolean }) {
  const [nameVal, setNameVal] = useState(variant.name);
  const [editingName, setEditingName] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.75)", border: `1px solid rgba(18,68,245,0.1)`, borderRadius: 12, padding: "11px 12px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <input autoFocus value={nameVal} onChange={e => setNameVal(e.target.value)} onBlur={() => { setEditingName(false); if (nameVal.trim()) onChangeName(variant.id, nameVal.trim()); else setNameVal(variant.name); }} onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} style={{ width: "100%", background: "none", border: "none", borderBottom: `1.5px solid rgba(18,68,245,0.4)`, outline: "none", fontSize: 14, fontWeight: 600, color: C.text, padding: "2px 0", boxSizing: "border-box" }} />
        ) : (
          <span onClick={() => setEditingName(true)} style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", cursor: "text" }}>{variant.name}</span>
        )}
      </div>
      {showDelete && <button onClick={() => onDelete(variant.id)} style={{ flexShrink:0, background:"none", border:"none", cursor:"pointer", padding:2, display:"flex", alignItems:"center", opacity:0.45 }}><X size={14} color={C.primary} /></button>}
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────
function TemplateCard({ template, isActive, onActivate, onDeactivate, onDelete, onUpdateAccounts, onUpdateCities, onUpdateMode, onUpdateAutoCount, onUpdateVariants }: {
  template: Template; isActive: boolean;
  onActivate:(id:number)=>void; onDeactivate:(id:number)=>void; onDelete:(id:number)=>void;
  onUpdateAccounts:(id:number,a:number[])=>void; onUpdateCities:(id:number,c:string[])=>void; onUpdateMode:(id:number,m:"auto"|"manual")=>void;
  onUpdateAutoCount:(id:number,c:number)=>void; onUpdateVariants:(id:number,v:AdVariant[])=>void;
}) {
  const [autoCountStr, setAutoCountStr] = useState(String(template.autoCount));
  const [autoFocused, setAutoFocused] = useState(false);
  const accountItems: PillItem[] = accountsList.map(a => ({ id: String(a.id), label: a.name, sublabel: a.email }));
  const cityItems: PillItem[] = CITIES.map(c => ({ id: c, label: c }));

  const addVariant = () => onUpdateVariants(template.id, [...template.variants, { id: Date.now(), name: `Вариант ${template.variants.length + 1}`, count: 10 }]);
  const updateVariantName = (vid: number, name: string) => onUpdateVariants(template.id, template.variants.map(v => v.id === vid ? { ...v, name } : v));
  const updateVariantCount = (vid: number, count: number) => onUpdateVariants(template.id, template.variants.map(v => v.id === vid ? { ...v, count } : v));
  const deleteVariant = (vid: number) => onUpdateVariants(template.id, template.variants.filter(v => v.id !== vid));
  const switchMode = (m: "auto"|"manual") => { onUpdateMode(template.id, m); if (m === "auto") onUpdateVariants(template.id, [{ id: Date.now(), name: "Базовый", count: template.autoCount }]); };

  return (
    <div style={{ ...C.card, borderRadius: 20, overflow: "visible", border: isActive ? "1.5px solid rgba(34,197,94,0.35)" : C.border }}>
      <div style={{ padding: "0 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0 13px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: isActive ? "rgba(34,197,94,0.12)" : "rgba(18,68,245,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={16} color={isActive ? "#22c55e" : C.primary} />
          </div>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{template.name}</span>
          {isActive && <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, padding: "3px 8px", flexShrink: 0 }}>Активен</span>}
          <button onClick={() => onDelete(template.id)} style={{ flexShrink: 0, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 9, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 size={13} color="#ef4444" />
          </button>
        </div>

        <SectionDivider />
        <div style={{ padding: "12px 0 14px" }}>
          <SectionLabel>Аккаунты</SectionLabel>
          <PillSelector items={accountItems} selected={template.selectedAccounts.map(String)} onChange={ids => onUpdateAccounts(template.id, ids.map(Number))} placeholder="Добавить аккаунт" searchPlaceholder="Поиск аккаунта…" />
        </div>

        <SectionDivider />
        <div style={{ padding: "12px 0 14px" }}>
          <SectionLabel>Города (гео)</SectionLabel>
          <PillSelector items={cityItems} selected={template.selectedCities} onChange={cities => onUpdateCities(template.id, cities)} placeholder="Добавить город" searchPlaceholder="Поиск города…" />
        </div>

        <SectionDivider />
        <div style={{ padding: "12px 0 14px" }}>
          {/* Variants block */}
          <div style={{ background: "linear-gradient(135deg,#eaf1ff 0%,#f0f6ff 100%)", borderRadius: 18, overflow: "hidden", padding: "14px 14px 0", border: `1px solid rgba(18,68,245,0.1)` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Варианты объявлений</span>
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(18,68,245,0.08)", border: `1px solid rgba(18,68,245,0.12)`, borderRadius: 20, padding: 3 }}>
                {(["auto","manual"] as const).map(m => (
                  <button key={m} onClick={() => switchMode(m)} style={{ padding: "5px 13px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", background: template.mode === m ? C.primary : "transparent", color: template.mode === m ? "white" : "rgba(18,68,245,0.45)", borderRadius: 16, transition: "all 0.15s" }}>
                    {m === "auto" ? "АВТО" : "ВРУЧНУЮ"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {template.variants.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 12px", background: "rgba(18,68,245,0.04)", borderRadius: 12, border: "1.5px dashed rgba(18,68,245,0.18)" }}>
                  <span style={{ fontSize: 12, color: "rgba(18,68,245,0.45)", textAlign: "center" }}>Создайте первый вариант объявления</span>
                </div>
              ) : (
                template.variants.map(v => template.mode === "auto"
                  ? <VariantAutoRow key={v.id} variant={v} onChangeName={updateVariantName} onDelete={deleteVariant} showDelete={true} />
                  : <VariantManualRow key={v.id} variant={v} onChangeName={updateVariantName} onChangeCount={updateVariantCount} onDelete={deleteVariant} showDelete={true} />
                )
              )}
            </div>
            <button onClick={addVariant} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600, padding: "4px 0 12px" }}>
              <Plus size={16} /> Создать объявление
            </button>
            {template.mode === "auto" && (
              <>
                <div style={{ height: 1, background: C.sep, margin: "0 -14px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 14px" }}>
                  <span style={{ fontSize: 12, color: "rgba(18,68,245,0.55)" }}>Кол-во публикаций на аккаунт</span>
                  <input type="number" min={1} max={500} value={autoCountStr}
                    onChange={e => { setAutoCountStr(e.target.value); const n=parseInt(e.target.value,10); if (n>=1&&n<=500) onUpdateAutoCount(template.id,n); }}
                    onFocus={() => setAutoFocused(true)}
                    onBlur={() => { setAutoFocused(false); const n=parseInt(autoCountStr,10); if (isNaN(n)||n<1||n>500) setAutoCountStr(String(template.autoCount)); }}
                    style={{ width:64, background:"rgba(18,68,245,0.07)", border:`1.5px solid ${autoFocused?"rgba(18,68,245,0.5)":"rgba(18,68,245,0.15)"}`, borderRadius:10, padding:"6px 10px", fontSize:15, fontWeight:700, color:C.text, textAlign:"center", outline:"none", appearance:"none" } as React.CSSProperties} />
                </div>
              </>
            )}
            {template.mode === "manual" && <div style={{ height: 2 }} />}
          </div>
        </div>

        <SectionDivider />
        <div style={{ padding: "12px 0 14px" }}>
          {isActive ? (
            <Btn variant="danger" size="m" onClick={() => onDeactivate(template.id)} style={{ width: "100%", justifyContent: "center", borderRadius: 12 }}>Деактивировать</Btn>
          ) : (
            <Btn variant="primary" size="m" onClick={() => onActivate(template.id)} className="avify-cta-btn" style={{ width: "100%", justifyContent: "center", borderRadius: 12 }}>Активировать</Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty Templates ──────────────────────────────────────
function EmptyTemplates({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 16px 20px", textAlign: "center" }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(18,68,245,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke={C.primary} strokeWidth="1.6" /><path d="M7 9H17M7 13H13" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" /><circle cx="19" cy="19" r="4" fill={C.primary} /><path d="M19 17V21M17 19H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </div>
      <div>
        <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Шаблонов пока нет</span>
        <span style={{ fontSize: 13, color: C.textSec, lineHeight: 1.55, display: "block" }}>Создайте шаблон — AI‑агент запишет ваши действия и будет автоматически публиковать объявления.</span>
      </div>
      <Btn variant="primary" size="l" onClick={onCreate} className="avify-cta-btn" style={{ borderRadius: 14, gap: 8 }}><Plus size={16} />Создать шаблон</Btn>
    </div>
  );
}

// ─── Main WorkTab ─────────────────────────────────────────
interface WorkTabProps { addTask: (task: Omit<LiveTask,"id">) => void; liveTasks: LiveTask[] }

export function WorkTab({ addTask, liveTasks }: WorkTabProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Задача создана ✓");
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  const [activeTemplateIds, setActiveTemplateIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const activeInTasks = new Set(liveTasks.filter(t => t.templateId !== undefined).map(t => t.templateId as number));
    setActiveTemplateIds(prev => { const next = new Set(prev); let changed = false; for (const tid of prev) { if (!activeInTasks.has(tid)) { next.delete(tid); changed = true; } } return changed ? next : prev; });
  }, [liveTasks]);

  const showToast = (msg: string) => { setToastMessage(msg); setToastVisible(true); };
  const handleCreateTemplate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString("ru-RU", { day:"2-digit", month:"short", year:"numeric" });
    setTemplates(prev => [{ id: Date.now(), name: `Новый шаблон #${prev.length+1}`, createdAt: formatted, selectedAccounts: [], selectedCities: [], mode: "auto", autoCount: 10, variants: [] }, ...prev]);
    showToast("Шаблон создан ✓");
  };
  const handleActivate = (id: number) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    if (tpl.selectedAccounts.length === 0) { showToast("Выберите хотя бы один аккаунт"); return; }
    if (tpl.selectedCities.length === 0) { showToast("Добавьте хотя бы один город"); return; }
    const brandNames = accountsList.filter(a => tpl.selectedAccounts.includes(a.id)).map(a => a.name).join(", ");
    const totalCount = tpl.mode === "auto" ? tpl.autoCount : tpl.variants.reduce((s,v) => s+v.count, 0);
    addTask({ brand: brandNames, task: tpl.name, pct: 0, count: totalCount, done: 0, templateId: id });
    setActiveTemplateIds(prev => new Set([...prev, id]));
    showToast(`Задача «${tpl.name}» добавлена в менеджер задач ✓`);
  };
  const handleDeactivate = (id: number) => { setActiveTemplateIds(prev => { const n = new Set(prev); n.delete(id); return n; }); showToast("Шаблон деактивирован"); };
  const handleDelete = (id: number) => { setTemplates(prev => prev.filter(t => t.id !== id)); showToast("Шаблон удалён"); };

  const templateCount = templates.length;
  const plural = templateCount === 1 ? "шаблон" : templateCount < 5 ? "шаблона" : "шаблонов";

  return (
    <>
      <Toast message={toastMessage} visible={toastVisible} onDone={() => setToastVisible(false)} type="success" duration={3500} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 20px 40px" }}>

        {/* Header */}
        <div style={{ ...C.card, borderRadius: 20, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.bgLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={16} color={C.primary} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>Шаблоны</h3>
                {templateCount > 0 && <span style={{ fontSize: 12, color: C.textSec, display: "block", marginTop: 1 }}>{templateCount} {plural}</span>}
              </div>
            </div>
            <Btn variant="primary" size="s" onClick={handleCreateTemplate} className="avify-cta-btn" style={{ borderRadius: 10, gap: 6 }}><Plus size={14} />Создать</Btn>
          </div>
        </div>

        {/* Templates */}
        {templateCount === 0 ? (
          <div style={{ ...C.card, borderRadius: 20 }}><EmptyTemplates onCreate={handleCreateTemplate} /></div>
        ) : (
          templates.map(tpl => (
            <TemplateCard key={tpl.id} template={tpl} isActive={activeTemplateIds.has(tpl.id)}
              onActivate={handleActivate} onDeactivate={handleDeactivate} onDelete={handleDelete}
              onUpdateAccounts={(id,a) => setTemplates(p => p.map(t => t.id===id ? {...t,selectedAccounts:a} : t))}
              onUpdateCities={(id,c) => setTemplates(p => p.map(t => t.id===id ? {...t,selectedCities:c} : t))}
              onUpdateMode={(id,m) => setTemplates(p => p.map(t => t.id===id ? {...t,mode:m} : t))}
              onUpdateAutoCount={(id,c) => setTemplates(p => p.map(t => t.id===id ? {...t,autoCount:c} : t))}
              onUpdateVariants={(id,v) => setTemplates(p => p.map(t => t.id===id ? {...t,variants:v} : t))}
            />
          ))
        )}

      </div>
    </>
  );
}
