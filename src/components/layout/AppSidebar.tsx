import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Fingerprint,
  Lightbulb,
  ShieldCheck,
  Zap,
  HeartPulse,
  Users,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/acces", label: "Accès intelligents", icon: Fingerprint },
  { to: "/eclairage", label: "Éclairage", icon: Lightbulb },
  { to: "/securite", label: "Sécurité", icon: ShieldCheck },
  { to: "/energie", label: "Énergie", icon: Zap },
  { to: "/senior", label: "Mode Senior", icon: HeartPulse },
  { to: "/utilisateurs", label: "Utilisateurs", icon: Users },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/connexion" });
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col glass-strong border-r border-glass-border z-40">
      <div className="px-6 py-7 flex items-center gap-3 border-b border-glass-border">
        <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight">DIGI HOME</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Smart Living OS</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active && "text-primary")} />
              <span className="font-medium">{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-glass-border space-y-2">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-sm font-bold">
              {user ? getInitials(user.nom) : "??"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.nom ?? "Utilisateur"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role ?? "—"}</p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-40 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
      {nav.slice(0, 5).map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
              active ? "bg-primary/20 text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
