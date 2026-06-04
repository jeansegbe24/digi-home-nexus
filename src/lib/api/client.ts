import { toast } from "sonner";

/** Empty string = same-origin (Vite dev proxy or production reverse proxy). */
export const getResolvedApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (envUrl === "" || envUrl === "same-origin") {
    return "";
  }

  if (envUrl) {
    if (envUrl.includes("localhost") && typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return envUrl.replace("localhost", window.location.hostname).replace(/\/$/, "");
    }
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
};

export const getWebSocketUrl = (): string => {
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

export const BASE_URL = getResolvedApiUrl();

class ApiError extends Error {
  status: number;
  info: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

async function flushQueue(success: boolean) {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
}

async function handleRefresh(): Promise<boolean> {
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
        "Content-Type": "application/json",
      },
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

interface RequestOptions extends RequestInit {
  skipErrorToast?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // crucial for httpOnly cookie authentication
  };

  try {
    let response = await fetch(url, fetchOptions);

    if (response.status === 401 && !path.includes("/auth/refresh") && !path.includes("/auth/login")) {
      // Attempt token refresh
      const refreshSuccess = await handleRefresh();
      if (refreshSuccess) {
        // Retry the original request
        response = await fetch(url, fetchOptions);
      } else {
        // Token refresh failed, trigger custom event or handle log out
        window.dispatchEvent(new CustomEvent("unauthorized-api-call"));
      }
    }

    if (!response.ok) {
      let info: any;
      try {
        info = await response.json();
      } catch {
        info = null;
      }
      
      const errorMessage = info?.detail || info?.message || `Erreur serveur (${response.status})`;
      throw new ApiError(errorMessage, response.status, info);
    }

    // Return empty object for 204 or empty responses
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    
    return (await response.text()) as unknown as T;
  } catch (error: any) {
    if (!options.skipErrorToast) {
      toast.error(error.message || "Une erreur réseau ou serveur s'est produite.");
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
