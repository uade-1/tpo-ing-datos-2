"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Estudiante {
  _id: string;
  id_postulante: string;
  nombre: string;
  apellido: string;
  carrera_interes: string;
  estado: "ENTREVISTA" | "INTERES" | "ACEPTADO" | "RECHAZADO";
  dni: string;
  mail: string;
  fecha_inscripcion: string;
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
                <TableHead>Name</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantes.map((estudiante) => (
                <TableRow key={estudiante._id}>
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

