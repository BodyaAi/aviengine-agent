"use client";

import type { ComponentType, ReactNode } from "react";

export function PanelHeader({ icon: Icon, title, action }: { icon: ComponentType<{ className?: string }>; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-600/10 text-primary-700">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {action}
    </div>
  );
}
