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
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";

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
  fecha_entrevista: string;
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

export function EnrollmentsTable({ institucionSlug }: EnrollmentsTableProps) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
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

        setEstudiantes(json.data || []);
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Fecha de Entrevista</p>
                                <p className="text-gray-600">{formatDate(estudiante.fecha_entrevista)}</p>
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

