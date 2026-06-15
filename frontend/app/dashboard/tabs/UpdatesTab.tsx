"use client";

import { motion } from "framer-motion";
import { RefreshCw, Search, Settings2 } from "lucide-react";
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
}: {
  listings: Listing[];
  selectedListings: number;
  toggleListing: (id: number) => void;
  toggleAllListings: () => void;
  updateSelectedListings: () => void;
}) {
  return (
    <Card className="light-panel overflow-hidden rounded-[1.8rem] text-ink-900 shadow-[0_28px_90px_rgba(4,18,54,.18)]">
      <PanelHeader icon={RefreshCw} title="Обновление" action={<div className="flex gap-2"><Button variant="secondary" size="sm" className="rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100"><Settings2 className="h-4 w-4" /> Режимы</Button><Button size="sm" className="rounded-full" onClick={updateSelectedListings}>Обновить сейчас</Button></div>} />
      <div className="border-y border-primary-900/10 bg-white/46 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_220px]">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><Input className="h-10 rounded-2xl border-primary-900/10 bg-white/90 pl-9 text-ink-900 shadow-sm placeholder:text-ink-400" placeholder="Поиск по объявлениям" /></div>
          <ModeCard title="Авто режим" text="Система выбирает время" active />
          <ModeCard title="Ручной режим" text="Кнопка обновления" />
        </div>
        <button onClick={toggleAllListings} className="mt-4 rounded-full px-1 text-sm font-bold text-primary-700 transition hover:text-primary-900">{selectedListings === listings.length ? "Снять выбор" : "Выбрать все"} · выбрано {selectedListings}</button>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
        {listings.map(item => <ListingCard key={item.id} item={item} onToggle={() => toggleListing(item.id)} />)}
      </div>
    </Card>
  );
}

function ModeCard({ title, text, active }: { title: string; text: string; active?: boolean }) {
  return <div className={`rounded-2xl border p-4 shadow-sm transition ${active ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/86"}`}><div className="font-black">{title}</div><div className="mt-1 text-xs text-ink-500">{text}</div></div>;
}

function ListingCard({ item, onToggle }: { item: Listing; onToggle: () => void }) {
  return <motion.div whileHover={{ y: -5, scale: 1.01 }} className={`rounded-3xl border p-3 shadow-[0_18px_48px_rgba(20,85,255,.10)] transition ${item.selected ? "border-primary-300 bg-primary-50" : "border-primary-900/10 bg-white/92"}`}><div className="mb-3 flex items-center justify-between"><Checkbox checked={item.selected} onCheckedChange={onToggle} /><Badge variant={item.mode === "Авто" ? "blue" : "default"}>{item.mode}</Badge></div><div className="mb-3 h-28 rounded-2xl bg-gradient-to-br from-primary-100 via-white to-cyan/20" /><b className="line-clamp-2 text-sm">{item.title}</b><div className="mt-2 text-lg font-black">{item.price.toLocaleString("ru-RU")} ₽</div><div className="mt-2 text-xs text-ink-500">№ {item.avitoId} · {item.updated}</div></motion.div>;
}
