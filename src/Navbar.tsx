import React, { useState } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface NavbarProps {
  isAuthenticated: boolean;
  userName: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  userName,
  onLogout,
}) => {
  const {
    settings,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleFocusOutline,
    toggleTtsEnabled,
  } = useAccessibility();

  const [openMenu, setOpenMenu] = useState(false);

  const anyEnabled =
    settings.highContrast ||
    settings.largeText ||
    settings.reduceMotion ||
    settings.focusOutline ||
    settings.ttsEnabled;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 text-lg"
          >
            🤖
          </span>
          <div>
            <p className="font-semibold text-sm md:text-base">EmoAI</p>
            <p className="text-[11px] text-slate-400">
              Bienestar emocional con IA para estudiantes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* BOTÓN PRINCIPAL ACCESIBILIDAD */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((v) => !v)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2
                ${
                  anyEnabled
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
                    : "border-slate-700 text-slate-200 hover:bg-slate-800"
                }`}
            >
              {anyEnabled ? "Modo accesible: ON" : "Modo accesible"}
              <span aria-hidden="true" className="text-[10px]">
                ▾
              </span>
            </button>

            {/* PANEL DE OPCIONES */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl p-3 text-xs space-y-2 z-30">
                <p className="font-semibold text-slate-100 mb-1">
                  Opciones de accesibilidad
                </p>

                <AccessibilityToggle
                  label="Alto contraste"
                  description="Colores más marcados y bordes definidos."
                  active={settings.highContrast}
                  onToggle={toggleHighContrast}
                />

                <AccessibilityToggle
                  label="Texto grande"
                  description="Aumenta el tamaño de letra en todo EmoAI."
                  active={settings.largeText}
                  onToggle={toggleLargeText}
                />

                <AccessibilityToggle
                  label="Enfoque de teclado"
                  description="Resalta elementos cuando navegas con TAB."
                  active={settings.focusOutline}
                  onToggle={toggleFocusOutline}
                />

                <AccessibilityToggle
                  label="Reducir movimiento"
                  description="Minimiza transiciones y animaciones."
                  active={settings.reduceMotion}
                  onToggle={toggleReduceMotion}
                />

                <AccessibilityToggle
                  label="Lectura en voz alta"
                  description="Lee en voz alta las respuestas del chatbot."
                  active={settings.ttsEnabled}
                  onToggle={toggleTtsEnabled}
                />

                <p className="text-[10px] text-slate-500 mt-1">
                  Tus preferencias se guardan en este navegador.
                </p>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-300">
                {userName}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs px-3 py-1.5 rounded-full bg-red-500/90 hover:bg-red-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Inicia sesión para acceder a tu panel
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};

interface AccessibilityToggleProps {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

const AccessibilityToggle: React.FC<AccessibilityToggleProps> = ({
  label,
  description,
  active,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-900 text-left"
    >
      <div>
        <p className="font-medium text-[11px] text-slate-100">{label}</p>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
      <span
        aria-hidden="true"
        className={`inline-flex h-4 w-7 items-center rounded-full border text-[9px] px-0.5
          ${
            active
              ? "border-emerald-400 bg-emerald-500/30 justify-end"
              : "border-slate-600 bg-slate-800 justify-start"
          }`}
      >
        <span
          className={`h-3 w-3 rounded-full ${
            active ? "bg-emerald-300" : "bg-slate-400"
          }`}
        />
      </span>
    </button>
  );
};
