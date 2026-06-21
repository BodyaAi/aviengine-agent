"use client";

import { useMemo, useState } from "react";
// ... existing code ...
import { AlertCircle, CheckCircle2, ChevronDown, Clock, FileText, Image, RefreshCw, Search, Upload, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Account, Listing, PhotoMode, UpdateAction } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

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
    listings,
    accounts,
    selectedListings,
    toggleListing,
    toggleAllListings,
    selectedAccountId,
    setSelectedAccountId,
    updateAction,
    setUpdateAction,
    photoMode,
    setPhotoMode,
    uploadedPhotos,
    setUploadedPhotos,
    customVariants,
    setCustomVariants,
    applyUpdateAction,
  } = props;

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

  const handleApply = () => {
    if (selectedCount === 0) return;
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    applyUpdateAction();
  };

  const actionTabs: { id: UpdateAction; label: string; icon: LucideIcon }[] = [
    { id: "ai_text", label: "Текст", icon: FileText },
    { id: "ai_photos", label: "Фото", icon: Image },
    { id: "upload_photos", label: "Загрузить", icon: Upload },
    { id: "custom_text", label: "Свой текст", icon: FileText },
    { id: "refresh", label: "Обновить", icon: RefreshCw },
  ];

  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновления" />
      
      {/* Account selector */}
      <div className="border-b border-primary-900/10 bg-white/46 p-5">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-500">Аккаунт</label>
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

      {/* Action tabs */}
      <div className="flex gap-2 border-b border-primary-900/10 bg-white/46 px-5 pb-4">
        {actionTabs.map(tab => {
          const Icon = tab.icon;
          const active = updateAction === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setUpdateAction(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${
                active ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-700 hover:bg-primary-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action-specific controls */}
      {updateAction === "upload_photos" && (
        <div className="border-b border-primary-900/10 bg-primary-50/50 p-5">
          <div className="mb-3 rounded-2xl border-2 border-dashed border-primary-300 bg-white p-6 text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-primary-400" />
            <p className="text-sm text-ink-600">Перетащите файлы сюда или нажмите для выбора</p>
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
            <div className="mb-3 text-sm text-ink-600">Загружено: {uploadedPhotos.length} фото</div>
          )}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-500">Режим обработки</label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="photoMode"
                checked={photoMode === "shuffle"}
                onChange={() => setPhotoMode("shuffle")}
                className="h-4 w-4"
              />
              <span>Тасовка (без изменений)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="photoMode"
                checked={photoMode === "viktor_unique"}
                onChange={() => setPhotoMode("viktor_unique")}
                className="h-4 w-4"
              />
              <span>Уникализация через Viktor API</span>
            </label>
          </div>
        </div>
      )}

      {updateAction === "custom_text" && (
        <div className="border-b border-primary-900/10 bg-primary-50/50 p-5">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-500">Варианты текста (2-5)</label>
          <div className="space-y-2">
            {customVariants.map((variant, i) => (
              <Input
                key={i}
                value={variant}
                onChange={e => {
                  const newVariants = [...customVariants];
                  newVariants[i] = e.target.value;
                  setCustomVariants(newVariants);
                }}
                placeholder={`Вариант ${i + 1}`}
                className="h-10 rounded-2xl border-primary-900/10 bg-white"
              />
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
        </div>
      )}

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
          <ListingCard key={item.id} item={item} onToggle={() => toggleListing(item.id)} />
        ))}
        {filteredListings.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-primary-300 bg-primary-50 p-10 text-center text-ink-500">
            Нет объявлений
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between border-t border-primary-900/10 bg-white/46 p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAllListings}
            className="text-sm font-bold text-primary-700 transition hover:text-primary-900"
          >
            {selectedCount === filteredListings.length ? "Снять выбор" : "Выбрать все"}
          </button>
          <span className="text-sm text-ink-600">
            Выбрано {selectedCount} из {filteredListings.length}
          </span>
        </div>
        <Button
          onClick={handleApply}
          disabled={selectedCount === 0}
          className="rounded-full"
        >
          Применить к выбранным
        </Button>
      </div>

      {/* Confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-black text-ink-900">Подтверждение</h3>
            <div className="mb-6 space-y-3 text-sm text-ink-700">
              <div>
                <span className="font-bold">Действие:</span>{" "}
                {actionTabs.find(t => t.id === updateAction)?.label}
              </div>
              <div>
                <span className="font-bold">Количество объявлений:</span> {selectedCount}
              </div>
              {selectedAccountId && (
                <div>
                  <span className="font-bold">Аккаунт:</span>{" "}
                  {accounts.find(a => a.id === selectedAccountId)?.name}
                </div>
              )}
              {updateAction === "upload_photos" && (
                <div>
                  <span className="font-bold">Режим:</span>{" "}
                  {photoMode === "shuffle" ? "Тасовка" : "Уникализация через Viktor"}
                </div>
              )}
              {updateAction === "custom_text" && (
                <div>
                  <span className="font-bold">Вариантов текста:</span> {customVariants.length}
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

function StatusSelect({ value, onChange }: { value: "all" | Listing["status"]; onChange: (value: "all" | Listing["status"]) => void }) {
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

const statusView: Record<Listing["status"], { text: string; variant: "default" | "blue" | "warning" | "danger" | "success"; icon: LucideIcon }> = {
  idle: { text: "Готово", variant: "default", icon: Clock },
  queued: { text: "В очереди", variant: "warning", icon: Clock },
  updating: { text: "Обновляется", variant: "blue", icon: RefreshCw },
  done: { text: "Готово", variant: "success", icon: CheckCircle2 },
  error: { text: "Ошибка", variant: "danger", icon: AlertCircle },
};

function ListingCard({ item, onToggle }: { item: Listing; onToggle: () => void }) {
  const view = statusView[item.status];
  const Icon = view.icon;
  return (
    <div
      className={`rounded-3xl border p-4 shadow-[0_18px_48px_rgba(20,85,255,.10)] transition ${
        item.selected ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/92"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <Checkbox checked={item.selected} onCheckedChange={onToggle} />
        <Badge variant={view.variant}>
          <Icon className="h-3 w-3" /> {view.text}
        </Badge>
      </div>
      <div className="mb-3 grid h-32 place-items-center rounded-2xl bg-gradient-to-br from-primary-100 via-white to-cyan/20 text-4xl font-black text-primary-200">
        {item.title.slice(0, 1)}
      </div>
      <h3 className="mb-2 line-clamp-2 text-sm font-bold">{item.title}</h3>
      <div className="mb-2 text-lg font-black">{item.price.toLocaleString("ru-RU")} ₽</div>
      <div className="mb-1 text-xs text-ink-500">№ {item.avitoId}</div>
      <div className="mb-1 text-xs text-ink-500">Обновлён: {item.updated}</div>
      <div className="text-xs text-ink-500">{item.nextUpdate}</div>
      {item.error && (
        <div className="mt-3 rounded-xl bg-danger/10 p-2 text-xs text-danger">{item.error}</div>
      )}
    </div>
  );
}

