import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AccessibilityProvider } from "./AccessibilityContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </React.StrictMode>
);
