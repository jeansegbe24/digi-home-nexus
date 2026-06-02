import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Fingerprint, Home, ScanFace, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — DIGI HOME" },
      { name: "description", content: "Authentification biométrique sécurisée DIGI HOME." },
    ],
  }),
  component: Connexion,
});

function Connexion() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(() => navigate({ to: "/" }), 400);
          return 100;
        }
        return p + 4;
      });
    }, 50);
    return () => clearInterval(id);
  }, [scanning, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated mesh */}
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

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-2xl"
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

        {/* Scanner */}
        <div className="relative mx-auto h-48 w-48 mb-6">
          <motion.div
            animate={{ scale: scanning ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1.2, repeat: scanning ? Infinity : 0 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40 flex items-center justify-center"
          >
            <ScanFace className={cn("h-20 w-20 transition-colors", scanning ? "text-primary" : "text-muted-foreground")} />
          </motion.div>
          {scanning && (
            <motion.div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px] shadow-primary"
              initial={{ top: "5%" }}
              animate={{ top: "95%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            />
          )}
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

        <p className="text-center text-sm text-muted-foreground mb-5">
          {progress >= 100 ? "Authentification réussie ✓"
            : scanning ? `Analyse biométrique… ${progress}%`
            : "Placez votre visage face à la caméra"}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setScanning(true)}
            disabled={scanning}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition glow-primary disabled:opacity-60"
          >
            <ScanFace className="h-4 w-4" />
            {scanning ? "Analyse en cours…" : "Reconnaissance faciale"}
            {!scanning && <ArrowRight className="h-4 w-4" />}
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full glass py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition"
          >
            <Fingerprint className="h-4 w-4 text-primary" /> Empreinte digitale
          </button>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3 w-3" /> Accès invité temporaire
          </button>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground tracking-widest uppercase">
          Chiffrement AES-256 · Local-first
        </p>
      </motion.div>
    </div>
  );
}
