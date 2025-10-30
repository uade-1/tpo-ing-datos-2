"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInstitution } from "@/components/institution-provider";

const STEPS = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about you",
  },
  {
    id: 2,
    title: "Academic Information",
    description: "Your educational background",
  },
];

export function ApplicationForm() {
  const inst = useInstitution();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dniCheckError, setDniCheckError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [materiaOpen, setMateriaOpen] = useState(false);
  const [departamentoOpen, setDepartamentoOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isCheckingDni, setIsCheckingDni] = useState(false);

  type Carrera = { key: string; label: string };
  type Departamento = { key: string; label: string; carreras: Carrera[] };
  const DEPARTAMENTOS: Departamento[] = [
    {
      key: "tecnologia",
      label: "Tecnología",
      carreras: [
        { key: "ingenieria-en-sistemas", label: "Ingeniería en Sistemas" },
        { key: "ingenieria-informatica", label: "Ingeniería Informática" },
        { key: "desarrollo-de-software", label: "Desarrollo de Software" },
      ],
    },
    {
      key: "administracion",
      label: "Administración",
      carreras: [
        {
          key: "administracion-de-empresas",
          label: "Administración de Empresas",
        },
        { key: "gestion-administrativa", label: "Gestión Administrativa" },
        { key: "administracion-publica", label: "Administración Pública" },
      ],
    },
  ];

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    dni: "",
    materia: "",
    departamento: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Academic Information
    currentInstitution: "",
    currentLevel: "",
    fieldOfStudy: "",
    gpa: "",
    expectedGraduation: "",
    intendedMajor: "",

    // Background & Eligibility
    citizenship: "",
    residencyStatus: "",
    firstGeneration: "",
    householdIncome: "",
    financialAidReceived: "",

    // Statement of Purpose
    statementOfPurpose: "",
    careerGoals: "",
    whyScholarship: "",

    // Documents
    transcript: null,
    recommendationLetter: null,
    additionalDocuments: null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const checkDNI = async (dni: string) => {
    if (!dni || dni.length < 7) return;
    // Require selected materia to perform carrera-specific Redis check
    if (!formData.materia) return;

    try {
      const res = await fetch(
        `/api/v1/enrollment/check/${encodeURIComponent(
          dni
        )}?carrera_interes=${encodeURIComponent(formData.materia)}`
      );
      const json = await res.json().catch(() => null);

      if (!res.ok || json?.success === false) {
        setDniCheckError(
          json?.data?.message || json?.message || "No se pudo verificar el DNI."
        );
        return;
      }

      const enrolled =
        json?.data?.status === "ENROLLED" || json?.data?.available === false;
      if (enrolled) {
        setDniCheckError(
          json?.data?.message || "DNI ya inscripto en la carrera seleccionada."
        );
      } else {
        setDniCheckError(null);
      }
    } catch (error) {
      console.error("[v0] DNI check error:", error);
    }
  };

  const nextStep = async () => {
    setStepError(null);

    if (currentStep === 1) {
      const dniIsValid = /^\d{7,}$/.test(formData.dni.trim());
      if (!dniIsValid) {
        setStepError(
          "Por favor ingrese un DNI válido (solo números, mínimo 7 dígitos)."
        );
        return;
      }
      if (dniCheckError) {
        setStepError("El DNI ingresado ya está registrado. Utilice otro.");
        return;
      }
      if (!formData.materia) {
        setStepError("Seleccione una carrera para continuar.");
        return;
      }

      // Backend Redis availability check for DNI + materia
      try {
        setIsCheckingDni(true);
        const res = await fetch(
          `/api/v1/enrollment/check/${encodeURIComponent(
            formData.dni
          )}?carrera_interes=${encodeURIComponent(formData.materia)}`
        );
        const json = await res.json().catch(() => null);

        const notOk = !res.ok || json?.success === false;
        const enrolled =
          json?.data?.status === "ENROLLED" || json?.data?.available === false;
        if (notOk || enrolled) {
          setStepError(
            json?.data?.message ||
              json?.message ||
              "DNI ya inscripto en la carrera seleccionada."
          );
          return;
        }
      } catch (err) {
        setStepError(
          "No se pudo verificar la disponibilidad. Intente nuevamente."
        );
        return;
      } finally {
        setIsCheckingDni(false);
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate step 2 required fields
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.gender ||
        !formData.email
      ) {
        throw new Error(
          "Complete nombre, apellido, género y email antes de enviar."
        );
      }

      const institucionSlug = inst.slug;

      const idPostulante = `EST${Date.now()}`;

      const apiPayload: Record<string, any> = {
        id_postulante: idPostulante,
        nombre: formData.firstName,
        apellido: formData.lastName,
        sexo:
          formData.gender === "male"
            ? "masculino"
            : formData.gender === "female"
            ? "femenino"
            : "otro",
        dni: formData.dni,
        mail: formData.email,
        departamento_interes: formData.departamento,
        carrera_interes: formData.materia,
        fecha_interes: new Date().toISOString(),
        fecha_entrevista: new Date().toISOString(),
        fecha_inscripcion: new Date().toISOString(),
        estado: "INTERES",
        institucion_slug: institucionSlug,
      };

      // Do NOT include documentos when not available to satisfy backend optional validation

      console.log("[v0] Submitting application:", apiPayload);

      const response = await fetch("/api/v1/enrollment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message ||
          errorData?.error?.message ||
          "Failed to submit application";
        throw new Error(message);
      }

      const result = await response.json();
      console.log("[v0] Application submitted successfully:", result);

      alert(
        result?.data?.message ||
          "Application submitted successfully! You will receive a confirmation email shortly."
      );

      // window.location.href = "/application-success"
    } catch (error) {
      console.error("[v0] Submission error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="hidden text-xs font-medium md:block">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {(submitError || stepError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{stepError ?? submitError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: DNI + Carrera + Departamento */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">
                    Ingrese su DNI <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={(e) => updateFormData("dni", e.target.value)}
                    onBlur={(e) => checkDNI(e.target.value)}
                    placeholder="12345678"
                    pattern="[0-9]+"
                    title="Ingrese solo números"
                  />
                  {dniCheckError && (
                    <p className="text-sm text-destructive">{dniCheckError}</p>
                  )}
                </div>

                {/* Departamento */}
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  {isClient ? (
                    <Popover
                      open={departamentoOpen}
                      onOpenChange={setDepartamentoOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          id="departamento"
                          type="button"
                          variant="outline"
                          className="justify-between"
                        >
                          {formData.departamento ||
                            "Seleccione un departamento"}
                          <ChevronRight className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar departamento..." />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron departamentos.
                            </CommandEmpty>
                            <CommandGroup>
                              {DEPARTAMENTOS.map((d) => (
                                <CommandItem
                                  key={d.key}
                                  onSelect={() => {
                                    const carrerasLabels = d.carreras.map(
                                      (c) => c.label
                                    );
                                    setDepartamentoOpen(false);
                                    updateFormData("departamento", d.label);
                                    if (
                                      !carrerasLabels.includes(formData.materia)
                                    ) {
                                      updateFormData("materia", "");
                                    }
                                  }}
                                  value={d.key}
                                >
                                  {d.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      id="departamento"
                      type="button"
                      variant="outline"
                      className="justify-between"
                      disabled
                    >
                      {formData.departamento || "Seleccione un departamento"}
                      <ChevronRight className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                    </Button>
                  )}
                </div>

                {/* Carrera */}
                <div className="space-y-2">
                  <Label htmlFor="materia">
                    Carrera <span className="text-destructive">*</span>
                  </Label>
                  {isClient ? (
                    <Popover open={materiaOpen} onOpenChange={setMateriaOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="materia"
                          type="button"
                          variant="outline"
                          className="justify-between"
                        >
                          {formData.materia || "Seleccione una carrera"}
                          <ChevronRight className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar carrera..." />
                          <CommandList>
                            {formData.departamento ? (
                              <CommandGroup>
                                {(
                                  DEPARTAMENTOS.find(
                                    (d) => d.label === formData.departamento
                                  )?.carreras || []
                                ).map((c) => (
                                  <CommandItem
                                    key={c.key}
                                    onSelect={() => {
                                      updateFormData("materia", c.label);
                                      setMateriaOpen(false);
                                    }}
                                    value={c.key}
                                  >
                                    {c.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ) : (
                              <CommandEmpty>
                                Seleccione un departamento primero.
                              </CommandEmpty>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      id="materia"
                      type="button"
                      variant="outline"
                      className="justify-between"
                      disabled
                    >
                      {formData.materia || "Seleccione una carrera"}
                      <ChevronRight className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        updateFormData("firstName", e.target.value)
                      }
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                    required
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>
            )}

            {/* Steps 3-5 removed */}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || isCheckingDni}
            >
              {currentStep === 1
                ? isCheckingDni
                  ? "Verificando..."
                  : "Aplicar"
                : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="font-medium"
              disabled={
                isSubmitting ||
                !!dniCheckError ||
                (currentStep === STEPS.length &&
                  (!formData.firstName ||
                    !formData.lastName ||
                    !formData.gender ||
                    !formData.email))
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
