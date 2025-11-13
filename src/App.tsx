import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AuthForm } from "./components/AuthForm";
import { EmotionCheckinCard } from "./components/EmotionCheckinCard";
import { ChatbotPanel } from "./components/ChatbotPanel";
import { StatCard } from "./components/StatCard";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Estudiante EmoAI");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {!isAuthenticated ? (
          <section aria-label="Autenticación">
            <AuthForm
              onLogin={(name) => {
                if (name) setUserName(name);
                setIsAuthenticated(true);
              }}
            />
          </section>
        ) : (
          <>
            {/* Encabezado del dashboard */}
            <section className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Bienvenida, {userName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                Este es tu panel de bienestar emocional. Aquí puedes registrar tu estado de ánimo,
                hablar con el chatbot y ver tus avances.
              </p>
            </section>

            {/* Tarjetas de resumen */}
            <section
              aria-label="Resumen de bienestar"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <StatCard
                title="Check-ins este mes"
                value="12"
                subtitle="Excelente constancia 💪"
              />
              <StatCard
                title="Estado promedio"
                value="😊"
                subtitle="Tendencia positiva"
              />
              <StatCard
                title="Sesiones con chatbot"
                value="8"
                subtitle="Últimos 7 días"
              />
              <StatCard
                title="Racha de bienestar"
                value="5 días"
                subtitle="Sin crisis detectadas"
              />
            </section>

            {/* Check-in + Chatbot */}
            <section
              aria-label="Interacción principal"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <EmotionCheckinCard />
              <ChatbotPanel />
            </section>

            {/* Placeholders futuras funciones */}
            <section
              aria-label="Funciones avanzadas"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Mapa de calor emocional (próximamente)
                </h2>
                <p className="text-sm text-slate-300">
                  Aquí podrás ver las zonas y horarios de mayor tensión emocional en el campus,
                  basadas en datos agregados y anónimos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Gamificación de bienestar (próximamente)
                </h2>
                <p className="text-sm text-slate-300">
                  Suma puntos por realizar check-ins, practicar ejercicios de calma y participar
                  en actividades. Desbloquea logros y recompensas.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        EmoAI • Proyecto universitario de bienestar emocional • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
