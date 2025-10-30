"use client"

import { useEffect } from "react"
import { useInstitution } from "./institution-provider"

export function ThemeInjector() {
  const inst = useInstitution()
  const colores = inst.theme?.colores

  useEffect(() => {
    if (!colores) return

    // Create or update style element
    let styleEl = document.getElementById("institution-theme-colors")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "institution-theme-colors"
      document.head.appendChild(styleEl)
    }

    // Apply theme colors
    styleEl.textContent = `
      :root {
        --inst-primary-hex: ${colores.primario || ""};
        --inst-secondary-hex: ${colores.secundario || colores.primario || ""};
        --inst-accent-hex: ${colores.acento || colores.primario || ""};
        --inst-text-primary-hex: ${colores.texto_primario || ""};
      }
      .bg-primary { background-color: var(--inst-primary-hex) !important; }
      .text-primary { color: var(--inst-primary-hex) !important; }
      .border-primary { border-color: var(--inst-primary-hex) !important; }
      .bg-accent { background-color: var(--inst-accent-hex) !important; }
      .text-accent { color: var(--inst-accent-hex) !important; }
      .bg-secondary { background-color: var(--inst-secondary-hex) !important; }
      button.bg-primary, .bg-primary button { background-color: var(--inst-primary-hex) !important; }
    `
  }, [colores])

  return null
}

