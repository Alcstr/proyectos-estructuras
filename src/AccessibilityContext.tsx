import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  focusOutline: boolean;
  ttsEnabled: boolean;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReduceMotion: () => void;
  toggleFocusOutline: () => void;
  toggleTtsEnabled: () => void;
  speak: (text: string) => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  focusOutline: true, // por defecto activado
  ttsEnabled: false,
};

const STORAGE_KEY = "emoai_accessibility_settings";

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(
  undefined
);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Error leyendo ajustes de accesibilidad:", e);
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Error guardando ajustes de accesibilidad:", e);
    }
  }, [settings]);

  const toggleHighContrast = () =>
    setSettings((s) => ({ ...s, highContrast: !s.highContrast }));

  const toggleLargeText = () =>
    setSettings((s) => ({ ...s, largeText: !s.largeText }));

  const toggleReduceMotion = () =>
    setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }));

  const toggleFocusOutline = () =>
    setSettings((s) => ({ ...s, focusOutline: !s.focusOutline }));

  const toggleTtsEnabled = () =>
    setSettings((s) => ({ ...s, ttsEnabled: !s.ttsEnabled }));

  const speak = useCallback(
    (text: string) => {
      if (!settings.ttsEnabled) return;
      if (typeof window === "undefined") return;
      const synth = window.speechSynthesis;
      if (!synth) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;

      synth.cancel();
      synth.speak(utterance);
    },
    [settings.ttsEnabled]
  );

  const anyEnabled =
    settings.highContrast ||
    settings.largeText ||
    settings.reduceMotion ||
    settings.focusOutline ||
    settings.ttsEnabled;

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleHighContrast,
        toggleLargeText,
        toggleReduceMotion,
        toggleFocusOutline,
        toggleTtsEnabled,
        speak,
      }}
    >
      <div
        data-accessible={anyEnabled ? "true" : "false"}
        data-ac-high-contrast={settings.highContrast ? "true" : "false"}
        data-ac-large-text={settings.largeText ? "true" : "false"}
        data-ac-reduce-motion={settings.reduceMotion ? "true" : "false"}
        data-ac-focus-outline={settings.focusOutline ? "true" : "false"}
        data-ac-tts-enabled={settings.ttsEnabled ? "true" : "false"}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility debe usarse dentro de AccessibilityProvider");
  }
  return ctx;
};
