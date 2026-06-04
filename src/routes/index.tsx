import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  Thermometer, Droplets, Wind, Zap, Shield, Lightbulb,
  ArrowUpRight, Activity as ActivityIcon, Lock, Camera, Wifi, Sparkles, Power,
  AlertTriangle, RefreshCw
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useClock } from "@/hooks/useLive";
import { PageTransition, StaggerList, StaggerItem } from "@/components/PageTransition";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — DIGI HOME" },
      { name: "description", content: "Vue d'ensemble premium de votre maison intelligente." },
    ],
  }),
  component: Dashboard,
});

interface Sensors {
  temperature: number;
  humidity: number;
  aqi: number;
  power: number;
}

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

interface Activity {
  id: string;
  time: string;
  text: string;
  icon: string;
  ok: boolean;
}

const getIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "camera": return Camera;
    case "sparkles": return Sparkles;
    case "lock": return Lock;
    case "shield": return Shield;
    case "wifi": return Wifi;
    default: return ActivityIcon;
  }
};

function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const now = useClock();

  // Queries
  const { 
    data: sensors, 
    isLoading: sensorsLoading, 
    error: sensorsError,
    refetch: refetchSensors
  } = useQuery<Sensors>({
    queryKey: ["sensors"],
    queryFn: () => apiClient.get<Sensors>("/api/sensors"),
  });

  const { 
    data: rooms, 
    isLoading: roomsLoading, 
    error: roomsError,
    refetch: refetchRooms
  } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => apiClient.get<Room[]>("/api/rooms"),
  });

  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: () => apiClient.get<Activity[]>("/api/activities"),
  });

  const { 
    data: securityArmed = true, 
    isLoading: securityLoading, 
    refetch: refetchSecurity 
  } = useQuery<boolean>({
    queryKey: ["security_armed"],
    queryFn: () => apiClient.get<{ armed: boolean }>("/api/security/state").then(r => r.armed),
  });

  // Mutations
  const toggleSecurityMutation = useMutation({
    mutationFn: (newArmedState: boolean) => 
      apiClient.post<{ armed: boolean }>("/api/security/toggle", { armed: newArmedState }),
    onSuccess: (data) => {
      queryClient.setQueryData(["security_armed"], data.armed);
      toast.success(data.armed ? "Système de sécurité armé ✓" : "Système de sécurité désarmé ⚠️");
    }
  });

  const activateScenarioMutation = useMutation({
    mutationFn: (scenarioName: string) => 
      apiClient.post("/api/scenarios/activate", { name: scenarioName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Scénario « Soirée » activé !");
    }
  });

  const toggleRoomPowerMutation = useMutation({
    mutationFn: ({ roomId, lit }: { roomId: string; lit: boolean }) => 
      apiClient.patch<Room>(`/api/rooms/${roomId}`, { lit }),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData<Room[]>(["rooms"], (prev) => 
        prev?.map((r) => r.id === updatedRoom.id ? updatedRoom : r)
      );
      toast.success(`Pièce ${updatedRoom.name} : éclairage ${updatedRoom.lit ? 'allumé' : 'éteint'}`);
    }
  });

  const isLoading = sensorsLoading || roomsLoading || activitiesLoading || securityLoading;
  const hasError = sensorsError || roomsError || activitiesError;

  const handleRetryAll = () => {
    refetchSensors();
    refetchRooms();
    refetchActivities();
    refetchSecurity();
  };

  const displayName = user?.nom || "Utilisateur";

  if (hasError) {
    return (
      <AppShell title={`Bonjour, ${displayName} 👋`} subtitle="Système connecté à DIGI HOME.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Impossible de charger les données</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Une erreur est survenue lors de la connexion au serveur de domotique. Vérifiez que le backend FastAPI est démarré.
            </p>
            <button
              onClick={handleRetryAll}
              className="bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition"
            >
              <RefreshCw className="h-4 w-4" /> Réessayer la connexion
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell title={`Bonjour, ${displayName} 👋`} subtitle="Mise à jour des systèmes en cours...">
        <div className="space-y-8 animate-pulse">
          <div className="h-56 glass rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 glass rounded-2xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 glass rounded-2xl" />
            <div className="h-72 glass rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  const sensorCards = [
    { label: "Température", value: sensors?.temperature.toFixed(1) || "22.0", unit: "°C", icon: Thermometer, color: "text-orange-300", trend: "stable" },
    { label: "Humidité", value: sensors?.humidity.toFixed(0) || "50", unit: "%", icon: Droplets, color: "text-cyan-300", trend: "optimal" },
    { label: "Qualité air", value: sensors?.aqi.toFixed(0) || "95", unit: "AQI", icon: Wind, color: "text-emerald-300", trend: "excellent" },
    { label: "Consommation", value: sensors?.power.toFixed(1) || "3.0", unit: "kW", icon: Zap, color: "text-yellow-300", trend: "-12%" },
  ];

  const totalActiveDevices = rooms?.reduce((sum, r) => sum + r.active, 0) || 0;
  const totalDevices = rooms?.reduce((sum, r) => sum + r.devices, 0) || 0;

  return (
    <AppShell title={`Bonjour, ${displayName} 👋`} subtitle="Votre maison est sécurisée et fonctionne parfaitement.">
      <PageTransition>
      {/* Hero status */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden glass-strong rounded-3xl p-8 mb-8"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(at 0% 0%, oklch(0.65 0.22 295 / 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.78 0.18 195 / 0.20) 0px, transparent 50%)",
              "radial-gradient(at 100% 0%, oklch(0.78 0.18 195 / 0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, oklch(0.65 0.22 295 / 0.20) 0px, transparent 50%)",
              "radial-gradient(at 0% 0%, oklch(0.65 0.22 295 / 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.78 0.18 195 / 0.20) 0px, transparent 50%)",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Système opérationnel · {now.toLocaleTimeString("fr-FR")}</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-3">
              Maison <span className="gradient-text">parfaitement</span> orchestrée.
            </h2>
            <p className="text-muted-foreground max-w-xl mb-6">
              {totalDevices} appareils connectés · {totalActiveDevices} actifs · 0 alerte critique. Consommation optimisée à 88 %.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }} 
                onClick={() => activateScenarioMutation.mutate("Soirée")}
                disabled={activateScenarioMutation.isPending}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition glow-primary disabled:opacity-60"
              >
                {activateScenarioMutation.isPending ? (
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Activer scénario « Soirée »
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => toggleSecurityMutation.mutate(!securityArmed)}
                disabled={toggleSecurityMutation.isPending}
                className={cn(
                  "glass px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition border disabled:opacity-60",
                  securityArmed ? "border-success/40 text-success" : "border-destructive/40 text-destructive"
                )}
              >
                {toggleSecurityMutation.isPending ? (
                  <span className={cn("h-4 w-4 border-2 border-t-transparent rounded-full animate-spin", securityArmed ? "border-success" : "border-destructive")} />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {securityArmed ? "Sécurité armée" : "Sécurité désarmée"}
              </motion.button>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Maintenant</p>
            <p className="text-5xl font-bold tabular-nums mb-2">{(sensors?.temperature ?? 22).toFixed(1)}°</p>
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
      </motion.section>

      {/* Sensors */}
      <StaggerList>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sensorCards.map((s) => {
            const Icon = s.icon;
            return (
              <StaggerItem key={s.label}>
                <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 card-hover h-full">
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
                </motion.div>
              </StaggerItem>
            );
          })}
        </section>
      </StaggerList>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rooms */}
        <section className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Pièces</h3>
            <button className="text-xs text-primary hover:underline">Voir tout</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {rooms?.map((r) => (
              <motion.div key={r.id || r.name} whileHover={{ y: -2 }} className="glass rounded-xl p-5 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.active}/{r.devices} appareils actifs
                    </p>
                  </div>
                  <button
                    disabled={toggleRoomPowerMutation.isPending}
                    onClick={() => toggleRoomPowerMutation.mutate({ roomId: r.id, lit: !r.lit })}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition disabled:opacity-55",
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Activité récente</h3>
            <ActivityIcon className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <ul className="space-y-3">
            {activities?.slice(0, 5).map((a, i) => {
              const Icon = getIcon(a.icon);
              return (
                <motion.li
                  key={a.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-3 group"
                >
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
                </motion.li>
              );
            })}
          </ul>
        </section>
      </div>
      </PageTransition>
    </AppShell>
  );
}
