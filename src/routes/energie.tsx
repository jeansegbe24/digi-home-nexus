import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Zap, TrendingDown, Leaf, Plug } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { PageTransition } from "@/components/PageTransition";
import { useLiveNumber } from "@/hooks/useLive";

export const Route = createFileRoute("/energie")({
  head: () => ({
    meta: [
      { title: "Énergie — DIGI HOME" },
      { name: "description", content: "Analyse, optimisation et monitoring temps réel de la consommation." },
    ],
  }),
  component: Energie,
});

const hours = Array.from({ length: 24 }, (_, i) => i);
const data = hours.map((h) => ({
  hour: `${h}h`,
  kw: +(1.5 + Math.sin(h / 3) * 0.9 + (h > 17 && h < 22 ? 1.8 : 0) + Math.random() * 0.4).toFixed(2),
  solaire: +(Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)) * 2.2).toFixed(2),
}));

const breakdown = [
  { label: "Chauffage", value: 38, color: "bg-orange-400" },
  { label: "Éclairage", value: 22, color: "bg-amber-300" },
  { label: "Électroménager", value: 18, color: "bg-cyan-300" },
  { label: "Multimédia", value: 12, color: "bg-purple-400" },
  { label: "Autres", value: 10, color: "bg-muted-foreground" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 text-xs shadow-2xl">
      <p className="font-semibold mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.dataKey === "kw" ? "Conso" : "Solaire"}:</span>
          <span className="font-mono font-semibold">{p.value} kW</span>
        </p>
      ))}
    </div>
  );
}

function Energie() {
  const [range, setRange] = useState("24h");
  const conso = useLiveNumber(12.8, { min: 11.5, max: 14, step: 0.2 });
  const eco = useLiveNumber(42.3, { min: 40, max: 45, step: 0.15 });
  const co2 = useLiveNumber(3.4, { min: 3.0, max: 3.8, step: 0.05 });

  const kpis = [
    { label: "Consommation jour", value: conso.toFixed(1), unit: "kWh", icon: Zap, trend: "-8%" },
    { label: "Économie mois", value: eco.toFixed(2), unit: "€", icon: TrendingDown, trend: "-12%" },
    { label: "Empreinte CO₂", value: co2.toFixed(1), unit: "kg", icon: Leaf, trend: "-15%" },
  ];

  return (
    <AppShell title="Gestion énergétique" subtitle="Suivi temps réel et optimisations intelligentes.">
      <PageTransition>
      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-success bg-success/15 rounded-full px-2 py-0.5">{k.trend}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
              <motion.p
                key={k.value}
                initial={{ opacity: 0.6, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tabular-nums"
              >
                {k.value}
                <span className="text-base text-muted-foreground ml-1.5 font-normal">{k.unit}</span>
              </motion.p>
            </motion.div>
          );
        })}
      </section>

      <section className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Consommation vs. production solaire</h3>
            <p className="text-xs text-muted-foreground">Profil heure par heure (kW)</p>
          </div>
          <div className="flex gap-2">
            {["24h", "7j", "30j", "1a"].map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition",
                  range === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gKw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 195)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 195)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.80 0.17 75)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.80 0.17 75)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="hour" stroke="oklch(0.68 0.03 255)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.68 0.03 255)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "oklch(0.78 0.18 195)", strokeWidth: 1, strokeDasharray: "3 3" }} />
              <Area type="monotone" dataKey="solaire" stroke="oklch(0.80 0.17 75)" strokeWidth={2} fill="url(#gSol)" />
              <Area type="monotone" dataKey="kw" stroke="oklch(0.78 0.18 195)" strokeWidth={2.5} fill="url(#gKw)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-5">Répartition par usage</h3>
          <div className="space-y-4">
            {breakdown.map((b, i) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground tabular-nums">{b.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${b.value}%` }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full rounded-full", b.color)}
                  />
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
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 glass rounded-xl p-3"
              >
                <span className="h-7 w-7 rounded-lg bg-success/15 text-success flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <span>{t}</span>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
      </PageTransition>
    </AppShell>
  );
}
