export type Tab = "manager" | "publication" | "updates";
export type ManagerSubTab = "tasks" | "migration" | "ai";

export type AccountStatus = "connected" | "error";
export type SubscriptionState = "trial_limits" | "trial_ended" | "lite" | "pro" | "expired";
export type TaskStatus = "running" | "paused" | "queue" | "error" | "done";
export type ListingStatus = "idle" | "queued" | "updating" | "done" | "error";
export type ListingMode = "auto" | "manual";
export type UpdateAction = "ai_text" | "ai_photos" | "upload_photos" | "custom_text" | "refresh";
export type PhotoMode = "shuffle" | "viktor_unique";

export type Account = {
  id: number;
  name: string;
  email: string;
  status: AccountStatus;
  avatar: string;
};

export type SubscriptionPlan = {
  id: "lite" | "pro";
  name: "Lite" | "Pro";
  price: string;
  slots: string;
};

export type SubscriptionStatus = {
  label: string;
  value: string;
  state: SubscriptionState;
  until?: string;
};

export type Task = {
  id: number;
  title: string;
  account: string;
  progress: number;
  status: TaskStatus;
  count: number;
  done: number;
  templateId?: number;
  error?: string;
};

export type PublicationVariant = {
  id: number;
  name: string;
  count: number;
  category: string;
  title: string;
  imageUrl: string;
  price: number;
};

export type PublicationTemplate = {
  id: number;
  name: string;
  active: boolean;
  accounts: string[];
  cities: string[];
  variants: PublicationVariant[];
};

export type Listing = {
  id: number;
  avitoId: number;
  title: string;
  price: number;
  imageUrl?: string;
  mode: ListingMode;
  selected: boolean;
  updated: string;
  nextUpdate: string;
  status: ListingStatus;
  error?: string;
  accountId?: number;
};
