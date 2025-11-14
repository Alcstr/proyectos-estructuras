const API_URL = "http://localhost:4000";

export interface User {
  id: number;
  name: string;
  email: string;
  institution?: string;
  avatarUrl?: string | null;
}

export interface Stats {
  totalCheckins: number;
  averageMood: string;
  chatbotSessions: number;
  streak: number;
}

export interface LoginSuccess {
  token: string;
  user: User;
}

export interface Login2FARequired {
  requires2fa: true;
  message: string;
  code?: string; // solo para demo
}

export type LoginResponse = LoginSuccess | Login2FARequired;

export async function register(
  name: string,
  email: string,
  password: string,
  institution?: string
): Promise<LoginSuccess> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, institution }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al registrar");
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
  return data;
}

export async function verifyTwoFactor(
  email: string,
  code: string
): Promise<LoginSuccess> {
  const res = await fetch(`${API_URL}/auth/verify-2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al verificar código");
  return data;
}

export async function requestPasswordReset(email: string): Promise<{
  message: string;
  code?: string;
}> {
  const res = await fetch(`${API_URL}/auth/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al solicitar recuperación");
  return data;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");
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
