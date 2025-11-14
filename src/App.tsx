import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { AuthForm } from "./AuthForm";
import { EmotionCheckinCard } from "./EmotionCheckinCard";
import { ChatbotPanel } from "./ChatbotPanel";
import { StatCard } from "./StatCard";
import { fetchMe, Stats, User } from "./api";


const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar token guardado
  useEffect(() => {
    const saved = localStorage.getItem("emoai_token");
    if (saved) {
      setToken(saved);
      loadProfile(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(jwt: string) {
    try {
      setLoadingProfile(true);
      setError(null);
      const data = await fetchMe(jwt);
      setUser(data.user);
      setStats(data.stats);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar perfil");
      setUser(null);
      setStats(null);
    } finally {
      setLoadingProfile(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
    setStats(null);
    localStorage.removeItem("emoai_token");
  }

  const isAuthenticated = !!token && !!user;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={user?.name || "Estudiante EmoAI"}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {!isAuthenticated ? (
          <section aria-label="Autenticación">
            <AuthForm
              onAuthSuccess={async (jwt) => {
                setToken(jwt);
                localStorage.setItem("emoai_token", jwt);
                await loadProfile(jwt);
              }}
            />
          </section>
        ) : (
          <>
            {/* Encabezado */}
            <section className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Bienvenida, {user!.name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                Este es tu panel de bienestar emocional. Aquí puedes registrar tu estado de ánimo,
                hablar con el chatbot y ver tus avances.
              </p>
              {loadingProfile && (
                <p className="text-xs text-slate-400">
                  Cargando información de tu cuenta…
                </p>
              )}
              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}
            </section>

            {/* Tarjetas de resumen */}
            <section
              aria-label="Resumen de bienestar"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <StatCard
                title="Check-ins este mes"
                value={stats ? String(stats.totalCheckins) : "0"}
                subtitle={
                  stats && stats.totalCheckins > 0
                    ? "Excelente constancia 💪"
                    : "Empieza registrando tu ánimo"
                }
              />
              <StatCard
                title="Estado promedio"
                value={stats?.averageMood || "😐"}
                subtitle="Tendencia general"
              />
              <StatCard
                title="Sesiones con chatbot"
                value={stats ? String(stats.chatbotSessions) : "0"}
                subtitle="Últimos 7 días"
              />
              <StatCard
                title="Racha de bienestar"
                value={stats ? `${stats.streak} días` : "0 días"}
                subtitle="Días sin crisis"
              />
            </section>

            {/* Check-in + Chatbot (chat más ancho) */}
            <section
              aria-label="Interacción principal"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <EmotionCheckinCard
                token={token!}
                onCheckinSaved={() => loadProfile(token!)}
              />
              <div className="lg:col-span-2">
                <ChatbotPanel token={token!} />
              </div>
            </section>

            {/* Funciones futuras */}
            <section
              aria-label="Funciones avanzadas"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Mapa de calor emocional (próximamente)
                </h2>
                <p className="text-sm text-slate-300">
                  Aquí podrás ver las zonas y horarios de mayor tensión emocional,
                  basadas en datos agregados y anónimos.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Gamificación de bienestar (próximamente)
                </h2>
                <p className="text-sm text-slate-300">
                  Suma puntos por realizar check-ins, practicar ejercicios de calma
                  y participar en actividades. Desbloquea logros y recompensas.
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
