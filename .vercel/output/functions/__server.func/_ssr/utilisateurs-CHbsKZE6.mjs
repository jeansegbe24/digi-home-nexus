import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, P as PageTransition, c as cn } from "./PageTransition-B6AJzU9o.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as apiClient, n as normalizeUser, t as toBackendRole } from "./router-h13vC9Q8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as TriangleAlert, R as RefreshCw, U as UserPlus, E as Ellipsis, a as Trash2, X, M as Mail, L as Lock, K as Key, H as HeartPulse, b as Users, C as Crown } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
const getRoleConfig = (role) => {
  switch (role) {
    case "Administrateur":
      return {
        icon: Crown,
        color: "from-primary to-accent",
        perms: "Accès total · Gestion système"
      };
    case "Famille":
      return {
        icon: Users,
        color: "from-emerald-400 to-cyan-300",
        perms: "Toutes pièces · Scénarios"
      };
    case "Senior":
      return {
        icon: HeartPulse,
        color: "from-amber-300 to-orange-400",
        perms: "Interface simplifiée"
      };
    case "Locataire":
      return {
        icon: Key,
        color: "from-purple-400 to-pink-400",
        perms: "Pièces privées uniquement"
      };
    default:
      return {
        icon: UserPlus,
        color: "from-slate-400 to-slate-500",
        perms: "Accès limité · Temporaire"
      };
  }
};
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function Utilisateurs() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [formNom, setFormNom] = reactExports.useState("");
  const [formEmail, setFormEmail] = reactExports.useState("");
  const [formRole, setFormRole] = reactExports.useState("Famille");
  const [formLangue, setFormLangue] = reactExports.useState("fr");
  const [formPassword, setFormPassword] = reactExports.useState("");
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users2 = await apiClient.get("/api/users");
      return users2.map((u) => ({
        ...normalizeUser(u),
        email: u.email
      }));
    }
  });
  const createUserMutation = useMutation({
    mutationFn: (newUser) => apiClient.post("/api/users", {
      nom: newUser.nom,
      email: newUser.email,
      role: toBackendRole(newUser.role),
      langue: newUser.langue,
      password: newUser.password || "password123"
    }),
    onSuccess: (data) => {
      const profile = {
        ...normalizeUser(data),
        email: data.email
      };
      queryClient.setQueryData(["users"], (prev) => {
        if (!prev) return [profile];
        return [...prev, profile];
      });
      toast.success(`Profil ${data.nom} créé avec succès.`);
      closeModal();
    }
  });
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) => apiClient.patch(`/api/users/${updatedUser.id}`, {
      nom: updatedUser.nom,
      email: updatedUser.email,
      role: toBackendRole(updatedUser.role),
      langue: updatedUser.langue
    }),
    onSuccess: (data) => {
      const profile = {
        ...normalizeUser(data),
        email: data.email
      };
      queryClient.setQueryData(["users"], (prev) => prev?.map((u) => u.id === profile.id ? profile : u));
      toast.success(`Profil ${data.nom} mis à jour.`);
      closeModal();
    }
  });
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => apiClient.delete(`/api/users/${userId}`),
    onSuccess: (_, userId) => {
      queryClient.setQueryData(["users"], (prev) => prev?.filter((u) => u.id !== userId));
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
  const openEditModal = (user) => {
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
  const handleSubmit = (e) => {
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
  const handleDelete = (userId, userName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${userName} ?`)) {
      deleteUserMutation.mutate(userId);
    }
  };
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion des utilisateurs", subtitle: "Profils, permissions et niveaux d'accès.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[400px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong p-8 rounded-3xl max-w-md text-center border border-destructive/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Erreur de chargement des profils" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 mb-6", children: "Impossible de joindre l'annuaire des utilisateurs de la maison connectée." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetch(), className: "bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
        " Réessayer"
      ] })
    ] }) }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion des utilisateurs", subtitle: "Chargement de l'annuaire...", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 glass rounded-2xl" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-48 glass rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 glass rounded-2xl" }, i)) })
    ] }) });
  }
  const roleStats = {
    Administrateur: 0,
    Famille: 0,
    Senior: 0,
    Locataire: 0,
    Invité: 0
  };
  users?.forEach((u) => {
    if (roleStats[u.role] !== void 0) {
      roleStats[u.role]++;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { title: "Gestion des utilisateurs", subtitle: "Profils, permissions et niveaux d'accès.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageTransition, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8", children: Object.keys(roleStats).map((role, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 animate-slide-up", style: {
      animationDelay: `${i * 50}ms`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-2", children: role }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold tabular-nums", children: roleStats[role] })
    ] }, role)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold", children: [
        "Tous les profils (",
        users?.length || 0,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: openAddModal, className: "bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Ajouter un utilisateur"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: users?.map((p, i) => {
      const config = getRoleConfig(p.role);
      const Icon = config.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 card-hover animate-slide-up", style: {
        animationDelay: `${i * 60}ms`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-primary-foreground", config.color), children: getInitials(p.nom) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4 text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-base", children: p.nom }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium", children: p.role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4 truncate", children: p.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed border-t border-glass-border pt-3", children: [
          config.perms,
          " · ",
          p.langue.toUpperCase()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEditModal(p), className: "flex-1 glass rounded-lg py-2 text-xs font-medium hover:bg-white/10 transition", children: "Modifier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id, p.nom), disabled: deleteUserMutation.isPending, className: "px-3 glass text-destructive border border-destructive/20 rounded-lg py-2 hover:bg-destructive/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, p.id || p.nom);
    }) }),
    modalOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 backdrop-blur-sm", onClick: closeModal }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "relative w-full max-w-md glass-strong rounded-3xl p-6 shadow-2xl border border-glass-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 border-b border-glass-border pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: editingUser ? "Modifier le profil" : "Créer un nouveau profil" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: closeModal, className: "h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Nom Complet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, placeholder: "Ex: Jean Dupont", value: formNom, onChange: (e) => setFormNom(e.target.value), className: "w-full glass rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/60" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Adresse Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center glass rounded-xl px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground mr-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, placeholder: "Ex: jean.dupont@email.com", value: formEmail, onChange: (e) => setFormEmail(e.target.value), className: "bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60" })
            ] })
          ] }),
          !editingUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Mot de Passe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center glass rounded-xl px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-muted-foreground mr-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "Mot de passe par défaut", value: formPassword, onChange: (e) => setFormPassword(e.target.value), className: "bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/60" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Rôle d'Accès" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formRole, onChange: (e) => setFormRole(e.target.value), className: "w-full glass bg-[#121214] border-0 rounded-xl px-3 py-3 text-sm outline-none text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "Administrateur", children: "Administrateur" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "Famille", children: "Famille" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "Senior", children: "Senior" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "Locataire", children: "Locataire" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "Invité", children: "Invité" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1", children: "Langue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: formLangue, onChange: (e) => setFormLangue(e.target.value), className: "w-full glass bg-[#121214] border-0 rounded-xl px-3 py-3 text-sm outline-none text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "fr", children: "Français (FR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-[#121214]", value: "en", children: "English (EN)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: closeModal, className: "flex-1 glass rounded-xl py-3 text-sm font-semibold hover:bg-white/10 transition", children: "Annuler" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: createUserMutation.isPending || updateUserMutation.isPending, className: "flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition glow-primary disabled:opacity-60", children: createUserMutation.isPending || updateUserMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto" }) : editingUser ? "Enregistrer" : "Créer" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Utilisateurs as component
};
