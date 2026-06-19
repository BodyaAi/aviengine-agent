"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, Clock, RefreshCw, Search, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Listing } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

export function UpdatesTab({
  listings,
  selectedListings,
  toggleListing,
  toggleAllListings,
  updateSelectedListings,
  updateListingNow,
}: {
  listings: Listing[];
  selectedListings: number;
  toggleListing: (id: number) => void;
  toggleAllListings: () => void;
  updateSelectedListings: () => void;
  updateListingNow: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Listing["status"]>("all");
  const filtered = useMemo(() => listings.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) && (status === "all" || item.status === status)), [listings, query, status]);

  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновления" action={<Button size="sm" className="rounded-full" onClick={updateSelectedListings} disabled={selectedListings === 0}>Обновить сейчас</Button>} />
      <div className="border-y border-primary-900/10 bg-white/46 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="h-10 rounded-2xl border-primary-900/10 bg-white/90 pl-9 text-ink-900 shadow-sm placeholder:text-ink-400" placeholder="Поиск по объявлениям" /></div>
          <StatusSelect value={status} onChange={setStatus} />
        </div>
        <button onClick={toggleAllListings} className="mt-4 rounded-full px-1 text-sm font-bold text-primary-700 transition hover:text-primary-900">{selectedListings === listings.length ? "Снять выбор" : "Выбрать все"} · выбрано {selectedListings} из {listings.length}</button>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map(item => <ListingCard key={item.id} item={item} onToggle={() => toggleListing(item.id)} onUpdate={() => updateListingNow(item.id)} />)}
      </div>
    </Card>
  );
}

function StatusSelect({ value, onChange }: { value: "all" | Listing["status"]; onChange: (value: "all" | Listing["status"]) => void }) {
  const options: { value: "all" | Listing["status"]; label: string }[] = [{ value: "all", label: "Все статусы" }, { value: "idle", label: "Готово" }, { value: "queued", label: "В очереди" }, { value: "updating", label: "Обновляется" }, { value: "done", label: "Готово" }, { value: "error", label: "Ошибка" }];
  return <div className="relative"><select value={value} onChange={event => onChange(event.target.value as "all" | Listing["status"])} className="h-10 w-full appearance-none rounded-2xl border border-primary-900/10 bg-white px-4 pr-9 text-sm font-semibold text-ink-700 shadow-sm outline-none ring-primary-300 transition focus:ring-2">{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-primary-700" /></div>;
}

const statusView: Record<Listing["status"], { text: string; variant: "default" | "blue" | "warning" | "danger" | "success"; icon: LucideIcon }> = {
  idle: { text: "Готово", variant: "default", icon: Clock },
  queued: { text: "В очереди", variant: "warning", icon: Clock },
  updating: { text: "Обновляется", variant: "blue", icon: RefreshCw },
  done: { text: "Готово", variant: "success", icon: CheckCircle2 },
  error: { text: "Ошибка", variant: "danger", icon: AlertCircle },
};

function ListingCard({ item, onToggle, onUpdate }: { item: Listing; onToggle: () => void; onUpdate: () => void }) {
  const view = statusView[item.status];
  const Icon = view.icon;
  return <motion.div whileHover={{ y: -5, scale: 1.01 }} className={`rounded-3xl border p-3 shadow-[0_18px_48px_rgba(20,85,255,.10)] transition ${item.selected ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/92"}`}><div className="mb-3 flex items-center justify-between"><Checkbox checked={item.selected} onCheckedChange={onToggle} /><Badge variant={item.mode === "auto" ? "blue" : "default"}>{item.mode === "auto" ? "Авто" : "Ручной"}</Badge></div><div className="mb-3 grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-primary-100 via-white to-cyan/20 text-3xl font-black text-primary-200">{item.title.slice(0, 1)}</div><b className="line-clamp-2 text-sm">{item.title}</b><div className="mt-2 text-lg font-black">{item.price.toLocaleString("ru-RU")} ₽</div><div className="mt-2 text-xs text-ink-500">№ {item.avitoId} · Обновлён: {item.updated}</div><div className="mt-1 text-xs text-ink-500">{item.nextUpdate}</div><div className="mt-3 flex items-center gap-2"><Badge variant={view.variant}><Icon className="h-3 w-3" /> {view.text}</Badge></div>{item.error && <div className="mt-2 rounded-xl bg-danger/10 p-2 text-xs text-danger">{item.error}</div>}<Button className="mt-3 w-full rounded-xl" size="sm" onClick={onUpdate}>Обновить</Button></motion.div>;
}
