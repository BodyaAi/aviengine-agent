"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, FileText, Megaphone, RefreshCw, Star, User, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan, SubscriptionState, SubscriptionStatus } from "../models/dashboard";

const limits = [
  { name: "5 публикаций", value: "0/5", icon: Megaphone },
  { name: "10 обновлений", value: "0/10", icon: RefreshCw },
  { name: "1 аккаунт", value: "0/1", icon: User },
  { name: "1 шаблон", value: "0/1", icon: FileText },
];

export function SubscriptionWidget({
  subscription,
  subscriptionState,
  plans,
  selectedPlan,
  setSelectedPlan,
  open,
  setOpen,
  cycleSubscription,
  onSelectPlan,
}: {
  subscription: SubscriptionStatus;
  subscriptionState: SubscriptionState;
  plans: SubscriptionPlan[];
  selectedPlan: "lite" | "pro";
  setSelectedPlan: (plan: "lite" | "pro") => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  cycleSubscription: () => void;
  onSelectPlan: (plan: "lite" | "pro") => void;
}) {
  return (
    <div data-subscription-zone="true" className="shrink-0" onClick={cycleSubscription}>
      {subscriptionState === "trial_limits" && (
        <div onClick={event => event.stopPropagation()} className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-600 to-primary-700 p-3 text-white shadow-lg">
          <div className="mb-3 text-sm font-black">Пробный доступ по лимитам</div>
          <div className="grid grid-cols-4 gap-2">
            {limits.map(({ name, value, icon: Icon }) => <div key={name} className="rounded-xl bg-white/14 p-2"><div className="flex items-center justify-between gap-1 text-[11px] font-bold"><Icon className="h-3.5 w-3.5" />{value}</div><div className="mt-1 truncate text-[11px] text-white/70">{name}</div><div className="mt-2 h-1 rounded-full bg-white/20" /></div>)}
          </div>
        </div>
      )}
      {subscriptionState === "trial_ended" && <StatusCta text="Оформить подписку" hint="Пробный период закончился" onClick={() => setOpen(true)} />}
      {subscriptionState === "expired" && <StatusCta text="Продлить подписку" hint="Подписка истекла" onClick={() => setOpen(true)} />}
      {subscriptionState === "lite" && <PlanBadge tone="lite" label={`Lite — активна ${subscription.until}`} />}
      {subscriptionState === "pro" && <PlanBadge tone="pro" label={`Pro — активна ${subscription.until}`} />}
      <SubscriptionSelectionWidget open={open} setOpen={setOpen} plans={plans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onSelectPlan={onSelectPlan} />
    </div>
  );
}

function StatusCta({ text, hint, onClick }: { text: string; hint: string; onClick: () => void }) {
  return <div onClick={event => event.stopPropagation()} className="space-y-1"><Button className="w-full rounded-full blue-gradient-button" onClick={onClick}>{text}</Button><div className="text-center text-xs font-medium text-white/58">{hint}</div></div>;
}

function PlanBadge({ tone, label }: { tone: "lite" | "pro"; label: string }) {
  return <div onClick={event => event.stopPropagation()} className={`flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold text-white shadow-glass ${tone === "pro" ? "border-white/10 bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950" : "border-white/25 bg-gradient-to-r from-fuchsia-500 to-cyan"}`}>{tone === "pro" ? <Star className="h-3 w-3 fill-white text-white/80" /> : <Check className="h-4 w-4" />}{label}</div>;
}

function SubscriptionSelectionWidget({ open, setOpen, plans, selectedPlan, setSelectedPlan, onSelectPlan }: { open: boolean; setOpen: (open: boolean) => void; plans: SubscriptionPlan[]; selectedPlan: "lite" | "pro"; setSelectedPlan: (plan: "lite" | "pro") => void; onSelectPlan: (plan: "lite" | "pro") => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!open || !mounted) return null;
  return createPortal(
    <div data-subscription-zone="true" className="fixed inset-0 z-[200] grid place-items-center bg-ink-950/60 p-4 backdrop-blur-md" onMouseDown={() => setOpen(false)}>
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/18 bg-white p-5 text-ink-900 shadow-[0_30px_100px_rgba(4,18,54,.34)]" onMouseDown={event => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4 text-center sm:text-left">
          <div><div className="text-2xl font-black text-primary-700">AviEngine</div><h2 className="mt-1 text-2xl font-black tracking-tight">Переходи на AI‑автопилот.</h2><p className="mt-2 text-sm text-ink-500">Lite проще для старта, Pro строже для масштабирования.</p></div>
          <Button variant="ghost" size="icon" className="text-ink-700 hover:bg-primary-50" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map(plan => {
            const pro = plan.id === "pro";
            return <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} className={`relative flex flex-col rounded-[1.75rem] border p-6 text-left text-white transition ${pro ? "border-white/10 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 shadow-[0_24px_70px_rgba(0,0,0,0.5)]" : "border-white/40 bg-gradient-to-br from-fuchsia-500 to-cyan shadow-[0_18px_52px_rgba(20,160,255,.24)]"}`}>
              <div className="mb-4 inline-flex w-fit rounded-full border border-white/25 bg-white/14 px-3 py-1 text-xs font-black uppercase tracking-wider">Подписка {plan.name}</div>
              <div className="text-4xl font-black tracking-tight">{plan.price}</div>
              <div className="mt-3 text-2xl font-black text-white/90">{plan.slots}</div>
              <div className="mt-auto pt-6">
                {pro && <p className="mb-4 text-sm font-medium text-white/70">В этом тарифе доступна функция обновления объявлений</p>}
                <Button className="w-full rounded-2xl bg-white/20 text-white hover:bg-white/30" onClick={event => { event.stopPropagation(); onSelectPlan(plan.id); }}>{pro ? <Star className="h-3 w-3 fill-white" /> : null}{pro ? "Активировать Pro" : "Выбрать Lite"}</Button>
              </div>
            </button>;
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
