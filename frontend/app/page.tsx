"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Rocket, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShaderOrb } from "@/components/effects/shader-orb";

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: .7, ease: [0.22, 1, 0.36, 1] } };

export default function LandingPage() {
  return (
    <main className="premium-flow-bg relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.72),transparent_28%),linear-gradient(180deg,rgba(4,18,54,.08),rgba(4,18,54,.78))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-35" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/20 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-600 shadow-glow"><span className="font-black">A</span></div><span className="text-lg font-black tracking-tight drop-shadow">AviEngine</span></Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/80 md:flex"><a href="#possibilities" className="hover:text-white">Возможности</a><a href="#how" className="hover:text-white">Как работает</a><a href="#pricing" className="hover:text-white">Тарифы</a></nav>
          <Button asChild size="sm" className="avito-gradient-button"><Link href="/login">Войти через Авито</Link></Button>
        </div>
      </header>

      <section className="container relative z-10 grid min-h-screen items-center gap-10 pt-28 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
          <Badge className="mb-6 border-white/30 bg-white/25 text-white shadow-glass"><Sparkles className="mr-1 h-3.5 w-3.5" /> Автопилот для авитолога и команды продаж</Badge>
          <h1 className="text-balance text-5xl font-black leading-[.94] tracking-[-.055em] text-white drop-shadow-[0_18px_60px_rgba(4,18,54,.45)] md:text-7xl">Выкладывайте объявления на Авито без рутины</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">AviEngine помогает создавать, публиковать, обновлять и масштабировать объявления из одной красивой панели. Больше порядка, меньше ручной работы, прозрачный контроль по каждому аккаунту.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="avito-gradient-button h-14 px-8 text-base"><Link href="/login"><UserRound className="h-5 w-5" /> Войти через Авито</Link></Button>
            <Button variant="secondary" size="lg" asChild className="h-14 border-white/30 bg-white/18 px-8 text-base text-white hover:bg-white/25"><Link href="/dashboard">Посмотреть демо <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center"><Metric v="10×" l="быстрее выкладка" /><Metric v="1 окно" l="вся работа" /><Metric v="24/7" l="контроль задач" /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative h-[620px]">
          <ShaderOrb className="absolute inset-x-0 top-0 h-[420px] opacity-75" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="liquid-card absolute bottom-14 left-0 right-0 mx-auto max-w-[560px] rounded-[2rem] border border-white/35 bg-white/22 p-3 shadow-premium backdrop-blur-2xl">
            <div className="rounded-[1.45rem] bg-white/86 p-5 text-ink-900 shadow-glass">
              <div className="mb-5 flex items-center justify-between"><div><span className="text-sm font-black">Демо панели AviEngine</span><p className="mt-1 text-xs text-ink-500">Так выглядит ежедневная работа без хаоса</p></div><Badge variant="success">Активно</Badge></div>
              {[ ["Менеджер задач", "Видно, что публикуется и где нужна проверка", 76], ["Публикация", "Шаблоны, города и аккаунты в одном месте", 88], ["Обновление", "Выбор объявлений и удобные режимы", 54] ].map((r, i) => <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .16 }} key={r[0] as string} className="mb-3 rounded-2xl border border-primary-900/10 bg-primary-50/80 p-4"><div className="mb-2 flex justify-between text-sm"><b>{r[0]}</b><span className="text-primary-700">{r[2]}%</span></div><div className="h-2 overflow-hidden rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} animate={{ width: `${r[2]}%` }} transition={{ duration: 1.2, delay: .55 + i * .18 }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div><p className="mt-2 text-xs text-ink-500">{r[1]}</p></motion.div>)}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="possibilities" className="container relative z-10 py-24"><motion.div {...fade} className="mx-auto max-w-3xl text-center"><Badge className="border-white/30 bg-white/20 text-white">Возможности</Badge><h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Всё, что нужно для массовой выкладки</h2><p className="mt-5 text-white/72">Смысловые акценты лендинга: подключение аккаунтов, создание шаблонов, запуск публикаций, обновление объявлений и контроль результата.</p></motion.div><div className="mt-14 grid gap-5 md:grid-cols-3"><Feature icon={Rocket} title="Быстрая публикация" text="Создавайте шаблоны, варианты объявлений, выбирайте города и аккаунты без лишних действий." /><Feature icon={RefreshCw} title="Регулярное обновление" text="Отмечайте нужные объявления и выбирайте удобный режим обновления — автоматически или вручную." /><Feature icon={ShieldCheck} title="Порядок и контроль" text="Статусы, ошибки, активные задачи и подключённые аккаунты собраны в понятной панели." /></div></section>

      <section id="how" className="container relative z-10 py-20"><motion.div {...fade} className="glass-panel rounded-[2rem] p-8 md:p-12"><div className="grid gap-8 md:grid-cols-[.9fr_1.1fr]"><div><Badge className="border-white/30 bg-white/15 text-white">Как это выглядит</Badge><h2 className="mt-5 text-4xl font-black tracking-tight">От шаблона до результата — в несколько кликов</h2><p className="mt-4 text-white/68">AviEngine берёт на себя повторяемые действия, а авитолог управляет стратегией: какие аккаунты использовать, сколько объявлений публиковать и когда обновлять активные позиции.</p></div><div className="grid gap-3"><Step n="01" t="Подключите аккаунты" d="Все рабочие аккаунты отображаются в едином пространстве." /><Step n="02" t="Создайте шаблоны" d="Настройте города, варианты и количество публикаций." /><Step n="03" t="Запустите работу" d="Следите за прогрессом в менеджере задач и обновлениях." /></div></div></motion.div></section>

      <section id="pricing" className="container relative z-10 pb-28 pt-10"><div className="glass-panel rounded-[2rem] p-8 md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_360px]"><div><Badge className="border-white/30 bg-white/15 text-white">Прозрачная оплата</Badge><h2 className="mt-5 text-4xl font-black tracking-tight">Платите за подключённые аккаунты</h2><p className="mt-4 max-w-2xl text-white/68">Удобная модель для частных авитологов, агентств и отделов продаж. Масштабируйте работу постепенно и контролируйте активные слоты.</p></div><div className="rounded-3xl border border-white/18 bg-white/16 p-6 backdrop-blur-xl"><div className="text-sm text-white/65">Профессиональный тариф</div><div className="mt-2 text-4xl font-black">от 9 900 ₽</div><Button className="avito-gradient-button mt-6 w-full" asChild><Link href="/login">Войти через Авито</Link></Button></div></div></div></section>
    </main>
  );
}

function Metric({ v, l }: { v: string; l: string }) { return <div className="rounded-2xl border border-white/25 bg-white/20 p-4 shadow-glass backdrop-blur"><div className="text-xl font-black">{v}</div><div className="text-xs text-white/72">{l}</div></div>; }
function Feature({ icon: Icon, title, text }: any) { return <motion.div {...fade} className="glass-panel rounded-3xl p-6"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/18 text-cyan"><Icon /></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/68">{text}</p></motion.div>; }
function Step({ n, t, d }: { n: string; t: string; d: string }) { return <div className="rounded-3xl border border-white/16 bg-white/12 p-5"><div className="text-xs font-black text-cyan">{n}</div><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-2 text-sm text-white/58">{d}</p></div>; }
