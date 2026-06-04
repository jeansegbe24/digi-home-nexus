import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { r as Download, s as House, t as ScanFace, u as FingerprintPattern, M as Mail, L as Lock, v as ArrowRight, o as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function Connexion() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [showPasswordForm, setShowPasswordForm] = reactExports.useState(false);
  const [scanning, setScanning] = reactExports.useState(false);
  const [scanType, setScanType] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [deferredPrompt, setDeferredPrompt] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const {
      outcome
    } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };
  reactExports.useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(async () => {
            try {
              const demoEmail = scanType === "face" ? "jean.dupont@digihome.com" : "marie.dupont@digihome.com";
              const demoPassword = scanType === "face" ? "admin123" : "family123";
              await login(demoEmail, demoPassword);
              navigate({
                to: "/"
              });
            } catch (err) {
              toast.error(err.message || "Échec de l'authentification biométrique.");
            } finally {
              setScanning(false);
              setScanType(null);
              setProgress(0);
            }
          }, 300);
          return 100;
        }
        return p + 5;
      });
    }, 40);
    return () => clearInterval(id);
  }, [scanning, scanType, login, navigate]);
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate({
        to: "/"
      });
    } catch (err) {
      toast.error(err.message || "Identifiants incorrects.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const startBiometricScan = (type) => {
    setScanType(type);
    setProgress(0);
    setScanning(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 pointer-events-none", animate: {
      background: ["radial-gradient(at 20% 20%, oklch(0.65 0.22 295 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 80%, oklch(0.78 0.18 195 / 0.30) 0px, transparent 50%)", "radial-gradient(at 80% 20%, oklch(0.78 0.18 195 / 0.35) 0px, transparent 50%), radial-gradient(at 20% 80%, oklch(0.65 0.22 295 / 0.30) 0px, transparent 50%)", "radial-gradient(at 20% 20%, oklch(0.65 0.22 295 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 80%, oklch(0.78 0.18 195 / 0.30) 0px, transparent 50%)"]
    }, transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    } }),
    [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute rounded-full blur-3xl", style: {
      width: 280 + i * 60,
      height: 280 + i * 60,
      background: i === 0 ? "oklch(0.78 0.18 195 / 0.25)" : i === 1 ? "oklch(0.65 0.22 295 / 0.25)" : "oklch(0.72 0.19 155 / 0.18)",
      top: `${20 + i * 20}%`,
      left: `${10 + i * 25}%`
    }, animate: {
      y: [0, -30, 0],
      x: [0, 20, 0]
    }, transition: {
      duration: 8 + i * 2,
      repeat: Infinity,
      ease: "easeInOut"
    } }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md flex flex-col gap-6 relative", children: [
      deferredPrompt && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: -20
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "glass-strong rounded-2xl p-4 flex items-center justify-between border border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "DIGI HOME sur votre écran" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Installez l'application en un clic" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleInstallClick, className: "bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition", children: "Installer l'application" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 30,
        scale: 0.96
      }, animate: {
        opacity: 1,
        y: 0,
        scale: 1
      }, transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }, className: "glass-strong rounded-3xl p-8 shadow-2xl border border-glass-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
            rotate: [0, 5, -5, 0]
          }, transition: {
            duration: 6,
            repeat: Infinity
          }, className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-7 w-7 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold font-display tracking-tight", children: [
            "DIGI ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "HOME" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2", children: "Smart Living OS" })
        ] }),
        scanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 w-48 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
              scale: [1, 1.05, 1]
            }, transition: {
              duration: 1.2,
              repeat: Infinity
            }, className: "absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40 flex items-center justify-center", children: scanType === "face" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "h-20 w-20 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "h-20 w-20 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px] shadow-primary", initial: {
              top: "5%"
            }, animate: {
              top: "95%"
            }, transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute inset-0 -rotate-90", viewBox: "0 0 100 100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "46", fill: "none", stroke: "oklch(1 0 0 / 0.05)", strokeWidth: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: "46", fill: "none", stroke: "oklch(0.78 0.18 195)", strokeWidth: "2", strokeDasharray: `${progress / 100 * 289} 289`, strokeLinecap: "round", style: {
                filter: "drop-shadow(0 0 6px oklch(0.78 0.18 195))"
              } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: progress >= 100 ? "Authentification réussie ✓" : `Analyse biométrique… ${progress}%` })
        ] }) : showPasswordForm ? (
          /* Email/Password form */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCredentialsSubmit, className: "space-y-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Adresse Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center glass rounded-xl px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground mr-3 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, placeholder: "nom@exemple.com", value: email, onChange: (e) => setEmail(e.target.value), className: "bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Mot de Passe" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center glass rounded-xl px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-muted-foreground mr-3 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), className: "bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-primary disabled:opacity-60", children: [
              isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" }) : null,
              "Se connecter",
              !isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] })
        ) : (
          /* Biometrics welcome card */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-48 w-48 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "h-20 w-20 text-muted-foreground/60" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Sélectionnez une méthode d'accès sécurisée" })
          ] })
        ),
        !scanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          !showPasswordForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startBiometricScan("face"), className: "w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "h-4 w-4" }),
              "Reconnaissance faciale",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startBiometricScan("finger"), className: "w-full glass py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "h-4 w-4 text-primary" }),
              " Empreinte digitale"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPasswordForm(true), className: "w-full text-xs text-primary hover:underline py-2 flex items-center justify-center gap-1.5", children: "Se connecter avec mot de passe" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPasswordForm(false), className: "w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5", children: "Retour aux options biométriques" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
            setIsSubmitting(true);
            try {
              await login("henri.dupont@digihome.com", "senior123");
              navigate({
                to: "/"
              });
            } catch (err) {
              toast.error(err.message || "Échec de connexion invité.");
            } finally {
              setIsSubmitting(false);
            }
          }, className: "w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " Accès invité temporaire"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-[10px] text-muted-foreground tracking-widest uppercase", children: "Chiffrement AES-256 · Local-first" })
      ] })
    ] })
  ] });
}
export {
  Connexion as component
};
