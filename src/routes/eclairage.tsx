import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Lightbulb, Sparkles, Moon, Sun, Film, Coffee } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/eclairage")({
  head: () => ({
    meta: [
      { title: "Éclairage intelligent — DIGI HOME" },
      { name: "description", content: "Contrôle d'éclairage par pièce, intensité et scénarios." },
    ],
  }),
  component: Eclairage,
});

const initialRooms = [
  { name: "Salon", on: true, brightness: 70, color: "warm" },
  { name: "Cuisine", on: false, brightness: 100, color: "cool" },
  { name: "Chambre principale", on: true, brightness: 25, color: "warm" },
  { name: "Bureau", on: true, brightness: 85, color: "cool" },
  { name: "Salle de bain", on: false, brightness: 60, color: "warm" },
  { name: "Entrée", on: true, brightness: 50, color: "warm" },
];

const scenes = [
  { name: "Réveil doux", icon: Sun, gradient: "from-amber-300 to-orange-400" },
  { name: "Concentration", icon: Coffee, gradient: "from-cyan-300 to-blue-400" },
  { name: "Soirée cinéma", icon: Film, gradient: "from-purple-400 to-pink-400" },
  { name: "Nuit", icon: Moon, gradient: "from-indigo-400 to-violet-500" },
];

function Eclairage() {
  const [rooms, setRooms] = useState(initialRooms);

  return (
    <AppShell title="Éclairage intelligent" subtitle="Contrôlez l'ambiance lumineuse de chaque pièce.">
      {/* Scenes */}
      <section className="mb-8">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Scénarios intelligents
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scenes.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.name}
                className="group relative overflow-hidden glass rounded-2xl p-6 text-left card-hover animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition", s.gradient)} />
                <Icon className="h-7 w-7 mb-3 relative" />
                <p className="font-semibold relative">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1 relative">Touchez pour activer</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Rooms */}
      <section>
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Pièces</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((r, idx) => (
            <div key={r.name} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition",
                    r.on ? "bg-gradient-to-br from-amber-300/30 to-orange-400/30 text-amber-200 glow-primary" : "bg-white/5 text-muted-foreground"
                  )}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.on ? `${r.brightness}% · ${r.color === "warm" ? "Chaud" : "Froid"}` : "Éteint"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setRooms((p) => p.map((x, i) => i === idx ? { ...x, on: !x.on } : x))}
                  className={cn(
                    "relative h-7 w-12 rounded-full transition",
                    r.on ? "bg-primary" : "bg-white/10"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-transform",
                    r.on ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Intensité</span>
                  <span className="tabular-nums">{r.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={r.brightness}
                  disabled={!r.on}
                  onChange={(e) =>
                    setRooms((p) => p.map((x, i) => i === idx ? { ...x, brightness: Number(e.target.value) } : x))
                  }
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-primary disabled:opacity-40"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
