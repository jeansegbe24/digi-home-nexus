import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Shield, Camera, AlertTriangle, Lock, Eye, Radio, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/securite")({
  head: () => ({
    meta: [
      { title: "Sécurité — DIGI HOME" },
      { name: "description", content: "Surveillance, alertes intrusion et monitoring live." },
    ],
  }),
  component: Securite,
});

const cameras = [
  { name: "Entrée principale", live: true },
  { name: "Jardin", live: true },
  { name: "Garage", live: true },
  { name: "Couloir", live: false },
];

const alerts = [
  { level: "info", time: "14:32", text: "Mouvement détecté · Jardin", icon: Eye },
  { level: "warn", time: "11:42", text: "Tentative d'accès non autorisée · Garage", icon: AlertTriangle },
  { level: "ok", time: "09:00", text: "Système armé automatiquement", icon: Shield },
  { level: "info", time: "07:30", text: "Capteur fenêtre Salon : OK", icon: Radio },
];

function Securite() {
  const [armed, setArmed] = useState(true);

  return (
    <AppShell title="Sécurité intelligente" subtitle="Protection active 24h/24 — monitoring temps réel.">
      {/* Status hero */}
      <section className={cn(
        "relative overflow-hidden glass-strong rounded-3xl p-8 mb-8 border-2 transition",
        armed ? "border-success/30" : "border-destructive/30"
      )}>
        <div className={cn(
          "absolute inset-0 pointer-events-none opacity-30",
          armed ? "bg-gradient-to-br from-success/20 to-transparent" : "bg-gradient-to-br from-destructive/20 to-transparent"
        )} />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={cn(
              "h-20 w-20 rounded-3xl flex items-center justify-center",
              armed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              <Shield className="h-10 w-10" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">État système</p>
              <h2 className="text-3xl font-bold">{armed ? "Maison protégée" : "Sécurité désarmée"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {armed ? "12 capteurs actifs · 4 caméras en ligne" : "Tous les capteurs sont en veille"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setArmed(!armed)}
            className={cn(
              "px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 transition glow-primary",
              armed
                ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground"
            )}
          >
            <Lock className="h-4 w-4" />
            {armed ? "Désarmer le système" : "Armer le système"}
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cameras */}
        <section className="lg:col-span-2">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Caméras live</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {cameras.map((c, i) => (
              <div
                key={c.name}
                className="glass rounded-2xl overflow-hidden card-hover animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/40" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 glass-strong rounded-full px-3 py-1">
                    <span className={cn("h-2 w-2 rounded-full", c.live ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{c.live ? "Live" : "Hors ligne"}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 glass rounded-md px-2 py-1 text-[10px] font-mono">
                    {new Date().toLocaleTimeString("fr-FR")}
                  </div>
                  {/* scanline */}
                  {c.live && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="font-medium text-sm">{c.name}</p>
                  <button className="text-xs text-primary hover:underline">Plein écran</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Alertes & événements
          </h3>
          <div className="glass rounded-2xl divide-y divide-glass-border">
            {alerts.map((a, i) => {
              const Icon = a.icon;
              const color = a.level === "warn" ? "text-destructive bg-destructive/15"
                : a.level === "ok" ? "text-success bg-success/15"
                : "text-primary bg-primary/15";
              return (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
