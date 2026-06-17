"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DashboardHeader } from "./components/DashboardHeader";
import { TabSwitcher } from "./components/TabSwitcher";
import { useDashboardState } from "./state/useDashboardState";
import { ManagerTab } from "./tabs/ManagerTab";
import { PublicationTab } from "./tabs/PublicationTab";
import { UpdatesTab } from "./tabs/UpdatesTab";

export default function DashboardPage() {
  const dashboard = useDashboardState();

  return (
    <main className="demo-flow-bg min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.20),transparent_30%),linear-gradient(180deg,rgba(4,18,54,.16),rgba(4,18,54,.62))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-25" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }} className="container relative z-10 py-6">
        <DashboardHeader accounts={dashboard.accounts} accountsOpen={dashboard.accountsOpen} setAccountsOpen={dashboard.setAccountsOpen} subscription={dashboard.subscription} subscriptionPlans={dashboard.subscriptionPlans} subscriptionOpen={dashboard.subscriptionOpen} setSubscriptionOpen={dashboard.setSubscriptionOpen} selectedPlan={dashboard.selectedPlan} setSelectedPlan={dashboard.setSelectedPlan} />
        <TabSwitcher tab={dashboard.tab} setTab={dashboard.setTab} />
        <section className="mx-auto mt-5 max-w-5xl">
          <AnimatePresence mode="wait">
            {dashboard.tab === "manager" && (
              <motion.div key="manager" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <ManagerTab tasks={dashboard.tasks} errors={dashboard.errors} runAgent={dashboard.runAgent} stopTask={dashboard.stopTask} resumeTask={dashboard.resumeTask} removeTask={dashboard.removeTask} />
              </motion.div>
            )}
            {dashboard.tab === "publication" && (
              <motion.div key="publication" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <PublicationTab templates={dashboard.templates} activateTemplate={dashboard.activateTemplate} />
              </motion.div>
            )}
            {dashboard.tab === "updates" && (
              <motion.div key="updates" initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(8px)" }} transition={{ duration: .42 }}>
                <UpdatesTab listings={dashboard.listings} selectedListings={dashboard.selectedListings} toggleListing={dashboard.toggleListing} toggleAllListings={dashboard.toggleAllListings} updateSelectedListings={dashboard.updateSelectedListings} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </main>
  );
}
