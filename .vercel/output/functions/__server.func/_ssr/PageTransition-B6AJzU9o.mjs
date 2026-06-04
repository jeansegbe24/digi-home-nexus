import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useRouterState, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { u as useAuth, g as getWebSocketUrl } from "./router-h13vC9Q8.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { s as House, Q as LayoutDashboard, u as FingerprintPattern, c as Lightbulb, V as ShieldCheck, Z as Zap, H as HeartPulse, b as Users, Y as Settings, _ as LogOut, $ as Search, S as Sun, a0 as Bell, q as Moon } from "../_libs/lucide-react.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const nav = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/acces", label: "Accès intelligents", icon: FingerprintPattern },
  { to: "/eclairage", label: "Éclairage", icon: Lightbulb },
  { to: "/securite", label: "Sécurité", icon: ShieldCheck },
  { to: "/energie", label: "Énergie", icon: Zap },
  { to: "/senior", label: "Mode Senior", icon: HeartPulse },
  { to: "/utilisateurs", label: "Utilisateurs", icon: Users }
];
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate({ to: "/connexion" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col glass-strong border-r border-glass-border z-40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-7 flex items-center gap-3 border-b border-glass-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold tracking-tight", children: "DIGI HOME" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Smart Living OS" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 px-4 py-6 space-y-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Navigation" }),
      nav.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all",
              active ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4 transition-transform group-hover:scale-110", active && "text-primary") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.label }),
              active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" })
            ]
          },
          item.to
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-glass-border space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-sm font-bold", children: user ? getInitials(user.nom) : "??" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: user?.nom ?? "Utilisateur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user?.role ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          className: "w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 transition",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
            "Se déconnecter"
          ]
        }
      )
    ] })
  ] });
}
function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "lg:hidden fixed bottom-4 left-4 right-4 z-40 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around", children: nav.slice(0, 5).map((item) => {
    const active = pathname === item.to;
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        className: cn(
          "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
          active ? "bg-primary/20 text-primary" : "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-medium", children: item.label.split(" ")[0] })
        ]
      },
      item.to
    );
  }) });
}
function TopBar({ title, subtitle }) {
  const [time] = reactExports.useState(
    () => (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 glass-strong border-b border-glass-border px-6 lg:px-10 py-5 flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl lg:text-3xl font-bold tracking-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2.5 w-72", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Rechercher pièces, scènes…",
            className: "bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "glass h-11 w-11 rounded-xl flex items-center justify-center hover:bg-white/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "glass h-11 w-11 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse-glow" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2 glass rounded-xl px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium tabular-nums", children: time })
      ] })
    ] })
  ] });
}
function useClock() {
  const [now, setNow] = reactExports.useState(() => /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now;
}
function useWebSocket() {
  const queryClient = useQueryClient();
  const socketRef = reactExports.useRef(null);
  const reconnectTimeoutRef = reactExports.useRef(null);
  const backoffRef = reactExports.useRef(1e3);
  const maxBackoff = 16e3;
  reactExports.useEffect(() => {
    let isMounted = true;
    function connect() {
      const wsUrl = getWebSocketUrl();
      console.log("Connexion WebSocket à :", wsUrl);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      ws.onopen = () => {
        console.log("WebSocket connecté avec succès !");
        backoffRef.current = 1e3;
      };
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, data } = message;
          if (!type || !data) return;
          console.log(`[WS Event] Recu type: ${type}`, data);
          switch (type) {
            case "sensor":
              queryClient.setQueryData(["sensors"], (prev) => {
                return prev ? { ...prev, ...data } : data;
              });
              break;
            case "room":
              queryClient.setQueryData(["rooms"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((r) => r.id === data.id || r.name === data.name ? { ...r, ...data } : r);
              });
              break;
            case "activity":
              queryClient.setQueryData(["activities"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return [data, ...prev].slice(0, 50);
              });
              queryClient.setQueryData(["access_logs"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return [data, ...prev].slice(0, 50);
              });
              break;
            case "alert":
              queryClient.setQueryData(["alerts"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return [data, ...prev].slice(0, 50);
              });
              break;
            case "energy":
              queryClient.setQueryData(["energy", "24h"], (prev) => {
                if (!prev?.chartData) return prev;
                return {
                  ...prev,
                  chartData: [...prev.chartData.slice(1), { hour: data.time, kw: data.conso, solaire: data.solaire }]
                };
              });
              break;
            case "door":
              queryClient.setQueryData(["doors"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((d) => d.id === data.id || d.name === data.name ? { ...d, ...data } : d);
              });
              break;
            case "window":
              queryClient.setQueryData(["windows"], (prev) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((w) => w.id === data.id || w.name === data.name ? { ...w, ...data } : w);
              });
              break;
            default:
              console.log("Type d'événement WebSocket inconnu:", type);
          }
        } catch (err) {
          console.error("Erreur de parsing du message WebSocket:", err);
        }
      };
      ws.onclose = (e) => {
        console.log(`WebSocket fermé (${e.code}). Tentative de reconnexion...`);
        socketRef.current = null;
        if (isMounted) {
          scheduleReconnect();
        }
      };
      ws.onerror = (err) => {
        console.error("Erreur WebSocket:", err);
        ws.close();
      };
    }
    function scheduleReconnect() {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, maxBackoff);
      console.log(`Planification de la reconnexion WebSocket dans ${delay}ms`);
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, delay);
    }
    connect();
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [queryClient]);
}
function AppShell({
  title,
  subtitle,
  children
}) {
  useWebSocket();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:pl-72", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { title, subtitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "px-6 lg:px-10 py-8 pb-28 lg:pb-12 animate-fade-in", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, {})
  ] });
}
function PageTransition({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16, filter: "blur(8px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: -10, filter: "blur(6px)" },
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
      children
    }
  );
}
function StaggerList({ children, delay = 0 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: "hidden",
      animate: "show",
      variants: {
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: delay } }
      },
      children
    }
  );
}
function StaggerItem({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className,
      variants: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
      },
      children
    }
  );
}
export {
  AppShell as A,
  PageTransition as P,
  StaggerList as S,
  StaggerItem as a,
  cn as c,
  useClock as u
};
