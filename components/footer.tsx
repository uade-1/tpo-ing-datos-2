"use client"

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useInstitution } from "@/components/institution-provider"

/**
 * CUSTOMIZATION: Update contact information, social links, and footer content
 * Replace with institution-specific details
 */
export function Footer() {
  const inst = useInstitution()
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About section */}
          <div>
            <div className="flex items-center gap-2">
              {inst.theme?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={inst.theme.logo_url} alt={inst.nombre} className="h-8 w-8 rounded object-contain" />
              ) : (
                <div className="h-8 w-8 rounded bg-primary-foreground/10" aria-hidden="true" />
              )}
              <span className="text-lg font-semibold">{inst.nombre}</span>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
              {inst.theme?.mensajes?.subtitulo_bienvenida ||
                "Empoderando estudiantes para alcanzar sus sueños académicos a través de programas integrales de becas y apoyo inquebrantable."}
            </p>
            {/* CUSTOMIZATION POINT: Update social media links */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold">Enlaces Rápidos</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {/* CUSTOMIZATION POINT: Update footer links */}
              <li>
                <a
                  href="#programs"
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Programas de Becas
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Beneficios y Apoyo
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Proceso de Solicitud
                </a>
              </li>
              <li>
                <a href="#faq" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                  Portal Estudiantil
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold">Contáctanos</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {/* CUSTOMIZATION POINT: Update contact information */}
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/80" aria-hidden="true" />
                <span className="text-primary-foreground/80">
                  123 University Avenue
                  <br />
                  City, State 12345
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary-foreground/80" aria-hidden="true" />
                <a
                  href="tel:+1234567890"
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary-foreground/80" aria-hidden="true" />
                <a
                  href="mailto:scholarships@institution.edu"
                  className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  scholarships@institution.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold">Mantente Informado</h3>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Suscríbete para recibir actualizaciones de becas y recordatorios de solicitudes.
            </p>
            <form className="mt-4 flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
                aria-label="Email for newsletter"
              />
              <Button variant="secondary" size="sm" className="w-full">
                Suscribirse
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/80 md:flex-row">
            <p>{inst.theme?.mensajes?.texto_footer || "© 2025 Nombre de la Institución. Todos los derechos reservados."}</p>
            <div className="flex gap-6">
              {/* CUSTOMIZATION POINT: Update legal links */}
              <a href="#" className="transition-colors hover:text-primary-foreground">
                Política de Privacidad
              </a>
              <a href="#" className="transition-colors hover:text-primary-foreground">
                Términos de Servicio
              </a>
              <a href="#" className="transition-colors hover:text-primary-foreground">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
