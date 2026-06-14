"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Layers3, LockKeyhole, RefreshCw, Rocket, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShaderOrb } from "@/components/effects/shader-orb";

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: .7, ease: [0.22, 1, 0.36, 1] } };

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-blue-radial text-white">
      <div className="aurora" /><div className="dot-grid pointer-events-none fixed inset-0 opacity-40" />
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-ink-950/45 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-600 shadow-glow"><span className="font-black">A</span></div><span className="text-lg font-black tracking-tight">AviEngine</span></Link>
          <nav className="hidden items-center gap-7 text-sm text-white/62 md:flex"><a href="#product" className="hover:text-white">Продукт</a><a href="#system" className="hover:text-white">Система</a><a href="#pricing" className="hover:text-white">Тарифы</a></nav>
          <Button asChild size="sm"><Link href="/dashboard">Открыть демо <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </header>

      <section className="container relative z-10 grid min-h-screen items-center gap-12 pt-28 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
          <Badge className="mb-6" variant="blue"><Sparkles className="mr-1 h-3.5 w-3.5" /> Enterprise automation for Avito API</Badge>
          <h1 className="text-balance text-5xl font-black leading-[.94] tracking-[-.055em] md:text-7xl">Премиальный автопилот публикаций для Авито</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/64">AviEngine заменяет рутинный отдел выкладки: публикует фиды через Autoload, обновляет объявления, управляет шаблонами, слотами и Smart‑Migration в единой B2B‑панели.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/dashboard">Перейти в интерфейс <ArrowRight className="h-4 w-4" /></Link></Button><Button variant="secondary" size="lg" asChild><a href="#product">Смотреть дизайн</a></Button></div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center"><Metric v="24/7" l="workers" /><Metric v="OAuth" l="официально" /><Metric v="1h" l="лимит обновлений" /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative h-[620px]">
          <ShaderOrb className="absolute inset-x-0 top-0 h-[420px] opacity-90" />
          <div className="absolute bottom-16 left-0 right-0 mx-auto max-w-[560px] rounded-[2rem] border border-white/14 bg-ink-950/55 p-3 shadow-premium backdrop-blur-2xl">
            <div className="rounded-[1.45rem] bg-white/[.06] p-4">
              <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold">Live publication pipeline</span><Badge variant="success">Stable</Badge></div>
              {[["Recording meta", "Синхронизация полей Авито", 100], ["Autoload feed", "XML/JSON сформирован", 82], ["Posting worker", "Очередь и rate limits", 64], ["Update worker", "Активные объявления", 48]].map((r) => <div key={r[0] as string} className="mb-3 rounded-2xl border border-white/10 bg-white/[.06] p-3"><div className="mb-2 flex justify-between text-sm"><b>{r[0]}</b><span className="text-white/45">{r[2]}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-primary-500" style={{ width: `${r[2]}%` }} /></div><p className="mt-2 text-xs text-white/45">{r[1]}</p></div>)}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="product" className="container relative z-10 py-24"><motion.div {...fade} className="mx-auto max-w-3xl text-center"><Badge>Design system</Badge><h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Глубокий синий, стекло, точная сетка</h2><p className="mt-5 text-white/58">Редизайн сохраняет UX прототипа, но заменяет устаревшие inline‑стили на цельную систему компонентов, состояний и motion‑паттернов.</p></motion.div><div className="mt-14 grid gap-5 md:grid-cols-3"><Feature icon={Rocket} title="Публикация" text="Шаблоны, варианты, города, аккаунты и запуск задач через Autoload pipeline." /><Feature icon={RefreshCw} title="Обновление" text="Новая полноценная вкладка: карточки объявлений, выбор, авто и ручной режим." /><Feature icon={ShieldCheck} title="Контроль ошибок" text="Технические ошибки показываются прозрачно, без кнопки и сценария «AI решение»." /></div></section>

      <section id="system" className="container relative z-10 py-20"><div className="grid gap-5 lg:grid-cols-4"><SystemCard n="01" t="OAuth" d="Привязка аккаунтов через официальный authorization_code flow." /><SystemCard n="02" t="Recording" d="Фиксация структуры формы в recording_meta без автоматики действий." /><SystemCard n="03" t="Feeds" d="Конвертация Template + Variant в корректный Autoload feed." /><SystemCard n="04" t="Workers" d="Публикация, обновления, миграция, backoff и аудит." /></div></section>

      <section id="pricing" className="container relative z-10 pb-28 pt-10"><div className="glass-panel rounded-[2rem] p-8 md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_360px]"><div><Badge variant="blue">Slot based billing</Badge><h2 className="mt-5 text-4xl font-black tracking-tight">Слоты = активные аккаунты</h2><p className="mt-4 max-w-2xl text-white/58">Прозрачная модель для авитологов и команд: подключайте аккаунты, контролируйте активность и масштабируйте публикации без ручной рутины.</p></div><div className="rounded-3xl border border-white/10 bg-white/[.06] p-6"><div className="text-sm text-white/45">Enterprise</div><div className="mt-2 text-4xl font-black">от 9 900 ₽</div><Button className="mt-6 w-full" asChild><Link href="/dashboard">Запустить демо</Link></Button></div></div></div></section>
    </main>
  );
}

function Metric({ v, l }: { v: string; l: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><div className="text-xl font-black">{v}</div><div className="text-xs text-white/45">{l}</div></div>; }
function Feature({ icon: Icon, title, text }: any) { return <motion.div {...fade} className="glass-panel rounded-3xl p-6"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-600/20 text-cyan"><Icon /></div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{text}</p></motion.div>; }
function SystemCard({ n, t, d }: { n: string; t: string; d: string }) { return <div className="rounded-3xl border border-white/10 bg-white/[.055] p-6"><div className="text-xs font-bold text-cyan">{n}</div><h3 className="mt-8 text-xl font-bold">{t}</h3><p className="mt-3 text-sm leading-6 text-white/50">{d}</p></div>; }
