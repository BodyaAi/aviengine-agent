"use client";

import Image from "next/image";
import { X, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Account, SubscriptionPlan, SubscriptionStatus } from "../models/dashboard";
import { SubscriptionWidget } from "./SubscriptionWidget";
import aviLogo from "@/public/logo_aviengine.png";

const accountStatusLabels = {
  active: "Активен",
  attention: "Внимание",
  ready: "Готов",
};

export function DashboardHeader({
  accounts,
  accountsOpen,
  setAccountsOpen,
  subscription,
  subscriptionPlans,
  subscriptionOpen,
  setSubscriptionOpen,
  selectedPlan,
  setSelectedPlan,
}: {
  accounts: Account[];
  accountsOpen: boolean;
  setAccountsOpen: (open: boolean) => void;
  subscription: SubscriptionStatus;
  subscriptionPlans: SubscriptionPlan[];
  subscriptionOpen: boolean;
  setSubscriptionOpen: (open: boolean) => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}) {
  return (
    <header className="relative mb-5 flex items-center justify-between rounded-[1.6rem] border border-white/18 bg-white/12 px-4 py-3 shadow-glass backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <Image src={aviLogo} alt="AviEngine" width={42} height={42} className="rounded-2xl shadow-[0_18px_45px_rgba(20,85,255,.35)]" />
        <div>
          <div className="font-black tracking-tight">AviEngine</div>
          <div className="text-xs text-white/60">{subscription.label}: {subscription.value}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubscriptionWidget subscription={subscription} plans={subscriptionPlans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} open={subscriptionOpen} setOpen={setSubscriptionOpen} />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setAccountsOpen(!accountsOpen)}
          className="border-white/25 bg-white/14 text-white hover:bg-white/20"
        >
          <UserRound className="h-4 w-4" /> Аккаунты
        </Button>
      </div>
      {accountsOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/58 p-5 backdrop-blur-md" onMouseDown={() => setAccountsOpen(false)}>
          <div className="w-full max-w-lg rounded-[2rem] border border-white/18 bg-white/94 p-4 text-ink-900 shadow-[0_30px_100px_rgba(4,18,54,.34)]" onMouseDown={event => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
              <div className="text-lg font-black">Аккаунты</div>
              <Button variant="ghost" size="icon" onClick={() => setAccountsOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {accounts.map(account => (
                <div key={account.id} className="flex items-center justify-between rounded-2xl border border-primary-900/10 bg-white px-3 py-3 transition hover:bg-primary-50">
                  <div>
                    <div className="text-sm font-black">{account.name}</div>
                    <div className="text-xs text-ink-500">{account.slots} слота</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${account.status === "attention" ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
                      {accountStatusLabels[account.status]}
                    </span>
                    <Button size="sm" variant="secondary" className="bg-primary-50 text-primary-700">Открыть</Button>
                  </div>
                </div>
            ))}
            </div>
          </div>
      </div>
      )}
    </header>
  );
}
