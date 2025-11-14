import React, { useState } from "react";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  verifyTwoFactor,
} from "./api";
import type { LoginResponse } from "./api";

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

type Mode = "login" | "register" | "forgot" | "reset" | "twofactor";

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<Mode>("login");

  // Campos de formulario
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos extra para 2FA y reset
  const [loginEmail, setLoginEmail] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estado general
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     HANDLERS
  ================================= */

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const response: LoginResponse = await login(loginEmail, password);

      if ("requires2fa" in response) {
        // Se requiere código 2FA
        setDemoCode(response.code || null);
        setMode("twofactor");
      } else {
        // Login exitoso
        localStorage.setItem("emoai_token", response.token);
        onAuthSuccess(response.token);
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
    setLoading(false);
  }

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password, institution);
      setMode("login");
      alert("Cuenta creada. Ahora inicia sesión.");
    } catch (err: any) {
      setError(err.message || "Error al registrar");
    }
    setLoading(false);
  }

  async function handleForgot() {
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      setMode("reset");
      alert("Te enviamos un código de recuperación.");
    } catch (err: any) {
      setError("No se pudo enviar el código.");
    }
    setLoading(false);
  }

  async function handleReset() {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email, resetCode, newPassword);
      setMode("login");
      alert("Contraseña actualizada.");
    } catch (err: any) {
      setError("No se pudo restablecer la contraseña.");
    }
    setLoading(false);
  }

  async function handle2FA() {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyTwoFactor(loginEmail, twoFactorCode);
      localStorage.setItem("emoai_token", data.token);
      onAuthSuccess(data.token);
    } catch (err: any) {
      setError("Código incorrecto.");
    }
    setLoading(false);
  }

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl shadow-lg mt-10 text-white space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {mode === "login" && "Iniciar sesión"}
        {mode === "register" && "Crear cuenta"}
        {mode === "forgot" && "Recuperar contraseña"}
        {mode === "reset" && "Restablecer contraseña"}
        {mode === "twofactor" && "Verificación 2FA"}
      </h2>

      {error && (
        <div className="bg-red-600 p-2 rounded text-center text-sm">{error}</div>
      )}

      {/* ================= LOGIN ================= */}
      {mode === "login" && (
        <>
          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Correo"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-2 rounded-md font-semibold"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>

          <p
            className="text-center text-sm underline cursor-pointer"
            onClick={() => setMode("forgot")}
          >
            ¿Olvidaste tu contraseña?
          </p>

          <p
            className="text-center text-sm underline cursor-pointer"
            onClick={() => setMode("register")}
          >
            Crear una cuenta
          </p>
        </>
      )}

      {/* ================= REGISTER ================= */}
      {mode === "register" && (
        <>
          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Institución"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 p-2 rounded font-semibold"
          >
            Crear cuenta
          </button>

          <p
            className="text-center text-sm underline cursor-pointer"
            onClick={() => setMode("login")}
          >
            Ya tengo cuenta
          </p>
        </>
      )}

      {/* ================= FORGOT ================= */}
      {mode === "forgot" && (
        <>
          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleForgot}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-2 rounded"
          >
            Enviar código
          </button>

          <p
            className="text-center text-sm underline cursor-pointer"
            onClick={() => setMode("login")}
          >
            Volver al login
          </p>
        </>
      )}

      {/* ================= RESET PASSWORD ================= */}
      {mode === "reset" && (
        <>
          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Código recibido"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-gray-700"
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 p-2 rounded"
          >
            Restablecer
          </button>
        </>
      )}

      {/* ================= TWO FACTOR ================= */}
      {mode === "twofactor" && (
        <>
          <p className="text-sm text-center opacity-.">
            Ingresa el código enviado a tu correo.
          </p>

          {demoCode && (
            <div className="p-2 text-center bg-gray-700 rounded">
              (Código demo: <b>{demoCode}</b>)
            </div>
          )}

          <input
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Código 2FA"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
          />

          <button
            onClick={handle2FA}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-2 rounded font-bold"
          >
            Verificar código
          </button>
        </>
      )}
    </div>
  );
};
