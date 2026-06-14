import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const params = new URLSearchParams({ response_type: "code", pro_users_flow: "true", client_id: "<CLIENT_ID>", scope: "autoload:reports,items:info,user:read", state: "demo-state" });
  return <main className="grid min-h-screen place-items-center bg-blue-radial p-6 text-white"><div className="glass-panel max-w-md rounded-[2rem] p-8 text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary-600 text-2xl font-black">A</div><h1 className="text-3xl font-black">Вход в AviEngine</h1><p className="mt-3 text-white/55">OAuth старт построен по документации Авито. В демо используется placeholder client_id.</p><Button className="mt-7 w-full" asChild><a href={`https://avito.ru/oauth?${params.toString()}`}>Привязать аккаунт Авито</a></Button><Button variant="ghost" className="mt-2 w-full" asChild><Link href="/dashboard">Открыть демо без входа</Link></Button></div></main>;
}
