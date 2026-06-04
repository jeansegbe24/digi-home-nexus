import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, t as ScanFace, w as Clock, x as CircleCheck, y as CircleX, u as FingerprintPattern, i as Radio, z as Mic } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
const getAccessIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case "scanface":
      return ScanFace;
    case "mic":
      return Mic;
    case "radio":
      return Radio;
    case "fingerprint":
      return FingerprintPattern;
    default:
      return FingerprintPattern;
  }
};
function Acces() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = reactExports.useState(false);
  const {
    data: methods,
    isLoading: methodsLoading,
    error: methodsError,
    refetch: refetchMethods
  } = useQuery({
    queryKey: ["access_methods"],
    queryFn: () => apiClient.get("/api/access-methods")
  });
  const {
    data: logs,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ["access_logs"],
    queryFn: () => apiClient.get("/api/access-logs")
  });
  const testScanMutation = useMutation({
    mutationFn: () => apiClient.post("/api/security/test-scan", {}),
    onMutate: () => {
      setScanning(true);
    },
    onSuccess: (newLog) => {
      setTimeout(() => {
        setScanning(false);
        queryClient.setQueryData(["access_logs"], (prev) => {
          if (!prev) return [newLog];
          return [newLog, ...prev];
        });
        toast.success(`Scan test complété : ${newLog.who} détecté.`);
      }, 2e3);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Accès intelligents", subtitle: "Pilotage biométrique et journalisation complète des entrées.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Panne du système biométrique" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Impossible de charger les méthodes d'accès et le journal des entrées." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRetryAll, className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Accès intelligents", subtitle: "Connexion au système biométrique...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 grid sm:grid-cols-2 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 glass rounded-2xl" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 glass rounded-2xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 glass rounded-2xl" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Accès intelligents", subtitle: "Pilotage biométrique et journalisation complète des entrées.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 grid sm:grid-cols-2 gap-4", children: methods?.map((m, i) => {
        const Icon = getAccessIcon(m.icon);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 card-hover animate-slide-up", style: {
          animationDelay: `${i * 60}ms`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", m.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: m.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: m.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-[10px] uppercase tracking-widest px-2 py-1 rounded-full", m.status === "Actif" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"), children: [
              "● ",
              m.status
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-primary hover:underline", children: "Configurer" })
          ] })
        ] }, m.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-6 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Scan en direct" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-h-[280px] rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border flex items-center justify-center overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative h-40 w-40 rounded-full border-2 flex items-center justify-center transition-all", scanning ? "border-primary animate-pulse-glow" : "border-glass-border"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: cn("h-20 w-20", scanning ? "text-primary" : "text-muted-foreground") }),
            scanning && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" })
          ] }),
          scanning && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-4 right-4 glass rounded-lg p-3 text-center text-xs", children: "Analyse biométrique en cours…" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => testScanMutation.mutate(), disabled: scanning || testScanMutation.isPending, className: "mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60", children: scanning ? "Scan en cours..." : "Lancer un scan test" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-glass-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Journal des accès" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Historique des 24 dernières heures" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-glass-border", children: logs?.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition", children: [
        l.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-success shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-destructive shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid sm:grid-cols-4 gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: l.who }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: l.method }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: l.door }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground tabular-nums sm:text-right", children: l.t })
        ] })
      ] }, l.id || i)) })
    ] })
  ] }) });
}
export {
  Acces as component
};
