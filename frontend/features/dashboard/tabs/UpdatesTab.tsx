"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle, CheckCircle2, ChevronDown, Clock, FileText, Image as ImageIcon,
  RefreshCw, Search, Upload, X, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Account, Listing, PhotoMode, UpdateAction } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

// --- Local types for the two independent action categories ---

type TextAction = "ai_text" | "custom_text" | "refresh" | null;
type PhotoAction = "ai_photos" | "upload_photos" | null;

type UpdatesTabProps = {
  listings: Listing[];
  accounts: Account[];
  selectedListings: number;
  toggleListing: (id: number) => void;
  toggleAllListings: () => void;
  updateSelectedListings: () => void;
  updateListingNow: (id: number) => void;
  selectedAccountId: number | null;
  setSelectedAccountId: (id: number | null) => void;
  updateAction: UpdateAction;
  setUpdateAction: (action: UpdateAction) => void;
  photoMode: PhotoMode;
  setPhotoMode: (mode: PhotoMode) => void;
  uploadedPhotos: string[];
  setUploadedPhotos: (photos: string[]) => void;
  customVariants: string[];
  setCustomVariants: (variants: string[]) => void;
  applyUpdateAction: () => void;
};

export function UpdatesTab(props: UpdatesTabProps) {
  const {
    listings, accounts, toggleListing, toggleAllListings,
    selectedAccountId, setSelectedAccountId,
    updateAction, setUpdateAction,
    photoMode, setPhotoMode,
    uploadedPhotos, setUploadedPhotos,
    customVariants, setCustomVariants,
    applyUpdateAction,
  } = props;

  // Derive independent text/photo actions from existing props
  const textAction: TextAction =
    updateAction === "ai_photos" || updateAction === "upload_photos" ? null : updateAction;
  const photoAction: PhotoAction =
    updateAction === "ai_photos" ? "ai_photos"
    : updateAction === "upload_photos" ? "upload_photos"
    : photoMode === "viktor_unique" ? "ai_photos"
    : null;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Listing["status"]>("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesAccount = !selectedAccountId || item.accountId === selectedAccountId;
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || item.status === status;
      return matchesAccount && matchesQuery && matchesStatus;
    });
  }, [listings, selectedAccountId, query, status]);

  const selectedCount = filteredListings.filter(l => l.selected).length;

  // --- Action handlers ---

  const handleTextActionChange = (action: TextAction) => {
    if (action === null) {
      if (photoAction) {
        setUpdateAction(photoAction);
      } else {
        setUpdateAction("refresh");
      }
    } else {
      setUpdateAction(action);
    }
  };

  const handlePhotoActionChange = (action: PhotoAction) => {
    if (action === null) {
      setPhotoMode("shuffle");
    } else if (action === "ai_photos") {
      if (textAction) {
        setUpdateAction(textAction);
      } else {
        setUpdateAction("ai_photos");
      }
      setPhotoMode("viktor_unique");
    } else if (action === "upload_photos") {
      if (textAction) {
        setUpdateAction(textAction);
      } else {
        setUpdateAction("upload_photos");
      }
      setPhotoMode("shuffle");
    }
  };

  const handleApply = () => {
    if (selectedCount === 0) return;
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    applyUpdateAction();
  };

  // --- Summary for bottom bar ---

  const textActionCount = filteredListings.filter(l => l.selected && textAction && textAction !== "refresh").length;
  const photoActionCount = filteredListings.filter(l => l.selected && photoAction !== null).length;

  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновления" />
      
      {/* Account selector */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-500">
          Аккаунт
        </label>
        <div className="relative">
          <select
            value={selectedAccountId ?? ""}
            onChange={e => setSelectedAccountId(e.target.value ? Number(e.target.value) : null)}
            className="h-10 w-full appearance-none rounded-2xl border border-primary-900/10 bg-white px-4 pr-9 text-sm font-semibold text-ink-700 shadow-sm outline-none ring-primary-300 transition focus:ring-2"
          >
            <option value="">Все аккаунты</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-primary-700" />
        </div>
      </div>

      {/* ── Action settings: two independent panels ── */}
      <div className="space-y-4 border-b border-primary-900/10 bg-white/46 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
          Настройка действий
        </p>

        {/* ── Text panel ── */}
        <div className="rounded-2xl border border-primary-900/10 bg-white/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-700">
            <FileText className="h-4 w-4" />
            Текст
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <RadioOption
              checked={textAction === "ai_text"}
              onChange={() => handleTextActionChange("ai_text")}
              label="AI уникализация"
            />
            <RadioOption
              checked={textAction === "custom_text"}
              onChange={() => handleTextActionChange("custom_text")}
              label="Свой текст (тасовка)"
            />
            <RadioOption
              checked={textAction === null || textAction === "refresh"}
              onChange={() => handleTextActionChange(null)}
              label="Нет"
            />
          </div>

          {/* Custom text variants */}
          {textAction === "custom_text" && (
            <div className="mt-4 space-y-2">
              {customVariants.map((variant, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={variant}
                    onChange={e => {
                      const next = [...customVariants];
                      next[i] = e.target.value;
                      setCustomVariants(next);
                    }}
                    placeholder={`Вариант ${i + 1}`}
                    className="h-10 flex-1 rounded-2xl border-primary-900/10 bg-white"
                  />
                  {customVariants.length > 1 && (
                    <button
                      onClick={() => setCustomVariants(customVariants.filter((_, j) => j !== i))}
                      className="rounded-full p-1 text-ink-400 transition hover:bg-danger/10 hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {customVariants.length < 5 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCustomVariants([...customVariants, ""])}
                  className="rounded-full"
                >
                  Добавить вариант
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ── Photo panel ── */}
        <div className="rounded-2xl border border-primary-900/10 bg-white/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-700">
            <ImageIcon className="h-4 w-4" />
            Фото
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <RadioOption
              checked={photoAction === "ai_photos"}
              onChange={() => handlePhotoActionChange("ai_photos")}
              label="Уникализация фото"
            />
            <RadioOption
              checked={photoAction === "upload_photos"}
              onChange={() => handlePhotoActionChange("upload_photos")}
              label="Загрузить фото"
            />
            <RadioOption
              checked={photoAction === null}
              onChange={() => handlePhotoActionChange(null)}
              label="Нет"
            />
          </div>

          {/* Photo upload dropzone */}
          {photoAction === "upload_photos" && (
            <div className="mt-4">
              <div className="rounded-2xl border-2 border-dashed border-primary-300 bg-white p-6 text-center">
                <Upload className="mx-auto mb-2 h-8 w-8 text-primary-400" />
                <p className="text-sm text-ink-600">
                  Перетащите файлы сюда или нажмите для выбора
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setUploadedPhotos(files.map(f => f.name));
                  }}
                  className="mt-3"
                />
              </div>
              {uploadedPhotos.length > 0 && (
                <p className="mt-2 text-sm text-ink-500">
                  Загружено: {uploadedPhotos.length} фото
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and filter */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="h-10 rounded-2xl border-primary-900/10 bg-white/90 pl-9 text-ink-900 shadow-sm placeholder:text-ink-400"
              placeholder="Поиск по объявлениям"
            />
          </div>
          <StatusSelect value={status} onChange={setStatus} />
        </div>
      </div>

      {/* Listings grid */}
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

      {/* Bottom action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary-900/10 bg-white/46 p-5">
        <div className="flex flex-wrap items-center gap-4">
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
          {textActionCount > 0 && textAction && textAction !== "refresh" && (
            <Badge variant="default" className="gap-1">
              <FileText className="h-3 w-3" />
              {textAction === "ai_text" ? "AI" : "Свой"} ({textActionCount})
            </Badge>
          )}
          {photoActionCount > 0 && photoAction && (
            <Badge variant="default" className="gap-1">
              <ImageIcon className="h-3 w-3" />
              {photoAction === "ai_photos" ? "Уникализация" : "Загрузка"} ({photoActionCount})
            </Badge>
          )}
        </div>
        <Button
          onClick={handleApply}
          disabled={selectedCount === 0}
          className="rounded-full"
        >
          Обновить выбранные
        </Button>
      </div>

      {/* Confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-black text-ink-900">Подтверждение</h3>
            <div className="mb-6 space-y-3 text-sm text-ink-700">
              <div>
                <span className="font-bold">Текст:</span>{" "}
                {textAction === "ai_text" && "AI уникализация"}
                {textAction === "custom_text" && `Свой текст (${customVariants.length} вариант.)`}
                {textAction === "refresh" && "Без изменений"}
                {textAction === null && "Без изменений"}
              </div>
              <div>
                <span className="font-bold">Фото:</span>{" "}
                {photoAction === "ai_photos" && "Уникализация"}
                {photoAction === "upload_photos" && `Загруженные (${uploadedPhotos.length} шт.)`}
                {photoAction === null && "Без изменений"}
              </div>
              <div>
                <span className="font-bold">Объявлений:</span> {selectedCount}
              </div>
              {selectedAccountId && (
                <div>
                  <span className="font-bold">Аккаунт:</span>{" "}
                  {accounts.find(a => a.id === selectedAccountId)?.name}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 rounded-full"
              >
                Отмена
              </Button>
              <Button onClick={handleConfirm} className="flex-1 rounded-full">
                Подтвердить
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}

// ── Local components ──

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

function StatusSelect({
  value,
  onChange,
}: {
  value: "all" | Listing["status"];
  onChange: (value: "all" | Listing["status"]) => void;
}) {
  const options: { value: "all" | Listing["status"]; label: string }[] = [
    { value: "all", label: "Все статусы" },
    { value: "idle", label: "Готово" },
    { value: "queued", label: "В очереди" },
    { value: "updating", label: "Обновляется" },
    { value: "done", label: "Готово" },
    { value: "error", label: "Ошибка" },
  ];
  return (
    <div className="relative">
      <select
        value={value}
        onChange={event => onChange(event.target.value as "all" | Listing["status"])}
        className="h-10 w-full appearance-none rounded-2xl border border-primary-900/10 bg-white px-4 pr-9 text-sm font-semibold text-ink-700 shadow-sm outline-none ring-primary-300 transition focus:ring-2"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-primary-700" />
    </div>
  );
}

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

      {/* Action indicators: what will be applied */}
      {showActions && (
        <div className="mt-3 flex gap-2">
          {textAction && textAction !== "refresh" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
              ✎ {textAction === "ai_text" ? "AI текст" : "Свой текст"}
            </span>
          )}
          {photoAction && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cyan/15 px-2 py-1 text-xs font-semibold text-cyan-700">
              📸 {photoAction === "ai_photos" ? "Уникализация" : "Загрузка"}
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
