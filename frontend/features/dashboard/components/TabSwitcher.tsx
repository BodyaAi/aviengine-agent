"use client";

import { motion } from "framer-motion";
import { CheckSquare2, Lock, RefreshCw, Send } from "lucide-react";
import type { Tab } from "../models/dashboard";

export function TabSwitcher({ tab, setTab, isUpdatesLocked }: { tab: Tab; setTab: (tab: Tab) => void; isUpdatesLocked: boolean }) {
  const tabs = [
    { id: "manager", label: "Менеджер задач", icon: CheckSquare2 },
    { id: "publication", label: "Публикация", icon: Send },
    { id: "updates", label: "Обновление", icon: RefreshCw },
  ] as const;

  return (
    <div className="mt-5 flex justify-center gap-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const locked = id === "updates" && isUpdatesLocked;
        return (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: .98 }}
          key={id}
          onClick={() => setTab(id)}
          className={`relative flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${tab === id ? "border-white/45 bg-white/24 text-white shadow-glass" : "border-white/10 bg-white/[.04] text-white/58 hover:bg-white/[.08] hover:text-white"}`}
        >
          {tab === id && <motion.span layoutId="tab-glow" className="absolute inset-0 rounded-full bg-white/10" />}
          <Icon className="relative h-4 w-4" />
          <span className="relative">{label}</span>
          {locked && <Lock className="relative h-3 w-3 text-cyan" />}
          {tab === id && !locked && <span className="relative h-1.5 w-1.5 rounded-full bg-cyan" />}
        </motion.button>
        );
      })}
    </div>
  );
}
