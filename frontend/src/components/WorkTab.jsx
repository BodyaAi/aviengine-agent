
import { useState, useRef, useEffect } from "react";
import {
  Card,
  Div,
  Button,
  Title,
  Text,
  Caption,
  Input,
  FormField,
  Separator,
  Header,
} from "@vkontakte/vkui";
import {
  Icon20Add,
  Icon20DeleteOutline,
  Icon20ArticleOutline,
  Icon16Cancel,
} from "@vkontakte/icons";
import Toast from "./ui/Toast";

const TAG_BLUE = {
  display: "inline-flex", alignItems: "center", gap: 4,
  backgroundColor: "var(--vkui--color_background_accent_themed, rgba(0,119,255,0.12))",
  border: "1px solid var(--vkui--color_background_accent_themed, rgba(0,119,255,0.22))",
  borderRadius: 20, padding: "4px 10px 4px 12px",
  fontSize: 13, fontWeight: 500, color: "var(--vkui--color_accent_blue)",
  whiteSpace: "nowrap",
};

function PillSelector({
  items, selected, onChange, placeholder, searchPlaceholder,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(""); }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (id) =>
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
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--vkui--color_accent_blue)", opacity: 0.65 }}
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
                  backgroundColor: "var(--vkui--color_background_accent_themed, rgba(0,119,255,0.07))",
                  border: "1px solid var(--vkui--color_background_accent_themed, rgba(0,119,255,0.18))",
                  borderRadius: 20, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, color: "var(--vkui--color_accent_blue)", cursor: "pointer",
                }}
              >
                +{extra}
              </span>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--vkui--color_accent_blue)", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 2, padding: "4px 2px",
              }}
            >
              {open ? "Скрыть" : "Изменить"}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="var(--vkui--color_accent_blue)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60,
          background: "var(--vkui--color_background, white)",
          borderRadius: 16, boxShadow: "0 10px 36px rgba(0,0,0,0.13)",
          border: "1px solid var(--vkui--color_separator_primary, #f0f0f5)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--vkui--color_separator_primary)" }}>
            <FormField>
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </FormField>
          </div>
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
                      backgroundColor: "var(--vkui--color_accent_blue)", borderRadius: 20,
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

function SectionLabel({ children }) {
  return <Header mode="secondary">{children}</Header>;
}

function SectionDivider() {
  return <Separator />;
}

function TemplateCard({
  template, isActive, onActivate, onDeactivate, onDelete,
  onUpdateAccounts, onUpdateCities, onUpdateMode, onUpdateAutoCount, onUpdateVariants,
  accountItems, cityItems,
}) {
  const [autoCountStr, setAutoCountStr] = useState(String(template.autoCount));
  const [autoFocused, setAutoFocused] = useState(false);

  const addVariant = () => {
    const next = { id: Date.now(), name: `Вариант ${template.variants.length + 1}`, count: 10 };
    onUpdateVariants(template.id, [...template.variants, next]);
  };

  const updateVariantName = (vid, name) =>
    onUpdateVariants(template.id, template.variants.map((v) => v.id === vid ? { ...v, name } : v));

  const updateVariantCount = (vid, count) =>
    onUpdateVariants(template.id, template.variants.map((v) => v.id === vid ? { ...v, count } : v));

  const deleteVariant = (vid) => {
    onUpdateVariants(template.id, template.variants.filter((v) => v.id !== vid));
  };

  const switchMode = (m) => {
    onUpdateMode(template.id, m);
    if (m === "auto") {
      onUpdateVariants(template.id, [{ id: Date.now(), name: "Базовый", count: template.autoCount }]);
    }
  };

  return (
    <Card mode="shadow" style={{ borderRadius: 20, overflow: "visible", border: isActive ? "1.5px solid rgba(34,197,94,0.35)" : "1.5px solid transparent", transition: "border-color 0.2s" }}>
      <Div style={{ padding: "0 16px" }}>
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

        <div style={{ padding: "12px 0 14px" }}>
          <div style={{
            backgroundColor: "#111827",
            borderRadius: 18,
            overflow: "hidden",
            padding: "14px 14px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text weight="2" normalize style={{ color: "white" }}>Варианты объявлений</Text>
              <div style={{
                display: "inline-flex", alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 20, padding: 3,
              }}>
                {["auto", "manual"].map((m) => (
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

            {template.mode === "auto" && (
              <>
                <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", margin: "0 -14px" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 14px" }}>
                  <Caption level="1" normalize style={{ color: "rgba(255,255,255,0.45)" }}>
                    Кол-во публикаций на аккаунт
                  </Caption>
                  <FormField style={{ width: 64 }}>
                    <Input
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
                    />
                  </FormField>
                </div>
              </>
            )}

            {template.mode === "manual" && (
              <div style={{ height: 2 }} />
            )}
          </div>
        </div>

        <SectionDivider />

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
      </Div>
    </Card>
  );
}

function VariantManualRow({
  variant, onChangeName, onChangeCount, onDelete, showDelete,
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
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <FormField>
            <Input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => {
                setEditingName(false);
                if (nameVal.trim()) onChangeName(variant.id, nameVal.trim());
                else setNameVal(variant.name);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
            />
          </FormField>
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

      <FormField style={{ width: 52, flexShrink: 0 }}>
        <Input
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
        />
      </FormField>

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

function VariantAutoRow({
  variant, onChangeName, onDelete, showDelete,
}) {
  const [nameVal, setNameVal] = useState(variant.name);
  const [editingName, setEditingName] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#1C2B47",
      borderRadius: 12, padding: "11px 12px",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editingName ? (
          <FormField>
            <Input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => {
                setEditingName(false);
                if (nameVal.trim()) onChangeName(variant.id, nameVal.trim());
                else setNameVal(variant.name);
              }}
              onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
            />
          </FormField>
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

function EmptyTemplates({ onCreate }) {
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

export function WorkTab({ addTask, liveTasks, accounts = [], cities = [], initialTemplates = [] }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Задача создана ✓");
  const [templates, setTemplates] = useState(initialTemplates);
  const [activeTemplateIds, setActiveTemplateIds] = useState(new Set());

  useEffect(() => {
    const activeInTasks = new Set(
      liveTasks.filter((t) => t.templateId !== undefined).map((t) => t.templateId)
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

  const showToast = (msg) => { setToastMessage(msg); setToastVisible(true); };

  const handleCreateTemplate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
    const newTpl = {
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

  const handleActivate = (id) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    if (tpl.selectedAccounts.length === 0) { showToast("Выберите хотя бы один аккаунт"); return; }
    if (tpl.selectedCities.length === 0) { showToast("Добавьте хотя бы один город"); return; }
    const brandNames = accounts.filter((a) => tpl.selectedAccounts.includes(a.id)).map((a) => a.name).join(", ");
    const totalCount = tpl.mode === "auto"
      ? tpl.autoCount
      : tpl.variants.reduce((s, v) => s + v.count, 0);
    addTask({ brand: brandNames, task: tpl.name, pct: 0, count: totalCount, done: 0, templateId: id });
    setActiveTemplateIds((prev) => new Set([...prev, id]));
    showToast(`Задача «${tpl.name}» добавлена в менеджер задач ✓`);
  };

  const handleDeactivate = (id) => {
    setActiveTemplateIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    showToast("Шаблон деактивирован");
  };

  const handleDelete = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast("Шаблон удалён");
  };

  const handleUpdateAccounts = (id, accs) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, selectedAccounts: accs } : t));

  const handleUpdateCities = (id, cts) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, selectedCities: cts } : t));

  const handleUpdateMode = (id, mode) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, mode } : t));

  const handleUpdateAutoCount = (id, count) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, autoCount: count } : t));

  const handleUpdateVariants = (id, variants) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, variants } : t));

  const templateCount = templates.length;
  const pluralTemplate = templateCount === 1 ? "шаблон" : templateCount < 5 ? "шаблона" : "шаблонов";

  const accountItems = accounts.map((a) => ({
    id: String(a.id),
    label: a.name,
    sublabel: a.email,
  }));
  const cityItems = cities.map((c) => ({ id: c, label: c }));

  return (
    <>
      <Toast message={toastMessage} visible={toastVisible} onDone={() => setToastVisible(false)} type="success" duration={3500} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px 40px" }}>
        <Card mode="shadow" style={{ borderRadius: 20 }}>
          <Div style={{ padding: "14px 16px" }}>
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
          </Div>
        </Card>

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
              accountItems={accountItems}
              cityItems={cityItems}
            />
          ))
        )}
      </div>
    </>
  );
}

