"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpdatesLockedBanner({ onActivate }: { onActivate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.42 }}
    >
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 p-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        {/* Декоративное свечение */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-600/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-cyan/10 blur-[80px]" />

        {/* Иконка */}
        <div className="relative mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-primary-600/30 to-ink-800 shadow-[0_0_40px_rgba(20,85,255,0.3)]">
            <Crown className="h-9 w-9 text-cyan" />
          </div>
        </div>

        {/* Заголовок */}
        <h2 className="relative mb-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Активируйте <span className="bg-gradient-to-r from-cyan to-primary-400 bg-clip-text text-transparent">PRO</span>
        </h2>

        {/* Описание */}
        <p className="relative mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed text-white/60 sm:text-base">
          Начните профессиональную работу вместе с дополнительной функцией обновления объявлений
        </p>

        {/* Преимущества */}
        <div className="relative mx-auto mb-8 flex max-w-md flex-col gap-2.5">
          {[
            "Массовое обновление текстов и фото",
            "AI‑переработка описаний",
            "Загрузка собственных фото‑шаблонов",
          ].map(feature => (
            <div key={feature} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-left">
              <Sparkles className="h-4 w-4 shrink-0 text-cyan" />
              <span className="text-sm font-medium text-white/70">{feature}</span>
            </div>
          ))}
        </div>

        {/* Кнопка */}
        <Button
          onClick={onActivate}
          className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-sm font-black text-white shadow-[0_10px_40px_rgba(20,85,255,0.4)] transition hover:from-primary-700 hover:to-primary-800"
        >
          <Zap className="h-4 w-4" />
          Активировать PRO
        </Button>
      </div>
    </motion.div>
  );
}
