import React, { useState } from "react";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  verifyTwoFactor,
  LoginResponse,
} from "./api";



interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

type Mode = "login" | "register" | "forgot" | "reset" | "twofactor";

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState(""); // para 2FA y reset
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null); // código mostrado por demo

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function resetMessages() {
    setError(null);
    setInfo(null);
    setDemoCode(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();

    try {
      setLoading(true);

      if (mode === "register") {
        const data = await register(name, email, password, institution);
        onAuthSuccess(data.token);
        return;
      }

      if (mode === "login") {
        const res: LoginResponse = await login(email, password);
        if ("requires2fa" in res && res.requires2fa) {
          setLoginEmail(email);
          setMode("twofactor");
          setInfo(res.message);
          if (res.code) setDemoCode(res.code); // visible solo en la demo
        } else {
          onAuthSuccess(res.token);
        }
        return;
      }

      if (mode === "forgot") {
        const data = await requestPasswordReset(email);
        setLoginEmail(email);
        setMode("reset");
        setInfo(data.message);
        if (data.code) setDemoCode(data.code);
        return;
      }

      if (mode === "reset") {
        await resetPassword(loginEmail, resetCode, newPassword);
        setInfo("Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.");
        setMode("login");
        setPassword("");
        setNewPassword("");
        setResetCode("");
        return;
      }

      if (mode === "twofactor") {
        const res = await verifyTwoFactor(loginEmail, twoFactorCode);
        onAuthSuccess(res.token);
        return;
      }
    } catch (err: any) {
      setError(err.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isTwoFactor = mode === "twofactor";

  let title = "";
  let subtitle = "";

  if (isLogin) {
    title = "Inicia sesión en EmoAI";
    subtitle = "Este acceso es solo para fines académicos y de demostración.";
  } else if (isRegister) {
    title = "Crea tu cuenta en EmoAI";
    subtitle = "Registra tus datos para acceder a tu panel de bienestar emocional.";
  } else if (isForgot) {
    title = "Recupera tu contraseña";
    subtitle =
      "Ingresa tu correo y te enviaremos un código de recuperación (en esta demo se mostrará en pantalla).";
  } else if (isReset) {
    title = "Introduce tu nuevo password";
    subtitle = "Escribe el código de recuperación y tu nueva contraseña.";
  } else if (isTwoFactor) {
    title = "Verificación en dos pasos";
    subtitle =
      "Introduce el código de 6 dígitos enviado a tu correo (en esta demo lo verás abajo).";
  }

  return (
    <div className="max-w-md mx-auto mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-2 text-center">{title}</h1>
      <p className="text-xs text-slate-300 mb-4 text-center">{subtitle}</p>

      {info && (
        <p className="text-[11px] text-emerald-300 mb-2 text-center">{info}</p>
      )}

      {demoCode && (
        <p className="text-[11px] text-yellow-300 mb-3 text-center">
          <strong>Código (demo):</strong> {demoCode}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de acceso">
        {/* CAMPOS PARA REGISTRO */}
        {isRegister && (
          <>
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

            <div className="space-y-1">
              <label htmlFor="institution" className="text-xs text-slate-200">
                Institución
              </label>
              <input
                id="institution"
                type="text"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Universidad / Colegio"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </>
        )}

        {/* EMAIL (login, register, forgot) */}
        {(isLogin || isRegister || isForgot) && (
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
        )}

        {/* PASSWORD para login/register */}
        {(isLogin || isRegister) && (
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
        )}

        {/* SOLO OLVIDÉ CONTRASEÑA (primer paso) */}
        {isForgot && (
          <p className="text-[11px] text-slate-400">
            Te mostraremos un código en pantalla para esta demo. En producción se
            enviaría por correo.
          </p>
        )}

        {/* FORMULARIO STEP RESET */}
        {isReset && (
          <>
            <div className="space-y-1">
              <label htmlFor="resetCode" className="text-xs text-slate-200">
                Código de recuperación
              </label>
              <input
                id="resetCode"
                type="text"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: 123456"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="newPassword" className="text-xs text-slate-200">
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Al menos 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {/* FORMULARIO 2FA */}
        {isTwoFactor && (
          <div className="space-y-1">
            <label htmlFor="twoFactorCode" className="text-xs text-slate-200">
              Código de verificación
            </label>
            <input
              id="twoFactorCode"
              type="text"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 123456"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
            />
          </div>
        )}

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
            : isLogin
            ? "Entrar al panel de bienestar"
            : isRegister
            ? "Crear cuenta y entrar"
            : isForgot
            ? "Enviar código"
            : isReset
            ? "Cambiar contraseña"
            : "Verificar código"}
        </button>
      </form>

      {/* LINKS INFERIORES SEGÚN MODO */}
      <div className="mt-4 text-center space-y-1">
        {isLogin && (
          <>
            <button
              type="button"
              className="block w-full text-[11px] text-indigo-300 hover:text-indigo-200 underline"
              onClick={() => {
                resetMessages();
                setMode("register");
              }}
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
            <button
              type="button"
              className="block w-full text-[11px] text-slate-300 hover:text-slate-200 underline"
              onClick={() => {
                resetMessages();
                setMode("forgot");
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        )}

        {isRegister && (
          <button
            type="button"
            className="text-[11px] text-indigo-300 hover:text-indigo-200 underline"
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        )}

        {(isForgot || isReset || isTwoFactor) && (
          <button
            type="button"
            className="text-[11px] text-indigo-300 hover:text-indigo-200 underline"
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
          >
            Volver a iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
};
