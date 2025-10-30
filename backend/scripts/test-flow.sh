#!/usr/bin/env bash

set -euo pipefail

# Simple helper to print section headers
section() {
  echo
  echo "============================================================"
  echo "== $1"
  echo "============================================================"
}

# Helper to perform curl with method, url, and optional data
req() {
  local method="$1"; shift
  local url="$1"; shift
  if [[ $# -gt 0 ]]; then
    curl -sS -X "$method" "$url" -H "Content-Type: application/json" -d "$*" | sed 's/^/  /'
  else
    curl -sS -X "$method" "$url" | sed 's/^/  /'
  fi
  echo
}

# Configurable base URL (override with BASE_URL env var)
: "${BASE_URL:=http://localhost:3001}"

# Unique suffix per run
UNIQ_TS="$(date +%s)"
UNIQ_RAND="$RANDOM"
UNIQ_SUFFIX="${UNIQ_TS}${UNIQ_RAND}"

# Test data (unique per run)
INSTITUCION_SLUG="universidad-buenos-aires-${UNIQ_SUFFIX}"
CARRERA_RAW="Ingeniería en Sistemas"
# URL-encoded carrera (Ingenier%C3%ADa%20en%20Sistemas)
CARRERA_ENC="Ingenier%C3%ADa%20en%20Sistemas"

EST_ID="EST${UNIQ_SUFFIX}"
# Generate an 8-digit DNI-like number
EST_DNI="$(( (RANDOM % 90000000) + 10000000 ))"
CHECK_DNI="$EST_DNI"

section "1) Create institución"
req POST "$BASE_URL/api/v1/instituciones" '{
  "slug": "'"$INSTITUCION_SLUG"'",
  "nombre": "Universidad de Buenos Aires",
  "estado": "ACTIVA",
  "configuracion_tema": {
    "logo_url": "https://example.com/logo.png",
    "favicon_url": null,
    "colores": {
      "primario": "#1e40af",
      "secundario": "#3b82f6",
      "acento": "#60a5fa",
      "texto_primario": "#1f2937"
    },
    "mensajes": {
      "titulo_bienvenida": "Bienvenido a UBA",
      "subtitulo_bienvenida": "Proceso de Admisión",
      "texto_footer": "© 2025 UBA"
    }
  }
}'

section "1b) Verify institución"
req GET "$BASE_URL/api/v1/instituciones"
req GET "$BASE_URL/api/v1/instituciones/$INSTITUCION_SLUG"

section "2) Enrollment pre-steps: subscribe + DNI check"
req POST "$BASE_URL/api/v1/enrollment/subscribe" '{
  "email": "estudiante+'"$UNIQ_SUFFIX"'@email.com",
  "institucion_slug": "'"$INSTITUCION_SLUG"'"
}'
req GET "$BASE_URL/api/v1/enrollment/check/$CHECK_DNI?carrera_interes=$CARRERA_ENC"

section "3) Submit full enrollment"
req POST "$BASE_URL/api/v1/enrollment/submit" '{
  "id_postulante": "'"$EST_ID"'",
  "nombre": "María",
  "apellido": "González",
  "sexo": "femenino",
  "dni": "'"$EST_DNI"'",
  "mail": "maria.gonzalez@email.com",
  "departamento_interes": "Facultad de Ingeniería",
  "carrera_interes": "'"$CARRERA_RAW"'",
  "fecha_interes": "2024-01-20T10:00:00Z",
  "fecha_entrevista": "2024-02-25T14:00:00Z",
  "estado": "INTERES",
  "documentos": {
    "dni_img": "dni_maria_gonzalez.jpg",
    "analitico_img": "analitico_maria_gonzalez.pdf"
  },
  "comite": {
    "comite_id": "COM002",
    "fecha_revision": "2024-02-28T16:00:00Z",
    "decision": "PENDIENTE",
    "comentarios": "Revisión en proceso"
  },
  "fecha_inscripcion": "2024-01-15T09:00:00Z",
  "institucion_slug": "'"$INSTITUCION_SLUG"'",
  "enrollment_status": "PENDING"
}'

section "4) Estudiantes: list, get, update estado"
req GET "$BASE_URL/api/v1/estudiantes"
req GET "$BASE_URL/api/v1/estudiantes/$EST_ID"
req PATCH "$BASE_URL/api/v1/estudiantes/$EST_ID" '{
  "estado": "ACEPTADO"
}'

section "5) Neo4j analytics"
req GET "$BASE_URL/api/v1/analytics/estudiante/$EST_DNI/carreras"
req GET "$BASE_URL/api/v1/analytics/carrera/$CARRERA_ENC/estudiantes"
req GET "$BASE_URL/api/v1/analytics/carrera/$CARRERA_ENC/estudiantes?estado=ACEPTADO"
req GET "$BASE_URL/api/v1/analytics/carrera/$CARRERA_ENC/estadisticas"
req GET "$BASE_URL/api/v1/analytics/estudiantes/multi-carrera"

section "6) Cassandra scholarships"
# Trigger manual registration to ensure presence, then allow a longer delay for Cassandra replication/indexing
req POST "$BASE_URL/api/v1/scholarships/register/$EST_DNI"
echo "  (Waiting 5s for Cassandra to settle...)"
sleep 5
req GET "$BASE_URL/api/v1/scholarships/$INSTITUCION_SLUG/2024/$EST_DNI"
req GET "$BASE_URL/api/v1/scholarships/$INSTITUCION_SLUG/2024"

section "7) Optional cleanup (comment out to keep data)"
# req -X DELETE "$BASE_URL/api/v1/estudiantes/$EST_ID"
# req -X DELETE "$BASE_URL/api/v1/instituciones/$INSTITUCION_SLUG"

echo
echo "Flow completed. Override BASE_URL to point elsewhere, e.g.: BASE_URL=http://localhost:3000 ./scripts/test-flow.sh"


