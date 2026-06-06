import { useState, useRef, useEffect } from "react";
import {
  Card,
  Box,
  Button,
  Title,
  Text,
  Caption,
} from "@vkontakte/vkui";
import {
  Icon20Add,
  Icon20DeleteOutline,
  Icon20ArticleOutline,
  Icon16Cancel,
} from "@vkontakte/icons";
import type { LiveTask } from "../App";
import { Toast } from "./ui/Toast";

// ─── Data ─────────────────────────────────────────────────
const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Уфа", "Ростов-на-Дону",
  "Красноярск", "Воронеж", "Пермь", "Волгоград", "Краснодар",
];

const accountsList = [
  { id: 1, name: "Applexis", email: "applexis@avito-seller.ru", icon: "🍎", status: "active" },
  { id: 2, name: "MotoDrive", email: "motodrive.seller@gmail.com", icon: "🚗", status: "active" },
  { id: 3, name: "HomeCraft", email: "homecraft.avito@yandex.ru", icon: "🏡", status: "error" },
  { id: 4, name: "TechMarket", email: "techmarket.store@gmail.com", icon: "📱", status: "active" },
  { id: 5, name: "FashionPoint", email: "fashionpoint.shop@yandex.ru", icon: "👗", status: "active" },
  { id: 6, name: "PetWorld", email: "petworld.avito@mail.ru", icon: "🐾", status: "active" },
  { id: 7, name: "AutoPartsPro", email: "autoparts.pro@yandex.ru", icon: "🔧", status: "active" },
  { id: 8, name: "GreenGarden", email: "greengarden.store@gmail.com", icon: "🌿", status: "active" },
];

interface AdVariant {
  id: number;
  name: string;
  count: number;
}

interface Template {
  id: number;
  name: string;
  createdAt: string;
  selectedAccounts: number[];
  selectedCities: string[];
  mode: "auto" | "manual";
  variants: AdVariant[];
  autoCount: number; // used when mode === "auto"
}

const sampleTemplates: Template[] = [
  {
    id: 1,
    name: "Авто — BMW X5",
    createdAt: "08 апр. 2026",
    selectedAccounts: [1],
    selectedCities: ["Москва", "Санкт-Петербург"],
    mode: "auto",
    autoCount: 25,
    variants: [{ id: 1, name: "Базовый", count: 25 }],
  },
  {
    id: 2,
    name: "Электроника — iPhone 15 Pro",
    createdAt: "05 апр. 2026",
    selectedAccounts: [1, 2],
    selectedCities: ["Москва"],
    mode: "manual",
    autoCount: 25,
    variants: [
      { id: 1, name: "Новый, запечатан", count: 25 },
      { id: 2, name: "Б/у, идеал", count: 15 },
    ],
  },
  {
    id: 3,
    name: "Мебель — Диван угловой",
    createdAt: "01 апр. 2026",
    selectedAccounts: [3],
    selectedCities: [],
    mode: "auto",
    autoCount: 5,
    variants: [{ id: 1, name: "Базовый", count: 5 }],
  },
];

// ─── Shared pill-tag styles ────────────────────────────────
const TAG_BLUE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 4,
  backgroundColor: "rgba(0,119,255,0.12)",
  border: "1px solid rgba(0,119,255,0.22)",
  borderRadius: 20, padding: "4px 10px 4px 12px",
  fontSize: 13, fontWeight: 500, color: "#0077FF",
  whiteSpace: "nowrap",
};

// ─── Generic Pill Multi-Selector ───────────────────────────
interface PillItem { id: string; label: string; sublabel?: string }

function PillSelector({
  items, selected, onChange, placeholder, searchPlaceholder,
}: {
  items: PillItem[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  const filtered = items.filter(
    (it) => it.label.toLowerCase().includes(query.toLowerCase()) && !selected.includes(it.id)
  );

  const MAX_TAGS = 2;
  const visibleTags = selected.slice(0, MAX_TAGS);
  const extra = selected.length - MAX_TAGS;
  const selectedItems = items.filter((it) => selected.includes(it.id));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Tags row */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, minHeight: 32 }}>
        {selected.length === 0 ? (
          <button
            onClick={() => setOpen(true)}
            style={{
              background: "none",
              border: "1.5px dashed var(--vkui--color_separator_primary, #e0e0ea)",
              borderRadius: 20, padding: "5px 13px",
              cursor: "pointer", color: "#818C99", fontSize: 13, fontWeight: 500,
            }}
          >
            + {placeholder}
          </button>
        ) : (
          <>
            {visibleTags.map((id) => {
              const it = items.find((x) => x.id === id);
              if (!it) return null;
              return (
                <span key={id} style={TAG_BLUE}>
                  {it.label}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#0077FF", opacity: 0.65 }}
                  >
                    <Icon16Cancel width={12} height={12} />
                  </button>
                </span>
              );
            })}
            {extra > 0 && (
              <span
                onClick={() => setOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center",
                  backgroundColor: "rgba(0,119,255,0.07)",
                  border: "1px solid rgba(0,119,255,0.18)",
                  borderRadius: 20, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, color: "#0077FF", cursor: "pointer",
                }}
              >
                +{extra}
              </span>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#0077FF", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 2, padding: "4px 2px",
              }}
            >
              {open ? "Скрыть" : "Изменить"}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#0077FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60,
          background: "var(--vkui--color_background, white)",
          borderRadius: 16, boxShadow: "0 10px 36px rgba(0,0,0,0.13)",
          border: "1px solid var(--vkui--color_separator_primary, #f0f0f5)",
          overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--vkui--color_separator_primary)" }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: "100%", background: "var(--vkui--color_background_secondary, #f5f5fa)",
                border: "none", outline: "none", borderRadius: 10, padding: "8px 12px",
                fontSize: 14, color: "var(--vkui--color_text_primary)", boxSizing: "border-box",
              }}
            />
          </div>
          {/* Selected pills */}
          {selectedItems.length > 0 && (
            <div style={{ padding: "8px 12px 6px" }}>
              <Caption level="2" normalize caps style={{ color: "#818C99", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Выбрано</Caption>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {selectedItems.map((it) => (
                  <span
                    key={it.id}
                    onClick={() => toggle(it.id)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      backgroundColor: "#0077FF", borderRadius: 20,
                      padding: "3px 9px 3px 11px", fontSize: 12, fontWeight: 600, color: "white", cursor: "pointer",
                    }}
                  >
                    {it.label} <Icon16Cancel width={10} height={10} />
                  </span>
                ))}
              </div>
              <div style={{ height: 1, backgroundColor: "var(--vkui--color_separator_primary)", margin: "8px 0 2px" }} />
            </div>
          )}
          {/* Filtered list */}
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <Caption level="1" normalize style={{ display: "block", color: "#818C99", padding: "14px 16px" }}>
                Нет совпадений
              </Caption>
            )}
            {filtered.map((it, i) => (
              <button
                key={it.id}
                onClick={() => toggle(it.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "none", border: "none",
                  borderTop: i > 0 ? "1px solid var(--vkui--color_separator_primary, #f5f5fa)" : "none",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div>
                  <Caption level="1" normalize style={{ color: "var(--vkui--color_text_primary)", display: "block" }}>{it.label}</Caption>
                  {it.sublabel && (
                    <Caption level="2" normalize style={{ color: "#818C99", display: "block" }}>{it.sublabel}</Caption>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section Label ─────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Caption level="2" weight="1" normalize caps style={{ color: "#818C99", letterSpacing: "0.07em", display: "block", marginBottom: 10 }}>
      {children}
    </Caption>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "var(--vkui--color_separator_primary, #f0f0f5)", margin: "0 -16px" }} />;
}

// ─── Template Card ─────────────────────────────────────────
function TemplateCard({
  template, isActive, onActivate, onDeactivate, onDelete,
  onUpdateAccounts, onUpdateCities, onUpdateMode, onUpdateAutoCount, onUpdateVariants,
}: {
  template: Template;
  isActive: boolean;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateAccounts: (id: number, accounts: number[]) => void;
  onUpdateCities: (id: number, cities: string[]) => void;
  onUpdateMode: (id: number, mode: "auto" | "manual") => void;
  onUpdateAutoCount: (id: number, count: number) => void;
  onUpdateVariants: (id: number, variants: AdVariant[]) => void;
}) {
  const [autoCountStr, setAutoCountStr] = useState(String(template.autoCount));
  const [autoFocused, setAutoFocused] = useState(false);

  const accountItems: PillItem[] = accountsList.map((a) => ({
    id: String(a.id),
    label: a.name,
    sublabel: a.email,
  }));
  const cityItems: PillItem[] = CITIES.map((c) => ({ id: c, label: c }));

  const addVariant = () => {
    const next: AdVariant = { id: Date.now(), name: `Вариант ${template.variants.length + 1}`, count: 10 };
    onUpdateVariants(template.id, [...template.variants, next]);
  };

  const updateVariantName = (vid: number, name: string) =>
    onUpdateVariants(template.id, template.variants.map((v) => v.id === vid ? { ...v, name } : v));

  const updateVariantCount = (vid: number, count: number) =>
    onUpdateVariants(template.id, template.variants.map((v) => v.id === vid ? { ...v, count } : v));

  const deleteVariant = (vid: number) => {
    onUpdateVariants(template.id, template.variants.filter((v) => v.id !== vid));
  };

  const switchMode = (m: "auto" | "manual") => {
    onUpdateMode(template.id, m);
    if (m === "auto") {
      onUpdateVariants(template.id, [{ id: Date.now(), name: "Базовый", count: template.autoCount }]);
    }
  };

  return (
    <Card mode="shadow" style={{ borderRadius: 20, overflow: "visible", border: isActive ? "1.5px solid rgba(34,197,94,0.35)" : "1.5px solid transparent", transition: "border-color 0.2s" }}>
      <Box style={{ padding: "0 16px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0 13px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            backgroundColor: isActive ? "rgba(34,197,94,0.12)" : "rgba(0,119,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon20ArticleOutline style={{ color: isActive ? "#22c55e" : "#0077FF" }} />
          </div>
          <Text weight="2" normalize style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
            {template.name}
          </Text>
          {isActive && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: 8, padding: "3px 8px", flexShrink: 0,
            }}>
              Активен
            </span>
          )}
          <button
            onClick={() => onDelete(template.id)}
            style={{
              flexShrink: 0, background: "rgba(239,68,68,0.08)", border: "none",
              borderRadius: 9, width: 30, height: 30, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon20DeleteOutline style={{ color: "#ef4444", width: 16, height: 16 }} />
          </button>
        </div>

        <SectionDivider />

        {/* ── Аккаунты ── */}
        <div style={{ padding: "12px 0 14px" }}>
          <SectionLabel>Аккаунты</SectionLabel>
          <PillSelector
            items={accountItems}
            selected={template.selectedAccounts.map(String)}
            onChange={(ids) => onUpdateAccounts(template.id, ids.map(Number))}
            placeholder="Добавить аккаунт"
            searchPlaceholder="Поиск аккаунта…"
          />
        </div>

        <SectionDivider />

        {/* ── Города (гео) ── */}
        <div style={{ padding: "12px 0 14px" }}>
          <SectionLabel>Города (гео)</SectionLabel>
          <PillSelector
            items={cityItems}
            selected={template.selectedCities}
            onChange={(cities) => onUpdateCities(template.id, cities)}
            placeholder="Добавить город"
            searchPlaceholder="Поиск города…"
          />
        </div>

        <SectionDivider />

        {/* ── Варианты объявлений ── */}
        <div style={{ padding: "12px 0 14px" }}>
          {/* Dark section wrapper */}
          <div style={{
            backgroundColor: "#111827",
            borderRadius: 18,
            overflow: "hidden",
            padding: "14px 14px 0",
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text weight="2" normalize style={{ color: "white" }}>Варианты объявлений</Text>
              {/* Toggle pill */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 20, padding: 3,
              }}>
                {(["auto", "manual"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    style={{
                      padding: "5px 13px", border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, letterSpacing: "0.03em",
                      backgroundColor: template.mode === m ? "#4F7EF7" : "transparent",
                      color: template.mode === m ? "white" : "rgba(255,255,255,0.4)",
                      borderRadius: 16,
                      transition: "all 0.15s",
                    }}
                  >
                    {m === "auto" ? "АВТО" : "ВРУЧНУЮ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {template.variants.length === 0 ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 12px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  border: "1.5px dashed rgba(255,255,255,0.12)",
                }}>
                  <Caption level="1" normalize style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
                    Создайте первый вариант объявления
                  </Caption>
                </div>
              ) : (
                template.variants.map((v) =>
                  template.mode === "auto" ? (
                    <VariantAutoRow
                      key={v.id}
                      variant={v}
                      onChangeName={(vid, name) => updateVariantName(vid, name)}
                      onDelete={(vid) => deleteVariant(vid)}
                      showDelete={true}
                    />
                  ) : (
                    <VariantManualRow
                      key={v.id}
                      variant={v}
                      onChangeName={(vid, name) => updateVariantName(vid, name)}
                      onChangeCount={(vid, count) => updateVariantCount(vid, count)}
                      onDelete={(vid) => deleteVariant(vid)}
                      showDelete={true}
                    />
                  )
                )
              )}
            </div>

            {/* + Добавить вариант */}
            <button
              onClick={addVariant}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "none", border: "none", cursor: "pointer",
                color: "#4F7EF7", fontSize: 13, fontWeight: 600,
                padding: "4px 0 12px",
              }}
            >
              <Icon20Add width={16} height={16} />
              Создать обьявление
            </button>

            {/* АВТО: shared count row (after separator) */}
            {template.mode === "auto" && (
              <>
                <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", margin: "0 -14px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 14px" }}>
                  <Caption level="1" normalize style={{ color: "rgba(255,255,255,0.45)" }}>
                    Кол-во публикаций на аккаунт
                  </Caption>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={autoCountStr}
                    onChange={(e) => {
                      setAutoCountStr(e.target.value);
                      const n = parseInt(e.target.value, 10);
                      if (n >= 1 && n <= 500) onUpdateAutoCount(template.id, n);
                    }}
                    onFocus={() => setAutoFocused(true)}
                    onBlur={() => {
                      setAutoFocused(false);
                      const n = parseInt(autoCountStr, 10);
                      if (isNaN(n) || n < 1 || n > 500) setAutoCountStr(String(template.autoCount));
                    }}
                    style={{
                      width: 64, background: "rgba(255,255,255,0.1)",
                      border: `1.5px solid ${autoFocused ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: 10, padding: "6px 10px",
                      fontSize: 15, fontWeight: 700, color: "white",
                      textAlign: "center", outline: "none",
                      appearance: "none", MozAppearance: "textfield",
                    } as React.CSSProperties}
                  />
                </div>
              </>
            )}

            {/* ВРУЧНУЮ: bottom padding */}
            {template.mode === "manual" && (
              <div style={{ height: 2 }} />
            )}
          </div>
        </div>

        <SectionDivider />

        {/* ── Action button ── */}
        <div style={{ padding: "12px 0 14px" }}>
          {isActive ? (
            <Button
              mode="primary"
              appearance="negative"
              size="m"
              stretched
              onClick={() => onDeactivate(template.id)}
              style={{
                borderRadius: 12,
                backgroundColor: "rgba(239,68,68,0.08)",
                color: "#DC2626",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              Деактивировать
            </Button>
          ) : (
            <Button
              mode="primary"
              size="m"
              stretched
              onClick={() => onActivate(template.id)}
              className="avify-cta-btn"
              style={{ borderRadius: 12 }}
            >
              Активировать
            </Button>
          )}
        </div>
      </Box>
    </Card>
  );
}

// ─── Manual Variant Row ────────────────────────────────────
function VariantManualRow({
  variant, onChangeName, onChangeCount, onDelete, showDelete,
}: {
  variant: AdVariant;
  onChangeName: (id: number, name: string) => void;
  onChangeCount: (id: number, count: number) => void;
  onDelete: (id: number) => void;
  showDelete: boolean;
}) {
  const [nameVal, setNameVal] = useState(variant.name);
  const [editingName, setEditingName] = useState(false);
  const [countStr, setCountStr] = useState(String(variant.count));
  const [countFocused, setCountFocused] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#1C2B47",
      borderRadius: 12, padding: "11px 12px",
    }}>
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (nameVal.trim()) onChangeName(variant.id, nameVal.trim());
              else setNameVal(variant.name);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            style={{
              width: "100%", background: "none", border: "none",
              borderBottom: "1.5px solid rgba(255,255,255,0.4)", outline: "none",
              fontSize: 14, fontWeight: 600, color: "white", padding: "2px 0", boxSizing: "border-box",
            }}
          />
        ) : (
          <span
            onClick={() => setEditingName(true)}
            style={{
              fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              display: "block", cursor: "text",
            }}
          >
            {variant.name}
          </span>
        )}
      </div>

      {/* Count */}
      <input
        type="number"
        min={1}
        max={500}
        value={countStr}
        onChange={(e) => {
          setCountStr(e.target.value);
          const n = parseInt(e.target.value, 10);
          if (n >= 1 && n <= 500) onChangeCount(variant.id, n);
        }}
        onFocus={() => setCountFocused(true)}
        onBlur={() => {
          setCountFocused(false);
          const n = parseInt(countStr, 10);
          if (isNaN(n) || n < 1 || n > 500) setCountStr(String(variant.count));
        }}
        style={{
          width: 52, flexShrink: 0,
          background: "rgba(255,255,255,0.1)",
          border: `1.5px solid ${countFocused ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 9, padding: "5px 8px",
          fontSize: 14, fontWeight: 700, color: "white",
          textAlign: "center", outline: "none",
          appearance: "none", MozAppearance: "textfield",
        } as React.CSSProperties}
      />

      {/* Delete */}
      {showDelete && (
        <button
          onClick={() => onDelete(variant.id)}
          style={{
            flexShrink: 0, background: "none", border: "none", cursor: "pointer",
            padding: 2, display: "flex", alignItems: "center", opacity: 0.4,
          }}
        >
          <Icon16Cancel style={{ color: "white" }} />
        </button>
      )}
    </div>
  );
}

// ─── Auto Variant Row (name only) ──────────────────────────
function VariantAutoRow({
  variant, onChangeName, onDelete, showDelete,
}: {
  variant: AdVariant;
  onChangeName: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  showDelete: boolean;
}) {
  const [nameVal, setNameVal] = useState(variant.name);
  const [editingName, setEditingName] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#1C2B47",
      borderRadius: 12, padding: "11px 12px",
    }}>
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (nameVal.trim()) onChangeName(variant.id, nameVal.trim());
              else setNameVal(variant.name);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            style={{
              width: "100%", background: "none", border: "none",
              borderBottom: "1.5px solid rgba(255,255,255,0.4)", outline: "none",
              fontSize: 14, fontWeight: 600, color: "white", padding: "2px 0", boxSizing: "border-box",
            }}
          />
        ) : (
          <span
            onClick={() => setEditingName(true)}
            style={{
              fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              display: "block", cursor: "text",
            }}
          >
            {variant.name}
          </span>
        )}
      </div>
      {/* Delete */}
      {showDelete && (
        <button
          onClick={() => onDelete(variant.id)}
          style={{
            flexShrink: 0, background: "none", border: "none", cursor: "pointer",
            padding: 2, display: "flex", alignItems: "center", opacity: 0.4,
          }}
        >
          <Icon16Cancel style={{ color: "white" }} />
        </button>
      )}
    </div>
  );
}

// ─── Empty Templates ───────────────────────────────────────
function EmptyTemplates({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 16px 20px", textAlign: "center" }}>
      <div style={{
        width: 54, height: 54, borderRadius: 16,
        backgroundColor: "rgba(0,119,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="#0077FF" strokeWidth="1.6" />
          <path d="M7 9H17M7 13H13" stroke="#0077FF" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="19" cy="19" r="4" fill="#0077FF" />
          <path d="M19 17V21M17 19H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <Text weight="2" normalize style={{ display: "block", marginBottom: 6 }}>Шаблонов пока нет</Text>
        <Caption level="1" normalize style={{ color: "#818C99", lineHeight: 1.55, display: "block" }}>
          Создайте шаблон — AI‑агент запишет ваши действия и будет автоматически публиковать объявления.
        </Caption>
      </div>
      <Button
        mode="primary" size="l" before={<Icon20Add />}
        onClick={onCreate}
        className="avify-cta-btn"
        style={{ borderRadius: 14 }}
      >
        Создать шаблон
      </Button>
    </div>
  );
}


// ─── Main WorkTab Component ────────────────────────────────
interface WorkTabProps {
  addTask: (task: Omit<LiveTask, "id">) => void;
  liveTasks: LiveTask[];
}

export function WorkTab({ addTask, liveTasks }: WorkTabProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Задача создана ✓");
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  const [activeTemplateIds, setActiveTemplateIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const activeInTasks = new Set(
      liveTasks.filter((t) => t.templateId !== undefined).map((t) => t.templateId as number)
    );
    setActiveTemplateIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const tid of prev) {
        if (!activeInTasks.has(tid)) { next.delete(tid); changed = true; }
      }
      return changed ? next : prev;
    });
  }, [liveTasks]);

  const showToast = (msg: string) => { setToastMessage(msg); setToastVisible(true); };

  const handleCreateTemplate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
    const newTpl: Template = {
      id: Date.now(),
      name: `Новый шаблон #${templates.length + 1}`,
      createdAt: formatted,
      selectedAccounts: [],
      selectedCities: [],
      mode: "auto",
      autoCount: 10,
      variants: [],
    };
    setTemplates((prev) => [newTpl, ...prev]);
    showToast("Шаблон создан ✓");
  };

  const handleActivate = (id: number) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    if (tpl.selectedAccounts.length === 0) { showToast("Выберите хотя бы один аккаунт"); return; }
    if (tpl.selectedCities.length === 0) { showToast("Добавьте хотя бы один город"); return; }
    const brandNames = accountsList.filter((a) => tpl.selectedAccounts.includes(a.id)).map((a) => a.name).join(", ");
    const totalCount = tpl.mode === "auto"
      ? tpl.autoCount
      : tpl.variants.reduce((s, v) => s + v.count, 0);
    addTask({ brand: brandNames, task: tpl.name, pct: 0, count: totalCount, done: 0, templateId: id });
    setActiveTemplateIds((prev) => new Set([...prev, id]));
    showToast(`Задача «${tpl.name}» добавлена в менеджер задач ✓`);
  };

  const handleDeactivate = (id: number) => {
    setActiveTemplateIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    showToast("Шаблон деактивирован");
  };

  const handleDelete = (id: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast("Шаблон удалён");
  };

  const handleUpdateAccounts = (id: number, accounts: number[]) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, selectedAccounts: accounts } : t));

  const handleUpdateCities = (id: number, cities: string[]) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, selectedCities: cities } : t));

  const handleUpdateMode = (id: number, mode: "auto" | "manual") =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, mode } : t));

  const handleUpdateAutoCount = (id: number, count: number) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, autoCount: count } : t));

  const handleUpdateVariants = (id: number, variants: AdVariant[]) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, variants } : t));

  const templateCount = templates.length;
  const pluralTemplate = templateCount === 1 ? "шаблон" : templateCount < 5 ? "шаблона" : "шаблонов";

  return (
    <>
      <Toast message={toastMessage} visible={toastVisible} onDone={() => setToastVisible(false)} type="success" duration={3500} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px 40px" }}>

        {/* ── Header card: Шаблоны + Создать (отдельная карточка) ── */}
        <Card mode="shadow" style={{ borderRadius: 20 }}>
          <Box style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, backgroundColor: "#EEF4FF",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon20ArticleOutline style={{ color: "#0077FF" }} />
                </div>
                <div>
                  <Title level="3" weight="2" normalize>Шаблоны</Title>
                  {templateCount > 0 && (
                    <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 1 }}>
                      {templateCount} {pluralTemplate}
                    </Caption>
                  )}
                </div>
              </div>
              <Button
                mode="primary"
                size="s"
                before={<Icon20Add />}
                onClick={handleCreateTemplate}
                className="avify-cta-btn"
                style={{ borderRadius: 10 }}
              >
                Создать
              </Button>
            </div>
          </Box>
        </Card>

        {/* ── Template list (каждый шаблон — отдельная карточка) ── */}
        {templateCount === 0 ? (
          <Card mode="shadow" style={{ borderRadius: 20 }}>
            <EmptyTemplates onCreate={handleCreateTemplate} />
          </Card>
        ) : (
          templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              isActive={activeTemplateIds.has(tpl.id)}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onDelete={handleDelete}
              onUpdateAccounts={handleUpdateAccounts}
              onUpdateCities={handleUpdateCities}
              onUpdateMode={handleUpdateMode}
              onUpdateAutoCount={handleUpdateAutoCount}
              onUpdateVariants={handleUpdateVariants}
            />
          ))
        )}


      </div>
    </>
  );
}