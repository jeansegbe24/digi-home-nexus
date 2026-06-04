import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Fingerprint, Home, ScanFace, ArrowRight, Sparkles, Mail, Lock as LockIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — DIGI HOME" },
      { name: "description", content: "Authentification biométrique et par mot de passe sécurisée DIGI HOME." },
    ],
  }),
  component: Connexion,
});

function Connexion() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Biometrics simulation states
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState<"face" | "finger" | null>(null);
  const [progress, setProgress] = useState(0);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };

  // Biometrics auto-login simulation
  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          // Trigger actual API login with demo credentials
          setTimeout(async () => {
            try {
              const demoEmail = scanType === "face" ? "jean.dupont@digihome.com" : "marie.dupont@digihome.com";
              const demoPassword = scanType === "face" ? "admin123" : "family123";
              await login(demoEmail, demoPassword);
              navigate({ to: "/" });
            } catch (err: any) {
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

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Identifiants incorrects.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startBiometricScan = (type: "face" | "finger") => {
    setScanType(type);
    setProgress(0);
    setScanning(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated mesh background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(at 20% 20%, oklch(0.65 0.22 295 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 80%, oklch(0.78 0.18 195 / 0.30) 0px, transparent 50%)",
            "radial-gradient(at 80% 20%, oklch(0.78 0.18 195 / 0.35) 0px, transparent 50%), radial-gradient(at 20% 80%, oklch(0.65 0.22 295 / 0.30) 0px, transparent 50%)",
            "radial-gradient(at 20% 20%, oklch(0.65 0.22 295 / 0.35) 0px, transparent 50%), radial-gradient(at 80% 80%, oklch(0.78 0.18 195 / 0.30) 0px, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 280 + i * 60,
            height: 280 + i * 60,
            background:
              i === 0 ? "oklch(0.78 0.18 195 / 0.25)" : i === 1 ? "oklch(0.65 0.22 295 / 0.25)" : "oklch(0.72 0.19 155 / 0.18)",
            top: `${20 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="w-full max-w-md flex flex-col gap-6 relative">
        {/* PWA Install Banner */}
        {deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-4 flex items-center justify-between border border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">DIGI HOME sur votre écran</p>
                <p className="text-xs text-muted-foreground">Installez l'application en un clic</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition"
            >
              Installer l'application
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-3xl p-8 shadow-2xl border border-glass-border"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-4"
            >
              <Home className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold font-display tracking-tight">
              DIGI <span className="gradient-text">HOME</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">
              Smart Living OS
            </p>
          </div>

          {/* Scanner view */}
          {scanning ? (
            <div className="flex flex-col items-center mb-6">
              <div className="relative h-48 w-48 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40 flex items-center justify-center"
                >
                  {scanType === "face" ? (
                    <ScanFace className="h-20 w-20 text-primary" />
                  ) : (
                    <Fingerprint className="h-20 w-20 text-primary" />
                  )}
                </motion.div>
                <motion.div
                  className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px] shadow-primary"
                  initial={{ top: "5%" }}
                  animate={{ top: "95%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                />
                {/* progress ring */}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="2" />
                  <circle
                    cx="50" cy="50" r="46" fill="none"
                    stroke="oklch(0.78 0.18 195)" strokeWidth="2"
                    strokeDasharray={`${(progress / 100) * 289} 289`}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.18 195))" }}
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {progress >= 100 ? "Authentification réussie ✓" : `Analyse biométrique… ${progress}%`}
              </p>
            </div>
          ) : showPasswordForm ? (
            /* Email/Password form */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 mb-6">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Adresse Email</label>
                <div className="relative flex items-center glass rounded-xl px-4 py-3">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Mot de Passe</label>
                <div className="relative flex items-center glass rounded-xl px-4 py-3">
                  <LockIcon className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-primary disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Se connecter
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            /* Biometrics welcome card */
            <div className="flex flex-col items-center mb-6">
              <div className="relative h-48 w-48 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border flex items-center justify-center">
                  <ScanFace className="h-20 w-20 text-muted-foreground/60" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Sélectionnez une méthode d'accès sécurisée
              </p>
            </div>
          )}

          {!scanning && (
            <div className="space-y-3">
              {!showPasswordForm ? (
                <>
                  <button
                    onClick={() => startBiometricScan("face")}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-primary"
                  >
                    <ScanFace className="h-4 w-4" />
                    Reconnaissance faciale
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => startBiometricScan("finger")}
                    className="w-full glass py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition"
                  >
                    <Fingerprint className="h-4 w-4 text-primary" /> Empreinte digitale
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full text-xs text-primary hover:underline py-2 flex items-center justify-center gap-1.5"
                  >
                    Se connecter avec mot de passe
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5"
                >
                  Retour aux options biométriques
                </button>
              )}

              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await login("henri.dupont@digihome.com", "senior123");
                    navigate({ to: "/" });
                  } catch (err: any) {
                    toast.error(err.message || "Échec de connexion invité.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3 w-3" /> Accès invité temporaire
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-[10px] text-muted-foreground tracking-widest uppercase">
            Chiffrement AES-256 · Local-first
          </p>
        </motion.div>
      </div>
    </div>
  );
}
