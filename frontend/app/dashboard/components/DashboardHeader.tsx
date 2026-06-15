"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Account, SubscriptionStatus } from "../models/dashboard";
import aviLogo from "../../../../docs/legacy_website_prototype/AviEngine Website/src/assets/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

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
}: {
  accounts: Account[];
  accountsOpen: boolean;
  setAccountsOpen: (open: boolean) => void;
  subscription: SubscriptionStatus;
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

      <div className="relative">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setAccountsOpen(!accountsOpen)}
          className="border-white/25 bg-white/14 text-white hover:bg-white/20"
        >
          <UserRound className="h-4 w-4" /> Аккаунты
        </Button>
        {accountsOpen && (
          <div className="absolute right-0 top-12 z-20 w-72 rounded-3xl border border-white/18 bg-white/92 p-3 text-ink-900 shadow-[0_24px_80px_rgba(4,18,54,.25)] backdrop-blur-2xl">
            {accounts.map(account => (
              <div key={account.id} className="flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-primary-50">
                <div>
                  <div className="text-sm font-black">{account.name}</div>
                  <div className="text-xs text-ink-500">{account.slots} слота</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${account.status === "attention" ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
                  {accountStatusLabels[account.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
