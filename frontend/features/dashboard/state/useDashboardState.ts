"use client";

import { useMemo, useState } from "react";
import type { Account, Listing, ListingMode, PublicationTemplate, PublicationVariant, SubscriptionPlan, SubscriptionState, SubscriptionStatus, Tab, Task, TemplateMode } from "../models/dashboard";

const cities = ["Москва", "Санкт‑Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Краснодар", "Самара"];

const initialAccounts: Account[] = [
  { id: 1, name: "Applexis", email: "applexis@avito-seller.ru", avatar: "A", status: "connected" },
  { id: 2, name: "MotoDrive", email: "motodrive.seller@gmail.com", avatar: "M", status: "connected" },
  { id: 3, name: "HomeCraft", email: "homecraft.avito@yandex.ru", avatar: "H", status: "error" },
  { id: 4, name: "TechMarket", email: "techmarket.store@gmail.com", avatar: "T", status: "connected" },
  { id: 5, name: "FashionPoint", email: "fashionpoint.shop@yandex.ru", avatar: "F", status: "connected" },
  { id: 6, name: "AutoPartsPro", email: "autoparts.pro@yandex.ru", avatar: "P", status: "connected" },
];

const initialTasks: Task[] = [
  { id: 101, title: "Публикация AirPods Pro", account: "Applexis", progress: 60, count: 30, done: 18, status: "running" },
  { id: 102, title: "Обновление описаний", account: "Applexis", progress: 66, count: 50, done: 33, status: "error", error: "Ошибка авторизации: сессия истекла, выполните повторный вход в аккаунт" },
  { id: 103, title: "Публикация кресел", account: "HomeCraft", progress: 35, count: 20, done: 7, status: "running" },
  { id: 104, title: "Загрузка запчастей Toyota", account: "MotoDrive, Applexis, HomeCraft, TechMarket, AutoPartsPro", progress: 27, count: 45, done: 12, status: "queue", error: "Ошибка API Авито: превышен лимит запросов (429 Too Many Requests). Повтор через 30 мин." },
];

const initialTemplates: PublicationTemplate[] = [
  { id: 1, name: "Авто — BMW X5", active: false, accounts: ["Applexis"], cities: ["Москва", "Санкт‑Петербург"], mode: "auto", autoCount: 25, variants: [{ id: 1, name: "Базовый", count: 25 }] },
  { id: 2, name: "Электроника — iPhone 15 Pro", active: false, accounts: ["Applexis", "MotoDrive"], cities: ["Москва"], mode: "manual", autoCount: 25, variants: [{ id: 1, name: "Новый, запечатан", count: 25 }, { id: 2, name: "Б/у, идеал", count: 15 }] },
  { id: 3, name: "Мебель — Диван угловой", active: false, accounts: ["HomeCraft"], cities: [], mode: "auto", autoCount: 5, variants: [{ id: 1, name: "Базовый", count: 5 }] },
];

const titles = ["iPhone 15 Pro 256GB", "BMW X5 G05", "Диван угловой Moon", "AirPods Pro 2", "Toyota Camry фара", "MacBook Air M2", "Кресло офисное", "Шины Michelin"];
const prices = [99000, 6200000, 45000, 17900, 12500, 87000, 12900, 36000];
const statuses: Listing["status"][] = ["done", "idle", "queued", "updating", "error", "done", "idle", "done"];

const initialListings: Listing[] = titles.map((title, i) => ({
  id: i + 1,
  avitoId: 8320100 + i,
  title,
  price: prices[i],
  mode: i % 3 === 0 ? "auto" : "manual",
  selected: i < 3,
  updated: i % 2 ? "48 мин назад" : "2 ч назад",
  nextUpdate: i === 1 ? "Доступно через 14 мин" : "Доступно сейчас",
  status: statuses[i],
  error: statuses[i] === "error" ? "Фид не прошёл валидацию XML" : undefined,
}));

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "lite",
    name: "Lite",
    price: "14 999 ₽ / месяц",
    slots: "До 10 активных аккаунтов",
    features: ["AI‑Контент: уникальные заголовки и описания", "Smart‑уникализация: города и фото", "Анти‑Бан: мониторинг лимитов", "Облачный запуск шаблонов", "Автообновление объявлений"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "24 999 ₽ / месяц",
    slots: "До 20 активных аккаунтов",
    features: ["Все функции тарифа Lite", "AI решение ошибок", "Smart‑Migration: копирование лучших объявлений 1:1"],
  },
];

function subscriptionView(state: SubscriptionState): SubscriptionStatus {
  const map: Record<SubscriptionState, SubscriptionStatus> = {
    free: { label: "Подписка", value: "Нет подписки", state },
    trial_limits: { label: "Пробный период", value: "По лимитам", state },
    trial_ended: { label: "Пробный период", value: "Закончился", state },
    lite: { label: "Lite", value: "Активна", state, until: "до 12.05.2026" },
    pro: { label: "Pro", value: "Активна", state, until: "до 12.05.2025" },
    expired: { label: "Подписка", value: "Истекла", state },
  };
  return map[state];
}

const subscriptionCycle: SubscriptionState[] = ["free", "trial_limits", "trial_ended", "lite", "pro", "expired"];

export function useDashboardState() {
  const [tab, setTab] = useState<Tab>("manager");
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>("free");
  const [selectedPlan, setSelectedPlan] = useState<"lite" | "pro">("pro");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [templates, setTemplates] = useState<PublicationTemplate[]>(initialTemplates);
  const [listings, setListings] = useState<Listing[]>(initialListings);

  const subscription = subscriptionView(subscriptionState);
  const isLocked = subscriptionState === "free" || subscriptionState === "trial_ended" || subscriptionState === "expired";
  const errors = useMemo(() => tasks.filter(task => task.status === "error" || task.error), [tasks]);
  const selectedListings = useMemo(() => listings.filter(listing => listing.selected).length, [listings]);

  const cycleSubscription = () => {
    const next = subscriptionCycle[(subscriptionCycle.indexOf(subscriptionState) + 1) % subscriptionCycle.length];
    setSubscriptionState(next);
    if (next === "trial_ended" || next === "expired") setSubscriptionOpen(true);
  };

  const selectPlan = (plan: "lite" | "pro") => {
    setSelectedPlan(plan);
    setSubscriptionState(plan);
    setSubscriptionOpen(false);
  };

  const startTrial = () => setSubscriptionState("trial_limits");

  const addAccount = () => {
    const id = Date.now();
    setAccounts(current => [{ id, name: `Новый аккаунт ${current.length + 1}`, email: `account${current.length + 1}@avito.ru`, avatar: "N", status: "connected" }, ...current]);
  };
  const removeAccount = (id: number) => setAccounts(current => current.filter(account => account.id !== id));

  const runAgent = () => setTasks(current => current.map(task => task.status === "queue" || task.status === "paused" ? { ...task, status: "running", progress: Math.max(task.progress, 34) } : task));
  const stopTask = (id: number) => setTasks(current => current.map(task => task.id === id && task.status === "running" ? { ...task, status: "paused" } : task));
  const resumeTask = (id: number) => setTasks(current => current.map(task => task.id === id && task.status === "paused" ? { ...task, status: "running" } : task));
  const removeTask = (id: number) => setTasks(current => current.filter(task => task.id !== id));
  const clearTasks = () => setTasks([]);

  const createTemplate = () => setTemplates(current => [{ id: Date.now(), name: `Новый шаблон #${current.length + 1}`, active: false, accounts: [], cities: [], mode: "auto", autoCount: 10, variants: [] }, ...current]);
  const deleteTemplate = (id: number) => setTemplates(current => current.filter(template => template.id !== id));
  const activateTemplate = (id: number) => {
    const template = templates.find(item => item.id === id);
    if (!template || template.accounts.length === 0 || template.cities.length === 0) return;
    const total = template.mode === "auto" ? template.autoCount : template.variants.reduce((sum, variant) => sum + variant.count, 0);
    setTemplates(current => current.map(item => item.id === id ? { ...item, active: true } : item));
    setTasks(current => [{ id: Date.now(), title: template.name, account: template.accounts.join(", "), progress: 0, count: total, done: 0, status: "running", templateId: id }, ...current]);
    setTab("manager");
  };
  const deactivateTemplate = (id: number) => setTemplates(current => current.map(template => template.id === id ? { ...template, active: false } : template));
  const updateTemplateAccounts = (id: number, value: string[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, accounts: value } : template));
  const updateTemplateCities = (id: number, value: string[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, cities: value } : template));
  const updateTemplateMode = (id: number, mode: TemplateMode) => setTemplates(current => current.map(template => template.id === id ? { ...template, mode, variants: mode === "auto" ? [{ id: Date.now(), name: "Базовый", count: template.autoCount }] : template.variants } : template));
  const updateTemplateAutoCount = (id: number, autoCount: number) => setTemplates(current => current.map(template => template.id === id ? { ...template, autoCount } : template));
  const updateTemplateVariants = (id: number, variants: PublicationVariant[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, variants } : template));

  const toggleListing = (id: number) => setListings(current => current.map(listing => listing.id === id ? { ...listing, selected: !listing.selected } : listing));
  const toggleAllListings = () => setListings(current => current.map(listing => ({ ...listing, selected: selectedListings !== current.length })));
  const setListingMode = (mode: ListingMode) => setListings(current => current.map(listing => listing.selected ? { ...listing, mode } : listing));
  const updateSelectedListings = () => {
    const chosen = listings.filter(listing => listing.selected);
    if (chosen.length === 0) return;
    setTasks(current => [{ id: Date.now(), title: `Обновление объявлений (${chosen.length} шт.)`, account: "Выбранные аккаунты", progress: 0, count: chosen.length, done: 0, status: "running" }, ...current]);
    setListings(current => current.map(listing => listing.selected ? { ...listing, status: "queued", updated: "в очереди", nextUpdate: "После выполнения задачи" } : listing));
    setTab("manager");
  };

  return {
    tab, setTab, cities,
    accounts, accountsOpen, setAccountsOpen, addAccount, removeAccount,
    subscription, subscriptionPlans, subscriptionState, isLocked, cycleSubscription, startTrial, selectPlan,
    subscriptionOpen, setSubscriptionOpen, selectedPlan, setSelectedPlan,
    tasks, errors, runAgent, stopTask, resumeTask, removeTask, clearTasks,
    templates, createTemplate, deleteTemplate, activateTemplate, deactivateTemplate, updateTemplateAccounts, updateTemplateCities, updateTemplateMode, updateTemplateAutoCount, updateTemplateVariants,
    listings, selectedListings, toggleListing, toggleAllListings, setListingMode, updateSelectedListings,
  };
}
