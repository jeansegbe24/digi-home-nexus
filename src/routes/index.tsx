import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  Thermometer, Droplets, Wind, Zap, Shield, Lightbulb,
  ArrowUpRight, Activity, Lock, Camera, Wifi, Sparkles, Power,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — DIGI HOME" },
      { name: "description", content: "Vue d'ensemble premium de votre maison intelligente." },
    ],
  }),
  component: Dashboard,
});

const sensors = [
  { label: "Température", value: "22,4", unit: "°C", icon: Thermometer, color: "text-orange-300", trend: "+0,3°" },
  { label: "Humidité", value: "48", unit: "%", icon: Droplets, color: "text-cyan-300", trend: "stable" },
  { label: "Qualité air", value: "98", unit: "AQI", icon: Wind, color: "text-emerald-300", trend: "excellent" },
  { label: "Consommation", value: "3,2", unit: "kW", icon: Zap, color: "text-yellow-300", trend: "-12%" },
];

const rooms = [
  { name: "Salon", devices: 8, active: 5, temp: "22°", lit: true },
  { name: "Cuisine", devices: 6, active: 2, temp: "21°", lit: false },
  { name: "Chambre", devices: 4, active: 1, temp: "20°", lit: false },
  { name: "Bureau", devices: 5, active: 3, temp: "23°", lit: true },
];

const activities = [
  { time: "14:32", text: "Reconnaissance faciale : Alex Dupont", icon: Camera, ok: true },
  { time: "13:18", text: "Scénario « Soirée cinéma » activé", icon: Sparkles, ok: true },
  { time: "12:05", text: "Porte d'entrée verrouillée automatiquement", icon: Lock, ok: true },
  { time: "11:42", text: "Tentative d'accès inconnue — refusée", icon: Shield, ok: false },
  { time: "10:30", text: "Mise à jour firmware caméra Salon", icon: Wifi, ok: true },
];

function Dashboard() {
  const [armed, setArmed] = useState(true);

  return (
    <AppShell title="Bonjour, Alex 👋" subtitle="Votre maison est sécurisée et fonctionne parfaitement.">
      {/* Hero status */}
      <section className="relative overflow-hidden glass-strong rounded-3xl p-8 mb-8 animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15 pointer-events-none" />
        <div className="relative grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Système opérationnel</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-3">
              Maison <span className="gradient-text">parfaitement</span> orchestrée.
            </h2>
            <p className="text-muted-foreground max-w-xl mb-6">
              23 appareils connectés · 11 actifs · 0 alerte critique. Consommation optimisée à 88 %.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition glow-primary">
                <Sparkles className="h-4 w-4" /> Activer scénario « Soirée »
              </button>
              <button
                onClick={() => setArmed(!armed)}
                className={cn(
                  "glass px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition border",
                  armed ? "border-success/40 text-success" : "border-destructive/40 text-destructive"
                )}
              >
                <Shield className="h-4 w-4" /> {armed ? "Sécurité armée" : "Sécurité désarmée"}
              </button>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Maintenant</p>
            <p className="text-5xl font-bold tabular-nums mb-2">22,4°</p>
            <p className="text-sm text-muted-foreground">Salon · Ensoleillé · Lyon</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["08h", "12h", "18h"].map((h, i) => (
                <div key={h} className="bg-white/5 rounded-lg py-2">
                  <p className="text-[10px] text-muted-foreground">{h}</p>
                  <p className="text-sm font-semibold">{[19, 23, 21][i]}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sensors */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sensors.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 card-hover animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center", s.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> {s.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-bold tabular-nums">
                {s.value}
                <span className="text-sm text-muted-foreground ml-1 font-normal">{s.unit}</span>
              </p>
            </div>
          );
        })}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rooms */}
        <section className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Pièces</h3>
            <button className="text-xs text-primary hover:underline">Voir tout</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {rooms.map((r) => (
              <div key={r.name} className="glass rounded-xl p-5 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.active}/{r.devices} appareils actifs
                    </p>
                  </div>
                  <button
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition",
                      r.lit ? "bg-primary text-primary-foreground glow-primary" : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Thermometer className="h-3 w-3" />{r.temp}</span>
                  <span className="flex items-center gap-1.5"><Lightbulb className="h-3 w-3" />{r.lit ? "Allumé" : "Éteint"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Activité récente</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <ul className="space-y-3">
            {activities.map((a, i) => {
              const Icon = a.icon;
              return (
                <li key={i} className="flex items-start gap-3 group">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                      a.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
