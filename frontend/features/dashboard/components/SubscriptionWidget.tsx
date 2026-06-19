"use client";

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
    <div data-subscription-zone="true" className="min-w-[520px]" onClick={cycleSubscription}>
      {subscriptionState === "trial_limits" && (
        <div onClick={event => event.stopPropagation()} className="rounded-2xl border border-white/20 bg-white/12 p-3 text-white backdrop-blur-xl">
          <div className="mb-3 text-sm font-black">Пробный доступ по лимитам</div>
          <div className="grid grid-cols-4 gap-2">
            {limits.map(({ name, value, icon: Icon }) => <div key={name} className="rounded-xl bg-white/10 p-2"><div className="flex items-center justify-between gap-1 text-[11px] font-bold"><Icon className="h-3.5 w-3.5" />{value}</div><div className="mt-1 truncate text-[11px] text-white/70">{name}</div><div className="mt-2 h-1 rounded-full bg-white/20" /></div>)}
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
  return <div onClick={event => event.stopPropagation()} className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold text-white shadow-glass ${tone === "pro" ? "border-blue-200/30 bg-gradient-to-r from-ink-950 via-primary-900 to-primary-600" : "border-white/25 bg-gradient-to-r from-fuchsia-500 to-cyan"}`}>{tone === "pro" ? <Star className="h-4 w-4 fill-white" /> : <Check className="h-4 w-4" />}{label}</div>;
}

function SubscriptionSelectionWidget({ open, setOpen, plans, selectedPlan, setSelectedPlan, onSelectPlan }: { open: boolean; setOpen: (open: boolean) => void; plans: SubscriptionPlan[]; selectedPlan: "lite" | "pro"; setSelectedPlan: (plan: "lite" | "pro") => void; onSelectPlan: (plan: "lite" | "pro") => void }) {
  if (!open) return null;
  return (
    <div data-subscription-zone="true" className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 p-4 backdrop-blur-md" onMouseDown={() => setOpen(false)}>
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/18 bg-white p-5 text-ink-900 shadow-[0_30px_100px_rgba(4,18,54,.34)]" onMouseDown={event => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4 text-center sm:text-left">
          <div><div className="text-2xl font-black text-primary-700">AviEngine</div><h2 className="mt-1 text-2xl font-black tracking-tight">Переходи на AI‑автопилот.</h2><p className="mt-2 text-sm text-ink-500">Lite проще для старта, Pro строже для масштабирования.</p></div>
          <Button variant="ghost" size="icon" className="text-ink-700 hover:bg-primary-50" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map(plan => {
            const pro = plan.id === "pro";
            return <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} className={`relative flex min-h-[430px] flex-col rounded-[1.75rem] border p-6 text-left text-white transition ${pro ? "border-blue-200/20 bg-gradient-to-br from-ink-950 via-primary-900 to-primary-600 shadow-[0_24px_70px_rgba(7,20,58,.34)]" : "border-white/40 bg-gradient-to-br from-fuchsia-500 to-cyan shadow-[0_18px_52px_rgba(20,160,255,.24)]"}`}>
              {selectedPlan === plan.id && <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-primary-700">Выбрано</span>}
              <div className="mb-4 inline-flex w-fit rounded-full border border-white/25 bg-white/14 px-3 py-1 text-xs font-black uppercase tracking-wider">Подписка {plan.name}</div>
              <div className="text-4xl font-black tracking-tight">{plan.price}</div>
              <div className="mt-2 text-sm text-white/78">{plan.slots}</div>
              <div className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map(feature => <div key={feature} className="flex gap-3 text-sm leading-5"><span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-white/18"><Check className="h-3 w-3" /></span>{feature}</div>)}
              </div>
              <Button className="mt-6 w-full rounded-2xl bg-white text-primary-700 hover:bg-primary-50" onClick={event => { event.stopPropagation(); onSelectPlan(plan.id); }}>{pro ? <Zap className="h-4 w-4" /> : null}{pro ? "Активировать Pro" : "Выбрать Lite"}</Button>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
}
