export type Tab = "manager" | "publication" | "updates";

export type AccountStatus = "active" | "attention" | "ready";

export type Account = {
  id: number;
  name: string;
  status: AccountStatus;
  slots: number;
};

export type TaskStatus = "running" | "queue" | "error";

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

export type SubscriptionStatus = {
  label: string;
  value: string;
};
