import { Session, Goal, ComputedStats } from "../types";

const getHeaders = () => {
  const token = localStorage.getItem("reyes_jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  login: async (password: string): Promise<{ token: string; uid: string }> => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Login failed");
    }
    return res.json();
  },

  getSessions: async (month?: string): Promise<Session[]> => {
    const url = month ? `/api/sessions?month=${month}` : "/api/sessions";
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("reyes_jwt_token");
        window.location.reload();
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch sessions");
    }
    return res.json();
  },

  createSession: async (session: Omit<Session, "id">): Promise<any> => {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(session),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create session");
    }
    return res.json();
  },

  updateSession: async (id: string, session: Omit<Session, "id">): Promise<any> => {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(session),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to update session");
    }
    return res.json();
  },

  deleteSession: async (id: string): Promise<any> => {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to delete session");
    }
    return res.json();
  },

  getGoals: async (): Promise<Goal[]> => {
    const res = await fetch("/api/goals", { headers: getHeaders() });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch goals");
    }
    return res.json();
  },

  createGoal: async (goal: Omit<Goal, "id">): Promise<any> => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(goal),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to create goal");
    }
    return res.json();
  },

  updateGoal: async (id: string, goal: Omit<Goal, "id">): Promise<any> => {
    const res = await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(goal),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to edit goal");
    }
    return res.json();
  },

  deleteGoal: async (id: string): Promise<any> => {
    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to delete goal");
    }
    return res.json();
  },

  getStats: async (): Promise<ComputedStats> => {
    const res = await fetch("/api/stats", { headers: getHeaders() });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to fetch stats");
    }
    return res.json();
  },
};
