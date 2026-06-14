"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, RefreshCw, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShaderOrb } from "@/components/effects/shader-orb";
import aviLogo from "../../docs/legacy_website_prototype/AviEngine Website/src/assets/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

const fade = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-120px" }, transition: { duration: .85, ease: [0.22, 1, 0.36, 1] } };

export default function LandingPage() {
  return (
    <main className="premium-flow-bg relative min-h-screen overflow-hidden text-white">
      <div className="premium-noise pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,.62),transparent_26%),linear-gradient(180deg,rgba(4,18,54,.05),rgba(4,18,54,.72))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-20" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/16 bg-white/12 backdrop-blur-2xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl shadow-[0_14px_38px_rgba(17,70,220,.32)]" />
            <span className="text-lg font-black tracking-tight drop-shadow">AviEngine</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/78 md:flex">
            <a href="#benefits" className="transition hover:text-white">Возможности</a>
            <a href="#demo" className="transition hover:text-white">Демо</a>
          </nav>
        </div>
      </header>

      <section className="container relative z-10 grid min-h-screen items-center gap-10 pt-28 lg:grid-cols-[1.02fr_.98fr]">
        <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-8 flex items-center gap-3">
            <Image src={aviLogo} alt="AviEngine" width={54} height={54} className="rounded-2xl shadow-[0_22px_60px_rgba(17,70,220,.35)]" />
            <div>
              <div className="text-xl font-black tracking-tight">AviEngine</div>
              <div className="text-sm text-white/62">Панель для профессиональной выкладки</div>
            </div>
          </div>
          <h1 className="text-balance max-w-4xl text-5xl font-black leading-[.93] tracking-[-.058em] text-white drop-shadow-[0_22px_70px_rgba(4,18,54,.48)] md:text-7xl">Выкладывайте объявления на Авито без рутины</h1>
          <p className="mt-8 max-w-[650px] text-[19px] font-medium leading-9 tracking-[-.015em] text-white/76 md:text-[21px] md:leading-10">AviEngine помогает создавать, публиковать, обновлять и масштабировать объявления из одной спокойной панели. Аккаунты, шаблоны, города и задачи собраны в понятный рабочий процесс для авитолога.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="avito-gradient-button h-[60px] px-9 text-base"><Link href="/login"><UserRound className="h-5 w-5" /> Войти через Авито</Link></Button>
            <Button asChild size="lg" className="blue-gradient-button h-[60px] px-9 text-base"><Link href="/dashboard">Посмотреть демо <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1 }} className="relative h-[640px]">
          <ShaderOrb className="absolute inset-x-0 top-0 h-[430px] opacity-65" />
          <HeroInterfacePreview />
        </motion.div>
      </section>

      <section id="benefits" className="container relative z-10 flex min-h-screen items-center py-28">
        <div className="w-full">
          <motion.div {...fade} className="mx-auto max-w-3xl text-center">
            <Badge className="border-white/24 bg-white/14 text-white shadow-glass">Возможности</Badge>
            <h2 className="mt-6 text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Всё для ежедневной работы с объявлениями</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/68">Сохраняем привычную логику прототипа: аккаунты сверху, затем менеджер задач, публикация шаблонов и отдельная вкладка обновлений.</p>
          </motion.div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Feature icon={UserRound} title="Аккаунты под контролем" text="Подключайте рабочие аккаунты Авито и видьте, какие из них активны, требуют внимания или готовы к публикации." />
            <Feature icon={FileText} title="Шаблоны и варианты" text="Создавайте шаблоны объявлений, выбирайте города и распределяйте публикации между аккаунтами без хаоса." />
            <Feature icon={RefreshCw} title="Обновление объявлений" text="Отмечайте нужные объявления карточками и выбирайте режим: обновлять вручную или доверить расписание системе." />
          </div>
        </div>
      </section>

      <section id="demo" className="container relative z-10 flex min-h-screen items-center py-28">
        <motion.div {...fade} className="grid w-full gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <Badge className="border-white/24 bg-white/14 text-white shadow-glass"><Sparkles className="mr-1 h-3.5 w-3.5" /> Демо интерфейса</Badge>
            <h2 className="mt-6 text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Плавный обзор возможностей AviEngine</h2>
            <p className="mt-6 text-lg leading-8 text-white/68">Демо показывает ключевые вкладки: менеджер задач, публикацию и обновление. Интерфейс остаётся спокойным, понятным и готовым к ежедневной работе.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Pill>Менеджер задач</Pill><Pill>Публикация</Pill><Pill>Обновление</Pill></div>
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="premium-card rounded-[2.2rem] p-3">
            <div className="rounded-[1.65rem] bg-white/90 p-5 text-ink-900 shadow-glass">
              <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl" /><div><b>Рабочая панель</b><p className="text-xs text-ink-500">Обновление объявлений открыто</p></div></div><Badge variant="success">Готово</Badge></div>
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl bg-primary-50 p-2 text-xs font-bold"><span className="rounded-xl bg-white px-3 py-2 text-primary-700 shadow-sm">Менеджер задач</span><span className="rounded-xl px-3 py-2 text-ink-500">Публикация</span><span className="rounded-xl bg-primary-600 px-3 py-2 text-white shadow-glow">Обновление</span></div>
              <div className="grid gap-3 md:grid-cols-3">
                {["iPhone 15 Pro", "BMW X5", "Диван Moon"].map((item, i) => <motion.div key={item} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * .12 }} className="rounded-2xl border border-primary-900/10 bg-white p-3 shadow-[0_14px_34px_rgba(20,85,255,.08)]"><div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-primary-100 via-white to-cyan/20" /><div className="text-sm font-black">{item}</div><div className="mt-1 text-xs text-ink-500">Выбрано для обновления</div><div className="mt-3 h-2 rounded-full bg-primary-100"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div></motion.div>)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

function HeroInterfacePreview() {
  return <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="premium-card absolute bottom-12 left-0 right-0 mx-auto max-w-[560px] rounded-[2.15rem] p-3"><div className="rounded-[1.55rem] bg-white/90 p-5 text-ink-900 shadow-glass"><div className="mb-5 flex items-center justify-between"><div><span className="text-sm font-black">Панель AviEngine</span><p className="mt-1 text-xs text-ink-500">Ежедневная работа без хаоса</p></div><Badge variant="success">Активно</Badge></div>{[["Аккаунты", "5 активных подключений", 92], ["Публикация", "Шаблоны готовы к запуску", 78], ["Обновление", "Карточки объявлений выбраны", 64]].map((r, i) => <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 + i * .14 }} key={r[0] as string} className="mb-3 rounded-2xl border border-primary-900/10 bg-primary-50/80 p-4"><div className="mb-2 flex justify-between text-sm"><b>{r[0]}</b><span className="text-primary-700">{r[2]}%</span></div><div className="h-2 overflow-hidden rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} animate={{ width: `${r[2]}%` }} transition={{ duration: 1.2, delay: .5 + i * .16 }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div><p className="mt-2 text-xs text-ink-500">{r[1]}</p></motion.div>)}</div></motion.div>;
}
function Feature({ icon: Icon, title, text }: any) { return <motion.div {...fade} whileHover={{ y: -6 }} className="premium-card rounded-3xl p-6"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-white/18 text-cyan shadow-glass"><Icon /></div><h3 className="text-xl font-black tracking-tight">{title}</h3><p className="mt-4 text-sm leading-7 text-white/68">{text}</p><div className="mt-7 flex items-center gap-2 text-sm font-bold text-white/84"><CheckCircle2 className="h-4 w-4 text-cyan" /> Готово к работе</div></motion.div>; }
function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-bold text-white/80 shadow-glass backdrop-blur">{children}</span>; }
