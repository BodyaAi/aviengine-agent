"use client";

import { useMemo, useState } from "react";
import type { Account, Listing, PublicationTemplate, SubscriptionPlan, SubscriptionStatus, Tab, Task } from "../models/dashboard";

const initialAccounts: Account[] = [
  { id: 1, name: "Applexis", status: "active", slots: 4 },
  { id: 2, name: "MotoDrive", status: "ready", slots: 3 },
  { id: 3, name: "HomeCraft", status: "attention", slots: 2 },
  { id: 4, name: "TechMarket", status: "active", slots: 2 },
  { id: 5, name: "AutoPartsPro", status: "ready", slots: 1 },
];

const initialTasks: Task[] = [
  { id: 1, title: "Публикация AirPods Pro", account: "Applexis", progress: 72, status: "running" },
  { id: 2, title: "Загрузка запчастей Toyota", account: "MotoDrive, AutoPartsPro", progress: 27, status: "queue" },
  { id: 3, title: "Обновление описаний", account: "HomeCraft", progress: 0, status: "error", error: "Нужно повторно подтвердить доступ к аккаунту. После входа система продолжит работу автоматически." },
];

const initialTemplates: PublicationTemplate[] = [
  { id: 1, name: "Авто — BMW X5", active: true, accounts: ["Applexis", "MotoDrive"], cities: ["Москва", "Санкт‑Петербург", "Казань"] },
  { id: 2, name: "Электроника — iPhone 15 Pro", active: false, accounts: ["Applexis", "TechMarket"], cities: ["Москва", "Краснодар", "Екатеринбург"] },
  { id: 3, name: "Мебель — Диван угловой", active: false, accounts: ["HomeCraft"], cities: ["Санкт‑Петербург", "Казань"] },
];

const initialListings: Listing[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  avitoId: 8320100 + i,
  title: ["iPhone 15 Pro 256GB", "BMW X5 G05", "Диван угловой Moon", "AirPods Pro 2", "Toyota Camry фара", "MacBook Air M2", "Кресло офисное", "Шины Michelin"][i],
  price: [99000, 6200000, 45000, 17900, 12500, 87000, 12900, 36000][i],
  mode: i % 3 === 0 ? "Авто" : "Вручную",
  selected: i < 3,
  updated: i % 2 ? "48 мин назад" : "2 ч назад",
}));

const subscription: SubscriptionStatus = {
  label: "Подписка",
  value: "Активна",
  state: "active",
  until: "до 24.08.2026",
};

const subscriptionPlans: SubscriptionPlan[] = [
  { id: "start", name: "Start", price: "1 990 ₽", slots: "3 слота" },
  { id: "pro", name: "Pro", price: "4 990 ₽", slots: "10 слотов" },
  { id: "business", name: "Business", price: "9 990 ₽", slots: "30 слотов" },
];

export function useDashboardState() {
  const [tab, setTab] = useState<Tab>("manager");
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [templates, setTemplates] = useState<PublicationTemplate[]>(initialTemplates);
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const errors = useMemo(() => tasks.filter(task => task.status === "error"), [tasks]);
  const selectedListings = useMemo(() => listings.filter(listing => listing.selected).length, [listings]);

  const runAgent = () => {
    setTasks(current => current.map(task => task.status === "queue" || task.status === "paused" ? { ...task, status: "running", progress: Math.max(task.progress, 34) } : task));
  };

  const stopTask = (id: number) => {
    setTasks(current => current.map(task => task.id === id && task.status === "running" ? { ...task, status: "paused" } : task));
  };

  const resumeTask = (id: number) => {
    setTasks(current => current.map(task => task.id === id && task.status === "paused" ? { ...task, status: "running" } : task));
  };

  const removeTask = (id: number) => {
    setTasks(current => current.filter(task => task.id !== id));
  };

  const activateTemplate = (id: number) => {
    setTemplates(current => current.map(template => ({ ...template, active: template.id === id })));
  };

  const toggleListing = (id: number) => {
    setListings(current => current.map(listing => listing.id === id ? { ...listing, selected: !listing.selected } : listing));
  };

  const toggleAllListings = () => {
    setListings(current => current.map(listing => ({ ...listing, selected: selectedListings !== current.length })));
  };

  const updateSelectedListings = () => {
    setListings(current => current.map(listing => listing.selected ? { ...listing, updated: "только что" } : listing));
  };

  return {
    tab,
    setTab,
    accounts: initialAccounts,
    accountsOpen,
    setAccountsOpen,
    subscription,
    subscriptionPlans,
    subscriptionOpen,
    setSubscriptionOpen,
    selectedPlan,
    setSelectedPlan,
    tasks,
    errors,
    runAgent,
    stopTask,
    resumeTask,
    removeTask,
    templates,
    activateTemplate,
    listings,
    selectedListings,
    toggleListing,
    toggleAllListings,
    updateSelectedListings,
  };
}
