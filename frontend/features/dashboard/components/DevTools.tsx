"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import type { SubscriptionState } from "../models/dashboard";

const SUBSCRIPTION_STATES: SubscriptionState[] = ["trial_limits", "trial_ended", "lite", "pro", "expired"];

/**
 * Изолированный dev-инструмент для переключения статуса подписки.
 * Отображается как фиксированная плавающая панель в правом нижнем углу.
 * Не влияет на production-логику, только меняет визуальное состояние.
 */
export function DevTools({ state, onCycle }: { state: SubscriptionState; onCycle: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[999]">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/90"
        title="Dev Tools"
      >
        <Wrench className="h-5 w-5" />
      </button>

      {/* Panel */}
      {open && (
        <div className="w-56 rounded-2xl border border-white/10 bg-zinc-900/95 p-3 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Dev Tools</span>
            <span className="rounded-md bg-zinc-700 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">{SUBSCRIPTION_STATES.length} states</span>
          </div>
          <div className="space-y-1">
            {SUBSCRIPTION_STATES.map(s => (
              <button
                key={s}
                onClick={() => {
                  // Прыгаем до нужного состояния циклическим вызовом
                  let current = SUBSCRIPTION_STATES.indexOf(state);
                  const target = SUBSCRIPTION_STATES.indexOf(s);
                  // Если цель впереди — просто крутим, иначе делаем полный круг
                  const steps = target > current ? target - current : (SUBSCRIPTION_STATES.length - current) + target;
                  for (let i = 0; i < steps; i++) onCycle();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  state === s ? "bg-primary-600 text-white" : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {s}
                {state === s && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </button>
            ))}
          </div>
          <div className="mt-2 border-t border-white/10 pt-2">
            <button
              onClick={onCycle}
              className="w-full rounded-lg bg-zinc-700 py-1.5 text-center text-[11px] font-bold text-white transition hover:bg-zinc-600"
            >
              Следующий →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
