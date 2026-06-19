"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Search, Trash2, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Account, SubscriptionPlan, SubscriptionState, SubscriptionStatus } from "../models/dashboard";
import { SubscriptionWidget } from "./SubscriptionWidget";
import aviLogo from "@/public/logo_aviengine.png";

export function DashboardHeader({
  accounts,
  accountsOpen,
  setAccountsOpen,
  addAccount,
  removeAccount,
  subscription,
  subscriptionState,
  subscriptionPlans,
  subscriptionOpen,
  setSubscriptionOpen,
  selectedPlan,
  setSelectedPlan,
  cycleSubscription,
  startTrial,
  selectPlan,
}: {
  accounts: Account[];
  accountsOpen: boolean;
  setAccountsOpen: (open: boolean) => void;
  addAccount: () => void;
  removeAccount: (id: number) => void;
  subscription: SubscriptionStatus;
  subscriptionState: SubscriptionState;
  subscriptionPlans: SubscriptionPlan[];
  subscriptionOpen: boolean;
  setSubscriptionOpen: (open: boolean) => void;
  selectedPlan: "lite" | "pro";
  setSelectedPlan: (plan: "lite" | "pro") => void;
  cycleSubscription: () => void;
  startTrial: () => void;
  selectPlan: (plan: "lite" | "pro") => void;
}) {
  const [query, setQuery] = useState("");
  const filteredAccounts = useMemo(() => accounts.filter(account => `${account.name} ${account.email}`.toLowerCase().includes(query.toLowerCase())), [accounts, query]);

  return (
    <header className="relative mb-5 flex flex-col gap-4 rounded-[1.6rem] border border-white/18 bg-white/12 px-4 py-3 shadow-glass backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <Image src={aviLogo} alt="AviEngine" width={42} height={42} className="rounded-2xl shadow-[0_18px_45px_rgba(20,85,255,.35)]" />
        <div><div className="font-black tracking-tight">AviEngine</div><div className="text-xs text-white/60">{subscription.label}: {subscription.value}</div></div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubscriptionWidget subscription={subscription} subscriptionState={subscriptionState} plans={subscriptionPlans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} open={subscriptionOpen} setOpen={setSubscriptionOpen} cycleSubscription={cycleSubscription} startTrial={startTrial} onSelectPlan={selectPlan} />
        <Button type="button" variant="secondary" size="sm" onClick={() => setAccountsOpen(true)} className="border-white/25 bg-white/14 text-white hover:bg-white/20"><UserRound className="h-4 w-4" /> Аккаунты</Button>
      </div>
      {accountsOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 p-4 backdrop-blur-md" onMouseDown={() => setAccountsOpen(false)}>
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/18 bg-white/96 text-ink-900 shadow-[0_30px_100px_rgba(4,18,54,.34)]" onMouseDown={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-primary-900/10 p-5">
              <div><div className="text-2xl font-black">Аккаунты</div><div className="text-sm text-ink-500">Поиск, добавление и удаление подключений Авито</div></div>
              <Button variant="ghost" size="icon" onClick={() => setAccountsOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <div className="grid gap-3 border-b border-primary-900/10 bg-primary-50/70 p-5 md:grid-cols-[1fr_auto]">
              <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Поиск аккаунта…" className="h-10 rounded-2xl border-primary-900/10 bg-white pl-9 text-ink-900" /></div>
              <Button onClick={addAccount} className="rounded-2xl"><Plus className="h-4 w-4" /> Добавить аккаунт</Button>
            </div>
            <div className="grid flex-1 content-start gap-4 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map(account => <div key={account.id} className="rounded-3xl border border-primary-900/10 bg-white p-4 shadow-[0_16px_42px_rgba(20,85,255,.08)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-cyan text-lg font-black text-white">{account.avatar}</div><div><div className="font-black">{account.name}</div><div className="text-xs text-ink-500">{account.email}</div></div></div>
                  <Button variant="ghost" size="icon" className="text-danger hover:bg-danger/10" onClick={() => removeAccount(account.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${account.status === "error" ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>{account.status === "error" ? "Ошибка" : "Подключен"}</span>
              </div>)}
              {filteredAccounts.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-primary-300 bg-primary-50 p-10 text-center text-ink-500">Нет совпадений</div>}
            </div>
          </div>
      </div>
      )}
    </header>
  );
}
