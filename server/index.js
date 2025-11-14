require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Ajusta el origin si usas otro puerto en el frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-demo";

// "Base de datos" en memoria (solo demo)
const users = []; // { id, name, email, passwordHash }
const checkins = []; // { id, userId, mood, note, createdAt }

// Crea un token JWT
function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Middleware de autenticación
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

// Registro
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
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
  };
  users.push(newUser);

  const token = createToken(newUser);
  res.json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

// Login
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

  const token = createToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Perfil + estadísticas
app.get("/me", authMiddleware, (req, res) => {
  const userCheckins = checkins.filter((c) => c.userId === req.user.id);
  const totalCheckins = userCheckins.length;

  const last7days = userCheckins.filter(
    (c) => Date.now() - c.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  );

  const stats = {
    totalCheckins,
    averageMood: "😊", // podrías calcular algo real según los moods
    chatbotSessions: last7days.length > 0 ? 8 : 0, // demo
    streak: totalCheckins > 0 ? 5 : 0, // demo
  };

  res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email },
    stats,
  });
});

// Crear check-in
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

// Obtener check-ins del usuario (por si luego los quieres listar)
app.get("/checkins", authMiddleware, (req, res) => {
  const userCheckins = checkins.filter((c) => c.userId === req.user.id);
  res.json({ checkins: userCheckins });
});

// Chatbot muy simple (sin API externa, pero con lógica empática básica)
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

  if (lower.includes("ansioso") || lower.includes("ansiosa") || lower.includes("ansiedad")) {
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

app.listen(PORT, () => {
  console.log(`API EmoAI escuchando en http://localhost:${PORT}`);
});
