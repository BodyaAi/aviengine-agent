"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Account, PublicationTemplate, PublicationVariant } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

export function PublicationTab({ accounts, cities, templates, createTemplate, deleteTemplate, activateTemplate, deactivateTemplate, updateTemplateName, updateTemplateAccounts, updateTemplateCities, updateTemplateVariants }: { accounts: Account[]; cities: string[]; templates: PublicationTemplate[]; createTemplate: () => void; deleteTemplate: (id: number) => void; activateTemplate: (id: number) => void; deactivateTemplate: (id: number) => void; updateTemplateName: (id: number, name: string) => void; updateTemplateAccounts: (id: number, value: string[]) => void; updateTemplateCities: (id: number, value: string[]) => void; updateTemplateVariants: (id: number, variants: PublicationVariant[]) => void }) {
  return <Card className="light-panel text-ink-900"><PanelHeader icon={FileText} title="Шаблоны" action={<Button size="sm" onClick={createTemplate}><Plus className="h-4 w-4" /> Создать</Button>} /><div className="space-y-4 p-5 pt-0">{templates.map(template => <TemplateCard key={template.id} template={template} accountNames={accounts.map(account => account.name)} cities={cities} deleteTemplate={deleteTemplate} activateTemplate={activateTemplate} deactivateTemplate={deactivateTemplate} updateTemplateName={updateTemplateName} updateTemplateAccounts={updateTemplateAccounts} updateTemplateCities={updateTemplateCities} updateTemplateVariants={updateTemplateVariants} />)}{templates.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-primary-300 bg-primary-50 p-10 text-center text-ink-500">Шаблонов пока нет</div>}</div></Card>;
}

function TemplateCard({ template, accountNames, cities, deleteTemplate, activateTemplate, deactivateTemplate, updateTemplateName, updateTemplateAccounts, updateTemplateCities, updateTemplateVariants }: { template: PublicationTemplate; accountNames: string[]; cities: string[]; deleteTemplate: (id: number) => void; activateTemplate: (id: number) => void; deactivateTemplate: (id: number) => void; updateTemplateName: (id: number, name: string) => void; updateTemplateAccounts: (id: number, value: string[]) => void; updateTemplateCities: (id: number, value: string[]) => void; updateTemplateVariants: (id: number, variants: PublicationVariant[]) => void }) {
  const toggleValue = (value: string, values: string[], onChange: (value: string[]) => void) => onChange(values.includes(value) ? values.filter(item => item !== value) : [...values, value]);
  const addVariant = () => updateTemplateVariants(template.id, [...template.variants, { id: Date.now(), name: `Объявление ${template.variants.length + 1}`, count: 10, category: "", title: "", imageUrl: "", price: 0 }]);
  const updateVariantCount = (id: number, count: number) => updateTemplateVariants(template.id, template.variants.map(item => item.id === id ? { ...item, count } : item));

  return <div className={`rounded-3xl border p-5 shadow-[0_16px_42px_rgba(20,85,255,.08)] transition-colors duration-300 ${template.active ? "border-green-300 bg-green-50" : "border-primary-900/10 bg-white/78"}`}>
    <div className="mb-4 flex items-center justify-between gap-3"><Input maxLength={64} value={template.name} onChange={event => updateTemplateName(template.id, event.target.value)} className="h-9 border-0 bg-transparent p-0 text-base font-black text-ink-900" /><div className="flex items-center gap-2">{template.active && <Badge variant="success">Активен</Badge>}<Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => deleteTemplate(template.id)}><Trash2 className="h-5 w-5" /></Button></div></div>
    <SearchableSelector label="Аккаунты" placeholder="Поиск аккаунта…" values={accountNames} selected={template.accounts} onToggle={value => toggleValue(value, template.accounts, next => updateTemplateAccounts(template.id, next))} />
    <SearchableSelector label="Города (гео)" placeholder="Поиск города…" values={cities} selected={template.cities} onToggle={value => toggleValue(value, template.cities, next => updateTemplateCities(template.id, next))} />
    <div className="mt-4 rounded-2xl border border-primary-900/10 bg-primary-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3"><span className="font-bold">Варианты объявлений</span></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{template.variants.map(variant => <VariantCard key={variant.id} variant={variant} updateVariantCount={updateVariantCount} deleteVariant={(id) => updateTemplateVariants(template.id, template.variants.filter(item => item.id !== id))} />)}</div>
      <Button variant="ghost" size="sm" className="mt-3 text-primary-700" onClick={addVariant}><Plus className="h-4 w-4" /> Создать объявление</Button>
    </div>
    <Button className="mt-4 w-full rounded-2xl" variant={template.active ? "destructive" : "default"} onClick={() => template.active ? deactivateTemplate(template.id) : activateTemplate(template.id)}>{template.active ? "Деактивировать" : "Активировать"}</Button>
    {(template.accounts.length === 0 || template.cities.length === 0) && !template.active && <div className="mt-2 text-center text-xs text-warning">Для активации выберите аккаунт и город</div>}
  </div>;
}

function VariantCard({ variant, updateVariantCount, deleteVariant }: { variant: PublicationVariant; updateVariantCount: (id: number, count: number) => void; deleteVariant: (id: number) => void }) {
  return <div className="rounded-2xl border border-primary-200 bg-white p-3 shadow-sm transition hover:shadow-md">
    {/* Photo */}
    <div className="mb-2 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 via-white to-cyan/20">
      {variant.imageUrl ? <img src={variant.imageUrl} alt={variant.title} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-primary-200"><FileText className="h-8 w-8" /></div>}
    </div>
    {/* Info */}
    {variant.category && <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">{variant.category}</div>}
    <h4 className="mb-1 line-clamp-2 text-sm font-bold text-ink-900">{variant.title || "Без заголовка"}</h4>
    <div className="mb-2 text-base font-black text-primary-700">{variant.price > 0 ? `${variant.price.toLocaleString("ru-RU")} ₽` : "—"}</div>
    {/* Count + delete */}
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <input type="text" inputMode="numeric" pattern="[0-9]*" value={variant.count} onChange={event => { const n = parseInt(event.target.value.replace(/\D/g, "")) || 0; updateVariantCount(variant.id, n < 1 ? 1 : n > 500 ? 500 : n); }} className="h-8 w-14 rounded-lg border border-primary-200 bg-ink-50 text-center text-sm font-black text-primary-700 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <span className="text-xs font-bold text-ink-400">шт</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => deleteVariant(variant.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </div>;
}

function SearchableSelector({ label, placeholder, values, selected, onToggle }: { label: string; placeholder: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => values.filter(value => value.toLowerCase().includes(query.toLowerCase())), [values, query]);
  return <div className="mb-3"><div className="mb-2 text-[10px] font-black uppercase tracking-wider text-ink-400">{label}</div><div className="relative mb-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder={placeholder} className="h-9 rounded-xl border-primary-900/10 bg-white pl-9 text-ink-900" /></div><div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-primary-900/10 bg-primary-50/60 p-2">{filtered.map(value => <button key={value} onClick={() => onToggle(value)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${selected.includes(value) ? "border-primary-300 bg-primary-600 text-white" : "border-primary-900/10 bg-white text-primary-700"}`}>{value}</button>)}</div></div>;
}


