import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crown, Users as UsersIcon, HeartPulse, Key, UserPlus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/utilisateurs")({
  head: () => ({
    meta: [
      { title: "Utilisateurs — DIGI HOME" },
      { name: "description", content: "Profils Administrateur, Famille, Senior, Locataire et Invité." },
    ],
  }),
  component: Utilisateurs,
});

const profiles = [
  { name: "Alex Dupont", role: "Administrateur", initials: "AD", icon: Crown, color: "from-primary to-accent", perms: "Accès total · Gestion système" },
  { name: "Marie Dupont", role: "Famille", initials: "MD", icon: UsersIcon, color: "from-emerald-400 to-cyan-300", perms: "Toutes pièces · Scénarios" },
  { name: "Léo Dupont", role: "Famille", initials: "LD", icon: UsersIcon, color: "from-emerald-400 to-cyan-300", perms: "Toutes pièces · Sauf garage" },
  { name: "Henri Dupont", role: "Senior", initials: "HD", icon: HeartPulse, color: "from-amber-300 to-orange-400", perms: "Interface simplifiée" },
  { name: "Camille Bauer", role: "Locataire", initials: "CB", icon: Key, color: "from-purple-400 to-pink-400", perms: "Studio 2e étage uniquement" },
  { name: "Service ménage", role: "Invité", initials: "SM", icon: UserPlus, color: "from-slate-400 to-slate-500", perms: "Accès limité · 9h–12h" },
];

const roleStats = [
  { role: "Administrateur", count: 1 },
  { role: "Famille", count: 2 },
  { role: "Senior", count: 1 },
  { role: "Locataire", count: 1 },
  { role: "Invité", count: 1 },
];

function Utilisateurs() {
  return (
    <AppShell title="Gestion des utilisateurs" subtitle="Profils, permissions et niveaux d'accès.">
      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {roleStats.map((r, i) => (
          <div key={r.role} className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{r.role}</p>
            <p className="text-3xl font-bold tabular-nums">{r.count}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">Tous les profils ({profiles.length})</h3>
        <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition">
          <UserPlus className="h-4 w-4" /> Ajouter un utilisateur
        </button>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="glass rounded-2xl p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary-foreground", p.color)}>
                  {p.initials}
                </div>
                <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="font-semibold text-base">{p.name}</p>
              <div className="flex items-center gap-1.5 mt-1 mb-4">
                <Icon className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">{p.role}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-glass-border pt-3">{p.perms}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 glass rounded-lg py-2 text-xs font-medium hover:bg-white/10 transition">Modifier</button>
                <button className="flex-1 glass rounded-lg py-2 text-xs font-medium hover:bg-white/10 transition">Permissions</button>
              </div>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
