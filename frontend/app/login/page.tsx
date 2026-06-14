import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import aviLogo from "../../../docs/legacy_website_prototype/AviEngine Website/src/assets/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

export default function LoginPage() {
  const params = new URLSearchParams({ response_type: "code", pro_users_flow: "true", client_id: "<CLIENT_ID>", scope: "autoload:reports,items:info,user:read", state: "demo-state" });
  return <main className="premium-flow-bg relative grid min-h-screen place-items-center overflow-hidden p-6 text-white"><div className="premium-noise pointer-events-none fixed inset-0" /><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,.55),transparent_28%),linear-gradient(180deg,rgba(4,18,54,.04),rgba(4,18,54,.72))]" /><div className="premium-card relative w-full max-w-md rounded-[2rem] p-3"><div className="rounded-[1.5rem] bg-white/88 p-8 text-center text-ink-900 shadow-glass"><Image src={aviLogo} alt="AviEngine" width={62} height={62} className="mx-auto mb-5 rounded-2xl shadow-[0_22px_58px_rgba(20,85,255,.28)]" /><h1 className="text-3xl font-black tracking-[-.035em]">Войти в AviEngine</h1><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-ink-500">Подключите аккаунт Авито и откройте рабочую панель для публикации, обновления и контроля объявлений.</p><Button className="avito-gradient-button mt-7 h-[54px] w-full text-base" asChild><a href={`https://avito.ru/oauth?${params.toString()}`}><ShieldCheck className="h-5 w-5" /> Войти через Авито</a></Button><Button variant="ghost" className="mt-2 w-full text-primary-700 hover:bg-primary-50" asChild><Link href="/dashboard">Посмотреть демо <ArrowRight className="h-4 w-4" /></Link></Button></div></div></main>;
}
