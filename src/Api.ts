const API_URL = "http://localhost:4000";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Stats {
  totalCheckins: number;
  averageMood: string;
  chatbotSessions: number;
  streak: number;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al registrar");
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
  return data;
}

export async function fetchMe(
  token: string
): Promise<{ user: User; stats: Stats }> {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener perfil");
  return data;
}

export async function createCheckin(token: string, mood: string, note: string) {
  const res = await fetch(`${API_URL}/checkins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mood, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar check-in");
  return data;
}

export async function sendChatMessage(token: string, text: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en el chatbot");
  return data as { reply: string };
}
