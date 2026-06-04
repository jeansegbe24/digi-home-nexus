import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn } from "./PageTransition-B6AJzU9o.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient } from "./router-h13vC9Q8.mjs";
import "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, Z as Zap, l as TrendingDown, m as Leaf, n as Plug } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area } from "../_libs/recharts.mjs";
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
import "../_libs/es-toolkit.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/reselect.mjs";
import "../_libs/reduxjs__toolkit.mjs";
import "../_libs/redux.mjs";
import "../_libs/immer.mjs";
import "../_libs/redux-thunk.mjs";
import "../_libs/react-redux.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const breakdown = [{
  label: "Chauffage",
  value: 38,
  color: "bg-orange-400"
}, {
  label: "Éclairage",
  value: 22,
  color: "bg-amber-300"
}, {
  label: "Électroménager",
  value: 18,
  color: "bg-cyan-300"
}, {
  label: "Multimédia",
  value: 12,
  color: "bg-purple-400"
}, {
  label: "Autres",
  value: 10,
  color: "bg-muted-foreground"
}];
function CustomTooltip({
  active,
  payload,
  label
}) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-xl p-3 text-xs shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1.5", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
        background: p.color
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        p.dataKey === "kw" ? "Conso" : "Solaire",
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", children: [
        p.value,
        " kW"
      ] })
    ] }, p.dataKey))
  ] });
}
function Energie() {
  const [range, setRange] = reactExports.useState("24h");
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["energy", range],
    queryFn: () => apiClient.get(`/api/energy?range=${range}`)
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion énergétique", subtitle: "Suivi temps réel et optimisations intelligentes.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Impossible de charger les données énergétiques" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Une erreur est survenue lors de la communication avec le module de télémesure." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetch(), className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion énergétique", subtitle: "Analyse de la consommation...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 glass rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 glass rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 glass rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 glass rounded-2xl" })
      ] })
    ] }) });
  }
  const kpis = [{
    label: "Consommation jour",
    value: data?.conso.toFixed(1) || "0.0",
    unit: "kWh",
    icon: Zap,
    trend: "-8%"
  }, {
    label: "Économie mois",
    value: data?.eco.toFixed(2) || "0.00",
    unit: "€",
    icon: TrendingDown,
    trend: "-12%"
  }, {
    label: "Empreinte CO₂",
    value: data?.co2.toFixed(1) || "0.0",
    unit: "kg",
    icon: Leaf,
    trend: "-15%"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion énergétique", subtitle: "Suivi temps réel et optimisations intelligentes.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid sm:grid-cols-3 gap-4 mb-8", children: kpis.map((k, i) => {
      const Icon = k.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.08,
        duration: 0.5
      }, whileHover: {
        y: -4
      }, className: "glass rounded-2xl p-6 card-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-success bg-success/15 rounded-full px-2 py-0.5", children: k.trend })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: k.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold tabular-nums", children: [
          k.value,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base text-muted-foreground ml-1.5 font-normal", children: k.unit })
        ] })
      ] }, k.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Consommation vs. production solaire" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Profil de consommation (",
            range === "24h" ? "kW" : "kWh",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["24h", "7j", "30j", "1a"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRange(t), className: cn("px-3 py-1.5 rounded-lg text-xs transition", range === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"), children: t }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: data?.chartData || [], margin: {
        top: 10,
        right: 10,
        left: -20,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gKw", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.78 0.18 195)", stopOpacity: 0.6 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.78 0.18 195)", stopOpacity: 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gSol", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.80 0.17 75)", stopOpacity: 0.5 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.80 0.17 75)", stopOpacity: 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(1 0 0 / 0.05)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "hour", stroke: "oklch(0.68 0.03 255)", fontSize: 10, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "oklch(0.68 0.03 255)", fontSize: 10, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}), cursor: {
          stroke: "oklch(0.78 0.18 195)",
          strokeWidth: 1,
          strokeDasharray: "3 3"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "solaire", stroke: "oklch(0.80 0.17 75)", strokeWidth: 2, fill: "url(#gSol)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "kw", stroke: "oklch(0.78 0.18 195)", strokeWidth: 2.5, fill: "url(#gKw)" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-5", children: "Répartition par usage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: breakdown.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground tabular-nums", children: [
              b.value,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-white/5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
            width: 0
          }, animate: {
            width: `${b.value}%`
          }, transition: {
            duration: 0.9,
            delay: 0.2 + i * 0.08,
            ease: [0.16, 1, 0.3, 1]
          }, className: cn("h-full rounded-full", b.color) }) })
        ] }, b.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { className: "h-4 w-4 text-primary" }),
          " Recommandations IA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 text-sm", children: ["Réduire de 2°C le chauffage la nuit → économie estimée 18 €/mois.", "Programmer le lave-vaisselle après 22h (tarif heures creuses).", "Mode éco-éclairage : intensité limitée à 80% en journée.", "Détection veille fantôme sur 3 appareils multimédia."].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.li, { initial: {
          opacity: 0,
          x: 10
        }, animate: {
          opacity: 1,
          x: 0
        }, transition: {
          delay: 0.3 + i * 0.08
        }, className: "flex items-start gap-3 glass rounded-xl p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-7 w-7 rounded-lg bg-success/15 text-success flex items-center justify-center text-xs font-bold shrink-0", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
        ] }, i)) })
      ] })
    ] })
  ] }) });
}
export {
  Energie as component
};
