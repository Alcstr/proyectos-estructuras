import React, { createContext, useContext, useState } from "react";

interface AccessibilityContextValue {
  accessibleMode: boolean;
  toggleAccessibleMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(
  undefined
);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessibleMode, setAccessibleMode] = useState(false);

  const toggleAccessibleMode = () => {
    setAccessibleMode((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{ accessibleMode, toggleAccessibleMode }}>
      <div data-accessible={accessibleMode ? "true" : "false"}>{children}</div>
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
