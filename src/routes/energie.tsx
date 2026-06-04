import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Zap, TrendingDown, Leaf, Plug, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { PageTransition } from "@/components/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const Route = createFileRoute("/energie")({
  head: () => ({
    meta: [
      { title: "Énergie — DIGI HOME" },
      { name: "description", content: "Analyse, optimisation et monitoring temps réel de la consommation." },
    ],
  }),
  component: Energie,
});

interface EnergyChartPoint {
  hour: string;
  kw: number;
  solaire: number;
}

interface EnergyResponse {
  conso: number;
  eco: number;
  co2: number;
  chartData: EnergyChartPoint[];
}

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

  // Query linked to the range state
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery<EnergyResponse>({
    queryKey: ["energy", range],
    queryFn: () => apiClient.get<EnergyResponse>(`/api/energy?range=${range}`),
  });

  if (error) {
    return (
      <AppShell title="Gestion énergétique" subtitle="Suivi temps réel et optimisations intelligentes.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Impossible de charger les données énergétiques</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Une erreur est survenue lors de la communication avec le module de télémesure.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition"
            >
              <RefreshCw className="h-4 w-4" /> Réessayer
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell title="Gestion énergétique" subtitle="Analyse de la consommation...">
        <div className="space-y-8 animate-pulse">
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 glass rounded-2xl" />
            ))}
          </div>
          <div className="h-80 glass rounded-2xl" />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-72 glass rounded-2xl" />
            <div className="h-72 glass rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Consommation jour", value: data?.conso.toFixed(1) || "0.0", unit: "kWh", icon: Zap, trend: "-8%" },
    { label: "Économie mois", value: data?.eco.toFixed(2) || "0.00", unit: "€", icon: TrendingDown, trend: "-12%" },
    { label: "Empreinte CO₂", value: data?.co2.toFixed(1) || "0.0", unit: "kg", icon: Leaf, trend: "-15%" },
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
              <p className="text-3xl font-bold tabular-nums">
                {k.value}
                <span className="text-base text-muted-foreground ml-1.5 font-normal">{k.unit}</span>
              </p>
            </motion.div>
          );
        })}
      </section>

      <section className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Consommation vs. production solaire</h3>
            <p className="text-xs text-muted-foreground">Profil de consommation ({range === "24h" ? "kW" : "kWh"})</p>
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
            <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
