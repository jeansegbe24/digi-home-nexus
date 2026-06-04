import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, o as Sparkles, S as Sun, p as Coffee, F as Film, q as Moon, c as Lightbulb } from "../_libs/lucide-react.mjs";
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
const scenes = [{
  name: "Réveil doux",
  icon: Sun,
  gradient: "from-amber-300 to-orange-400"
}, {
  name: "Concentration",
  icon: Coffee,
  gradient: "from-cyan-300 to-blue-400"
}, {
  name: "Soirée cinéma",
  icon: Film,
  gradient: "from-purple-400 to-pink-400"
}, {
  name: "Nuit",
  icon: Moon,
  gradient: "from-indigo-400 to-violet-500"
}];
const getSceneIcon = (name) => {
  switch (name) {
    case "Réveil doux":
      return Sun;
    case "Concentration":
      return Coffee;
    case "Soirée cinéma":
      return Film;
    case "Nuit":
      return Moon;
    default:
      return Sparkles;
  }
};
function Eclairage() {
  const queryClient = useQueryClient();
  const {
    data: rooms,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => apiClient.get("/api/rooms")
  });
  const activateScenarioMutation = useMutation({
    mutationFn: (scenarioName) => apiClient.post("/api/scenarios/activate", {
      name: scenarioName
    }),
    onSuccess: (_, scenarioName) => {
      toast.success(`Scénario « ${scenarioName} » activé !`);
      queryClient.invalidateQueries({
        queryKey: ["rooms"]
      });
    }
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Éclairage intelligent", subtitle: "Contrôlez l'ambiance lumineuse de chaque pièce.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Impossible de charger les pièces" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Une erreur est survenue lors du chargement des lumières de la maison." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetch(), className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Éclairage intelligent", subtitle: "Chargement de l'ambiance...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 glass rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 glass rounded-2xl" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Éclairage intelligent", subtitle: "Contrôlez l'ambiance lumineuse de chaque pièce.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
        " Scénarios intelligents"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: scenes.map((s, i) => {
        const Icon = getSceneIcon(s.name);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => activateScenarioMutation.mutate(s.name), disabled: activateScenarioMutation.isPending, className: "group relative overflow-hidden glass rounded-2xl p-6 text-left card-hover animate-slide-up disabled:opacity-50", style: {
          animationDelay: `${i * 60}ms`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition", s.gradient) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-7 w-7 mb-3 relative" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold relative", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 relative", children: "Touchez pour activer" })
        ] }, s.name);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-widest text-muted-foreground mb-4", children: "Pièces" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: rooms?.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RoomCard, { room: r }, r.id || r.name)) })
    ] })
  ] }) });
}
function RoomCard({
  room
}) {
  const queryClient = useQueryClient();
  const [localBrightness, setLocalBrightness] = reactExports.useState(room.brightness);
  reactExports.useEffect(() => {
    setLocalBrightness(room.brightness);
  }, [room.brightness]);
  const updateRoomMutation = useMutation({
    mutationFn: (updates) => apiClient.patch(`/api/rooms/${room.id}`, updates),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData(["rooms"], (prev) => prev?.map((r) => r.id === updatedRoom.id ? updatedRoom : r));
    },
    onError: () => {
      setLocalBrightness(room.brightness);
    }
  });
  const handleToggle = () => {
    updateRoomMutation.mutate({
      lit: !room.lit
    });
  };
  const handleBrightnessRelease = () => {
    updateRoomMutation.mutate({
      brightness: localBrightness
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 card-hover", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-12 w-12 rounded-xl flex items-center justify-center transition", room.lit ? "bg-gradient-to-br from-amber-300/30 to-orange-400/30 text-amber-200 glow-primary" : "bg-white/5 text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: room.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: room.lit ? `${localBrightness}% · ${room.color === "warm" ? "Chaud" : "Froid"}` : "Éteint" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleToggle, disabled: updateRoomMutation.isPending, className: cn("relative h-7 w-12 rounded-full transition disabled:opacity-60", room.lit ? "bg-primary" : "bg-white/10"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-lg transition-transform", room.lit ? "translate-x-5" : "translate-x-0.5") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Intensité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
          localBrightness,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0, max: 100, value: localBrightness, disabled: !room.lit || updateRoomMutation.isPending, onChange: (e) => setLocalBrightness(Number(e.target.value)), onMouseUp: handleBrightnessRelease, onTouchEnd: handleBrightnessRelease, className: "w-full h-1.5 rounded-full appearance-none bg-white/10 accent-primary disabled:opacity-40" })
    ] })
  ] });
}
export {
  Eclairage as component
};
