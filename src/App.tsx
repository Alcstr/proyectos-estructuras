import { useEffect, useState } from "react";
import "./styles.css";

const emotions = ["Calm", "Happy", "Stressed", "Angry", "Neutral"];

export default function App() {
  const [active] = useState(false);
  const [emotion, setEmotion] = useState("Neutral");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEmotion =
        emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header>
        <h1> EMOAI</h1>
        <p>Intelligent Emotional Wellbeing & Conflict Prevention System</p>
      </header>

      <main>
        <section>
          <h2>System Status</h2>
          <p>
            <strong>System Active:</strong>{" "}
            {active ? "✅ Online" : "❌ Offline"}
          </p>
          <p>
            <strong>Detected Emotion:</strong> {emotion}
          </p>
        </section>
      </main>

      <footer>
        <p>© 2025 EMOAI – Smart Emotional Intelligence Project</p>
      </footer>
    </div>
  );
}
