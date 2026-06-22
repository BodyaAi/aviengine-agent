"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Plus, Search, Trash2, User, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Account, SubscriptionPlan, SubscriptionState, SubscriptionStatus } from "../models/dashboard";
import { SubscriptionWidget } from "./SubscriptionWidget";
import aviLogo from "@/public/logo_aviengine.png";

// Legacy tokens
const C = {
  primary: "#1244F5",
  text: "#1a2060",
  textSec: "#6b7890",
  border: "rgba(255,255,255,0.75)",
  sep: "rgba(18,68,245,0.07)",
  bgLight: "rgba(255,255,255,0.55)",
};

const statusColors: Record<string, string> = { connected: "#22c55e", error: "#ef4444" };
const statusLabels: Record<string, string> = { connected: "Подключен", error: "Ошибка" };

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
  selectPlan: (plan: "lite" | "pro") => void;
}) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const filteredAccounts = useMemo(() => accounts.filter(account => `${account.name} ${account.email}`.toLowerCase().includes(query.toLowerCase())), [accounts, query]);
  const activeCount = accounts.filter(a => a.status === "connected").length;

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="relative mx-auto mb-5 flex w-full max-w-5xl flex-col gap-4 rounded-[1.6rem] border border-white/18 bg-white/12 px-6 py-4 shadow-glass backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-center lg:gap-8">
      <div className="flex items-center gap-3">
        <Image src={aviLogo} alt="AviEngine" width={42} height={42} className="rounded-2xl shadow-[0_18px_45px_rgba(20,85,255,.35)]" />
        <span className="text-xl font-black tracking-tight text-white drop-shadow-sm">AviEngine</span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubscriptionWidget subscription={subscription} subscriptionState={subscriptionState} plans={subscriptionPlans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} open={subscriptionOpen} setOpen={setSubscriptionOpen} cycleSubscription={cycleSubscription} onSelectPlan={selectPlan} />
        <Button type="button" variant="secondary" size="sm" onClick={() => setAccountsOpen(true)} className="border-white/25 bg-white/14 text-white hover:bg-white/20"><UserRound className="h-4 w-4" /> Аккаунты</Button>
      </div>
      {accountsOpen && mounted && createPortal(
        <div onClick={() => setAccountsOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(10,20,80,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 780, maxHeight: "88vh", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(18,68,245,0.25), 0 8px 24px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.5)" }}>
            {/* Blue gradient header */}
            <div style={{ background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 50%,#4880FF 100%)", padding: "24px 28px 22px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
              <button onClick={() => setAccountsOpen(false)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                <X size={16} color="white" />
              </button>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={20} color="white" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.3px" }}>Аккаунты</h2>
                </div>
                <div style={{ display: "flex", gap: 16, marginLeft: 52 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}><span style={{ fontWeight: 700, color: "white" }}>{activeCount}</span> активных</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}><span style={{ fontWeight: 700, color: "white" }}>{accounts.length}</span> всего</span>
                </div>
              </div>
            </div>
            {/* Search bar */}
            <div style={{ background: "#fff", padding: "14px 24px", borderBottom: `1px solid ${C.sep}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={15} color={C.textSec} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по имени или email…" style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 13, color: C.text, background: C.bgLight, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={addAccount} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", flexShrink: 0, background: "linear-gradient(135deg,#1244F5 0%,#1A52FF 100%)", borderRadius: 999 }}>
                <Plus size={15} /> Подключить аккаунт
              </button>
            </div>
            {/* Accounts grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px", background: "#f8fbff" }}>
              {filteredAccounts.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: C.textSec, fontSize: 14 }}>{query ? "Ничего не найдено" : "Нет подключённых аккаунтов"}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {filteredAccounts.map(acc => (
                  <div key={acc.id} style={{ background: "#fff", borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 14px rgba(18,68,245,0.08)", border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,rgba(18,68,245,0.08),rgba(18,68,245,0.04))", border: "1px solid rgba(18,68,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{acc.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.name}</div>
                        <div style={{ fontSize: 11, color: C.textSec, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.sep}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[acc.status] ?? C.textSec, boxShadow: acc.status === "connected" ? "0 0 6px rgba(34,197,94,0.5)" : "none", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: statusColors[acc.status] ?? C.textSec }}>{statusLabels[acc.status] ?? acc.status}</span>
                      </div>
                      <button onClick={() => removeAccount(acc.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

