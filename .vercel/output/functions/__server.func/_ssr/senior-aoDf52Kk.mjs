import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, S as Sun, c as Lightbulb, P as Phone, d as MessageCircle, e as CircleAlert, f as Pill, H as HeartPulse } from "../_libs/lucide-react.mjs";
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
const bigButtons = [{
  label: "Lumière",
  icon: Lightbulb,
  color: "from-amber-300 to-orange-400",
  action: "lumiere"
}, {
  label: "Famille",
  icon: Phone,
  color: "from-emerald-300 to-cyan-400",
  action: "famille"
}, {
  label: "Message",
  icon: MessageCircle,
  color: "from-primary to-accent",
  action: "message"
}, {
  label: "Urgence",
  icon: CircleAlert,
  color: "from-red-400 to-orange-500",
  action: "urgence"
}];
const getButtonIcon = (label) => {
  switch (label) {
    case "Lumière":
      return Lightbulb;
    case "Famille":
      return Phone;
    case "Message":
      return MessageCircle;
    case "Urgence":
      return CircleAlert;
    default:
      return CircleAlert;
  }
};
function Senior() {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["senior"],
    queryFn: () => apiClient.get("/api/senior")
  });
  const takeMedMutation = useMutation({
    mutationFn: (medId) => apiClient.post(`/api/senior/meds/${medId}/take`, {}),
    onSuccess: (updatedMed) => {
      queryClient.setQueryData(["senior"], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          meds: prev.meds.map((m) => m.id === updatedMed.id ? updatedMed : m)
        };
      });
      toast.success(`Médicament « ${updatedMed.name} » validé.`);
    }
  });
  const SOSMutation = useMutation({
    mutationFn: () => apiClient.post("/api/senior/urgency", {}),
    onSuccess: () => {
      toast.error("⚠️ ALERTE SOS ENVOYÉE. La famille et les secours ont été prévenus.", {
        duration: 8e3
      });
    }
  });
  const triggerActionMutation = useMutation({
    mutationFn: (action) => apiClient.post(`/api/senior/action/${action}`, {}),
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Mode Senior", subtitle: "Une maison qui prend soin de vous.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Erreur du mode Senior" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Impossible de se connecter aux systèmes d'assistance." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetch(), className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Mode Senior", subtitle: "Chargement de votre assistant...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 glass rounded-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-5", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-36 glass rounded-3xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 glass rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 glass rounded-2xl" })
      ] })
    ] }) });
  }
  const seniorName = data?.username || "Aîné";
  const undoneMedsCount = data?.meds.filter((m) => !m.taken).length || 0;
  const subtitleMsg = undoneMedsCount > 0 ? `Tout va bien à la maison. Pensez à vos ${undoneMedsCount} médicaments restants.` : "Tout va bien à la maison. Tous vos médicaments ont été pris !";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Mode Senior", subtitle: "Une maison qui prend soin de vous.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass-strong rounded-3xl p-8 lg:p-10 mb-8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-5 w-5 text-amber-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Aujourd'hui · ",
          (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl lg:text-5xl font-bold mb-3", children: [
        "Bonjour ",
        seniorName,
        " 👋"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: subtitleMsg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8", children: bigButtons.map((b, i) => {
      const Icon = getButtonIcon(b.label);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: triggerActionMutation.isPending, onClick: () => triggerActionMutation.mutate(b.action), className: "group glass-strong rounded-3xl p-8 text-center card-hover animate-slide-up disabled:opacity-60", style: {
        animationDelay: `${i * 60}ms`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition", b.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-10 w-10 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: b.label })
      ] }, b.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold mb-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { className: "h-6 w-6 text-primary" }),
          " Rappels médicaments"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: data?.meds.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: cn("flex items-center justify-between p-5 rounded-2xl text-lg transition-colors", m.taken ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/30"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xl", children: m.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground", children: m.time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: m.taken || takeMedMutation.isPending, onClick: () => takeMedMutation.mutate(m.id), className: cn("px-5 py-2.5 rounded-xl font-semibold text-base transition-all", m.taken ? "bg-success/20 text-success cursor-default" : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 active:scale-95"), children: m.taken ? "✓ Pris" : "Marquer pris" })
        ] }, m.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold mb-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "h-6 w-6 text-destructive" }),
          " Bien-être"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [{
          label: "Rythme cardiaque",
          value: data?.health.bpm || "72",
          unit: "bpm"
        }, {
          label: "Sommeil",
          value: data?.health.sleep || "7h",
          unit: ""
        }, {
          label: "Pas du jour",
          value: data?.health.steps || "0",
          unit: ""
        }, {
          label: "Hydratation",
          value: data?.health.water || "0",
          unit: "verres"
        }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold tabular-nums", children: [
            s.value,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-normal text-muted-foreground", children: s.unit })
          ] })
        ] }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => SOSMutation.mutate(), disabled: SOSMutation.isPending, className: "mt-5 w-full bg-gradient-to-r from-destructive to-orange-500 text-white py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 glow-primary hover:opacity-95 active:scale-[0.98] transition disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 animate-pulse" }),
          SOSMutation.isPending ? "Appel de détresse en cours..." : "Appeler à l'aide (SOS)"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Senior as component
};
