import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Shield, AlertTriangle, Lock, Eye, Radio, Activity } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CameraFeed } from "@/components/CameraFeed";
import { PageTransition } from "@/components/PageTransition";

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
  { name: "Entrée principale", live: true, mode: "night" as const, motion: true },
  { name: "Jardin", live: true, mode: "thermal" as const, motion: false },
  { name: "Garage", live: true, mode: "night" as const, motion: false },
  { name: "Couloir", live: false, mode: "day" as const, motion: false },
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
      <PageTransition>
      <motion.section
        layout
        className={cn(
          "relative overflow-hidden glass-strong rounded-3xl p-8 mb-8 border-2 transition",
          armed ? "border-success/30" : "border-destructive/30"
        )}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background: armed
              ? "radial-gradient(at 30% 50%, oklch(0.72 0.19 155 / 0.25), transparent 60%)"
              : "radial-gradient(at 30% 50%, oklch(0.65 0.24 25 / 0.25), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              animate={{ scale: armed ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "h-20 w-20 rounded-3xl flex items-center justify-center",
                armed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}
            >
              <Shield className="h-10 w-10" />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">État système</p>
              <h2 className="text-3xl font-bold">{armed ? "Maison protégée" : "Sécurité désarmée"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {armed ? "12 capteurs actifs · 4 caméras en ligne" : "Tous les capteurs sont en veille"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => setArmed(!armed)}
            className={cn(
              "px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 transition",
              armed
                ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
            )}
          >
            <Lock className="h-4 w-4" />
            {armed ? "Désarmer le système" : "Armer le système"}
          </motion.button>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Caméras live</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {cameras.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <CameraFeed name={c.name} live={c.live} mode={c.mode} motionDetected={c.motion} />
              </motion.div>
            ))}
          </div>
        </section>

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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="p-4 flex items-start gap-3"
                >
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
      </PageTransition>
    </AppShell>
  );
}
