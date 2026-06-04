import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Fingerprint, Mic, Radio, ScanFace, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/acces")({
  head: () => ({
    meta: [
      { title: "Accès intelligents — DIGI HOME" },
      { name: "description", content: "Reconnaissance faciale, vocale et badges RFID." },
    ],
  }),
  component: Acces,
});

interface AccessMethod {
  id: string;
  name: string;
  icon: string;
  status: string;
  desc: string;
  color: string;
}

interface AccessLog {
  id: string;
  t: string;
  who: string;
  method: string;
  door: string;
  ok: boolean;
}

const getAccessIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "scanface": return ScanFace;
    case "mic": return Mic;
    case "radio": return Radio;
    case "fingerprint": return Fingerprint;
    default: return Fingerprint;
  }
};

function Acces() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);

  // Queries
  const { 
    data: methods, 
    isLoading: methodsLoading, 
    error: methodsError,
    refetch: refetchMethods 
  } = useQuery<AccessMethod[]>({
    queryKey: ["access_methods"],
    queryFn: () => apiClient.get<AccessMethod[]>("/api/access-methods"),
  });

  const { 
    data: logs, 
    isLoading: logsLoading, 
    error: logsError,
    refetch: refetchLogs 
  } = useQuery<AccessLog[]>({
    queryKey: ["access_logs"],
    queryFn: () => apiClient.get<AccessLog[]>("/api/access-logs"),
  });

  // Mutations
  const testScanMutation = useMutation({
    mutationFn: () => apiClient.post<AccessLog>("/api/security/test-scan", {}),
    onMutate: () => {
      setScanning(true);
    },
    onSuccess: (newLog) => {
      // Simulate real timing for the face scanner graphic
      setTimeout(() => {
        setScanning(false);
        queryClient.setQueryData<AccessLog[]>(["access_logs"], (prev) => {
          if (!prev) return [newLog];
          return [newLog, ...prev];
        });
        toast.success(`Scan test complété : ${newLog.who} détecté.`);
      }, 2000);
    },
    onError: () => {
      setScanning(false);
      toast.error("Le test de scan biométrique a échoué.");
    }
  });

  const isLoading = methodsLoading || logsLoading;
  const hasError = methodsError || logsError;

  const handleRetryAll = () => {
    refetchMethods();
    refetchLogs();
  };

  if (hasError) {
    return (
      <AppShell title="Accès intelligents" subtitle="Pilotage biométrique et journalisation complète des entrées.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Panne du système biométrique</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Impossible de charger les méthodes d'accès et le journal des entrées.
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
      <AppShell title="Accès intelligents" subtitle="Connexion au système biométrique...">
        <div className="space-y-8 animate-pulse">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 glass rounded-2xl" />
              ))}
            </div>
            <div className="h-80 glass rounded-2xl" />
          </div>
          <div className="h-64 glass rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Accès intelligents" subtitle="Pilotage biométrique et journalisation complète des entrées.">
      <PageTransition>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {methods?.map((m, i) => {
            const Icon = getAccessIcon(m.icon);
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
            onClick={() => testScanMutation.mutate()}
            disabled={scanning || testScanMutation.isPending}
            className="mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {scanning ? "Scan en cours..." : "Lancer un scan test"}
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
          {logs?.map((l, i) => (
            <div key={l.id || i} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition">
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
      </PageTransition>
    </AppShell>
  );
}
