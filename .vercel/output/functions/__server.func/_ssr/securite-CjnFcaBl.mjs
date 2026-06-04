import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn, u as useClock } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, g as Shield, L as Lock, h as LockOpen, D as DoorOpen, i as Radio, A as Activity, W as Wifi, j as Maximize2, k as Eye } from "../_libs/lucide-react.mjs";
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
const palettes = {
  night: "from-emerald-950 via-emerald-900/40 to-black",
  day: "from-slate-700 via-slate-900 to-black",
  thermal: "from-fuchsia-900 via-orange-700/40 to-amber-300/20"
};
function CameraFeed({
  name,
  live = true,
  mode = "night",
  motionDetected = false
}) {
  const now = useClock();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden card-hover", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative aspect-video overflow-hidden bg-gradient-to-br", palettes[mode]), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute inset-0 w-full h-full opacity-30", viewBox: "0 0 200 120", preserveAspectRatio: "xMidYMid slice", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "spot", cx: "50%", cy: "40%", r: "60%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.18" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "200", height: "120", fill: "url(#spot)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,120 60,70 100,90 140,55 200,80 200,120", fill: "rgba(0,0,0,0.55)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "80", y: "60", width: "20", height: "40", fill: "rgba(0,0,0,0.7)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "120", y: "50", width: "15", height: "50", fill: "rgba(0,0,0,0.7)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none",
          style: {
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px"
          }
        }
      ),
      live && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none",
          initial: { y: "-20%" },
          animate: { y: "110%" },
          transition: { duration: 3.5, repeat: Infinity, ease: "linear" }
        }
      ),
      motionDetected && live && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: [0.4, 1, 0.4], scale: 1 },
          transition: { duration: 1.6, repeat: Infinity },
          className: "absolute top-[35%] left-[40%] w-16 h-20 border-2 border-warning rounded-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-5 left-0 text-[9px] font-mono text-warning", children: "MOUVEMENT" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-2 glass-strong rounded-full px-2.5 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "h-1.5 w-1.5 rounded-full",
              live ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold uppercase tracking-widest", children: live ? "● REC" : "Offline" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 glass-strong rounded-full px-2.5 py-1 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-2.5 w-2.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono", children: [
          "HD · ",
          mode.toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 right-2 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] font-mono text-white/70 leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "CAM · ",
            name.slice(0, 10).toUpperCase()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/50", children: [
            now.toLocaleDateString("fr-FR"),
            " · ",
            now.toLocaleTimeString("fr-FR")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "glass-strong h-7 w-7 rounded-md flex items-center justify-center hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-3 w-3" }) })
      ] }),
      ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute h-3 w-3 border-primary/60", p, {
        "border-t border-l": i === 0,
        "border-t border-r": i === 1,
        "border-b border-l": i === 2,
        "border-b border-r": i === 3
      }) }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-[10px] text-primary hover:underline", children: "Plein écran" })
    ] })
  ] });
}
const getAlertIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case "shield":
      return Shield;
    case "alerttriangle":
      return TriangleAlert;
    case "eye":
      return Eye;
    case "radio":
      return Radio;
    default:
      return TriangleAlert;
  }
};
function Securite() {
  const queryClient = useQueryClient();
  const {
    data: securityArmed = true,
    isLoading: securityLoading,
    error: securityError,
    refetch: refetchSecurity
  } = useQuery({
    queryKey: ["security_armed"],
    queryFn: () => apiClient.get("/api/security/state").then((r) => r.armed)
  });
  const {
    data: cameras,
    isLoading: camerasLoading,
    error: camerasError,
    refetch: refetchCameras
  } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => apiClient.get("/api/cameras")
  });
  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => apiClient.get("/api/alerts")
  });
  const {
    data: doors,
    isLoading: doorsLoading,
    error: doorsError,
    refetch: refetchDoors
  } = useQuery({
    queryKey: ["doors"],
    queryFn: () => apiClient.get("/api/doors")
  });
  const {
    data: windows,
    isLoading: windowsLoading,
    error: windowsError,
    refetch: refetchWindows
  } = useQuery({
    queryKey: ["windows"],
    queryFn: () => apiClient.get("/api/windows")
  });
  const toggleSecurityMutation = useMutation({
    mutationFn: (newArmedState) => apiClient.post("/api/security/toggle", {
      armed: newArmedState
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(["security_armed"], data.armed);
      toast.success(data.armed ? "Maison protégée (alarme armée) ✓" : "Système de sécurité désarmé ⚠️");
    }
  });
  const toggleDoorMutation = useMutation({
    mutationFn: ({
      doorId,
      locked
    }) => apiClient.patch(`/api/doors/${doorId}`, {
      locked
    }),
    onSuccess: (updatedDoor) => {
      queryClient.setQueryData(["doors"], (prev) => prev?.map((d) => d.id === updatedDoor.id ? updatedDoor : d));
      toast.success(`Porte ${updatedDoor.name} : ${updatedDoor.locked ? "verrouillée" : "déverrouillée"}`);
      queryClient.invalidateQueries({
        queryKey: ["access_logs"]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
    }
  });
  const toggleWindowMutation = useMutation({
    mutationFn: ({
      windowId,
      open
    }) => apiClient.patch(`/api/windows/${windowId}`, {
      open
    }),
    onSuccess: (updatedWindow) => {
      queryClient.setQueryData(["windows"], (prev) => prev?.map((w) => w.id === updatedWindow.id ? updatedWindow : w));
      toast.success(`Fenêtre ${updatedWindow.name} : ${updatedWindow.open ? "ouverte" : "fermée"}`);
      queryClient.invalidateQueries({
        queryKey: ["access_logs"]
      });
      queryClient.invalidateQueries({
        queryKey: ["activities"]
      });
    }
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Sécurité intelligente", subtitle: "Protection active 24h/24 — monitoring temps réel.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Erreur du module de sécurité" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Impossible de se connecter aux caméras et au système d'alarme de la maison." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRetryAll, className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Sécurité intelligente", subtitle: "Connexion au flux vidéo...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 glass rounded-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 glass rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 glass rounded-2xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 glass rounded-2xl" })
      ] })
    ] }) });
  }
  const activeSensorsCount = securityArmed ? 12 : 0;
  const onlineCamerasCount = cameras?.filter((c) => c.live).length || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Sécurité intelligente", subtitle: "Protection active 24h/24 — monitoring temps réel.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { layout: true, className: cn("relative overflow-hidden glass-strong rounded-3xl p-8 mb-8 border-2 transition", securityArmed ? "border-success/30" : "border-destructive/30"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 pointer-events-none", animate: {
        opacity: [0.2, 0.4, 0.2]
      }, transition: {
        duration: 4,
        repeat: Infinity
      }, style: {
        background: securityArmed ? "radial-gradient(at 30% 50%, oklch(0.72 0.19 155 / 0.25), transparent 60%)" : "radial-gradient(at 30% 50%, oklch(0.65 0.24 25 / 0.25), transparent 60%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
            scale: securityArmed ? [1, 1.05, 1] : 1
          }, transition: {
            duration: 2,
            repeat: Infinity
          }, className: cn("h-20 w-20 rounded-3xl flex items-center justify-center", securityArmed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1", children: "État système" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: securityArmed ? "Maison protégée" : "Sécurité désarmée" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              activeSensorsCount,
              " capteurs actifs · ",
              onlineCamerasCount,
              " caméras en ligne"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { whileHover: {
          scale: 1.03
        }, whileTap: {
          scale: 0.96
        }, onClick: () => toggleSecurityMutation.mutate(!securityArmed), disabled: toggleSecurityMutation.isPending, className: cn("px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 transition disabled:opacity-60", securityArmed ? "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30" : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
          toggleSecurityMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : null,
          securityArmed ? "Désarmer le système" : "Armer le système"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-widest text-muted-foreground mb-4", children: "Caméras live" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: cameras?.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: i * 0.1,
          duration: 0.5
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CameraFeed, { name: c.name, live: c.live, mode: c.mode, motionDetected: c.motion }) }, c.id || c.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-widest text-muted-foreground mb-4", children: "Contrôle des Accès & Ouvertures" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-5 border border-glass-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold mb-4 flex items-center gap-2 text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
                " Portes & Verrous"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: doors?.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 flex items-center justify-between border border-glass-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: d.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Accès sécurisé" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { whileTap: {
                  scale: 0.95
                }, onClick: () => toggleDoorMutation.mutate({
                  doorId: d.id,
                  locked: !d.locked
                }), disabled: toggleDoorMutation.isPending, className: cn("px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border disabled:opacity-60", d.locked ? "bg-success/15 border-success/30 text-success" : "bg-destructive/15 border-destructive/30 text-destructive"), children: [
                  d.locked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-3.5 w-3.5" }),
                  d.locked ? "Verrouillé" : "Déverrouillé"
                ] })
              ] }, d.id)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-5 border border-glass-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold mb-4 flex items-center gap-2 text-accent", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-4 w-4" }),
                " Fenêtres & Ouvrants"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: windows?.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 flex items-center justify-between border border-glass-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: w.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "État ouvrant" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.button, { whileTap: {
                  scale: 0.95
                }, onClick: () => toggleWindowMutation.mutate({
                  windowId: w.id,
                  open: !w.open
                }), disabled: toggleWindowMutation.isPending, className: cn("px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border disabled:opacity-60", w.open ? "bg-destructive/15 border-destructive/30 text-destructive" : "bg-success/15 border-success/30 text-success"), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3.5 w-3.5" }),
                  w.open ? "Ouverte" : "Fermée"
                ] })
              ] }, w.id)) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
          " Alertes & événements"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl divide-y divide-glass-border", children: alerts?.map((a, i) => {
          const Icon = getAlertIcon(a.icon);
          const color = a.level === "warn" ? "text-destructive bg-destructive/15" : a.level === "ok" ? "text-success bg-success/15" : "text-primary bg-primary/15";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            x: 10
          }, animate: {
            opacity: 1,
            x: 0
          }, transition: {
            delay: 0.2 + i * 0.08
          }, className: "p-4 flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: a.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: a.time })
            ] })
          ] }, a.id || i);
        }) })
      ] })
    ] })
  ] }) });
}
export {
  Securite as component
};
