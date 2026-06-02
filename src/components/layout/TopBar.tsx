import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time] = useState(() =>
    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-glass-border px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2.5 w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher pièces, scènes…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <button className="glass h-11 w-11 rounded-xl flex items-center justify-center hover:bg-white/10 transition">
          <Sun className="h-4 w-4" />
        </button>
        <button className="glass h-11 w-11 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse-glow" />
        </button>
        <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-4 py-2.5">
          <Moon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium tabular-nums">{time}</span>
        </div>
      </div>
    </header>
  );
}
