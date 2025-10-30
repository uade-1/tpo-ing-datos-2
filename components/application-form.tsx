"use client";

import type React from "react";

import { useState } from "react";
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
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  {
    id: 3,
    title: "Background & Eligibility",
    description: "Additional information",
  },
  { id: 4, title: "Statement of Purpose", description: "Tell us your story" },
  {
    id: 5,
    title: "Documents & Review",
    description: "Upload required documents",
  },
];

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dniCheckError, setDniCheckError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [materiaOpen, setMateriaOpen] = useState(false);

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

    try {
      const institucionSlug = "your-institution-slug";
      const response = await fetch(
        `/api/v1/enrollment/check-dni?dni=${dni}&institucion_slug=${institucionSlug}`
      );

      if (!response.ok) {
        const data = await response.json();
        setDniCheckError(data.message || "This DNI is already registered");
      } else {
        setDniCheckError(null);
      }
    } catch (error) {
      console.error("[v0] DNI check error:", error);
    }
  };

  const nextStep = () => {
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
        setStepError("Seleccione una materia para continuar.");
        return;
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
      const institucionSlug = "your-institution-slug";

      const idPostulante = `EST${Date.now()}`;

      const apiPayload = {
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
        departamento_interes: formData.currentInstitution,
        carrera_interes: formData.intendedMajor,
        fecha_interes: new Date().toISOString(),
        fecha_inscripcion: new Date().toISOString(),
        estado: "INTERES",
        institucion_slug: institucionSlug,
        documentos: {
          dni_img: formData.transcript ? "transcript.pdf" : undefined,
          analitico_img: formData.recommendationLetter
            ? "recommendation.pdf"
            : undefined,
        },
      };

      console.log("[v0] Submitting application:", apiPayload);

      const response = await fetch("/api/v1/enrollment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const result = await response.json();
      console.log("[v0] Application submitted successfully:", result);

      alert(
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
            {/* Step 1: DNI + Materia */}
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

                <div className="space-y-2">
                  <Label htmlFor="materia">
                    Materia <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={materiaOpen} onOpenChange={setMateriaOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="materia"
                        type="button"
                        variant="outline"
                        className="justify-between"
                      >
                        {formData.materia
                          ? formData.materia === "matematica"
                            ? "Matemática"
                            : formData.materia === "programacion"
                            ? "Programación"
                            : formData.materia === "base-de-datos"
                            ? "Base de Datos"
                            : formData.materia
                          : "Seleccione una materia"}
                        <ChevronRight className="ml-2 h-4 w-4 rotate-90 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar materia..." />
                        <CommandList>
                          <CommandEmpty>
                            No se encontraron materias.
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                updateFormData("materia", "matematica");
                                setMateriaOpen(false);
                              }}
                              value="matematica"
                            >
                              Matemática
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                updateFormData("materia", "programacion");
                                setMateriaOpen(false);
                              }}
                              value="programacion"
                            >
                              Programación
                            </CommandItem>
                            <CommandItem
                              onSelect={() => {
                                updateFormData("materia", "base-de-datos");
                                setMateriaOpen(false);
                              }}
                              value="base-de-datos"
                            >
                              Base de Datos
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentInstitution">
                    Current Institution{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="currentInstitution"
                    required
                    value={formData.currentInstitution}
                    onChange={(e) =>
                      updateFormData("currentInstitution", e.target.value)
                    }
                    placeholder="University of Example"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLevel">
                    Current Academic Level{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.currentLevel}
                    onValueChange={(value) =>
                      updateFormData("currentLevel", value)
                    }
                  >
                    <SelectTrigger id="currentLevel">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="undergraduate-freshman">
                        Undergraduate - Freshman
                      </SelectItem>
                      <SelectItem value="undergraduate-sophomore">
                        Undergraduate - Sophomore
                      </SelectItem>
                      <SelectItem value="undergraduate-junior">
                        Undergraduate - Junior
                      </SelectItem>
                      <SelectItem value="undergraduate-senior">
                        Undergraduate - Senior
                      </SelectItem>
                      <SelectItem value="graduate-masters">
                        Graduate - Master's
                      </SelectItem>
                      <SelectItem value="graduate-phd">
                        Graduate - PhD
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">
                    Current Field of Study{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fieldOfStudy"
                    required
                    value={formData.fieldOfStudy}
                    onChange={(e) =>
                      updateFormData("fieldOfStudy", e.target.value)
                    }
                    placeholder="Computer Science"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">
                      Current GPA <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      required
                      value={formData.gpa}
                      onChange={(e) => updateFormData("gpa", e.target.value)}
                      placeholder="3.75"
                    />
                    <p className="text-xs text-muted-foreground">
                      On a 4.0 scale
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedGraduation">
                      Expected Graduation Date{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="expectedGraduation"
                      type="month"
                      required
                      value={formData.expectedGraduation}
                      onChange={(e) =>
                        updateFormData("expectedGraduation", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intendedMajor">
                    Intended Major/Program{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="intendedMajor"
                    required
                    value={formData.intendedMajor}
                    onChange={(e) =>
                      updateFormData("intendedMajor", e.target.value)
                    }
                    placeholder="Software Engineering"
                  />
                  <p className="text-xs text-muted-foreground">
                    If applying for scholarship, what program will you pursue?
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h3 className="mb-2 font-medium">Academic Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    Please list any academic honors, awards, or achievements
                    (optional)
                  </p>
                  <Textarea
                    className="mt-3"
                    placeholder="Dean's List, Honor Society memberships, academic competitions, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Background & Eligibility */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citizenship">
                    Citizenship Status{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.citizenship}
                    onValueChange={(value) =>
                      updateFormData("citizenship", value)
                    }
                  >
                    <SelectTrigger id="citizenship">
                      <SelectValue placeholder="Select citizenship status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">Citizen</SelectItem>
                      <SelectItem value="permanent-resident">
                        Permanent Resident
                      </SelectItem>
                      <SelectItem value="international">
                        International Student
                      </SelectItem>
                      <SelectItem value="refugee">Refugee/Asylee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residencyStatus">
                    State Residency Status{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.residencyStatus}
                    onValueChange={(value) =>
                      updateFormData("residencyStatus", value)
                    }
                  >
                    <SelectTrigger id="residencyStatus">
                      <SelectValue placeholder="Select residency status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-state">
                        In-State Resident
                      </SelectItem>
                      <SelectItem value="out-of-state">
                        Out-of-State Resident
                      </SelectItem>
                      <SelectItem value="international">
                        International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>
                    First-Generation College Student{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.firstGeneration}
                    onValueChange={(value) =>
                      updateFormData("firstGeneration", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="first-gen-yes" />
                      <Label htmlFor="first-gen-yes" className="font-normal">
                        Yes, I am the first in my family to attend college
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="first-gen-no" />
                      <Label htmlFor="first-gen-no" className="font-normal">
                        No, my parent(s)/guardian(s) attended college
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="householdIncome">
                    Annual Household Income{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.householdIncome}
                    onValueChange={(value) =>
                      updateFormData("householdIncome", value)
                    }
                  >
                    <SelectTrigger id="householdIncome">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25000">$0 - $25,000</SelectItem>
                      <SelectItem value="25001-50000">
                        $25,001 - $50,000
                      </SelectItem>
                      <SelectItem value="50001-75000">
                        $50,001 - $75,000
                      </SelectItem>
                      <SelectItem value="75001-100000">
                        $75,001 - $100,000
                      </SelectItem>
                      <SelectItem value="100001-150000">
                        $100,001 - $150,000
                      </SelectItem>
                      <SelectItem value="150001+">$150,001+</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This information is used for need-based scholarships
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>
                    Are you currently receiving financial aid?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.financialAidReceived}
                    onValueChange={(value) =>
                      updateFormData("financialAidReceived", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="aid-yes" />
                      <Label htmlFor="aid-yes" className="font-normal">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="aid-no" />
                      <Label htmlFor="aid-no" className="font-normal">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h3 className="mb-2 font-medium">Special Circumstances</h3>
                  <p className="text-sm text-muted-foreground">
                    Please describe any special circumstances that may affect
                    your financial need (optional)
                  </p>
                  <Textarea
                    className="mt-3"
                    placeholder="Family hardships, medical expenses, supporting dependents, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Statement of Purpose */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statementOfPurpose">
                    Statement of Purpose{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="statementOfPurpose"
                    required
                    value={formData.statementOfPurpose}
                    onChange={(e) =>
                      updateFormData("statementOfPurpose", e.target.value)
                    }
                    placeholder="Tell us about your academic journey, achievements, and what drives your passion for learning..."
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 250 words, maximum 500 words
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerGoals">
                    Career Goals and Aspirations{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="careerGoals"
                    required
                    value={formData.careerGoals}
                    onChange={(e) =>
                      updateFormData("careerGoals", e.target.value)
                    }
                    placeholder="Describe your career goals and how this scholarship will help you achieve them..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 150 words, maximum 300 words
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyScholarship">
                    Why Do You Need This Scholarship?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="whyScholarship"
                    required
                    value={formData.whyScholarship}
                    onChange={(e) =>
                      updateFormData("whyScholarship", e.target.value)
                    }
                    placeholder="Explain how this scholarship will impact your education and future..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 150 words, maximum 300 words
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-accent/50 p-4">
                  <h3 className="mb-2 font-medium">Writing Tips</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Be authentic and personal in your responses</li>
                    <li>• Provide specific examples and experiences</li>
                    <li>• Proofread carefully for grammar and spelling</li>
                    <li>• Show your passion and commitment to your field</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 5: Documents & Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transcript">
                      Official Transcript{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="transcript"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          updateFormData("transcript", e.target.files?.[0])
                        }
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PDF or Word document, max 10MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendationLetter">
                      Letter of Recommendation{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="recommendationLetter"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          updateFormData(
                            "recommendationLetter",
                            e.target.files?.[0]
                          )
                        }
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From a teacher, counselor, or mentor
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalDocuments">
                      Additional Documents (Optional)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="additionalDocuments"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) =>
                          updateFormData("additionalDocuments", e.target.files)
                        }
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awards, certificates, or other supporting documents
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Application Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Institution:
                      </span>
                      <span className="font-medium">
                        {formData.currentInstitution}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPA:</span>
                      <span className="font-medium">{formData.gpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Intended Major:
                      </span>
                      <span className="font-medium">
                        {formData.intendedMajor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I certify that all information provided is accurate and
                      complete <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By submitting this application, you agree to our terms and
                      conditions and acknowledge that false information may
                      result in disqualification.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            <Button type="button" onClick={nextStep} disabled={isSubmitting}>
              {currentStep === 1 ? "Aplicar" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="font-medium"
              disabled={isSubmitting || !!dniCheckError}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
