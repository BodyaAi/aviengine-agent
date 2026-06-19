"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Search, Settings2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Listing, ListingMode } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

export function UpdatesTab({
  listings,
  selectedListings,
  toggleListing,
  toggleAllListings,
  setListingMode,
  updateSelectedListings,
}: {
  listings: Listing[];
  selectedListings: number;
  toggleListing: (id: number) => void;
  toggleAllListings: () => void;
  setListingMode: (mode: ListingMode) => void;
  updateSelectedListings: () => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Listing["status"]>("all");
  const filtered = useMemo(() => listings.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) && (status === "all" || item.status === status)), [listings, query, status]);

  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновления" action={<div className="flex gap-2"><Button variant="secondary" size="sm" className="rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100"><Settings2 className="h-4 w-4" /> Режимы</Button><Button size="sm" className="rounded-full" onClick={updateSelectedListings} disabled={selectedListings === 0}>Обновить сейчас</Button></div>} />
      <div className="border-y border-primary-900/10 bg-white/46 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_220px_220px]">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><Input value={query} onChange={event => setQuery(event.target.value)} className="h-10 rounded-2xl border-primary-900/10 bg-white/90 pl-9 text-ink-900 shadow-sm placeholder:text-ink-400" placeholder="Поиск по объявлениям" /></div>
          <select value={status} onChange={event => setStatus(event.target.value as typeof status)} className="h-10 rounded-2xl border border-primary-900/10 bg-white px-3 text-sm font-semibold text-ink-700"><option value="all">Все статусы</option><option value="idle">Готово</option><option value="queued">В очереди</option><option value="updating">Обновляется</option><option value="done">Готово</option><option value="error">Ошибка</option></select>
          <ModeCard title="AI Автопилот" text="AI сам определяет время" active={listings.some(item => item.selected && item.mode === "auto")} onClick={() => setListingMode("auto")} />
          <ModeCard title="Ручной режим" text="Пользователь запускает сам" active={listings.some(item => item.selected && item.mode === "manual")} onClick={() => setListingMode("manual")} />
        </div>
        <button onClick={toggleAllListings} className="mt-4 rounded-full px-1 text-sm font-bold text-primary-700 transition hover:text-primary-900">{selectedListings === listings.length ? "Снять выбор" : "Выбрать все"} · выбрано {selectedListings} из {listings.length}</button>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map(item => <ListingCard key={item.id} item={item} onToggle={() => toggleListing(item.id)} />)}
      </div>
    </Card>
  );
}

function ModeCard({ title, text, active, onClick }: { title: string; text: string; active?: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-2xl border p-4 text-left shadow-sm transition ${active ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/86"}`}><div className="font-black">{title}</div><div className="mt-1 text-xs text-ink-500">{text}</div></button>;
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
  return <motion.div whileHover={{ y: -5, scale: 1.01 }} className={`rounded-3xl border p-3 shadow-[0_18px_48px_rgba(20,85,255,.10)] transition ${item.selected ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/92"}`}><div className="mb-3 flex items-center justify-between"><Checkbox checked={item.selected} onCheckedChange={onToggle} /><Badge variant={item.mode === "auto" ? "blue" : "default"}>{item.mode === "auto" ? "Авто" : "Ручной"}</Badge></div><div className="mb-3 grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-primary-100 via-white to-cyan/20 text-3xl font-black text-primary-200">{item.title.slice(0, 1)}</div><b className="line-clamp-2 text-sm">{item.title}</b><div className="mt-2 text-lg font-black">{item.price.toLocaleString("ru-RU")} ₽</div><div className="mt-2 text-xs text-ink-500">№ {item.avitoId} · Обновлён: {item.updated}</div><div className="mt-1 text-xs text-ink-500">{item.nextUpdate}</div><div className="mt-3 flex items-center gap-2"><Badge variant={view.variant}><Icon className="h-3 w-3" /> {view.text}</Badge></div>{item.error && <div className="mt-2 rounded-xl bg-danger/10 p-2 text-xs text-danger">{item.error}</div>}</motion.div>;
}
