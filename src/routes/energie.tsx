import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Zap, TrendingDown, Leaf, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/energie")({
  head: () => ({
    meta: [
      { title: "Énergie — DIGI HOME" },
      { name: "description", content: "Analyse, optimisation et monitoring temps réel de la consommation." },
    ],
  }),
  component: Energie,
});

// data points (24h)
const hours = Array.from({ length: 24 }, (_, i) => i);
const data = hours.map((h) => 1.5 + Math.sin(h / 3) * 0.9 + (h > 17 && h < 22 ? 1.8 : 0) + Math.random() * 0.4);
const max = Math.max(...data);

const breakdown = [
  { label: "Chauffage", value: 38, color: "bg-orange-400" },
  { label: "Éclairage", value: 22, color: "bg-amber-300" },
  { label: "Électroménager", value: 18, color: "bg-cyan-300" },
  { label: "Multimédia", value: 12, color: "bg-purple-400" },
  { label: "Autres", value: 10, color: "bg-muted-foreground" },
];

function Energie() {
  return (
    <AppShell title="Gestion énergétique" subtitle="Suivi temps réel et optimisations intelligentes.">
      {/* KPI */}
      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Consommation jour", value: "12,8", unit: "kWh", icon: Zap, trend: "-8%" },
          { label: "Économie mois", value: "42,30", unit: "€", icon: TrendingDown, trend: "-12%" },
          { label: "Empreinte CO₂", value: "3,4", unit: "kg", icon: Leaf, trend: "-15%" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass rounded-2xl p-6 card-hover animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-success bg-success/15 rounded-full px-2 py-0.5">{k.trend}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
              <p className="text-3xl font-bold tabular-nums">
                {k.value}
                <span className="text-base text-muted-foreground ml-1.5 font-normal">{k.unit}</span>
              </p>
            </div>
          );
        })}
      </section>

      {/* Chart */}
      <section className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Consommation 24h</h3>
            <p className="text-xs text-muted-foreground">Profil heure par heure (kW)</p>
          </div>
          <div className="flex gap-2">
            {["24h", "7j", "30j", "1a"].map((t, i) => (
              <button
                key={t}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition",
                  i === 0 ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-64">
          <svg viewBox="0 0 480 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.18 195)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(0.78 0.18 195)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = data.map((v, i) => `${(i / 23) * 480},${200 - (v / max) * 180}`).join(" ");
              return (
                <>
                  <polygon points={`0,200 ${pts} 480,200`} fill="url(#g)" />
                  <polyline points={pts} fill="none" stroke="oklch(0.78 0.18 195)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                  {data.map((v, i) => (
                    <circle key={i} cx={(i / 23) * 480} cy={200 - (v / max) * 180} r="2" fill="oklch(0.78 0.18 195)" />
                  ))}
                </>
              );
            })()}
          </svg>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {[0, 6, 12, 18, 23].map((h) => <span key={h}>{h}h</span>)}
          </div>
        </div>
      </section>

      {/* Breakdown + tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-5">Répartition par usage</h3>
          <div className="space-y-4">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground tabular-nums">{b.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={cn("h-full rounded-full", b.color)} style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <Plug className="h-4 w-4 text-primary" /> Recommandations IA
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              "Réduire de 2°C le chauffage la nuit → économie estimée 18 €/mois.",
              "Programmer le lave-vaisselle après 22h (tarif heures creuses).",
              "Mode éco-éclairage : intensité limitée à 80% en journée.",
              "Détection veille fantôme sur 3 appareils multimédia.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 glass rounded-xl p-3">
                <span className="h-7 w-7 rounded-lg bg-success/15 text-success flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
