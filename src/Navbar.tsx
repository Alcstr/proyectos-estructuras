import React from "react";
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
  const { accessibleMode, toggleAccessibleMode } = useAccessibility();

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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAccessibleMode}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${
                accessibleMode
                  ? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
                  : "border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
          >
            {accessibleMode ? "Modo accesible: ON" : "Modo accesible"}
          </button>

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
