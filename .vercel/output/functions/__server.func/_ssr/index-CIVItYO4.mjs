import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useClock, A as AppShell, P as PageTransition, c as cn, S as StaggerList, a as StaggerItem } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as apiClient } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, B as Thermometer, G as Droplets, I as Wind, Z as Zap, o as Sparkles, g as Shield, J as ArrowUpRight, N as Power, c as Lightbulb, A as Activity, W as Wifi, L as Lock, O as Camera } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const getIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case "camera":
      return Camera;
    case "sparkles":
      return Sparkles;
    case "lock":
      return Lock;
    case "shield":
      return Shield;
    case "wifi":
      return Wifi;
    default:
      return Activity;
  }
};
function Dashboard() {
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const now = useClock();
  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
    refetch: refetchSensors
  } = useQuery({
    queryKey: ["sensors"],
    queryFn: () => apiClient.get("/api/sensors")
  });
  const {
    data: rooms,
    isLoading: roomsLoading,
    error: roomsError,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => apiClient.get("/api/rooms")
  });
  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => apiClient.get("/api/activities")
  });
  const {
    data: securityArmed = true,
    isLoading: securityLoading,
    refetch: refetchSecurity
  } = useQuery({
    queryKey: ["security_armed"],
    queryFn: () => apiClient.get("/api/security/state").then((r) => r.armed)
  });
  const toggleSecurityMutation = useMutation({
    mutationFn: (newArmedState) => apiClient.post("/api/security/toggle", {
      armed: newArmedState
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(["security_armed"], data.armed);
      toast.success(data.armed ? "Système de sécurité armé ✓" : "Système de sécurité désarmé ⚠️");
    }
  });
  const activateScenarioMutation = useMutation({
    mutationFn: (scenarioName) => apiClient.post("/api/scenarios/activate", {
      name: scenarioName
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"]
      });
      toast.success("Scénario « Soirée » activé !");
    }
  });
  const toggleRoomPowerMutation = useMutation({
    mutationFn: ({
      roomId,
      lit
    }) => apiClient.patch(`/api/rooms/${roomId}`, {
      lit
    }),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData(["rooms"], (prev) => prev?.map((r) => r.id === updatedRoom.id ? updatedRoom : r));
      toast.success(`Pièce ${updatedRoom.name} : éclairage ${updatedRoom.lit ? "allumé" : "éteint"}`);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: `Bonjour, ${displayName} 👋`, subtitle: "Système connecté à DIGI HOME.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Impossible de charger les données" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Une erreur est survenue lors de la connexion au serveur de domotique. Vérifiez que le backend FastAPI est démarré." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRetryAll, className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer la connexion"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: `Bonjour, ${displayName} 👋`, subtitle: "Mise à jour des systèmes en cours...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 glass rounded-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 glass rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 h-72 glass rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 glass rounded-2xl" })
      ] })
    ] }) });
  }
  const sensorCards = [{
    label: "Température",
    value: sensors?.temperature.toFixed(1) || "22.0",
    unit: "°C",
    icon: Thermometer,
    color: "text-orange-300",
    trend: "stable"
  }, {
    label: "Humidité",
    value: sensors?.humidity.toFixed(0) || "50",
    unit: "%",
    icon: Droplets,
    color: "text-cyan-300",
    trend: "optimal"
  }, {
    label: "Qualité air",
    value: sensors?.aqi.toFixed(0) || "95",
    unit: "AQI",
    icon: Wind,
    color: "text-emerald-300",
    trend: "excellent"
  }, {
    label: "Consommation",
    value: sensors?.power.toFixed(1) || "3.0",
    unit: "kW",
    icon: Zap,
    color: "text-yellow-300",
    trend: "-12%"
  }];
  const totalActiveDevices = rooms?.reduce((sum, r) => sum + r.active, 0) || 0;
  const totalDevices = rooms?.reduce((sum, r) => sum + r.devices, 0) || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: `Bonjour, ${displayName} 👋`, subtitle: "Votre maison est sécurisée et fonctionne parfaitement.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
      opacity: 0,
      y: 30
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1]
    }, className: "relative overflow-hidden glass-strong rounded-3xl p-8 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 pointer-events-none", animate: {
        background: ["radial-gradient(at 0% 0%, oklch(0.65 0.22 295 / 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.78 0.18 195 / 0.20) 0px, transparent 50%)", "radial-gradient(at 100% 0%, oklch(0.78 0.18 195 / 0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, oklch(0.65 0.22 295 / 0.20) 0px, transparent 50%)", "radial-gradient(at 0% 0%, oklch(0.65 0.22 295 / 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.78 0.18 195 / 0.20) 0px, transparent 50%)"]
      }, transition: {
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid lg:grid-cols-3 gap-8 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-success animate-pulse-glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: [
              "Système opérationnel · ",
              now.toLocaleTimeString("fr-FR")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl lg:text-5xl font-bold leading-tight mb-3", children: [
            "Maison ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "parfaitement" }),
            " orchestrée."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground max-w-xl mb-6", children: [
            totalDevices,
            " appareils connectés · ",
            totalActiveDevices,
            " actifs · 0 alerte critique. Consommation optimisée à 88 %."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { whileHover: {
              scale: 1.03
            }, whileTap: {
              scale: 0.97
            }, onClick: () => activateScenarioMutation.mutate("Soirée"), disabled: activateScenarioMutation.isPending, className: "bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition glow-primary disabled:opacity-60", children: [
              activateScenarioMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              "Activer scénario « Soirée »"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { whileHover: {
              scale: 1.03
            }, whileTap: {
              scale: 0.97
            }, onClick: () => toggleSecurityMutation.mutate(!securityArmed), disabled: toggleSecurityMutation.isPending, className: cn("glass px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition border disabled:opacity-60", securityArmed ? "border-success/40 text-success" : "border-destructive/40 text-destructive"), children: [
              toggleSecurityMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-4 w-4 border-2 border-t-transparent rounded-full animate-spin", securityArmed ? "border-success" : "border-destructive") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
              securityArmed ? "Sécurité armée" : "Sécurité désarmée"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Maintenant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-5xl font-bold tabular-nums mb-2", children: [
            (sensors?.temperature ?? 22).toFixed(1),
            "°"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Salon · Ensoleillé · Lyon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: ["08h", "12h", "18h"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-lg py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: h }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
              [19, 23, 21][i],
              "°"
            ] })
          ] }, h)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerList, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: sensorCards.map((s) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { whileHover: {
        y: -4
      }, className: "glass rounded-2xl p-5 card-hover h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center", s.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" }),
            " ",
            s.trend
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold tabular-nums", children: [
          s.value,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground ml-1 font-normal", children: s.unit })
        ] })
      ] }) }, s.label);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Pièces" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-primary hover:underline", children: "Voir tout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: rooms?.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { whileHover: {
          y: -2
        }, className: "glass rounded-xl p-5 card-hover", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                r.active,
                "/",
                r.devices,
                " appareils actifs"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: toggleRoomPowerMutation.isPending, onClick: () => toggleRoomPowerMutation.mutate({
              roomId: r.id,
              lit: !r.lit
            }), className: cn("h-10 w-10 rounded-full flex items-center justify-center transition disabled:opacity-55", r.lit ? "bg-primary text-primary-foreground glow-primary" : "bg-white/5 text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Thermometer, { className: "h-3 w-3" }),
              r.temp
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-3 w-3" }),
              r.lit ? "Allumé" : "Éteint"
            ] })
          ] })
        ] }, r.id || r.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Activité récente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: activities?.slice(0, 5).map((a, i) => {
          const Icon = getIcon(a.icon);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.li, { initial: {
            opacity: 0,
            x: -10
          }, animate: {
            opacity: 1,
            x: 0
          }, transition: {
            delay: 0.1 + i * 0.05
          }, className: "flex items-start gap-3 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", a.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-snug", children: a.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: a.time })
            ] })
          ] }, a.id || i);
        }) })
      ] })
    ] })
  ] }) });
}
export {
  Dashboard as component
};
