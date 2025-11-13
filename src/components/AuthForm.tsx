import React, { useState } from "react";

interface AuthFormProps {
  onLogin: (name?: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(name || "Estudiante EmoAI");
  }

  return (
    <div className="max-w-md mx-auto mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-2 text-center">
        Inicia sesión en EmoAI
      </h1>
      <p className="text-xs text-slate-300 mb-4 text-center">
        Este acceso es solo para fines académicos y de demostración.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de acceso">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs text-slate-200">
            Nombre (opcional)
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

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Entrar al panel de bienestar
        </button>
      </form>
    </div>
  );
};
