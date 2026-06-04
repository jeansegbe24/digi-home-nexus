import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Lightbulb, Sparkles, Moon, Sun, Film, Coffee, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/eclairage")({
  head: () => ({
    meta: [
      { title: "Éclairage intelligent — DIGI HOME" },
      { name: "description", content: "Contrôle d'éclairage par pièce, intensité et scénarios." },
    ],
  }),
  component: Eclairage,
});

interface Room {
  id: string;
  name: string;
  devices: number;
  active: number;
  temp: string;
  lit: boolean;
  brightness: number;
  color: "warm" | "cool";
}

const scenes = [
  { name: "Réveil doux", icon: Sun, gradient: "from-amber-300 to-orange-400" },
  { name: "Concentration", icon: Coffee, gradient: "from-cyan-300 to-blue-400" },
  { name: "Soirée cinéma", icon: Film, gradient: "from-purple-400 to-pink-400" },
  { name: "Nuit", icon: Moon, gradient: "from-indigo-400 to-violet-500" },
];

const getSceneIcon = (name: string) => {
  switch (name) {
    case "Réveil doux": return Sun;
    case "Concentration": return Coffee;
    case "Soirée cinéma": return Film;
    case "Nuit": return Moon;
    default: return Sparkles;
  }
};

function Eclairage() {
  const queryClient = useQueryClient();

  // Queries
  const { 
    data: rooms, 
    isLoading, 
    error,
    refetch
  } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => apiClient.get<Room[]>("/api/rooms"),
  });

  // Mutations
  const activateScenarioMutation = useMutation({
    mutationFn: (scenarioName: string) => 
      apiClient.post("/api/scenarios/activate", { name: scenarioName }),
    onSuccess: (_, scenarioName) => {
      toast.success(`Scénario « ${scenarioName} » activé !`);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });

  if (error) {
    return (
      <AppShell title="Éclairage intelligent" subtitle="Contrôlez l'ambiance lumineuse de chaque pièce.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Impossible de charger les pièces</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Une erreur est survenue lors du chargement des lumières de la maison.
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
      <AppShell title="Éclairage intelligent" subtitle="Chargement de l'ambiance...">
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 glass rounded-2xl" />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 glass rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Éclairage intelligent" subtitle="Contrôlez l'ambiance lumineuse de chaque pièce.">
      <PageTransition>
      {/* Scenes */}
      <section className="mb-8">
        <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Scénarios intelligents
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scenes.map((s, i) => {
            const Icon = getSceneIcon(s.name);
            return (
              <button
                key={s.name}
                onClick={() => activateScenarioMutation.mutate(s.name)}
                disabled={activateScenarioMutation.isPending}
                className="group relative overflow-hidden glass rounded-2xl p-6 text-left card-hover animate-slide-up disabled:opacity-50"
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
          {rooms?.map((r) => (
            <RoomCard key={r.id || r.name} room={r} />
          ))}
        </div>
      </section>
      </PageTransition>
    </AppShell>
  );
}

function RoomCard({ room }: { room: Room }) {
  const queryClient = useQueryClient();
  const [localBrightness, setLocalBrightness] = useState(room.brightness);

  // Sync with react-query updates (e.g. from WebSockets or mutations)
  useEffect(() => {
    setLocalBrightness(room.brightness);
  }, [room.brightness]);

  const updateRoomMutation = useMutation({
    mutationFn: (updates: { lit?: boolean; brightness?: number }) => 
      apiClient.patch<Room>(`/api/rooms/${room.id}`, updates),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData<Room[]>(["rooms"], (prev) => 
        prev?.map((r) => r.id === updatedRoom.id ? updatedRoom : r)
      );
    },
    onError: () => {
      // Revert local value on error
      setLocalBrightness(room.brightness);
    }
  });

  const handleToggle = () => {
    updateRoomMutation.mutate({ lit: !room.lit });
  };

  const handleBrightnessRelease = () => {
    updateRoomMutation.mutate({ brightness: localBrightness });
  };

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition",
            room.lit ? "bg-gradient-to-br from-amber-300/30 to-orange-400/30 text-amber-200 glow-primary" : "bg-white/5 text-muted-foreground"
          )}>
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{room.name}</p>
            <p className="text-xs text-muted-foreground">
              {room.lit ? `${localBrightness}% · ${room.color === "warm" ? "Chaud" : "Froid"}` : "Éteint"}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={updateRoomMutation.isPending}
          className={cn(
            "relative h-7 w-12 rounded-full transition disabled:opacity-60",
            room.lit ? "bg-primary" : "bg-white/10"
          )}
        >
          <span className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-transform",
            room.lit ? "translate-x-5" : "translate-x-0.5"
          )} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Intensité</span>
          <span className="tabular-nums">{localBrightness}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={localBrightness}
          disabled={!room.lit || updateRoomMutation.isPending}
          onChange={(e) => setLocalBrightness(Number(e.target.value))}
          onMouseUp={handleBrightnessRelease}
          onTouchEnd={handleBrightnessRelease}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-primary disabled:opacity-40"
        />
      </div>
    </div>
  );
}
