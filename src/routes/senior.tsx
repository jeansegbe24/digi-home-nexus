import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HeartPulse, Pill, Phone, MessageCircle, AlertCircle, Sun, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/senior")({
  head: () => ({
    meta: [
      { title: "Mode Senior — DIGI HOME" },
      { name: "description", content: "Interface simplifiée et assistance intelligente pour seniors." },
    ],
  }),
  component: Senior,
});

const meds = [
  { name: "Tension artérielle", time: "08:00", taken: true },
  { name: "Vitamine D", time: "12:30", taken: true },
  { name: "Anti-inflammatoire", time: "19:00", taken: false },
];

const bigButtons = [
  { label: "Lumière", icon: Lightbulb, color: "from-amber-300 to-orange-400" },
  { label: "Famille", icon: Phone, color: "from-emerald-300 to-cyan-400" },
  { label: "Message", icon: MessageCircle, color: "from-primary to-accent" },
  { label: "Urgence", icon: AlertCircle, color: "from-red-400 to-orange-500" },
];

function Senior() {
  return (
    <AppShell title="Mode Senior" subtitle="Une maison qui prend soin de vous.">
      {/* Greeting */}
      <section className="glass-strong rounded-3xl p-8 lg:p-10 mb-8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="h-5 w-5 text-amber-300" />
          <span className="text-sm text-muted-foreground">Mardi 2 juin · 14:32</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-3">Bonjour Henri 👋</h2>
        <p className="text-xl text-muted-foreground">Tout va bien à la maison. Pensez à votre médicament de 19h.</p>
      </section>

      {/* Big buttons */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {bigButtons.map((b, i) => {
          const Icon = b.icon;
          return (
            <button
              key={b.label}
              className="group glass-strong rounded-3xl p-8 text-center card-hover animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={cn(
                "h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition",
                b.color
              )}>
                <Icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <p className="text-xl font-bold">{b.label}</p>
            </button>
          );
        })}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Medications */}
        <section className="glass rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
            <Pill className="h-6 w-6 text-primary" /> Rappels médicaments
          </h3>
          <ul className="space-y-3">
            {meds.map((m, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl text-lg",
                  m.taken ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/30"
                )}
              >
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-base text-muted-foreground">{m.time}</p>
                </div>
                <button className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold",
                  m.taken ? "bg-success/20 text-success" : "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                )}>
                  {m.taken ? "✓ Pris" : "Marquer pris"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Health */}
        <section className="glass rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-destructive" /> Bien-être
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Rythme cardiaque", value: "72", unit: "bpm" },
              { label: "Sommeil", value: "7h32", unit: "" },
              { label: "Pas du jour", value: "4 218", unit: "" },
              { label: "Hydratation", value: "5/8", unit: "verres" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                <p className="text-3xl font-bold tabular-nums">
                  {s.value} <span className="text-base font-normal text-muted-foreground">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full bg-gradient-to-r from-destructive to-orange-500 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 glow-primary">
            <AlertCircle className="h-6 w-6" /> Appeler à l'aide
          </button>
        </section>
      </div>
    </AppShell>
  );
}
