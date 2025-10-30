"use client";

import React, { createContext, useContext } from "react";
import type { Institution } from "@/lib/get-institution";

export type InstitutionContextValue = {
  slug: string;
  nombre: string;
  theme: Institution["configuracion_tema"];
};

const InstitutionContext = createContext<InstitutionContextValue | null>(null);

export function useInstitution(): InstitutionContextValue {
  const ctx = useContext(InstitutionContext);
  if (!ctx) throw new Error("useInstitution must be used within InstitutionProvider");
  return ctx;
}

export function InstitutionProvider({
  value,
  children,
}: {
  value: InstitutionContextValue;
  children: React.ReactNode;
}) {
  const colores = value.theme?.colores || {};
  const cssVars: React.CSSProperties = {
    // Provide CSS variables for theming
    // Fallbacks are left to Tailwind defaults
    ["--inst-primario" as any]: colores.primario,
    ["--inst-secundario" as any]: colores.secundario,
    ["--inst-acento" as any]: colores.acento,
    ["--inst-texto-primario" as any]: colores.texto_primario,
  } as React.CSSProperties;

  return (
    <InstitutionContext.Provider value={value}>
      <div style={cssVars}>{children}</div>
    </InstitutionContext.Provider>
  );
}


