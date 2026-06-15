"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cloud,
  Copy,
  FileText,
  MousePointerClick,
  RefreshCw,
  Shield,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShaderOrb } from "@/components/effects/shader-orb";
import aviLogo from "../../docs/legacy_website_prototype/AviEngine Website/src/assets/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

const premiumEase = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    n: "01",
    icon: MousePointerClick,
    title: "Подключаете аккаунт",
    text: "Добавляете Авито-аккаунт в пару кликов. Никаких токенов и кода — просто логин.",
  },
  {
    n: "02",
    icon: FileText,
    title: "Настраиваете шаблон",
    text: "Задаёте категорию, города, описание и фото. AI сам генерирует уникальный текст.",
  },
  {
    n: "03",
    icon: Zap,
    title: "Запускаете агента",
    text: "Нажимаете «Запустить» — и идёте пить кофе. Агент публикует, ротирует и следит за лимитами.",
  },
];

const benefits = [
  { icon: Sparkles, title: "AI-Контент", text: "Система генерирует уникальные заголовки и описания для каждого объявления" },
  { icon: RefreshCw, title: "Smart-Уникализация", text: "Тасовка городов, уникализация и ротация фото, перефраз текста - создание множества обьявлений" },
  { icon: Shield, title: "Анти-Бан", text: "Мониторинг лимитов Авито и безопасные интервалы публикации." },
  { icon: Cloud, title: "Облачный запуск", text: "Работает на наших серверах. Ваш компьютер выключен — агент продолжает." },
  { icon: RefreshCw, title: "Автообновление", text: "AI сам поднимает объявления в нужный момент для максимальной отдачи." },
  { icon: Copy, title: "Smart-Миграция", text: "Копирует лучшие объявления между аккаунтами одной кнопкой." },
];

export default function LandingPage() {
  const [activeScreen, setActiveScreen] = useState(1);
  const avitoUrl = useMemo(() => {
    const params = new URLSearchParams({
      response_type: "code",
      pro_users_flow: "true",
      client_id: "<CLIENT_ID>",
      scope: "autoload:reports,items:info,user:read",
      state: "demo-state",
    });
    return `https://avito.ru/oauth?${params.toString()}`;
  }, []);

  return (
    <main className="premium-flow-bg relative h-screen snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth text-white">
      <div className="premium-noise pointer-events-none fixed inset-0 z-40" />
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,.62),transparent_25%),linear-gradient(180deg,rgba(4,18,54,.02),rgba(4,18,54,.62))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 z-30 opacity-20" />
      <div className="pointer-events-none fixed inset-0 z-20">
        <ShaderOrb className="absolute -right-32 top-12 h-[520px] w-[520px] opacity-35" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-[60] flex h-16 items-center justify-between px-5 md:px-10">
        <Link href="#screen-1" className="flex items-center gap-3">
          <Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl shadow-[0_14px_38px_rgba(17,70,220,.32)]" />
          <span className="text-lg font-black tracking-tight drop-shadow">AviEngine</span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Навигация по экранам">
          {[1, 2, 3].map(item => (
            <a
              key={item}
              href={`#screen-${item}`}
              aria-label={`Экран ${item}`}
              className={`h-2 rounded-full transition-all duration-500 ${activeScreen === item ? "w-8 bg-white shadow-glow" : "w-2 bg-white/28 hover:bg-white/55"}`}
            />
          ))}
        </nav>
      </header>

      <HeroScreen onEnter={() => setActiveScreen(1)} />
      <BenefitsScreen onEnter={() => setActiveScreen(2)} />
      <DemoScreen avitoUrl={avitoUrl} onEnter={() => setActiveScreen(3)} />
    </main>
  );
}

function HeroScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      id="screen-1"
      onViewportEnter={onEnter}
      viewport={{ amount: 0.65 }}
      className="relative z-50 flex min-h-screen snap-start snap-always items-center justify-center px-5 pb-32 pt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.7 }}
        transition={{ duration: 0.9, ease: premiumEase }}
        className="mx-auto max-w-5xl -translate-y-8 text-center md:-translate-y-12"
      >
        <h1 className="text-balance text-[clamp(2.35rem,5.8vw,5.8rem)] font-black leading-[1.04] tracking-[-.052em] drop-shadow-[0_26px_82px_rgba(4,18,54,.48)]">
          Выкладывайте объявления на Авито без рутины, AI автопилот теперь работает за отдел выкладки
        </h1>
      </motion.div>
    </motion.section>
  );
}

function BenefitsScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      id="screen-2"
      onViewportEnter={onEnter}
      viewport={{ amount: 0.45 }}
      className="relative z-50 flex min-h-screen snap-start snap-always items-center px-5 py-24"
    >
      <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: .78, ease: premiumEase }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold text-white/80 shadow-glass backdrop-blur-xl">Три шага до автопилота</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Всё, чтобы Авито работало само</h2>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((item, index) => <StepCard key={item.n} index={index} {...item} />)}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => <BenefitCard key={item.title} index={index} {...item} />)}
        </div>
      </div>
    </motion.section>
  );
}

function DemoScreen({ avitoUrl, onEnter }: { avitoUrl: string; onEnter: () => void }) {
  return (
    <motion.section
      id="screen-3"
      onViewportEnter={onEnter}
      viewport={{ amount: 0.45 }}
      className="relative z-50 flex min-h-screen snap-start snap-always items-center px-5 py-24"
    >
      <div className="container mx-auto grid min-h-[calc(100vh-12rem)] items-center gap-10 lg:grid-cols-[.88fr_1.12fr]">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.65 }}
          transition={{ duration: .88, ease: premiumEase }}
          className="text-center lg:text-left"
        >
          <h2 className="text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Всем этим вы можете управлять в одной удобной панели</h2>
          <p className="mt-6 text-lg leading-8 text-white/70">Аккаунты, шаблоны, запуск агента и обновление объявлений собраны в одной комфортной для управления панели.</p>
          <div className="mt-8 flex justify-center lg:justify-start">
            <Button asChild size="lg" className="group relative isolate h-[62px] overflow-hidden rounded-full border border-white/35 bg-white/15 px-10 text-base font-bold text-white shadow-[0_24px_70px_rgba(17,70,220,.32),inset_0_1px_0_rgba(255,255,255,.65)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/22 hover:shadow-[0_32px_90px_rgba(17,70,220,.45),inset_0_1px_0_rgba(255,255,255,.86)] before:absolute before:inset-[1px] before:-z-10 before:rounded-full before:bg-[linear-gradient(135deg,rgba(255,255,255,.30),rgba(93,220,255,.18)_42%,rgba(20,85,255,.34))] after:absolute after:inset-y-[-60%] after:left-[-45%] after:-z-10 after:w-1/3 after:rotate-12 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent)] after:opacity-0 after:transition-all after:duration-700 hover:after:left-[115%] hover:after:opacity-100">
              <a href={avitoUrl}><UserRound className="h-5 w-5" /> Войти через Авито</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: .96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.55 }}
          transition={{ duration: .95, ease: premiumEase }}
          className="relative"
        >
          <DemoInterfacePreview />
        </motion.div>
      </div>
    </motion.section>
  );
}

function DemoInterfacePreview() {
  return (
    <motion.div
      whileInView={{ y: [0, -8, 0] }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="premium-card mx-auto max-w-[650px] rounded-[2.2rem] p-3"
    >
      <div className="rounded-[1.65rem] bg-white/90 p-5 text-ink-900 shadow-glass">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl" />
            <div><b>Рабочая панель</b><p className="text-xs text-ink-500">Менеджер задач открыт</p></div>
          </div>
          <span className="rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success">Готово</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl bg-primary-50 p-2 text-xs font-bold"><span className="rounded-xl bg-primary-600 px-3 py-2 text-white shadow-glow">Менеджер задач</span><span className="rounded-xl px-3 py-2 text-ink-500">Публикация</span><span className="rounded-xl px-3 py-2 text-ink-500">Обновление</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          {["iPhone 15 Pro", "BMW X5", "Диван Moon"].map((item, i) => <motion.div key={item} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: i * .1, duration: .6, ease: premiumEase }} className="rounded-2xl border border-primary-900/10 bg-white p-3 shadow-[0_14px_34px_rgba(20,85,255,.08)]"><div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-primary-100 via-white to-cyan/20" /><div className="text-sm font-black">{item}</div><div className="mt-1 text-xs text-ink-500">В процессе публикации</div><div className="mt-3 h-2 rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} whileInView={{ width: `${60 + i * 10}%` }} viewport={{ once: false }} transition={{ duration: 1.2, delay: .18 + i * .1 }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div></motion.div>)}
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ n, icon: Icon, title, text, index }: { n: string; icon: any; title: string; text: string; index: number }) {
  return <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.35 }} transition={{ duration: .72, delay: index * .08, ease: premiumEase }} whileHover={{ y: -5 }} className="premium-card rounded-3xl p-6 text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/18 text-cyan shadow-glass"><Icon className="h-6 w-6" /></div><div className="mb-3 text-xs font-black text-cyan">{n}</div><h3 className="text-xl font-black tracking-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-white/68">{text}</p></motion.div>;
}

function BenefitCard({ icon: Icon, title, text, index }: { icon: any; title: string; text: string; index: number }) {
  return <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.35 }} transition={{ duration: .68, delay: index * .045, ease: premiumEase }} whileHover={{ y: -4 }} className="premium-card rounded-3xl p-5"><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/16 text-cyan"><Icon className="h-5 w-5" /></div><h3 className="text-lg font-black tracking-tight">{title}</h3><p className="mt-2 text-sm leading-6 text-white/62">{text}</p></motion.div>;
}
