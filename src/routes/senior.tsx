import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HeartPulse, Pill, Phone, MessageCircle, AlertCircle, Sun, Lightbulb, RefreshCw, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/senior")({
  head: () => ({
    meta: [
      { title: "Mode Senior — DIGI HOME" },
      { name: "description", content: "Interface simplifiée et assistance intelligente pour seniors." },
    ],
  }),
  component: Senior,
});

interface Med {
  id: string;
  name: string;
  time: string;
  taken: boolean;
}

interface SeniorData {
  username: string;
  meds: Med[];
  health: {
    bpm: string;
    sleep: string;
    steps: string;
    water: string;
  };
}

const bigButtons = [
  { label: "Lumière", icon: Lightbulb, color: "from-amber-300 to-orange-400", action: "lumiere" },
  { label: "Famille", icon: Phone, color: "from-emerald-300 to-cyan-400", action: "famille" },
  { label: "Message", icon: MessageCircle, color: "from-primary to-accent", action: "message" },
  { label: "Urgence", icon: AlertCircle, color: "from-red-400 to-orange-500", action: "urgence" },
];

const getButtonIcon = (label: string) => {
  switch (label) {
    case "Lumière": return Lightbulb;
    case "Famille": return Phone;
    case "Message": return MessageCircle;
    case "Urgence": return AlertCircle;
    default: return AlertCircle;
  }
};

function Senior() {
  const queryClient = useQueryClient();

  // Queries
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<SeniorData>({
    queryKey: ["senior"],
    queryFn: () => apiClient.get<SeniorData>("/api/senior"),
  });

  // Mutations
  const takeMedMutation = useMutation({
    mutationFn: (medId: string) => 
      apiClient.post<Med>(`/api/senior/meds/${medId}/take`, {}),
    onSuccess: (updatedMed) => {
      queryClient.setQueryData<SeniorData>(["senior"], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meds: prev.meds.map((m) => m.id === updatedMed.id ? updatedMed : m),
        };
      });
      toast.success(`Médicament « ${updatedMed.name} » validé.`);
    }
  });

  const SOSMutation = useMutation({
    mutationFn: () => apiClient.post("/api/senior/urgency", {}),
    onSuccess: () => {
      toast.error("⚠️ ALERTE SOS ENVOYÉE. La famille et les secours ont été prévenus.", {
        duration: 8000,
      });
    }
  });

  const triggerActionMutation = useMutation({
    mutationFn: (action: string) => apiClient.post(`/api/senior/action/${action}`, {}),
    onSuccess: (_, action) => {
      if (action === "lumiere") {
        toast.success("Éclairages adaptés activés.");
      } else if (action === "famille") {
        toast.info("Appel en cours vers votre contact d'urgence...");
      } else if (action === "message") {
        toast.info("Envoi d'un message rapide à vos proches...");
      } else if (action === "urgence") {
        SOSMutation.mutate();
      }
    }
  });

  if (error) {
    return (
      <AppShell title="Mode Senior" subtitle="Une maison qui prend soin de vous.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Erreur du mode Senior</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Impossible de se connecter aux systèmes d'assistance.
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
      <AppShell title="Mode Senior" subtitle="Chargement de votre assistant...">
        <div className="space-y-8 animate-pulse">
          <div className="h-44 glass rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 glass rounded-3xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-80 glass rounded-2xl" />
            <div className="h-80 glass rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  const seniorName = data?.username || "Aîné";
  const undoneMedsCount = data?.meds.filter(m => !m.taken).length || 0;
  const subtitleMsg = undoneMedsCount > 0 
    ? `Tout va bien à la maison. Pensez à vos ${undoneMedsCount} médicaments restants.` 
    : "Tout va bien à la maison. Tous vos médicaments ont été pris !";

  return (
    <AppShell title="Mode Senior" subtitle="Une maison qui prend soin de vous.">
      <PageTransition>
      {/* Greeting */}
      <section className="glass-strong rounded-3xl p-8 lg:p-10 mb-8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="h-5 w-5 text-amber-300" />
          <span className="text-sm text-muted-foreground">Aujourd'hui · {new Date().toLocaleTimeString("fr-FR", {hour: '2-digit', minute: '2-digit'})}</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-3">Bonjour {seniorName} 👋</h2>
        <p className="text-xl text-muted-foreground">{subtitleMsg}</p>
      </section>

      {/* Big buttons */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {bigButtons.map((b, i) => {
          const Icon = getButtonIcon(b.label);
          return (
            <button
              key={b.label}
              disabled={triggerActionMutation.isPending}
              onClick={() => triggerActionMutation.mutate(b.action)}
              className="group glass-strong rounded-3xl p-8 text-center card-hover animate-slide-up disabled:opacity-60"
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
            {data?.meds.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl text-lg transition-colors",
                  m.taken ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/30"
                )}
              >
                <div>
                  <p className="font-semibold text-xl">{m.name}</p>
                  <p className="text-base text-muted-foreground">{m.time}</p>
                </div>
                <button 
                  disabled={m.taken || takeMedMutation.isPending}
                  onClick={() => takeMedMutation.mutate(m.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-semibold text-base transition-all",
                    m.taken ? "bg-success/20 text-success cursor-default" : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 active:scale-95"
                  )}
                >
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
              { label: "Rythme cardiaque", value: data?.health.bpm || "72", unit: "bpm" },
              { label: "Sommeil", value: data?.health.sleep || "7h", unit: "" },
              { label: "Pas du jour", value: data?.health.steps || "0", unit: "" },
              { label: "Hydratation", value: data?.health.water || "0", unit: "verres" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                <p className="text-3xl font-bold tabular-nums">
                  {s.value} <span className="text-base font-normal text-muted-foreground">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => SOSMutation.mutate()}
            disabled={SOSMutation.isPending}
            className="mt-5 w-full bg-gradient-to-r from-destructive to-orange-500 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 glow-primary hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60"
          >
            <AlertCircle className="h-6 w-6 animate-pulse" />
            {SOSMutation.isPending ? "Appel de détresse en cours..." : "Appeler à l'aide (SOS)"}
          </button>
        </section>
      </div>
      </PageTransition>
    </AppShell>
  );
}
