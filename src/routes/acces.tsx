import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Fingerprint, Mic, Radio, ScanFace, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/acces")({
  head: () => ({
    meta: [
      { title: "Accès intelligents — DIGI HOME" },
      { name: "description", content: "Reconnaissance faciale, vocale et badges RFID." },
    ],
  }),
  component: Acces,
});

const methods = [
  { id: "face", name: "Reconnaissance faciale", icon: ScanFace, status: "Actif", desc: "12 visages enregistrés", color: "from-primary to-accent" },
  { id: "voice", name: "Reconnaissance vocale", icon: Mic, status: "Actif", desc: "5 empreintes vocales", color: "from-accent to-pink-400" },
  { id: "rfid", name: "Badge RFID / NFC", icon: Radio, status: "Actif", desc: "8 badges autorisés", color: "from-emerald-400 to-cyan-300" },
  { id: "finger", name: "Empreinte digitale", icon: Fingerprint, status: "Veille", desc: "Capteur porte garage", color: "from-yellow-300 to-orange-400" },
];

const logs = [
  { t: "14:32", who: "Alex Dupont", method: "Faciale", door: "Entrée principale", ok: true },
  { t: "14:18", who: "Marie Dupont", method: "Vocale", door: "Garage", ok: true },
  { t: "13:55", who: "Inconnu", method: "Faciale", door: "Entrée principale", ok: false },
  { t: "13:30", who: "Léo Dupont", method: "Badge RFID", door: "Porte arrière", ok: true },
  { t: "12:48", who: "Femme de ménage", method: "Code PIN", door: "Entrée principale", ok: true },
  { t: "11:42", who: "Inconnu", method: "Vocale", door: "Garage", ok: false },
];

function Acces() {
  const [scanning, setScanning] = useState(false);

  return (
    <AppShell title="Accès intelligents" subtitle="Pilotage biométrique et journalisation complète des entrées.">
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {methods.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="glass rounded-2xl p-6 card-hover animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", m.color)}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="font-semibold mb-1">{m.name}</p>
                <p className="text-xs text-muted-foreground mb-4">{m.desc}</p>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] uppercase tracking-widest px-2 py-1 rounded-full",
                    m.status === "Actif" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  )}>● {m.status}</span>
                  <button className="text-xs text-primary hover:underline">Configurer</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live scan */}
        <div className="glass-strong rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Scan en direct</h3>
          <div className="relative flex-1 min-h-[280px] rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border flex items-center justify-center overflow-hidden">
            <div className={cn(
              "relative h-40 w-40 rounded-full border-2 flex items-center justify-center transition-all",
              scanning ? "border-primary animate-pulse-glow" : "border-glass-border"
            )}>
              <ScanFace className={cn("h-20 w-20", scanning ? "text-primary" : "text-muted-foreground")} />
              {scanning && (
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
              )}
            </div>
            {scanning && (
              <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3 text-center text-xs">
                Analyse biométrique en cours…
              </div>
            )}
          </div>
          <button
            onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2500); }}
            className="mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
          >
            Lancer un scan test
          </button>
        </div>
      </div>

      {/* Journal */}
      <section className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-glass-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Journal des accès</h3>
            <p className="text-xs text-muted-foreground">Historique des 24 dernières heures</p>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-glass-border">
          {logs.map((l, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition">
              {l.ok ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
              )}
              <div className="flex-1 grid sm:grid-cols-4 gap-2 text-sm">
                <span className="font-medium">{l.who}</span>
                <span className="text-muted-foreground">{l.method}</span>
                <span className="text-muted-foreground">{l.door}</span>
                <span className="text-muted-foreground tabular-nums sm:text-right">{l.t}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
