// server/index.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

/* ==========================
   CONFIGURACIÓN BÁSICA
   ========================== */

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-dev";

// Si pones CORS_ORIGIN en Render, se usará eso.
// Si no, permite todo (*) para pruebas.
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.get("/", (req, res) => {
  res.send("Backend EmoAI funcionando correctamente ✔️");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});




app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

/* Rutas de prueba / salud */
app.get("/", (req, res) => {
  res.send("EmoAI API funcionando ✅");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

/* ==========================
   "BASE DE DATOS" EN MEMORIA
   ========================== */

// En producción usarías MongoDB / Postgres, etc.
const users = []; // { id, name, email, passwordHash, institution, avatarUrl, twoFactorEnabled, twoFactorCode, twoFactorCodeExpires, resetCode, resetCodeExpires }
const checkins = []; // { id, userId, mood, note, createdAt }

/* ==========================
   UTILIDADES
   ========================== */

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

/* ==========================
   AUTENTICACIÓN BÁSICA
   ========================== */

// Registro
app.post("/auth/register", async (req, res) => {
  const { name, email, password, institution } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    name: name || "Estudiante EmoAI",
    email,
    passwordHash,
    institution: institution || "",
    avatarUrl: null,
    twoFactorEnabled: false,
    twoFactorCode: null,
    twoFactorCodeExpires: null,
    resetCode: null,
    resetCodeExpires: null,
  };

  users.push(newUser);

  const token = createToken(newUser);
  res.json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      institution: newUser.institution,
      avatarUrl: newUser.avatarUrl,
    },
  });
});

// Login (puede requerir 2FA)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "Credenciales inválidas" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: "Credenciales inválidas" });
  }

  // Si NO tiene 2FA activo → login normal
  if (!user.twoFactorEnabled) {
    const token = createToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        institution: user.institution,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  // Si tiene 2FA activo → generar código y pedir verificación
  const code = generateCode();
  user.twoFactorCode = code;
  user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // En producción se enviaría por correo/SMS. Aquí lo devolvemos para demo.
  return res.json({
    requires2fa: true,
    message:
      "Se ha enviado un código de verificación a tu correo (en esta demo se muestra directamente).",
    code, // ⚠️ solo para demo académica
  });
});

// Verificar 2FA
app.post("/auth/verify-2fa", (req, res) => {
  const { email, code } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user || !user.twoFactorCode) {
    return res.status(400).json({ error: "Código inválido" });
  }

  if (user.twoFactorCode !== code) {
    return res.status(400).json({ error: "Código incorrecto" });
  }

  if (user.twoFactorCodeExpires && user.twoFactorCodeExpires < new Date()) {
    return res.status(400).json({ error: "El código ha expirado" });
  }

  // Limpiar código
  user.twoFactorCode = null;
  user.twoFactorCodeExpires = null;

  const token = createToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      institution: user.institution,
      avatarUrl: user.avatarUrl,
    },
  });
});

/* ==========================
   OLVIDÉ MI CONTRASEÑA
   ========================== */

// Solicitar código de reseteo
app.post("/auth/request-password-reset", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);

  // Por seguridad, respondemos lo mismo exista o no
  if (!user) {
    return res.json({
      message:
        "Si el correo está registrado, se ha enviado un código de recuperación.",
    });
  }

  const code = generateCode();
  user.resetCode = code;
  user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // En prod se enviaría por correo; aquí lo devolvemos para demo
  return res.json({
    message:
      "Se ha generado un código de recuperación (en una app real se enviaría a tu correo).",
    code, // ⚠️ solo para la demo
  });
});

// Resetear contraseña con código
app.post("/auth/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !user.resetCode) {
    return res.status(400).json({ error: "Datos de recuperación inválidos" });
  }

  if (user.resetCode !== code) {
    return res.status(400).json({ error: "Código incorrecto" });
  }

  if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
    return res.status(400).json({ error: "El código ha expirado" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  user.resetCode = null;
  user.resetCodeExpires = null;

  return res.json({ message: "Contraseña actualizada correctamente." });
});

/* ==========================
   PERFIL + STATS
   ========================== */

app.get("/me", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const userCheckins = checkins.filter((c) => c.userId === user.id);
  const totalCheckins = userCheckins.length;

  const last7days = userCheckins.filter(
    (c) => Date.now() - c.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  );

  const stats = {
    totalCheckins,
    averageMood: "😊", // podrías calcularlo real más adelante
    chatbotSessions: last7days.length > 0 ? 8 : 0, // demo
    streak: totalCheckins > 0 ? 5 : 0, // demo
  };

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      institution: user.institution,
      avatarUrl: user.avatarUrl,
    },
    stats,
  });
});

/* ==========================
   CHECK-INS
   ========================== */

app.post("/checkins", authMiddleware, (req, res) => {
  const { mood, note } = req.body;
  if (!mood) {
    return res.status(400).json({ error: "Mood requerido" });
  }

  const newCheckin = {
    id: checkins.length + 1,
    userId: req.user.id,
    mood,
    note: note || "",
    createdAt: new Date(),
  };

  checkins.push(newCheckin);
  res.status(201).json({ checkin: newCheckin });
});

app.get("/checkins", authMiddleware, (req, res) => {
  const userCheckins = checkins.filter((c) => c.userId === req.user.id);
  res.json({ checkins: userCheckins });
});

/* ==========================
   CHATBOT SIMPLE
   ========================== */

app.post("/chat", authMiddleware, (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Mensaje de texto requerido" });
  }

  let reply =
    "Gracias por compartir cómo te sientes. Recuerda que tus emociones son válidas. " +
    "Puedes probar un ejercicio de respiración profunda: inhala 4 segundos, retén 4, exhala 6. " +
    "Si quieres, cuéntame un poco más de lo que está pasando.";

  const lower = text.toLowerCase();

  if (
    lower.includes("ansioso") ||
    lower.includes("ansiosa") ||
    lower.includes("ansiedad")
  ) {
    reply =
      "Siento que te sientas ansioso/a 😔. La ansiedad es muy incómoda, pero no estás solo/a. " +
      "Puedes intentar enfocar tu atención en 5 cosas que ves, 4 que puedes tocar, 3 que puedes oír, 2 que puedes oler y 1 que puedas saborear. " +
      "¿Quieres que te acompañe con más ejercicios?";
  }

  if (lower.includes("triste") || lower.includes("deprimid")) {
    reply =
      "Lamento que te sientas triste 💜. A veces es importante permitirnos sentir esa tristeza sin juzgarnos. " +
      "Si te ayuda, puedes escribir qué es lo que más te pesa ahora mismo. Estoy aquí para leerte.";
  }

  if (lower.includes("feliz") || lower.includes("content")) {
    reply =
      "Me alegra mucho que te sientas bien 😄. Es valioso reconocer también los momentos positivos. " +
      "¿Hay algo que quieras celebrar o algo que haya salido bien hoy?";
  }

  res.json({ reply });
});

/* ==========================
   ARRANCAR SERVIDOR
   ========================== */

app.listen(PORT, () => {
  console.log(`API EmoAI escuchando en el puerto ${PORT}`);
});
