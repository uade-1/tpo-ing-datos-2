export type InstitutionTheme = {
  logo_url?: string;
  favicon_url?: string;
  colores?: {
    primario?: string;
    secundario?: string;
    acento?: string;
    texto_primario?: string;
  };
  mensajes?: {
    titulo_bienvenida?: string;
    subtitulo_bienvenida?: string;
    texto_footer?: string;
  };
};

export type Carrera = {
  nombre: string;
};

export type Departamento = {
  nombre: string;
  carreras: Carrera[];
};

export type Institution = {
  nombre: string;
  slug: string;
  descripcion?: string;
  configuracion_tema?: InstitutionTheme;
  departamentos?: Departamento[];
};

export async function fetchInstitutionBySlug(slug: string): Promise<Institution | null> {
  try {
    // Use relative URL since we have rewrite in next.config.mjs to proxy to backend
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window === "undefined" ? "http://localhost:3000" : "");
    const res = await fetch(`${baseUrl}/api/v1/instituciones/${encodeURIComponent(slug)}`, {
      // Force dynamic fetch at request time for SSR
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[get-institution] Failed to fetch institution ${slug}: ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json().catch(() => null);
    // Expect shape { success: true, data: institution }
    const institution = json?.data ?? null;
    if (institution) {
      console.log(`[get-institution] Fetched ${slug}:`, institution.nombre, "logo_url:", institution.configuracion_tema?.logo_url);
    }
    return institution;
  } catch (error) {
    console.error(`[get-institution] Error fetching ${slug}:`, error);
    return null;
  }
}


