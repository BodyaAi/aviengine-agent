export type Tab = "manager" | "publication" | "updates";

export type AccountStatus = "active" | "attention" | "ready";
export type SubscriptionState = "active" | "inactive" | "trial";
export type TaskStatus = "running" | "paused" | "queue" | "error" | "done";

export type Account = {
  id: number;
  name: string;
  status: AccountStatus;
  slots: number;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  slots: string;
};

export type SubscriptionStatus = {
  label: string;
  value: string;
  state: SubscriptionState;
  until: string;
};

export type Task = {
  id: number;
  title: string;
  account: string;
  progress: number;
  status: TaskStatus;
  error?: string;
};

export type PublicationTemplate = {
  id: number;
  name: string;
  active: boolean;
  accounts: string[];
  cities: string[];
};

export type Listing = {
  id: number;
  avitoId: number;
  title: string;
  price: number;
  mode: "Авто" | "Вручную";
  selected: boolean;
  updated: string;
};

