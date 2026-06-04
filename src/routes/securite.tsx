import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Shield, AlertTriangle, Lock, Unlock, Eye, Radio, Activity, RefreshCw, DoorOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CameraFeed } from "@/components/CameraFeed";
import { PageTransition } from "@/components/PageTransition";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/securite")({
  head: () => ({
    meta: [
      { title: "Sécurité — DIGI HOME" },
      { name: "description", content: "Surveillance, alertes intrusion et monitoring live." },
    ],
  }),
  component: Securite,
});

interface CameraDevice {
  id: string;
  name: string;
  live: boolean;
  mode: "night" | "day" | "thermal";
  motion: boolean;
}

interface AlertLog {
  id: string;
  level: "info" | "warn" | "ok";
  time: string;
  text: string;
  icon: string;
}

interface Door {
  id: string;
  name: string;
  locked: boolean;
  last_changed: string;
}

interface Window {
  id: string;
  name: string;
  open: boolean;
  last_changed: string;
}

const getAlertIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "shield": return Shield;
    case "alerttriangle": return AlertTriangle;
    case "eye": return Eye;
    case "radio": return Radio;
    default: return AlertTriangle;
  }
};

function Securite() {
  const queryClient = useQueryClient();

  // Queries
  const { 
    data: securityArmed = true, 
    isLoading: securityLoading, 
    error: securityError,
    refetch: refetchSecurity 
  } = useQuery<boolean>({
    queryKey: ["security_armed"],
    queryFn: () => apiClient.get<{ armed: boolean }>("/api/security/state").then(r => r.armed),
  });

  const { 
    data: cameras, 
    isLoading: camerasLoading, 
    error: camerasError,
    refetch: refetchCameras 
  } = useQuery<CameraDevice[]>({
    queryKey: ["cameras"],
    queryFn: () => apiClient.get<CameraDevice[]>("/api/cameras"),
  });

  const { 
    data: alerts, 
    isLoading: alertsLoading, 
    error: alertsError,
    refetch: refetchAlerts 
  } = useQuery<AlertLog[]>({
    queryKey: ["alerts"],
    queryFn: () => apiClient.get<AlertLog[]>("/api/alerts"),
  });

  const {
    data: doors,
    isLoading: doorsLoading,
    error: doorsError,
    refetch: refetchDoors
  } = useQuery<Door[]>({
    queryKey: ["doors"],
    queryFn: () => apiClient.get<Door[]>("/api/doors"),
  });

  const {
    data: windows,
    isLoading: windowsLoading,
    error: windowsError,
    refetch: refetchWindows
  } = useQuery<Window[]>({
    queryKey: ["windows"],
    queryFn: () => apiClient.get<Window[]>("/api/windows"),
  });

  // Mutations
  const toggleSecurityMutation = useMutation({
    mutationFn: (newArmedState: boolean) => 
      apiClient.post<{ armed: boolean }>("/api/security/toggle", { armed: newArmedState }),
    onSuccess: (data) => {
      queryClient.setQueryData(["security_armed"], data.armed);
      toast.success(data.armed ? "Maison protégée (alarme armée) ✓" : "Système de sécurité désarmé ⚠️");
    }
  });

  const toggleDoorMutation = useMutation({
    mutationFn: ({ doorId, locked }: { doorId: string; locked: boolean }) =>
      apiClient.patch<Door>(`/api/doors/${doorId}`, { locked }),
    onSuccess: (updatedDoor) => {
      queryClient.setQueryData<Door[]>(["doors"], (prev) =>
        prev?.map((d) => (d.id === updatedDoor.id ? updatedDoor : d))
      );
      toast.success(`Porte ${updatedDoor.name} : ${updatedDoor.locked ? 'verrouillée' : 'déverrouillée'}`);
      queryClient.invalidateQueries({ queryKey: ["access_logs"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const toggleWindowMutation = useMutation({
    mutationFn: ({ windowId, open }: { windowId: string; open: boolean }) =>
      apiClient.patch<Window>(`/api/windows/${windowId}`, { open }),
    onSuccess: (updatedWindow) => {
      queryClient.setQueryData<Window[]>(["windows"], (prev) =>
        prev?.map((w) => (w.id === updatedWindow.id ? updatedWindow : w))
      );
      toast.success(`Fenêtre ${updatedWindow.name} : ${updatedWindow.open ? 'ouverte' : 'fermée'}`);
      queryClient.invalidateQueries({ queryKey: ["access_logs"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const isLoading = securityLoading || camerasLoading || alertsLoading || doorsLoading || windowsLoading;
  const hasError = securityError || camerasError || alertsError || doorsError || windowsError;

  const handleRetryAll = () => {
    refetchSecurity();
    refetchCameras();
    refetchAlerts();
    refetchDoors();
    refetchWindows();
  };

  if (hasError) {
    return (
      <AppShell title="Sécurité intelligente" subtitle="Protection active 24h/24 — monitoring temps réel.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Erreur du module de sécurité</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Impossible de se connecter aux caméras et au système d'alarme de la maison.
            </p>
            <button
              onClick={handleRetryAll}
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
      <AppShell title="Sécurité intelligente" subtitle="Connexion au flux vidéo...">
        <div className="space-y-8 animate-pulse">
          <div className="h-56 glass rounded-3xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="h-48 glass rounded-2xl" />
              <div className="h-48 glass rounded-2xl" />
            </div>
            <div className="h-72 glass rounded-2xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  const activeSensorsCount = securityArmed ? 12 : 0;
  const onlineCamerasCount = cameras?.filter(c => c.live).length || 0;

  return (
    <AppShell title="Sécurité intelligente" subtitle="Protection active 24h/24 — monitoring temps réel.">
      <PageTransition>
      <motion.section
        layout
        className={cn(
          "relative overflow-hidden glass-strong rounded-3xl p-8 mb-8 border-2 transition",
          securityArmed ? "border-success/30" : "border-destructive/30"
        )}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background: securityArmed
              ? "radial-gradient(at 30% 50%, oklch(0.72 0.19 155 / 0.25), transparent 60%)"
              : "radial-gradient(at 30% 50%, oklch(0.65 0.24 25 / 0.25), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div
              animate={{ scale: securityArmed ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "h-20 w-20 rounded-3xl flex items-center justify-center",
                securityArmed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}
            >
              <Shield className="h-10 w-10" />
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">État système</p>
              <h2 className="text-3xl font-bold">{securityArmed ? "Maison protégée" : "Sécurité désarmée"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeSensorsCount} capteurs actifs · {onlineCamerasCount} caméras en ligne
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => toggleSecurityMutation.mutate(!securityArmed)}
            disabled={toggleSecurityMutation.isPending}
            className={cn(
              "px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 transition disabled:opacity-60",
              securityArmed
                ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
            )}
          >
            <Lock className="h-4 w-4" />
            {toggleSecurityMutation.isPending ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : null}
            {securityArmed ? "Désarmer le système" : "Armer le système"}
          </motion.button>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Caméras live</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {cameras?.map((c, i) => (
              <motion.div
                key={c.id || c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <CameraFeed name={c.name} live={c.live} mode={c.mode} motionDetected={c.motion} />
              </motion.div>
            ))}
          </div>

          {/* Doors & Windows Control Panel */}
          <div className="mt-8">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Contrôle des Accès & Ouvertures
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Doors Card */}
              <div className="glass-strong rounded-2xl p-5 border border-glass-border">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-primary">
                  <Lock className="h-4 w-4" /> Portes & Verrous
                </h4>
                <div className="space-y-3">
                  {doors?.map((d) => (
                    <div key={d.id} className="glass rounded-xl p-3 flex items-center justify-between border border-glass-border">
                      <div>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-[10px] text-muted-foreground">Accès sécurisé</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDoorMutation.mutate({ doorId: d.id, locked: !d.locked })}
                        disabled={toggleDoorMutation.isPending}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border disabled:opacity-60",
                          d.locked
                            ? "bg-success/15 border-success/30 text-success"
                            : "bg-destructive/15 border-destructive/30 text-destructive"
                        )}
                      >
                        {d.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        {d.locked ? "Verrouillé" : "Déverrouillé"}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Windows Card */}
              <div className="glass-strong rounded-2xl p-5 border border-glass-border">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-accent">
                  <DoorOpen className="h-4 w-4" /> Fenêtres & Ouvrants
                </h4>
                <div className="space-y-3">
                  {windows?.map((w) => (
                    <div key={w.id} className="glass rounded-xl p-3 flex items-center justify-between border border-glass-border">
                      <div>
                        <p className="text-sm font-medium">{w.name}</p>
                        <p className="text-[10px] text-muted-foreground">État ouvrant</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleWindowMutation.mutate({ windowId: w.id, open: !w.open })}
                        disabled={toggleWindowMutation.isPending}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border disabled:opacity-60",
                          w.open
                            ? "bg-destructive/15 border-destructive/30 text-destructive"
                            : "bg-success/15 border-success/30 text-success"
                        )}
                      >
                        <Radio className="h-3.5 w-3.5" />
                        {w.open ? "Ouverte" : "Fermée"}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Alertes & événements
          </h3>
          <div className="glass rounded-2xl divide-y divide-glass-border">
            {alerts?.map((a, i) => {
              const Icon = getAlertIcon(a.icon);
              const color = a.level === "warn" ? "text-destructive bg-destructive/15"
                : a.level === "ok" ? "text-success bg-success/15"
                : "text-primary bg-primary/15";
              return (
                <motion.div
                  key={a.id || i}
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
