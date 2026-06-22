"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle, CheckCircle2, Clock, FileText, Image as ImageIcon,
  Plus, RefreshCw, Search, Trash2, Upload, X, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import type { Account, Listing } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

// --- Local types ---

type TextAction = "ai_text" | "custom_text" | "refresh" | null;
type PhotoAction = "ai_photos" | "upload_photos" | null;

type TextTemplate = { id: number; title: string; description: string };
type PhotoTemplate = { id: number; mainPhoto: string | null; otherPhotos: string[] };

type UpdatesTabProps = {
  listings: Listing[];
  accounts: Account[];
  selectedListings: number;
  toggleListing: (id: number) => void;
  toggleAllListings: () => void;
  selectedAccountIds: number[];
  setSelectedAccountIds: (ids: number[]) => void;
  applyUpdateAction: (customTitle?: string) => void;
};

export function UpdatesTab(props: UpdatesTabProps) {
  const {
    listings, accounts, toggleListing, toggleAllListings,
    selectedAccountIds, setSelectedAccountIds,
    applyUpdateAction,
  } = props;

  // ── Local state for the new panel structure ──

  // Text panel
  const [textEnabled, setTextEnabled] = useState(true);
  const [textTab, setTextTab] = useState<"ai" | "custom">("ai");
  const [aiTextMode, setAiTextMode] = useState<"both" | "title" | "description">("both");
  const [textTemplates, setTextTemplates] = useState<TextTemplate[]>([]);

  // Photo panel
  const [photoEnabled, setPhotoEnabled] = useState(false);
  const [photoTemplates, setPhotoTemplates] = useState<PhotoTemplate[]>([]);

  // Derive effective actions from local panel state
  const textAction: TextAction = textEnabled
    ? textTab === "ai" ? "ai_text" : "custom_text"
    : null;
  const photoAction: PhotoAction = photoEnabled ? "upload_photos" : null;

  // ── Toast ──
  const { toast } = useToast();

  // ── Existing UI state ──

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Listing["status"]>("all");

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesAccount = selectedAccountIds.length === 0 || selectedAccountIds.includes(item.accountId);
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesAccount && matchesQuery && matchesStatus;
    });
  }, [listings, selectedAccountIds, query, statusFilter]);

  const selectedCount = filteredListings.filter(l => l.selected).length;

  // ── Status counts for filter buttons ──

  const statusCounts = useMemo(() => {
    const base = listings.filter(item =>
      (selectedAccountIds.length === 0 || selectedAccountIds.includes(item.accountId)) &&
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    return {
      all: base.length,
      idle: base.filter(l => l.status === "idle").length,
      updating: base.filter(l => l.status === "updating" || l.status === "queued").length,
      error: base.filter(l => l.status === "error").length,
    };
  }, [listings, selectedAccountIds, query]);

  // ── Template helpers ──

  const addTextTemplate = () =>
    setTextTemplates(prev => [...prev, { id: Date.now(), title: "", description: "" }]);

  const updateTextTemplate = (id: number, field: keyof TextTemplate, value: string) =>
    setTextTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

  const removeTextTemplate = (id: number) =>
    setTextTemplates(prev => prev.filter(t => t.id !== id));

  const addPhotoTemplate = () =>
    setPhotoTemplates(prev => [...prev, { id: Date.now(), mainPhoto: null, otherPhotos: [] }]);

  const updatePhotoTemplate = (id: number, field: keyof PhotoTemplate, value: string | string[] | null) =>
    setPhotoTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

  const removePhotoTemplate = (id: number) =>
    setPhotoTemplates(prev => prev.filter(t => t.id !== id));

  /** Remove a single "other photo" by index */
  const removeOtherPhoto = (templateId: number, index: number) =>
    setPhotoTemplates(prev => prev.map(t =>
      t.id === templateId
        ? { ...t, otherPhotos: t.otherPhotos.filter((_, i) => i !== index) }
        : t
    ));

  // ── Action handler ──

  const handleApply = () => {
    if (selectedCount === 0) return;

    // Build task title based on selected actions
    let title = "Обновление";
    if (textAction && photoAction) {
      title = "Обновление текста и фото";
    } else if (textAction) {
      title = "Обновление текста";
    } else if (photoAction) {
      title = "Обновление фото";
    }

    applyUpdateAction(`${title} (${selectedCount} шт.)`);

    // Show system toast
    toast({
      title: "Задача добавлена в Менеджер задач",
      description: `${title} — ${selectedCount} шт.`,
      variant: "success",
    });
  };

  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновления" />

      {/* ── Account selector (multi-select chips) ── */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-500">
          Аккаунт
        </label>
        <div className="flex flex-wrap gap-2">
          <AccountChip
            label="Все аккаунты"
            active={selectedAccountIds.length === 0}
            onClick={() => setSelectedAccountIds([])}
          />
          {accounts.map(acc => (
            <AccountChip
              key={acc.id}
              label={acc.name}
              active={selectedAccountIds.includes(acc.id)}
              onClick={() => {
                setSelectedAccountIds(prev =>
                  prev.includes(acc.id)
                    ? prev.filter(id => id !== acc.id)
                    : [...prev, acc.id]
                );
              }}
            />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* ── Action settings: Text & Photo panels ──  */}
      {/* ════════════════════════════════════════════ */}
      <div className="space-y-4 border-b border-primary-900/10 bg-white/46 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
          Настройка действий
        </p>

        {/* ══════════ TEXT PANEL ══════════ */}
        <div className="rounded-2xl border border-primary-900/10 bg-white/70 overflow-hidden">
          {/* Header with toggle */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-800">
              <FileText className="h-4 w-4 text-primary-600" />
              Текст
            </div>
            <Toggle checked={textEnabled} onChange={setTextEnabled} />
          </div>

          {/* Content (visible when enabled) */}
          {textEnabled && (
            <div className="border-t border-primary-900/8 px-4 pb-4 pt-3">
              {/* Tabs */}
              <div className="mb-4 inline-flex rounded-xl bg-ink-100 p-1">
                <TabButton
                  active={textTab === "ai"}
                  onClick={() => setTextTab("ai")}
                >
                  AI Переработка
                </TabButton>
                <TabButton
                  active={textTab === "custom"}
                  onClick={() => setTextTab("custom")}
                >
                  Свой контент
                </TabButton>
              </div>

              {/* ── AI Переработка mode ── */}
              {textTab === "ai" && (
                <div className="space-y-2.5">
                  <RadioOption
                    checked={aiTextMode === "both"}
                    onChange={() => setAiTextMode("both")}
                    label="Обновить название и описание"
                  />
                  <RadioOption
                    checked={aiTextMode === "title"}
                    onChange={() => setAiTextMode("title")}
                    label="Обновить название"
                  />
                  <RadioOption
                    checked={aiTextMode === "description"}
                    onChange={() => setAiTextMode("description")}
                    label="Обновить описание"
                  />
                </div>
              )}

              {/* ── Свой контент mode ── */}
              {textTab === "custom" && (
                <div className="space-y-3">
                  <Button
                    size="sm"
                    onClick={addTextTemplate}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4" />
                    Создать шаблон
                  </Button>

                  {textTemplates.map((tpl, idx) => (
                    <div
                      key={tpl.id}
                      className="rounded-xl border border-primary-900/10 bg-white p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
                          Шаблон {idx + 1}
                        </span>
                        <button
                          onClick={() => removeTextTemplate(tpl.id)}
                          className="rounded-lg p-1 text-ink-400 transition hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Заголовок */}
                      <div className="mb-2">
                        <label className="mb-1 block text-xs font-semibold text-ink-600">
                          Заголовок
                        </label>
                        <input
                          value={tpl.title}
                          onChange={e => updateTextTemplate(tpl.id, "title", e.target.value)}
                          placeholder="Введите заголовок…"
                          className="h-10 w-full rounded-xl border border-primary-900/10 bg-ink-50 px-3 text-sm text-ink-900 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>

                      {/* Описание */}
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-ink-600">
                          Описание
                        </label>
                        <textarea
                          value={tpl.description}
                          onChange={e => updateTextTemplate(tpl.id, "description", e.target.value)}
                          placeholder="Введите описание…"
                          rows={3}
                          className="w-full resize-none rounded-xl border border-primary-900/10 bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>
                    </div>
                  ))}

                  {textTemplates.length === 0 && (
                    <p className="rounded-xl border border-dashed border-primary-200 bg-primary-50/40 px-3 py-4 text-center text-xs text-ink-400">
                      Нет шаблонов. Нажмите «Создать шаблон» чтобы добавить.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══════════ PHOTO PANEL ══════════ */}
        <div className="rounded-2xl border border-primary-900/10 bg-white/70 overflow-hidden">
          {/* Header with toggle */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-800">
              <ImageIcon className="h-4 w-4 text-primary-600" />
              Фото
            </div>
            <Toggle checked={photoEnabled} onChange={setPhotoEnabled} />
          </div>

          {/* Content (visible when enabled) */}
          {photoEnabled && (
            <div className="border-t border-primary-900/8 px-4 pb-4 pt-3">
              <div className="space-y-3">
                <Button
                  size="sm"
                  onClick={addPhotoTemplate}
                  className="rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Создать шаблон
                </Button>

                {photoTemplates.map((tpl, idx) => (
                  <div
                    key={tpl.id}
                    className="rounded-xl border border-primary-900/10 bg-white p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-ink-500">
                        Шаблон {idx + 1}
                      </span>
                      <button
                        onClick={() => removePhotoTemplate(tpl.id)}
                        className="rounded-lg p-1 text-ink-400 transition hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Главное фото */}
                    <div className="mb-3">
                      <label className="mb-1.5 block text-xs font-semibold text-ink-600">
                        Главное фото
                      </label>
                      <Dropzone
                        label="Главное фото"
                        photo={tpl.mainPhoto}
                        maxReached={(tpl.mainPhoto ? 1 : 0) >= 1}
                        onUploadSingle={fileName => updatePhotoTemplate(tpl.id, "mainPhoto", fileName)}
                        onRemoveMain={() => updatePhotoTemplate(tpl.id, "mainPhoto", null)}
                      />
                    </div>

                    {/* Остальные фото */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-ink-600">
                        Остальные фото {tpl.otherPhotos.length > 0 && (
                          <span className="text-ink-400">({tpl.otherPhotos.length}/9)</span>
                        )}
                      </label>
                      <Dropzone
                        label="Остальные фото"
                        multiple
                        photos={tpl.otherPhotos}
                        maxReached={1 + tpl.otherPhotos.length >= 10}
                        onUploadMultiple={fileNames => updatePhotoTemplate(tpl.id, "otherPhotos", [...tpl.otherPhotos, ...fileNames])}
                        onRemoveOther={idx => removeOtherPhoto(tpl.id, idx)}
                      />
                    </div>
                  </div>
                ))}

                {photoTemplates.length === 0 && (
                  <p className="rounded-xl border border-dashed border-primary-200 bg-primary-50/40 px-3 py-4 text-center text-xs text-ink-400">
                    Нет шаблонов. Нажмите «Создать шаблон» чтобы добавить.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Action bar (separate panel) ── */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary-900/10 bg-white/70 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAllListings}
              className="text-sm font-bold text-primary-700 transition hover:text-primary-900"
            >
              {selectedCount === filteredListings.length && filteredListings.length > 0
                ? "Снять выбор"
                : "Выбрать все"}
            </button>
            <span className="text-sm text-ink-600">
              Выбрано {selectedCount} из {filteredListings.length}
            </span>
          </div>
          <button
            onClick={handleApply}
            disabled={selectedCount === 0}
            className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-10 py-3 text-sm font-black text-white shadow-lg transition-all duration-200 hover:from-primary-700 hover:to-primary-800 active:translate-y-[2px] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Обновить
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
          <Input
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="h-10 rounded-2xl border-primary-900/10 bg-white/90 pl-9 text-ink-900 shadow-sm placeholder:text-ink-400"
            placeholder="Поиск по объявлениям"
          />
        </div>
      </div>

      {/* ── Status filter (horizontal blocks) ── */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusChip
            label="Все"
            count={statusCounts.all}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatusChip
            label="Готово"
            count={statusCounts.idle}
            active={statusFilter === "idle"}
            onClick={() => setStatusFilter("idle")}
            variant="success"
          />
          <StatusChip
            label="Обновляется"
            count={statusCounts.updating}
            active={statusFilter === "updating"}
            onClick={() => setStatusFilter("updating")}
            variant="blue"
          />
          <StatusChip
            label="Ошибка"
            count={statusCounts.error}
            active={statusFilter === "error"}
            onClick={() => setStatusFilter("error")}
            variant="danger"
          />
        </div>
      </div>

      {/* ── Listings grid ── */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map(item => (
          <ListingCard
            key={item.id}
            item={item}
            onToggle={() => toggleListing(item.id)}
            textAction={item.selected ? textAction : null}
            photoAction={item.selected ? photoAction : null}
          />
        ))}
        {filteredListings.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-primary-300 bg-primary-50 p-10 text-center text-ink-500">
            Нет объявлений
          </div>
        )}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════
// ── Local UI components ──
// ══════════════════════════════════════════════

/** Account selector chip (like PublicationTab) */
function AccountChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
        active
          ? "border-primary-300 bg-primary-600 text-white shadow-sm"
          : "border-primary-900/10 bg-white text-primary-700 hover:bg-primary-50"
      }`}
    >
      {label}
    </button>
  );
}

/** Status filter chip */
function StatusChip({
  label,
  count,
  active,
  onClick,
  variant = "default",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  variant?: "default" | "success" | "blue" | "danger";
}) {
  const activeColor =
    variant === "success" ? "bg-success text-white border-success"
    : variant === "blue" ? "bg-primary-600 text-white border-primary-600"
    : variant === "danger" ? "bg-danger text-white border-danger"
    : "bg-primary-600 text-white border-primary-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-200 ${
        active ? activeColor : "border-primary-900/10 bg-white text-ink-600 hover:bg-primary-50"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-xs ${
        active ? "bg-white/25" : "bg-primary-50 text-primary-700"
      }`}>
        {count}
      </span>
    </button>
  );
}

/** Animated toggle switch */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-primary-600" : "bg-ink-300"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
        style={{ height: "1.125rem", width: "1.125rem" }}
      />
    </button>
  );
}

/** Pill-style tab button */
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
        active
          ? "bg-white text-primary-700 shadow-sm"
          : "text-ink-500 hover:text-ink-700"
      }`}
    >
      {children}
    </button>
  );
}

/** Radio option */
function RadioOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary-600"
      />
      <span className={checked ? "font-semibold text-ink-800" : "text-ink-600"}>
        {label}
      </span>
    </label>
  );
}

/** Image upload dropzone with thumbnail grid */
function Dropzone({
  label,
  photo,
  photos,
  multiple,
  maxReached,
  onUploadSingle,
  onUploadMultiple,
  onRemoveMain,
  onRemoveOther,
}: {
  label: string;
  photo?: string | null;
  photos?: string[];
  multiple?: boolean;
  maxReached?: boolean;
  onUploadSingle?: (value: string) => void;
  onUploadMultiple?: (value: string[]) => void;
  onRemoveMain?: () => void;
  onRemoveOther?: (index: number) => void;
}) {
  const photoList = photos ?? [];

  return (
    <div className="space-y-2">
      {/* ── Thumbnail grid ── */}
      {multiple ? (
        photoList.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {photoList.map((p, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-lg border border-primary-900/10 bg-ink-50"
              >
                <img
                  src={p}
                  alt={`Фото ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveOther?.(i)}
                  className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        photo && (
          <div className="group relative aspect-[16/7] overflow-hidden rounded-lg border border-primary-900/10 bg-ink-50">
            <img
              src={photo}
              alt="Главное фото"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveMain?.()}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-danger"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      )}

      {/* ── Upload button / placeholder ── */}
      {!maxReached && (
        <label className="block cursor-pointer">
          <div className="grid place-items-center rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 px-4 py-5 text-center transition hover:border-primary-400 hover:bg-primary-50/60">
            <Upload className="mb-1.5 h-6 w-6 text-primary-400" />
            <p className="text-xs font-semibold text-ink-600">
              {multiple && photoList.length > 0
                ? "Добавить ещё"
                : `${label} (Загрузить)`}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={e => {
              const files = Array.from(e.target.files || []).map(f => URL.createObjectURL(f));
              if (multiple) {
                onUploadMultiple?.(files);
              } else {
                onUploadSingle?.(files[0] ?? "");
              }
            }}
          />
        </label>
      )}

      {/* ── Counter / limit hint ── */}
      {multiple && (
        <p className="text-xs text-ink-400">
          {photoList.length}/9 фото
          {maxReached && " · достигнут лимит (10 с главным)"}
        </p>
      )}
    </div>
  );
}

/** Listing status → badge mapping */
const statusView: Record<
  Listing["status"],
  { text: string; variant: "default" | "blue" | "warning" | "danger" | "success"; icon: LucideIcon }
> = {
  idle: { text: "Готово", variant: "success", icon: CheckCircle2 },
  queued: { text: "В очереди", variant: "warning", icon: Clock },
  updating: { text: "Обновляется", variant: "blue", icon: RefreshCw },
  done: { text: "Готово", variant: "success", icon: CheckCircle2 },
  error: { text: "Ошибка", variant: "danger", icon: AlertCircle },
};

/** Listing card */
function ListingCard({
  item,
  onToggle,
  textAction,
  photoAction,
}: {
  item: Listing;
  onToggle: () => void;
  textAction: TextAction;
  photoAction: PhotoAction;
}) {
  const view = statusView[item.status];
  const Icon = view.icon;
  const showActions = item.selected && (textAction || photoAction);

  return (
    <div
      className={`rounded-3xl border p-4 shadow-[0_18px_48px_rgba(20,85,255,.10)] transition ${
        item.selected
          ? "border-primary-300 bg-primary-50"
          : "border-primary-900/10 bg-white/92"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <Checkbox checked={item.selected} onCheckedChange={onToggle} />
        <Badge variant={view.variant}>
          <Icon className="h-3 w-3" /> {view.text}
        </Badge>
      </div>

      {/* Image / placeholder */}
      <div className="mb-3 grid h-32 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-white to-cyan/20">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl font-black text-primary-200">
            {item.title.slice(0, 1)}
          </span>
        )}
      </div>

      <h3 className="mb-2 line-clamp-2 text-sm font-bold">{item.title}</h3>
      <div className="mb-2 text-lg font-black">
        {item.price.toLocaleString("ru-RU")} ₽
      </div>
      <div className="mb-1 text-xs text-ink-500">№ {item.avitoId}</div>
      <div className="mb-1 text-xs text-ink-500">Обновлён: {item.updated}</div>
      <div className="text-xs text-ink-500">{item.nextUpdate}</div>

      {/* Action indicators */}
      {showActions && (
        <div className="mt-3 flex gap-2">
          {textAction && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
              ✎ {textAction === "ai_text" ? "AI текст" : "Свой текст"}
            </span>
          )}
          {photoAction && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cyan/15 px-2 py-1 text-xs font-semibold text-cyan-700">
              📸 Загрузка фото
            </span>
          )}
        </div>
      )}

      {item.error && (
        <div className="mt-3 rounded-xl bg-danger/10 p-2 text-xs text-danger">
          {item.error}
        </div>
      )}
    </div>
  );
}




