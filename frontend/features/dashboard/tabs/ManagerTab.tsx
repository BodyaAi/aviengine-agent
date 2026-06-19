"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckSquare2, Pause, Play, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Task } from "../models/dashboard";
import { PanelHeader } from "../components/PanelHeader";

export function ManagerTab({ tasks, errors, runAgent, stopTask, resumeTask, removeTask, clearTasks }: { tasks: Task[]; errors: Task[]; runAgent: () => void; stopTask: (id: number) => void; resumeTask: (id: number) => void; removeTask: (id: number) => void; clearTasks: () => void }) {
  return (
    <div className="space-y-5">
      <Card className="light-panel overflow-hidden text-ink-900">
        <PanelHeader icon={CheckSquare2} title="Менеджер задач" action={<div className="flex gap-2"><Button size="sm" onClick={runAgent}><Zap className="h-4 w-4" /> Запустить AI агента</Button>{tasks.length > 0 && <Button size="sm" variant="secondary" onClick={clearTasks}>Очистить</Button>}</div>} />
        <div className="grid grid-cols-3 border-y border-primary-900/10 text-sm">
          <Kpi l="Выполнено" v="54%" />
          <Kpi l="Активных задач" v={String(tasks.length)} />
          <Kpi l="Ошибки" v={String(errors.length)} danger />
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-700"><span className="h-2 w-2 rounded-full bg-primary-600" /> В процессе</div>
          {tasks.filter(task => task.status !== "error" && !task.error).map(task => <TaskRow key={task.id} task={task} stopTask={stopTask} resumeTask={resumeTask} removeTask={removeTask} />)}
          {tasks.filter(task => task.status !== "error" && !task.error).length === 0 ? <div className="rounded-2xl border border-dashed border-primary-300 bg-primary-50 p-6 text-center text-sm text-ink-500">Нет активных задач</div> : <SkeletonPreview />}
        </div>
        {errors.length > 0 && <ErrorState errors={errors} removeTask={removeTask} />}
      </Card>
    </div>
  );
}

function Kpi({ l, v, danger }: { l: string; v: string; danger?: boolean }) { return <div className="p-4"><div className="text-xs text-ink-500">{l}</div><div className={`mt-1 text-xl font-black ${danger ? "text-danger" : "text-primary-700"}`}>{v}</div></div>; }
function TaskRow({ task, stopTask, resumeTask, removeTask }: { task: Task; stopTask: (id: number) => void; resumeTask: (id: number) => void; removeTask: (id: number) => void }) { return <motion.div whileHover={{ y: -3, scale: 1.004 }} className="mb-3 rounded-2xl border border-primary-900/10 bg-white/74 p-4 shadow-[0_10px_35px_rgba(20,85,255,.08)] transition"><div className="mb-3 flex items-center justify-between gap-3"><div className="min-w-0"><b className="line-clamp-1">{task.title}</b><div className="mt-1 text-xs text-ink-500">{task.account} · {task.done}/{task.count}</div></div><div className="flex shrink-0 items-center gap-2"><Badge variant={task.status === "queue" ? "warning" : "blue"}>{task.status === "queue" ? "Очередь" : task.status === "paused" ? "Пауза" : "Работает"}</Badge>{task.status === "running" && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => stopTask(task.id)}><Pause className="h-4 w-4" /></Button>}{task.status === "paused" && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resumeTask(task.id)}><Play className="h-4 w-4" /></Button>}<Button size="icon" variant="ghost" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4" /></Button></div></div><div className="h-2 overflow-hidden rounded-full bg-primary-100"><motion.div initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-primary-600 to-cyan" /></div></motion.div>; }
function SkeletonPreview() { return <div className="rounded-2xl border border-primary-900/10 bg-white/48 p-4"><div className="mb-3 flex items-center justify-between"><div className="skeleton-line h-3 w-44" /><div className="skeleton-line h-6 w-20" /></div><div className="skeleton-line h-2 w-full" /><p className="mt-3 text-xs text-ink-400">Следующая задача готовится к запуску</p></div>; }
function ErrorState({ errors, removeTask }: { errors: Task[]; removeTask: (id: number) => void }) { return <div className="border-t border-danger/15 bg-danger/[.045] p-4"><div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-danger"><AlertTriangle className="h-4 w-4" /> Требует внимания <Badge variant="danger">{errors.length}</Badge></div>{errors.map(task => <motion.div key={task.id} whileHover={{ y: -2 }} className="rounded-2xl border border-danger/15 bg-white/74 p-4 shadow-[0_14px_38px_rgba(239,68,68,.08)]"><div className="flex items-start justify-between gap-4"><div><b>{task.title}</b><p className="mt-1 text-sm text-danger">{task.error}</p><p className="mt-2 text-xs text-ink-500">Подтвердите доступ — и задача продолжит работу.</p></div><Button variant="destructive" size="icon" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4" /></Button></div></motion.div>)}</div>; }
