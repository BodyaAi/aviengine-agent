"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import type { Account, Listing, PhotoMode, PublicationTemplate, PublicationVariant, SubscriptionPlan, SubscriptionState, SubscriptionStatus, Tab, Task, UpdateAction } from "../models/dashboard";

const cities = ["Москва", "Санкт‑Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Челябинск", "Самара", "Уфа", "Ростов-на-Дону", "Красноярск", "Воронеж", "Пермь", "Волгоград", "Краснодар", "Сочи", "Тюмень", "Иркутск", "Омск", "Владивосток"];

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
  {
    id: 1, name: "Авто — BMW X5", active: false, accounts: ["Applexis"], cities: ["Москва", "Санкт‑Петербург"],
    variants: [{ id: 1, name: "Объявление 1", count: 25, category: "Транспорт", title: "BMW X5 G05 2021", imageUrl: "https://images.unsplash.com/photo-1555215695-3004950ad420?w=400", price: 6200000 }],
  },
  {
    id: 2, name: "Электроника — iPhone 15 Pro", active: false, accounts: ["Applexis", "MotoDrive"], cities: ["Москва"],
    variants: [
      { id: 1, name: "Объявление 1", count: 25, category: "Электроника", title: "iPhone 15 Pro 256GB", imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", price: 99000 },
      { id: 2, name: "Объявление 2", count: 15, category: "Электроника", title: "AirPods Pro 2", imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400", price: 17900 },
    ],
  },
  {
    id: 3, name: "Мебель — Диван угловой", active: false, accounts: ["HomeCraft"], cities: [],
    variants: [{ id: 1, name: "Объявление 1", count: 5, category: "Мебель", title: "Диван угловой Moon", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", price: 45000 }],
  },
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
  accountId: i < 3 ? 1 : i < 5 ? 2 : i < 7 ? 4 : 5,
}));

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "lite",
    name: "Lite",
    price: "14 999 ₽ / месяц",
    slots: "До 20 аккаунтов",
    features: ["AI‑Контент: уникальные заголовки и описания", "Smart‑уникализация: города и фото", "Анти‑Бан: мониторинг лимитов", "Облачный запуск шаблонов", "Автообновление объявлений"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "29 999 ₽ / месяц",
    slots: "До 30 аккаунтов",
    features: ["Все функции тарифа Lite", "AI решение ошибок", "Smart‑Migration: копирование лучших объявлений 1:1"],
  },
];

function subscriptionView(state: SubscriptionState): SubscriptionStatus {
  const map: Record<SubscriptionState, SubscriptionStatus> = {
    trial_limits: { label: "Пробный период", value: "По лимитам", state },
    trial_ended: { label: "Пробный период", value: "Закончился", state },
    lite: { label: "Lite", value: "Активна", state, until: "до 12.05.2026" },
    pro: { label: "Pro", value: "Активна", state, until: "до 12.05.2025" },
    expired: { label: "Подписка", value: "Истекла", state },
  };
  return map[state];
}

const subscriptionCycle: SubscriptionState[] = ["trial_limits", "trial_ended", "lite", "pro", "expired"];

export function useDashboardState() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("manager");
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>("trial_limits");
  const [selectedPlan, setSelectedPlan] = useState<"lite" | "pro">("pro");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [templates, setTemplates] = useState<PublicationTemplate[]>(initialTemplates);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [updateAction, setUpdateAction] = useState<UpdateAction>("ai_text");
  const [photoMode, setPhotoMode] = useState<PhotoMode>("shuffle");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [customVariants, setCustomVariants] = useState<string[]>([]);

  const subscription = subscriptionView(subscriptionState);
  const isLocked = subscriptionState === "trial_ended" || subscriptionState === "expired";
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

  const addAccount = () => {
    const id = Date.now();
    setAccounts(current => [{ id, name: `Новый аккаунт ${current.length + 1}`, email: `account${current.length + 1}@avito.ru`, avatar: "N", status: "connected" }, ...current]);
  };
  const removeAccount = (id: number) => setAccounts(current => current.filter(account => account.id !== id));

  const stopTask = (id: number) => setTasks(current => current.map(task => task.id === id && task.status === "running" ? { ...task, status: "paused" } : task));
  const resumeTask = (id: number) => setTasks(current => current.map(task => task.id === id && task.status === "paused" ? { ...task, status: "running" } : task));
  const removeTask = (id: number) => setTasks(current => current.filter(task => task.id !== id));
  const clearTasks = () => setTasks([]);

  const createTemplate = () => setTemplates(current => [{ id: Date.now(), name: `Новый шаблон #${current.length + 1}`, active: false, accounts: [], cities: [], variants: [] }, ...current]);  const deleteTemplate = (id: number) => setTemplates(current => current.filter(template => template.id !== id));  const activateTemplate = (id: number) => {
    const template = templates.find(item => item.id === id);
    if (!template || template.accounts.length === 0 || template.cities.length === 0) return;
    const total = template.variants.reduce((sum, variant) => sum + variant.count, 0);
    setTemplates(current => current.map(item => item.id === id ? { ...item, active: true } : item));
    setTasks(current => [{ id: Date.now(), title: template.name, account: template.accounts.join(", "), progress: 0, count: total, done: 0, status: "running", templateId: id }, ...current]);
    toast({ title: "Шаблон добавлен в менеджер задач", description: `${template.name} — ${total} шт.`, variant: "success" });
  };
  const deactivateTemplate = (id: number) => setTemplates(current => current.map(template => template.id === id ? { ...template, active: false } : template));
  const updateTemplateName = (id: number, name: string) => setTemplates(current => current.map(template => template.id === id ? { ...template, name: name.slice(0, 64) } : template));
  const updateTemplateAccounts = (id: number, value: string[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, accounts: value } : template));
  const updateTemplateCities = (id: number, value: string[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, cities: value } : template));
  const updateTemplateVariants = (id: number, variants: PublicationVariant[]) => setTemplates(current => current.map(template => template.id === id ? { ...template, variants: variants.map((variant, index) => ({ ...variant, name: `Объявление ${index + 1}` })) } : template));

  const toggleListing = (id: number) => setListings(current => current.map(listing => listing.id === id ? { ...listing, selected: !listing.selected } : listing));
  const toggleAllListings = () => {
    const filteredListings = selectedAccountIds.length > 0 ? listings.filter(l => selectedAccountIds.includes(l.accountId)) : listings;
    const allSelected = filteredListings.every(l => l.selected);
    setListings(current => current.map(listing => {
      if (selectedAccountIds.length > 0 && !selectedAccountIds.includes(listing.accountId)) return listing;
      return { ...listing, selected: !allSelected };
    }));
  };

  const applyUpdateAction = (customTitle?: string) => {
    const chosen = listings.filter(listing => listing.selected && (selectedAccountIds.length === 0 || selectedAccountIds.includes(listing.accountId)));
    if (chosen.length === 0) return;

    const accountLabel = selectedAccountIds.length === 0
      ? "Все аккаунты"
      : selectedAccountIds.map(id => accounts.find(a => a.id === id)?.name).filter(Boolean).join(", ");

    setTasks(current => [{
      id: Date.now(),
      title: customTitle || `Обновление (${chosen.length} шт.)`,
      account: accountLabel,
      progress: 0,
      count: chosen.length,
      done: 0,
      status: "running"
    }, ...current]);

    setListings(current => current.map(listing => {
      if (!listing.selected || (selectedAccountIds.length > 0 && !selectedAccountIds.includes(listing.accountId))) return listing;
      return { ...listing, status: "queued", updated: "в очереди", nextUpdate: "После выполнения задачи" };
    }));
  };

  return {
    tab, setTab, cities,
    accounts, accountsOpen, setAccountsOpen, addAccount, removeAccount,
    subscription, subscriptionPlans, subscriptionState, isLocked, cycleSubscription, selectPlan,
    subscriptionOpen, setSubscriptionOpen, selectedPlan, setSelectedPlan,
    tasks, errors, stopTask, resumeTask, removeTask, clearTasks,
    templates, createTemplate, deleteTemplate, activateTemplate, deactivateTemplate, updateTemplateName, updateTemplateAccounts, updateTemplateCities, updateTemplateVariants,
    listings, selectedListings, toggleListing, toggleAllListings,
    selectedAccountIds, setSelectedAccountIds, updateAction, setUpdateAction, photoMode, setPhotoMode, uploadedPhotos, setUploadedPhotos, customVariants, setCustomVariants, applyUpdateAction,
  };
}





