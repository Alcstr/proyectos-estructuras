import { getAIStatus } from "./app";

const statusDiv = document.getElementById("status")!;

function renderStatus() {
  const { active, emotion } = getAIStatus();
  statusDiv.innerHTML = `
    <p><strong>System Active:</strong> ${active ? "✅ Online" : "❌ Offline"}</p>
    <p><strong>Detected Emotion:</strong> ${emotion}</p>
  `;
}

// Actualiza cada 3 segundos
setInterval(renderStatus, 3000);
renderStatus();
