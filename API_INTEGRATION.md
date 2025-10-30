# API Integration Guide

This document explains how the scholarship application system integrates with the backend API.

## Configuration

Before deploying, you MUST update the institution slug in the following locations:

1. `lib/api-config.ts` - Update `INSTITUCION_SLUG` constant
2. Or set environment variable: `NEXT_PUBLIC_INSTITUCION_SLUG`

## API Endpoints Used

### 1. Email Subscription (Hero Section)
- **Endpoint**: `POST /api/v1/enrollment/subscribe`
- **Location**: `components/hero-section.tsx`
- **Purpose**: Capture email leads before full application
- **Payload**:
  \`\`\`json
  {
    "email": "user@example.com",
    "institucion_slug": "your-institution-slug"
  }
  \`\`\`

### 2. DNI Pre-Check (Application Form)
- **Endpoint**: `GET /api/v1/enrollment/check-dni`
- **Location**: `components/application-form.tsx`
- **Purpose**: Validate DNI isn't already registered
- **Query Params**: `?dni=12345678&institucion_slug=your-institution-slug`
- **Triggers**: On blur of DNI input field

### 3. Full Application Submission
- **Endpoint**: `POST /api/v1/enrollment/submit`
- **Location**: `components/application-form.tsx`
- **Purpose**: Submit complete application
- **Payload**: See API documentation for full structure

## Field Mapping

| Form Field | API Field | Required | Notes |
|------------|-----------|----------|-------|
| firstName | nombre | Yes | |
| lastName | apellido | Yes | |
| dni | dni | Yes | Validated on blur |
| email | mail | Yes | |
| gender | sexo | Yes | Mapped: male→masculino, female→femenino, other→otro |
| currentInstitution | departamento_interes | Yes | |
| intendedMajor | carrera_interes | Yes | |
| - | fecha_interes | Yes | Auto-generated (current date) |
| - | fecha_inscripcion | Yes | Auto-generated (current date) |
| - | estado | Yes | Always "INTERES" on submit |
| - | id_postulante | Yes | Auto-generated: EST{timestamp} |
| transcript | documentos.dni_img | Optional | File name only |
| recommendationLetter | documentos.analitico_img | Optional | File name only |

## Error Handling

All API calls include try-catch blocks with user-friendly error messages:
- Network errors
- Validation errors (e.g., duplicate DNI)
- Server errors

Errors are displayed using Alert components with appropriate styling.

## Testing

To test the integration:

1. Update `INSTITUCION_SLUG` in `lib/api-config.ts`
2. Ensure backend API is running and accessible
3. Test email subscription in hero section
4. Test DNI validation in application form
5. Submit complete application and verify in backend

## Customization Notes

- All API calls use relative URLs (assumes same domain)
- If API is on different domain, set `NEXT_PUBLIC_API_BASE_URL` environment variable
- Loading states and disabled buttons prevent duplicate submissions
- Success messages include automatic redirects where appropriate
