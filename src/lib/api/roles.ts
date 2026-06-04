export type FrontendRole = "Administrateur" | "Famille" | "Senior" | "Locataire" | "Invité";
export type BackendRole = "proprietaire" | "famille" | "senior" | "locataire" | "personnel";

const BACKEND_TO_FRONTEND: Record<BackendRole, FrontendRole> = {
  proprietaire: "Administrateur",
  famille: "Famille",
  senior: "Senior",
  locataire: "Locataire",
  personnel: "Invité",
};

const FRONTEND_TO_BACKEND: Record<FrontendRole, BackendRole> = {
  Administrateur: "proprietaire",
  Famille: "famille",
  Senior: "senior",
  Locataire: "locataire",
  Invité: "personnel",
};

export function toFrontendRole(role: string): FrontendRole {
  const normalized = role.toLowerCase() as BackendRole;
  return BACKEND_TO_FRONTEND[normalized] ?? "Invité";
}

export function toBackendRole(role: FrontendRole | string): BackendRole {
  return FRONTEND_TO_BACKEND[role as FrontendRole] ?? "famille";
}

export interface ApiUser {
  id: number | string;
  nom: string;
  email: string;
  role: string;
  langue: "fr" | "en";
}

export function normalizeUser(user: ApiUser) {
  return {
    id: String(user.id),
    nom: user.nom,
    email: user.email,
    role: toFrontendRole(user.role),
    langue: user.langue,
  };
}
