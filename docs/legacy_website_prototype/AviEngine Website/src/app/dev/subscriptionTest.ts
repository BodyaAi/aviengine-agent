// ── DEV ONLY: Subscription test cycling logic ─────────────
// Extracted here so it's completely separate from production code.

import type { SubscriptionStatus } from "../context/AppContext";

/** Cycle order when tapping the subscription widget */
export const TEST_CYCLE: SubscriptionStatus[] = [
  "free",
  "trial_limits",
  "lite",
  "pro",
  "trial_ended",
  "expired",
];

/** Only these two states trigger the pricing modal */
export const PAYWALL_STATES: SubscriptionStatus[] = ["trial_ended", "expired"];

export function getNextTestStatus(current: SubscriptionStatus): SubscriptionStatus {
  const i = TEST_CYCLE.indexOf(current);
  if (i === -1) return TEST_CYCLE[0];
  return TEST_CYCLE[(i + 1) % TEST_CYCLE.length];
}

export function isPaywallState(status: SubscriptionStatus): boolean {
  return PAYWALL_STATES.includes(status);
}
