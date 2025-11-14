import React, { useState } from "react";
import { login, register } from "./api";

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const data = await register(name, email, password);
        onAuthSuccess(data.token);
      } else {
        const data = await login(email, password);
        onAuthSuccess(data.token);
      }
    } catch (err: any) {
      setError(err.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-2 text-center">
        {mode === "login" ? "Inicia sesión en EmoAI" : "Crea tu cuenta en EmoAI"}
      </h1>
      <p className="text-xs text-slate-300 mb-4 text-center">
        Este acceso es solo para fines académicos y de demostración.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de acceso">
        {mode === "register" && (
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs text-slate-200">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Brithany"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs text-slate-200">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs text-slate-200">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Al menos 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white text-sm font-medium py-2.5 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {loading
            ? "Procesando..."
            : mode === "login"
            ? "Entrar al panel de bienestar"
            : "Crear cuenta y entrar"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-[11px] text-indigo-300 hover:text-indigo-200 underline"
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setError(null);
          }}
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate aquí"
            : "¿Ya tienes cuenta? Inicia sesión aquí"}
        </button>
      </div>
    </div>
  );
};
