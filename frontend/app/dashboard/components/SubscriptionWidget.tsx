"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan, SubscriptionStatus } from "../models/dashboard";

export function SubscriptionWidget({
  subscription,
  plans,
  selectedPlan,
  setSelectedPlan,
  open,
  setOpen,
}: {
  subscription: SubscriptionStatus;
  plans: SubscriptionPlan[];
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-white/22 bg-white/12 px-4 py-2 text-sm font-bold text-white shadow-glass backdrop-blur-xl transition hover:bg-white/18">
        {subscription.label}: {subscription.value}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/58 p-5 backdrop-blur-md" onMouseDown={() => setOpen(false)}>
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/18 bg-white/94 p-4 text-ink-900 shadow-[0_30px_100px_rgba(4,18,54,.34)]" onMouseDown={event => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
              <div>
                <div className="text-lg font-black">{subscription.label}: {subscription.value}</div>
                <div className="text-sm text-ink-500">{subscription.until}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {plans.map(plan => (
                <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} className={`rounded-3xl border p-4 text-left transition ${selectedPlan === plan.id ? "border-primary-300 bg-primary-50 shadow-[0_16px_42px_rgba(20,85,255,.12)]" : "border-primary-900/10 bg-white hover:bg-primary-50/60"}`}>
                  <div className="font-black">{plan.name}</div>
                  <div className="mt-2 text-2xl font-black text-primary-700">{plan.price}</div>
                  <div className="mt-1 text-sm text-ink-500">{plan.slots}</div>
                </button>
              ))}
            </div>
            <Button className="mt-4 w-full rounded-full" onClick={() => setOpen(false)}>Оформить подписку</Button>
          </div>
        </div>
      )}
    </>
  );
}
