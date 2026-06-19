"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { TabSwitcher } from "@/features/dashboard/components/TabSwitcher";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { ManagerTab } from "@/features/dashboard/tabs/ManagerTab";
import { PublicationTab } from "@/features/dashboard/tabs/PublicationTab";
import { UpdatesTab } from "@/features/dashboard/tabs/UpdatesTab";

export default function DashboardPage() {
  const dashboard = useDashboardState();
  const [freeToastVisible, setFreeToastVisible] = useState(false);

  const handleContentClick = () => {
    if (!dashboard.isLocked) return;
    if (dashboard.subscriptionState === "free") {
      setFreeToastVisible(true);
      window.setTimeout(() => setFreeToastVisible(false), 2500);
      return;
    }
    dashboard.setSubscriptionOpen(true);
  };

  return (
    <main className="demo-flow-bg min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.20),transparent_30%),linear-gradient(180deg,rgba(4,18,54,.16),rgba(4,18,54,.62))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-25" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }} className="container relative z-10 py-6">
        <DashboardHeader accounts={dashboard.accounts} accountsOpen={dashboard.accountsOpen} setAccountsOpen={dashboard.setAccountsOpen} addAccount={dashboard.addAccount} removeAccount={dashboard.removeAccount} subscription={dashboard.subscription} subscriptionState={dashboard.subscriptionState} subscriptionPlans={dashboard.subscriptionPlans} subscriptionOpen={dashboard.subscriptionOpen} setSubscriptionOpen={dashboard.setSubscriptionOpen} selectedPlan={dashboard.selectedPlan} setSelectedPlan={dashboard.setSelectedPlan} cycleSubscription={dashboard.cycleSubscription} startTrial={dashboard.startTrial} selectPlan={dashboard.selectPlan} />
        <TabSwitcher tab={dashboard.tab} setTab={dashboard.setTab} />
        <section className="relative mx-auto mt-5 max-w-5xl" onClickCapture={handleContentClick}>
          {dashboard.isLocked && <div className="absolute inset-0 z-20 rounded-[2rem] bg-white/5 backdrop-blur-[1px]" />}
          <div className={dashboard.isLocked ? "pointer-events-none select-none opacity-60" : ""}>
          <AnimatePresence mode="wait">
            {dashboard.tab === "manager" && (
              <motion.div key="manager" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <ManagerTab tasks={dashboard.tasks} errors={dashboard.errors} runAgent={dashboard.runAgent} stopTask={dashboard.stopTask} resumeTask={dashboard.resumeTask} removeTask={dashboard.removeTask} clearTasks={dashboard.clearTasks} />
              </motion.div>
            )}
            {dashboard.tab === "publication" && (
              <motion.div key="publication" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <PublicationTab accounts={dashboard.accounts} cities={dashboard.cities} templates={dashboard.templates} createTemplate={dashboard.createTemplate} deleteTemplate={dashboard.deleteTemplate} activateTemplate={dashboard.activateTemplate} deactivateTemplate={dashboard.deactivateTemplate} updateTemplateAccounts={dashboard.updateTemplateAccounts} updateTemplateCities={dashboard.updateTemplateCities} updateTemplateMode={dashboard.updateTemplateMode} updateTemplateAutoCount={dashboard.updateTemplateAutoCount} updateTemplateVariants={dashboard.updateTemplateVariants} />
              </motion.div>
            )}
            {dashboard.tab === "updates" && (
              <motion.div key="updates" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <UpdatesTab listings={dashboard.listings} selectedListings={dashboard.selectedListings} toggleListing={dashboard.toggleListing} toggleAllListings={dashboard.toggleAllListings} setListingMode={dashboard.setListingMode} updateSelectedListings={dashboard.updateSelectedListings} />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </section>
        {freeToastVisible && <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/15 bg-ink-950/90 px-6 py-3 text-sm font-bold text-white shadow-glass backdrop-blur-xl">Начните пробный период</div>}
      </motion.div>
    </main>
  );
}
