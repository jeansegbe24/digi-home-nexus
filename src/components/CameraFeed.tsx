import { motion } from "framer-motion";
import { useClock } from "@/hooks/useLive";
import { Maximize2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "night" | "day" | "thermal";

const palettes: Record<Mode, string> = {
  night: "from-emerald-950 via-emerald-900/40 to-black",
  day: "from-slate-700 via-slate-900 to-black",
  thermal: "from-fuchsia-900 via-orange-700/40 to-amber-300/20",
};

export function CameraFeed({
  name,
  live = true,
  mode = "night",
  motionDetected = false,
}: {
  name: string;
  live?: boolean;
  mode?: Mode;
  motionDetected?: boolean;
}) {
  const now = useClock();

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover">
      <div className={cn("relative aspect-video overflow-hidden bg-gradient-to-br", palettes[mode])}>
        {/* Faux silhouette / scene */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="spot" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.18" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="120" fill="url(#spot)" />
          <polygon points="0,120 60,70 100,90 140,55 200,80 200,120" fill="rgba(0,0,0,0.55)" />
          <rect x="80" y="60" width="20" height="40" fill="rgba(0,0,0,0.7)" />
          <rect x="120" y="50" width="15" height="50" fill="rgba(0,0,0,0.7)" />
        </svg>

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Scanline */}
        {live && (
          <motion.div
            className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none"
            initial={{ y: "-20%" }}
            animate={{ y: "110%" }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Motion box */}
        {motionDetected && live && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute top-[35%] left-[40%] w-16 h-20 border-2 border-warning rounded-sm"
          >
            <span className="absolute -top-5 left-0 text-[9px] font-mono text-warning">
              MOUVEMENT
            </span>
          </motion.div>
        )}

        {/* HUD top */}
        <div className="absolute top-3 left-3 flex items-center gap-2 glass-strong rounded-full px-2.5 py-1">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              live ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground"
            )}
          />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {live ? "● REC" : "Offline"}
          </span>
        </div>
        <div className="absolute top-3 right-3 glass-strong rounded-full px-2.5 py-1 flex items-center gap-1.5">
          <Wifi className="h-2.5 w-2.5 text-primary" />
          <span className="text-[9px] font-mono">HD · {mode.toUpperCase()}</span>
        </div>

        {/* HUD bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <div className="text-[9px] font-mono text-white/70 leading-tight">
            <div>CAM · {name.slice(0, 10).toUpperCase()}</div>
            <div className="text-white/50">
              {now.toLocaleDateString("fr-FR")} · {now.toLocaleTimeString("fr-FR")}
            </div>
          </div>
          <button className="glass-strong h-7 w-7 rounded-md flex items-center justify-center hover:bg-white/10">
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>

        {/* Crosshair corners */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((p, i) => (
          <div key={i} className={cn("absolute h-3 w-3 border-primary/60", p, {
            "border-t border-l": i === 0,
            "border-t border-r": i === 1,
            "border-b border-l": i === 2,
            "border-b border-r": i === 3,
          })} />
        ))}
      </div>
      <div className="p-3 flex items-center justify-between">
        <p className="font-medium text-sm">{name}</p>
        <button className="text-[10px] text-primary hover:underline">Plein écran</button>
      </div>
    </div>
  );
}
