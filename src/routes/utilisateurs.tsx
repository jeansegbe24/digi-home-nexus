import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crown, Users as UsersIcon, HeartPulse, Key, UserPlus, MoreHorizontal, AlertTriangle, RefreshCw, X, Trash2, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";


export const Route = createFileRoute("/utilisateurs")({
  head: () => ({
    meta: [
      { title: "Utilisateurs — DIGI HOME" },
      { name: "description", content: "Profils Administrateur, Famille, Senior, Locataire et Invité." },
    ],
  }),
  component: Utilisateurs,
});

interface Profile {
  id: string;
  nom: string;
  role: "Administrateur" | "Famille" | "Senior" | "Locataire" | "Invité";
  langue: "fr" | "en";
  email: string;
}

const getRoleConfig = (role: string) => {
  switch (role) {
    case "Administrateur":
      return { icon: Crown, color: "from-primary to-accent", perms: "Accès total · Gestion système" };
    case "Famille":
      return { icon: UsersIcon, color: "from-emerald-400 to-cyan-300", perms: "Toutes pièces · Scénarios" };
    case "Senior":
      return { icon: HeartPulse, color: "from-amber-300 to-orange-400", perms: "Interface simplifiée" };
    case "Locataire":
      return { icon: Key, color: "from-purple-400 to-pink-400", perms: "Pièces privées uniquement" };
    default:
      return { icon: UserPlus, color: "from-slate-400 to-slate-500", perms: "Accès limité · Temporaire" };
  }
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Utilisateurs() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  // Form states
  const [formNom, setFormNom] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<Profile["role"]>("Famille");
  const [formLangue, setFormLangue] = useState<Profile["langue"]>("fr");
  const [formPassword, setFormPassword] = useState("");

  // Queries
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Profile[]>({
    queryKey: ["users"],
    queryFn: () => apiClient.get<Profile[]>("/api/users"),
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (newUser: Omit<Profile, "id"> & { password?: string }) => 
      apiClient.post<Profile>("/api/users", newUser),
    onSuccess: (data) => {
      queryClient.setQueryData<Profile[]>(["users"], (prev) => {
        if (!prev) return [data];
        return [...prev, data];
      });
      toast.success(`Profil ${data.nom} créé avec succès.`);
      closeModal();
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: Profile) => 
      apiClient.patch<Profile>(`/api/users/${updatedUser.id}`, updatedUser),
    onSuccess: (data) => {
      queryClient.setQueryData<Profile[]>(["users"], (prev) => 
        prev?.map((u) => u.id === data.id ? data : u)
      );
      toast.success(`Profil ${data.nom} mis à jour.`);
      closeModal();
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => 
      apiClient.delete(`/api/users/${userId}`),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<Profile[]>(["users"], (prev) => 
        prev?.filter((u) => u.id !== userId)
      );
      toast.success("Profil supprimé.");
    }
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormNom("");
    setFormEmail("");
    setFormRole("Famille");
    setFormLangue("fr");
    setFormPassword("");
    setModalOpen(true);
  };

  const openEditModal = (user: Profile) => {
    setEditingUser(user);
    setFormNom(user.nom);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormLangue(user.langue);
    setFormPassword("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom || !formEmail) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        nom: formNom,
        email: formEmail,
        role: formRole,
        langue: formLangue
      });
    } else {
      createUserMutation.mutate({
        nom: formNom,
        email: formEmail,
        role: formRole,
        langue: formLangue,
        password: formPassword || "password123"
      });
    }
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${userName} ?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (error) {
    return (
      <AppShell title="Gestion des utilisateurs" subtitle="Profils, permissions et niveaux d'accès.">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold">Erreur de chargement des profils</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Impossible de joindre l'annuaire des utilisateurs de la maison connectée.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition"
            >
              <RefreshCw className="h-4 w-4" /> Réessayer
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell title="Gestion des utilisateurs" subtitle="Chargement de l'annuaire...">
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 glass rounded-2xl" />
            ))}
          </div>
          <div className="h-12 w-48 glass rounded-xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 glass rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // Calculate statistics dynamically
  const roleStats = {
    Administrateur: 0,
    Famille: 0,
    Senior: 0,
    Locataire: 0,
    Invité: 0
  };
  users?.forEach((u) => {
    if (roleStats[u.role] !== undefined) {
      roleStats[u.role]++;
    }
  });

  return (
    <AppShell title="Gestion des utilisateurs" subtitle="Profils, permissions et niveaux d'accès.">
      <PageTransition>
      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {(Object.keys(roleStats) as Array<keyof typeof roleStats>).map((role, i) => (
          <div key={role} className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{role}</p>
            <p className="text-3xl font-bold tabular-nums">{roleStats[role]}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">Tous les profils ({users?.length || 0})</h3>
        <button 
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition glow-primary"
        >
          <UserPlus className="h-4 w-4" /> Ajouter un utilisateur
        </button>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users?.map((p, i) => {
          const config = getRoleConfig(p.role);
          const Icon = config.icon;
          return (
            <div
              key={p.id || p.nom}
              className="glass rounded-2xl p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary-foreground", config.color)}>
                  {getInitials(p.nom)}
                </div>
                <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="font-semibold text-base">{p.nom}</p>
              <div className="flex items-center gap-1.5 mt-1 mb-2">
                <Icon className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">{p.role}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 truncate">{p.email}</p>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-glass-border pt-3">{config.perms} · {p.langue.toUpperCase()}</p>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => openEditModal(p)}
                  className="flex-1 glass rounded-lg py-2 text-xs font-medium hover:bg-white/10 transition"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(p.id, p.nom)}
                  disabled={deleteUserMutation.isPending}
                  className="px-3 glass text-destructive border border-destructive/20 rounded-lg py-2 hover:bg-destructive/10 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Glassmorphic Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md glass-strong rounded-3xl p-6 shadow-2xl border border-glass-border"
          >
            <div className="flex items-center justify-between mb-5 border-b border-glass-border pb-3">
              <h3 className="text-lg font-bold">
                {editingUser ? "Modifier le profil" : "Créer un nouveau profil"}
              </h3>
              <button onClick={closeModal} className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Dupont"
                  value={formNom}
                  onChange={(e) => setFormNom(e.target.value)}
                  className="w-full glass rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Adresse Email</label>
                <div className="relative flex items-center glass rounded-xl px-4 py-3">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Ex: jean.dupont@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Mot de Passe</label>
                  <div className="relative flex items-center glass rounded-xl px-4 py-3">
                    <Lock className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
                    <input
                      type="password"
                      placeholder="Mot de passe par défaut"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Rôle d'Accès</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as Profile["role"])}
                    className="w-full glass bg-[#121214] border-0 rounded-xl px-3 py-3 text-sm outline-none text-foreground"
                  >
                    <option className="bg-[#121214]" value="Administrateur">Administrateur</option>
                    <option className="bg-[#121214]" value="Famille">Famille</option>
                    <option className="bg-[#121214]" value="Senior">Senior</option>
                    <option className="bg-[#121214]" value="Locataire">Locataire</option>
                    <option className="bg-[#121214]" value="Invité">Invité</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Langue</label>
                  <select
                    value={formLangue}
                    onChange={(e) => setFormLangue(e.target.value as Profile["langue"])}
                    className="w-full glass bg-[#121214] border-0 rounded-xl px-3 py-3 text-sm outline-none text-foreground"
                  >
                    <option className="bg-[#121214]" value="fr">Français (FR)</option>
                    <option className="bg-[#121214]" value="en">English (EN)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 glass rounded-xl py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition glow-primary disabled:opacity-60"
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                    <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : editingUser ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </PageTransition>
    </AppShell>
  );
}
