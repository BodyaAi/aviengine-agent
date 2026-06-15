"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
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

type Screen = 1 | 2 | 3;

const premiumEase = [0.22, 1, 0.36, 1] as const;
const screenVariants = {
  enter: (direction: number) => ({
    y: direction >= 0 ? "105vh" : "-105vh",
    opacity: 0,
    scale: 0.94,
    filter: "blur(18px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: direction >= 0 ? "-72vh" : "72vh",
    opacity: 0,
    scale: 0.965,
    filter: "blur(14px)",
  }),
};

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
  { icon: Sparkles, title: "AI-Контент", text: "Уникальные заголовки и описания под каждое объявление. Никакого копипаста." },
  { icon: RefreshCw, title: "Smart-Уникализация", text: "Тасовка городов, ротация фото, перефраз текста — объявления не банятся." },
  { icon: Shield, title: "Анти-Бан", text: "Мониторинг лимитов Авито и безопасные интервалы публикации." },
  { icon: Cloud, title: "Облачный запуск", text: "Работает на наших серверах. Ваш компьютер выключен — агент продолжает." },
  { icon: RefreshCw, title: "Автообновление", text: "AI сам поднимает объявления в нужный момент для максимальной отдачи." },
  { icon: Copy, title: "Smart-Миграция", text: "Копирует лучшие объявления между аккаунтами одной кнопкой." },
];

export default function LandingPage() {
  const [screen, setScreen] = useState<Screen>(1);
  const [direction, setDirection] = useState(1);

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

  const moveTo = useCallback((target: Screen) => {
    setDirection(target > screen ? 1 : -1);
    setScreen(target);
  }, [screen]);

  const next = useCallback(() => {
    setDirection(1);
    setScreen(current => (current < 3 ? ((current + 1) as Screen) : current));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setScreen(current => (current > 1 ? ((current - 1) as Screen) : current));
  }, []);

  useEffect(() => {
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      if (locked || Math.abs(event.deltaY) < 45) return;
      locked = true;
      if (event.deltaY > 0) next();
      else prev();
      window.setTimeout(() => { locked = false; }, 1150);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) next();
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    let startY = 0;
    const onStart = (event: TouchEvent) => { startY = event.touches[0]?.clientY ?? 0; };
    const onEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? startY;
      if (startY - endY > 80) next();
      if (endY - startY > 80) prev();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  return (
    <main className="premium-flow-bg relative h-screen overflow-hidden text-white">
      <div className="premium-noise pointer-events-none fixed inset-0 z-40" />
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,.62),transparent_25%),linear-gradient(180deg,rgba(4,18,54,.02),rgba(4,18,54,.62))]" />
      <div className="dot-grid pointer-events-none fixed inset-0 z-30 opacity-20" />
      <motion.div className="pointer-events-none fixed inset-0 z-20" animate={{ opacity: [0.55, 0.82, 0.55] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        <ShaderOrb className="absolute -right-32 top-10 h-[540px] w-[540px] opacity-40" />
        <ShaderOrb className="absolute -bottom-48 -left-36 h-[520px] w-[520px] opacity-25" />
      </motion.div>

      <header className="fixed left-0 right-0 top-0 z-[60] flex h-16 items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl shadow-[0_14px_38px_rgba(17,70,220,.32)]" />
          <span className="text-lg font-black tracking-tight drop-shadow">AviEngine</span>
        </Link>
        <div className="flex items-center gap-2" aria-label="Навигация по экранам">
          {[1, 2, 3].map(item => (
            <button
              key={item}
              aria-label={`Экран ${item}`}
              onClick={() => moveTo(item as Screen)}
              className={`h-2 rounded-full transition-all duration-500 ${screen === item ? "w-8 bg-white shadow-glow" : "w-2 bg-white/28 hover:bg-white/55"}`}
            />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait" custom={direction}>
        {screen === 1 && <HeroScreen key="hero" direction={direction} avitoUrl={avitoUrl} />}
        {screen === 2 && <BenefitsScreen key="benefits" direction={direction} onNext={next} />}
        {screen === 3 && <DemoScreen key="demo" direction={direction} avitoUrl={avitoUrl} />}
      </AnimatePresence>

      {screen < 3 && (
        <motion.button
          type="button"
          onClick={next}
          animate={{ y: [0, 8, 0], opacity: [0.38, 0.72, 0.38] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/12 bg-white/8 p-3 text-white backdrop-blur-xl"
          aria-label="Следующий экран"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      )}
    </main>
  );
}

function ScreenShell({ children, custom }: { children: ReactNode; custom: number }) {
  return (
    <motion.section
      custom={custom}
      variants={screenVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.95, ease: premiumEase }}
      className="absolute inset-0 z-50 flex h-screen w-screen items-center justify-center"
    >
      {children}
    </motion.section>
  );
}

function HeroScreen({ direction, avitoUrl }: { direction: number; avitoUrl: string }) {
  return (
    <ScreenShell custom={direction}>
      <div className="container grid h-full items-center gap-8 pt-16 lg:grid-cols-[1.04fr_.96fr]">
        <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.16, ease: premiumEase }} className="text-center lg:text-left">
          <div className="mb-7 flex items-center justify-center gap-3 lg:justify-start">
            <Image src={aviLogo} alt="AviEngine" width={56} height={56} className="rounded-2xl shadow-[0_22px_60px_rgba(17,70,220,.36)]" />
            <div className="text-left">
              <div className="text-xl font-black tracking-tight">AviEngine</div>
              <div className="text-sm text-white/64">AI автопилот для Авито</div>
            </div>
          </div>
          <h1 className="mx-auto max-w-5xl text-balance text-5xl font-black leading-[.92] tracking-[-.06em] drop-shadow-[0_24px_74px_rgba(4,18,54,.5)] md:text-7xl lg:mx-0 lg:text-[5.35rem]">
            Выкладывайте объявления на Авито без рутины, AI автопилот теперь работает за вас
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-white/74 md:text-xl lg:mx-0">
            Запускаете один раз — объявления публикуются, обновляются и получают уникальную подачу автоматически.
          </p>
          <div className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row lg:mx-0">
            <Button asChild size="lg" className="avito-gradient-button h-[60px] px-9 text-base">
              <a href={avitoUrl}><UserRound className="h-5 w-5" /> Войти через Авито</a>
            </Button>
            <Button asChild size="lg" className="blue-gradient-button h-[60px] px-9 text-base">
              <Link href="/dashboard">Посмотреть демо <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.05, delay: .3, ease: premiumEase }} className="relative hidden h-[590px] lg:block">
          <ShaderOrb className="absolute inset-x-0 top-0 h-[430px] opacity-60" />
          <HeroInterfacePreview />
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function BenefitsScreen({ direction, onNext }: { direction: number; onNext: () => void }) {
  return (
    <ScreenShell custom={direction}>
      <div className="container flex h-full flex-col justify-center overflow-y-auto py-20">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .1, ease: premiumEase }} className="text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold text-white/80 shadow-glass backdrop-blur-xl">Три шага до автопилота</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Всё, чтобы Авито работало само</h2>
        </motion.div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((item, index) => <StepCard key={item.n} index={index} {...item} />)}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => <BenefitCard key={item.title} index={index} {...item} />)}
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .74, duration: .72, ease: premiumEase }} className="mt-9 flex justify-center">
          <Button onClick={onNext} size="lg" className="blue-gradient-button h-[56px] px-10 text-base">
            Смотреть демо <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function DemoScreen({ direction, avitoUrl }: { direction: number; avitoUrl: string }) {
  return (
    <ScreenShell custom={direction}>
      <div className="container grid h-full items-center gap-9 pt-16 lg:grid-cols-[.86fr_1.14fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .88, delay: .16, ease: premiumEase }} className="text-center lg:text-left">
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold text-white/80 shadow-glass backdrop-blur-xl">Демо интерфейса</span>
          <h2 className="mt-6 text-balance text-4xl font-black tracking-[-.045em] md:text-6xl">Плавная панель для ежедневной работы</h2>
          <p className="mt-6 text-lg leading-8 text-white/70">Аккаунты, шаблоны, запуск агента и обновление объявлений собраны в одной спокойной премиальной панели.</p>
          <div className="mt-9 flex justify-center lg:justify-start">
            <Button asChild size="lg" className="avito-gradient-button h-[62px] px-10 text-base">
              <a href={avitoUrl}><UserRound className="h-5 w-5" /> Войти через Авито</a>
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .94, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: .26, ease: premiumEase }} className="relative">
          <ShaderOrb className="absolute -top-28 left-1/2 h-[430px] w-[430px] -translate-x-1/2 opacity-45" />
          <DemoInterfacePreview />
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function HeroInterfacePreview() {
  return (
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="premium-card absolute bottom-12 left-0 right-0 mx-auto max-w-[560px] rounded-[2.15rem] p-3">
      <div className="rounded-[1.55rem] bg-white/90 p-5 text-ink-900 shadow-glass">
        <div className="mb-5 flex items-center justify-between"><div><span className="text-sm font-black">Панель AviEngine</span><p className="mt-1 text-xs text-ink-500">AI автопилот активен</p></div><span className="rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success">Активно</span></div>
        {[["Аккаунты", "5 активных подключений", 92], ["Публикация", "Шаблоны готовы к запуску", 78], ["Обновление", "Карточки объявлений выбраны", 64]].map((r, i) => (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 + i * .14 }} key={r[0] as string} className="mb-3 rounded-2xl border border-primary-900/10 bg-primary-50/80 p-4">
            <div className="mb-2 flex justify-between text-sm"><b>{r[0]}</b><span className="text-primary-700">{r[2]}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} animate={{ width: `${r[2]}%` }} transition={{ duration: 1.2, delay: .5 + i * .16 }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div>
            <p className="mt-2 text-xs text-ink-500">{r[1]}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DemoInterfacePreview() {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="premium-card mx-auto max-w-[650px] rounded-[2.2rem] p-3">
      <div className="rounded-[1.65rem] bg-white/90 p-5 text-ink-900 shadow-glass">
        <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><Image src={aviLogo} alt="AviEngine" width={38} height={38} className="rounded-xl" /><div><b>Рабочая панель</b><p className="text-xs text-ink-500">Менеджер задач открыт</p></div></div><span className="rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success">Готово</span></div>
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl bg-primary-50 p-2 text-xs font-bold"><span className="rounded-xl bg-primary-600 px-3 py-2 text-white shadow-glow">Менеджер задач</span><span className="rounded-xl px-3 py-2 text-ink-500">Публикация</span><span className="rounded-xl px-3 py-2 text-ink-500">Обновление</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          {["iPhone 15 Pro", "BMW X5", "Диван Moon"].map((item, i) => <motion.div key={item} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 + i * .12 }} className="rounded-2xl border border-primary-900/10 bg-white p-3 shadow-[0_14px_34px_rgba(20,85,255,.08)]"><div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-primary-100 via-white to-cyan/20" /><div className="text-sm font-black">{item}</div><div className="mt-1 text-xs text-ink-500">В процессе публикации</div><div className="mt-3 h-2 rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} animate={{ width: `${60 + i * 10}%` }} transition={{ duration: 1.2, delay: .62 + i * .1 }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div></motion.div>)}
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ n, icon: Icon, title, text, index }: { n: string; icon: any; title: string; text: string; index: number }) {
  return <motion.div initial={{ opacity: 0, y: 28, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .75, delay: .18 + index * .1, ease: premiumEase }} whileHover={{ y: -6 }} className="premium-card rounded-3xl p-6 text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/18 text-cyan shadow-glass"><Icon className="h-6 w-6" /></div><div className="mb-3 text-xs font-black text-cyan">{n}</div><h3 className="text-xl font-black tracking-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-white/68">{text}</p></motion.div>;
}

function BenefitCard({ icon: Icon, title, text, index }: { icon: any; title: string; text: string; index: number }) {
  return <motion.div initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .72, delay: .3 + index * .055, ease: premiumEase }} whileHover={{ y: -5 }} className="premium-card rounded-3xl p-5"><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/16 text-cyan"><Icon className="h-5 w-5" /></div><h3 className="text-lg font-black tracking-tight">{title}</h3><p className="mt-2 text-sm leading-6 text-white/62">{text}</p></motion.div>;
}
