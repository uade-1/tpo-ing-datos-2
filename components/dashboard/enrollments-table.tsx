"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronDown, ChevronRight, CheckCircle, XCircle, Calendar } from "lucide-react";

interface Estudiante {
  _id: string;
  id_postulante: string;
  nombre: string;
  apellido: string;
  carrera_interes: string;
  departamento_interes: string;
  estado: "ENTREVISTA" | "INTERES" | "ACEPTADO" | "RECHAZADO";
  dni: string;
  mail: string;
  fecha_inscripcion: string;
  fecha_interes: string;
  fecha_entrevista?: string;
}

interface EnrollmentsTableProps {
  institucionSlug: string;
}

const estadoColors: Record<string, string> = {
  INTERES: "bg-blue-100 text-blue-800",
  ENTREVISTA: "bg-yellow-100 text-yellow-800",
  ACEPTADO: "bg-green-100 text-green-800",
  RECHAZADO: "bg-red-100 text-red-800",
};

// Calculate min date as tomorrow to only allow future dates (not today or past)
const getMinDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1); // Tomorrow
  return date.toISOString().split('T')[0];
};
const MIN_DATE = getMinDate();

export function EnrollmentsTable({ institucionSlug }: EnrollmentsTableProps) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [fechaEntrevistaValues, setFechaEntrevistaValues] = useState<Record<string, string>>({});

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Initialize fecha_entrevista value when expanding row
      const estudiante = estudiantes.find((e) => e._id === id);
      if (estudiante && estudiante.fecha_entrevista && !fechaEntrevistaValues[estudiante.id_postulante]) {
        const date = new Date(estudiante.fecha_entrevista);
        setFechaEntrevistaValues((prev) => ({
          ...prev,
          [estudiante.id_postulante]: date.toISOString().split('T')[0],
        }));
      }
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const updateEstudianteEstado = async (idPostulante: string, nuevoEstado: "ACEPTADO" | "RECHAZADO", comentarios: string) => {
    setUpdatingIds((prev) => new Set(prev).add(idPostulante));
    try {
      const res = await fetch(`/api/v1/estudiantes/${idPostulante}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
          comite: {
            decision: nuevoEstado,
            comentarios: comentarios,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update student status");
      }

      // Update local state
      setEstudiantes((prev) =>
        prev.map((est) =>
          est.id_postulante === idPostulante
            ? { ...est, estado: nuevoEstado }
            : est
        )
      );
    } catch (err) {
      console.error("Error updating student status:", err);
      alert(err instanceof Error ? err.message : "An error occurred while updating the student status");
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idPostulante);
        return newSet;
      });
    }
  };

  const handleAccept = (idPostulante: string) => {
    updateEstudianteEstado(idPostulante, "ACEPTADO", "Estudiante aceptado para la beca");
  };

  const handleReject = (idPostulante: string) => {
    updateEstudianteEstado(idPostulante, "RECHAZADO", "Estudiante rechazado");
  };

  const handleSetFechaEntrevista = async (idPostulante: string, fechaValue: string) => {
    if (!fechaValue) {
      alert("Please select a date");
      return;
    }

    setUpdatingIds((prev) => new Set(prev).add(idPostulante));
    try {
      const fechaISO = new Date(fechaValue).toISOString();
      const res = await fetch(`/api/v1/estudiantes/${idPostulante}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha_entrevista: fechaISO,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update interview date");
      }

      // Update local state
      setEstudiantes((prev) =>
        prev.map((est) =>
          est.id_postulante === idPostulante
            ? { ...est, fecha_entrevista: fechaISO }
            : est
        )
      );
    } catch (err) {
      console.error("Error updating fecha_entrevista:", err);
      alert(err instanceof Error ? err.message : "An error occurred while updating the interview date");
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idPostulante);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(
          `/api/v1/estudiantes/institucion/${encodeURIComponent(institucionSlug)}`
        );
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to fetch enrollments");
        }

        const estudiantesData = json.data || [];
        setEstudiantes(estudiantesData);
        
        // Initialize fecha_entrevista values for date inputs
        const fechaValues: Record<string, string> = {};
        estudiantesData.forEach((est: Estudiante) => {
          if (est.fecha_entrevista) {
            // Convert ISO date to YYYY-MM-DD format for date input
            const date = new Date(est.fecha_entrevista);
            fechaValues[est.id_postulante] = date.toISOString().split('T')[0];
          }
        });
        setFechaEntrevistaValues(fechaValues);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstudiantes();
  }, [institucionSlug]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
          <CardDescription>View and manage student enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Loading enrollments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
          <CardDescription>View and manage student enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-red-600">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollments</CardTitle>
        <CardDescription>
          {estudiantes.length} student{estudiantes.length !== 1 ? "s" : ""} enrolled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {estudiantes.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No enrollments found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantes.map((estudiante) => {
                const isExpanded = expandedRows.has(estudiante._id);
                return (
                  <React.Fragment key={estudiante._id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(estudiante._id)}
                          className="h-8 w-8 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {estudiante.nombre} {estudiante.apellido}
                      </TableCell>
                      <TableCell>{estudiante.carrera_interes}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            estadoColors[estudiante.estado] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {estudiante.estado}
                        </span>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-gray-50">
                          <div className="px-4 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">ID Postulante</p>
                                <p className="text-gray-600">{estudiante.id_postulante}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">DNI</p>
                                <p className="text-gray-600">{estudiante.dni}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Email</p>
                                <p className="text-gray-600">{estudiante.mail}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Nombre</p>
                                <p className="text-gray-600">{estudiante.nombre}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Apellido</p>
                                <p className="text-gray-600">{estudiante.apellido}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Departamento</p>
                                <p className="text-gray-600">{estudiante.departamento_interes}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Carrera</p>
                                <p className="text-gray-600">{estudiante.carrera_interes}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Fecha de Interés</p>
                                <p className="text-gray-600">{formatDate(estudiante.fecha_interes)}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Fecha de Inscripción</p>
                                <p className="text-gray-600">{formatDate(estudiante.fecha_inscripcion)}</p>
                              </div>
                              <div className="md:col-span-3">
                                <p className="font-semibold text-gray-700 mb-2">Fecha de Entrevista</p>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="date"
                                    value={fechaEntrevistaValues[estudiante.id_postulante] || ""}
                                    onChange={(e) => {
                                      setFechaEntrevistaValues((prev) => ({
                                        ...prev,
                                        [estudiante.id_postulante]: e.target.value,
                                      }));
                                    }}
                                    className="max-w-xs"
                                    disabled={updatingIds.has(estudiante.id_postulante)}
                                    min={MIN_DATE}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const fechaValue = fechaEntrevistaValues[estudiante.id_postulante];
                                      if (fechaValue) {
                                        handleSetFechaEntrevista(estudiante.id_postulante, fechaValue);
                                      }
                                    }}
                                    disabled={
                                      updatingIds.has(estudiante.id_postulante) ||
                                      !fechaEntrevistaValues[estudiante.id_postulante] ||
                                      fechaEntrevistaValues[estudiante.id_postulante] ===
                                        (estudiante.fecha_entrevista
                                          ? new Date(estudiante.fecha_entrevista).toISOString().split('T')[0]
                                          : "")
                                    }
                                    variant="outline"
                                  >
                                    {updatingIds.has(estudiante.id_postulante) ? (
                                      <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Guardando...
                                      </>
                                    ) : (
                                      <>
                                        <Calendar className="h-3 w-3 mr-1" />
                                        Guardar
                                      </>
                                    )}
                                  </Button>
                                </div>
                                {estudiante.fecha_entrevista && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Actual: {formatDate(estudiante.fecha_entrevista)}
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Estado</p>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    estadoColors[estudiante.estado] || "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {estudiante.estado}
                                </span>
                              </div>
                            </div>
                            {estudiante.estado !== "ACEPTADO" && estudiante.estado !== "RECHAZADO" && (
                              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(estudiante.id_postulante)}
                                  disabled={updatingIds.has(estudiante.id_postulante)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {updatingIds.has(estudiante.id_postulante) ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Procesando...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Rechazar
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAccept(estudiante.id_postulante)}
                                  disabled={updatingIds.has(estudiante.id_postulante)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {updatingIds.has(estudiante.id_postulante) ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Procesando...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Aceptar
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

