"use client";

import { motion } from "framer-motion";
import { ChevronRight, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicationTemplate } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

export function PublicationTab({ templates, activateTemplate }: { templates: PublicationTemplate[]; activateTemplate: (id: number) => void }) {
  return (
    <div className="space-y-5">
      <Card className="light-panel text-ink-900">
        <PanelHeader icon={FileText} title="Шаблоны публикаций" action={<Button size="sm"><Plus className="h-4 w-4" /> Создать</Button>} />
        <div className="grid gap-4 p-5 pt-0 md:grid-cols-2">
          {templates.map(template => <TemplateCard key={template.id} template={template} activateTemplate={activateTemplate} />)}
          <EmptyState />
        </div>
      </Card>
    </div>
  );
}

function TemplateCard({ template, activateTemplate }: { template: PublicationTemplate; activateTemplate: (id: number) => void }) {
  return (
    <div className="rounded-3xl border border-primary-900/10 bg-white/72 p-5 shadow-[0_16px_42px_rgba(20,85,255,.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <b>{template.name}</b>
        {template.active ? <Badge variant="success">Активен</Badge> : <Button size="sm" onClick={() => activateTemplate(template.id)}>Активировать</Button>}
      </div>
      <Field label="Аккаунты" value={template.accounts.join(", ")} />
      <Field label="Города" value={template.cities.join(", ")} />
      <div className="mt-4 rounded-2xl bg-primary-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold">Варианты объявлений</span>
          <Badge variant="blue">АВТО</Badge>
        </div>
        <button className="flex w-full items-center justify-between rounded-xl border border-primary-200 bg-white px-4 py-3 text-left text-sm font-semibold">
          Базовый <ChevronRight className="h-4 w-4" />
        </button>
        <Button variant="ghost" size="sm" className="mt-2 text-primary-700"><Plus className="h-4 w-4" /> Создать объявление</Button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="mb-3"><div className="mb-1 text-[10px] font-black uppercase tracking-wider text-ink-400">{label}</div><div className="rounded-xl border border-primary-900/10 bg-primary-50 px-3 py-2 text-sm text-ink-700">{value}</div></div>;
}

function EmptyState() {
  return <motion.div whileHover={{ y: -4 }} className="grid min-h-[240px] place-items-center rounded-3xl border border-dashed border-primary-300/70 bg-primary-50/70 p-6 text-center"><div><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary-700 shadow-sm"><Plus className="h-5 w-5" /></div><b>Создайте новый шаблон</b><p className="mt-2 text-sm leading-6 text-ink-500">Добавьте аккаунты, города и варианты объявлений — всё будет готово к запуску.</p></div></motion.div>;
}
