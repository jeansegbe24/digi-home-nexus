import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate, e as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
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
const appCss = "/assets/styles-DNxF6qwO.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const getResolvedApiUrl = () => {
  {
    return "";
  }
};
const getWebSocketUrl = () => {
  const apiUrl = getResolvedApiUrl();
  if (apiUrl) {
    return apiUrl.replace(/^http/, "ws") + "/ws";
  }
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
  }
  return "ws://localhost:8000/ws";
};
const BASE_URL = getResolvedApiUrl();
class ApiError extends Error {
  status;
  info;
  constructor(message, status, info) {
    super(message);
    this.status = status;
    this.info = info;
  }
}
let isRefreshing = false;
let refreshQueue = [];
async function flushQueue(success) {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
}
async function handleRefresh() {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }
  isRefreshing = true;
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      isRefreshing = false;
      await flushQueue(true);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  isRefreshing = false;
  await flushQueue(false);
  return false;
}
async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const fetchOptions = {
    ...options,
    headers,
    credentials: "include"
    // crucial for httpOnly cookie authentication
  };
  try {
    let response = await fetch(url, fetchOptions);
    if (response.status === 401 && !path.includes("/auth/refresh") && !path.includes("/auth/login")) {
      const refreshSuccess = await handleRefresh();
      if (refreshSuccess) {
        response = await fetch(url, fetchOptions);
      } else {
        window.dispatchEvent(new CustomEvent("unauthorized-api-call"));
      }
    }
    if (!response.ok) {
      let info;
      try {
        info = await response.json();
      } catch {
        info = null;
      }
      const errorMessage = info?.detail || info?.message || `Erreur serveur (${response.status})`;
      throw new ApiError(errorMessage, response.status, info);
    }
    if (response.status === 204) {
      return {};
    }
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    if (!options.skipErrorToast) {
      toast.error(error.message || "Une erreur réseau ou serveur s'est produite.");
    }
    throw error;
  }
}
const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  put: (path, body, options) => request(path, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  patch: (path, body, options) => request(path, {
    ...options,
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" })
};
const BACKEND_TO_FRONTEND = {
  proprietaire: "Administrateur",
  famille: "Famille",
  senior: "Senior",
  locataire: "Locataire",
  personnel: "Invité"
};
const FRONTEND_TO_BACKEND = {
  Administrateur: "proprietaire",
  Famille: "famille",
  Senior: "senior",
  Locataire: "locataire",
  Invité: "personnel"
};
function toFrontendRole(role) {
  const normalized = role.toLowerCase();
  return BACKEND_TO_FRONTEND[normalized] ?? "Invité";
}
function toBackendRole(role) {
  return FRONTEND_TO_BACKEND[role] ?? "famille";
}
function normalizeUser(user) {
  return {
    id: String(user.id),
    nom: user.nom,
    email: user.email,
    role: toFrontendRole(user.role),
    langue: user.langue
  };
}
const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function restoreSession() {
      try {
        const userData = await apiClient.get("/auth/me", { skipErrorToast: true });
        if (userData && userData.id) {
          setUser(normalizeUser(userData));
        }
      } catch (error) {
        console.log("No active session restored:", error);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);
  reactExports.useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
    };
    window.addEventListener("unauthorized-api-call", handleUnauthorized);
    return () => window.removeEventListener("unauthorized-api-call", handleUnauthorized);
  }, []);
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await apiClient.post("/auth/login", { email, password });
      setUser(normalizeUser(userData));
      toast.success(`Bienvenue, ${userData.nom} !`);
      return normalizeUser(userData);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout", {}, { skipErrorToast: true });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      toast.success("Vous avez été déconnecté.");
    }
  };
  const isAuthenticated = () => !!user;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, isLoading, login, logout, isAuthenticated }, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page non trouvée" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "La page que vous recherchez n'existe pas ou a été déplacée." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Retour à l'accueil"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Cette page n'a pas pu être chargée" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Une erreur est survenue de notre côté. Vous pouvez réessayer ou retourner à l'accueil." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Réessayer"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Retour à l'accueil"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DIGI HOME — Smart Living OS" },
      { name: "description", content: "DIGI HOME : système intelligent premium pour piloter votre maison connectée." },
      { name: "author", content: "DIGI HOME" },
      { property: "og:title", content: "DIGI HOME — Smart Living OS" },
      { property: "og:description", content: "DIGI HOME : système intelligent premium pour piloter votre maison connectée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@DigiHome" },
      { name: "twitter:title", content: "DIGI HOME — Smart Living OS" },
      { name: "twitter:description", content: "DIGI HOME : système intelligent premium pour piloter votre maison connectée." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d25683f-2fea-47aa-9c77-cc4af78cbe5a/id-preview-d8d4fcaa--6a6dcd94-5962-44f0-a5ec-857cf37f1987.lovable.app-1780376507737.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d25683f-2fea-47aa-9c77-cc4af78cbe5a/id-preview-d8d4fcaa--6a6dcd94-5962-44f0-a5ec-857cf37f1987.lovable.app-1780376507737.png" },
      { name: "theme-color", content: "#09090b" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-192.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "fr", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "bg-background text-foreground antialiased selection:bg-primary/30", children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function AuthGuard({ children }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  reactExports.useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/connexion") {
        navigate({ to: "/connexion" });
      } else if (user && pathname === "/connexion") {
        navigate({ to: "/" });
      }
    }
  }, [user, isLoading, pathname, navigate]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => console.log("Service Worker enregistré avec succès, scope:", reg.scope)).catch((err) => console.error("Échec de l'enregistrement du Service Worker:", err));
      };
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-6 w-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-pulse", children: "Chargement de votre DIGI HOME..." })
    ] }) });
  }
  if (!user && pathname !== "/connexion") {
    return null;
  }
  if (user && pathname === "/connexion") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", theme: "dark", closeButton: true, richColors: true })
  ] });
}
const $$splitComponentImporter$7 = () => import("./utilisateurs-CHbsKZE6.mjs");
const Route$7 = createFileRoute("/utilisateurs")({
  head: () => ({
    meta: [{
      title: "Utilisateurs — DIGI HOME"
    }, {
      name: "description",
      content: "Profils Administrateur, Famille, Senior, Locataire et Invité."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./senior-aoDf52Kk.mjs");
const Route$6 = createFileRoute("/senior")({
  head: () => ({
    meta: [{
      title: "Mode Senior — DIGI HOME"
    }, {
      name: "description",
      content: "Interface simplifiée et assistance intelligente pour seniors."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./securite-CjnFcaBl.mjs");
const Route$5 = createFileRoute("/securite")({
  head: () => ({
    meta: [{
      title: "Sécurité — DIGI HOME"
    }, {
      name: "description",
      content: "Surveillance, alertes intrusion et monitoring live."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./energie-DU2MueXK.mjs");
const Route$4 = createFileRoute("/energie")({
  head: () => ({
    meta: [{
      title: "Énergie — DIGI HOME"
    }, {
      name: "description",
      content: "Analyse, optimisation et monitoring temps réel de la consommation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./eclairage-8-3cUxOj.mjs");
const Route$3 = createFileRoute("/eclairage")({
  head: () => ({
    meta: [{
      title: "Éclairage intelligent — DIGI HOME"
    }, {
      name: "description",
      content: "Contrôle d'éclairage par pièce, intensité et scénarios."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./connexion-DCCGoet2.mjs");
const Route$2 = createFileRoute("/connexion")({
  head: () => ({
    meta: [{
      title: "Connexion — DIGI HOME"
    }, {
      name: "description",
      content: "Authentification biométrique et par mot de passe sécurisée DIGI HOME."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./acces-DRYjOk_Z.mjs");
const Route$1 = createFileRoute("/acces")({
  head: () => ({
    meta: [{
      title: "Accès intelligents — DIGI HOME"
    }, {
      name: "description",
      content: "Reconnaissance faciale, vocale et badges RFID."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CIVItYO4.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Tableau de bord — DIGI HOME"
    }, {
      name: "description",
      content: "Vue d'ensemble premium de votre maison intelligente."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UtilisateursRoute = Route$7.update({
  id: "/utilisateurs",
  path: "/utilisateurs",
  getParentRoute: () => Route$8
});
const SeniorRoute = Route$6.update({
  id: "/senior",
  path: "/senior",
  getParentRoute: () => Route$8
});
const SecuriteRoute = Route$5.update({
  id: "/securite",
  path: "/securite",
  getParentRoute: () => Route$8
});
const EnergieRoute = Route$4.update({
  id: "/energie",
  path: "/energie",
  getParentRoute: () => Route$8
});
const EclairageRoute = Route$3.update({
  id: "/eclairage",
  path: "/eclairage",
  getParentRoute: () => Route$8
});
const ConnexionRoute = Route$2.update({
  id: "/connexion",
  path: "/connexion",
  getParentRoute: () => Route$8
});
const AccesRoute = Route$1.update({
  id: "/acces",
  path: "/acces",
  getParentRoute: () => Route$8
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  AccesRoute,
  ConnexionRoute,
  EclairageRoute,
  EnergieRoute,
  SecuriteRoute,
  SeniorRoute,
  UtilisateursRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  apiClient as a,
  getWebSocketUrl as g,
  normalizeUser as n,
  router as r,
  toBackendRole as t,
  useAuth as u
};
