"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Scholarship {
  dni: string;
  id_postulante: string;
  nombre: string;
  apellido: string;
  sexo: string;
  mail: string;
  carrera_interes: string;
  departamento_interes: string;
  fecha_inscripcion: string;
  fecha_interes: string;
  fecha_entrevista?: string;
  fecha_aceptacion: string;
  comite_decision?: string;
  comite_comentarios?: string;
}

interface CassandraDataProps {
  institucionSlug: string;
  refreshKey?: number;
}

export function CassandraData({
  institucionSlug,
  refreshKey,
}: CassandraDataProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]); // Store all data for filtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Filters
  const [filterEstado, setFilterEstado] = useState<string>("ALL");
  const [filterDate, setFilterDate] = useState<string>(""); // Date filter for fecha_aceptacion

  const fetchScholarships = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        `/api/v1/scholarships/${encodeURIComponent(
          institucionSlug
        )}/${selectedYear}`
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error?.message || "Error al obtener datos de Cassandra"
        );
      }

      // Convert Cassandra rows to our format
      const scholarshipsData = (json.data?.scholarships || []).map(
        (row: any) => ({
          dni: row.dni || "",
          id_postulante: row.id_postulante || "",
          nombre: row.nombre || "",
          apellido: row.apellido || "",
          sexo: row.sexo || "",
          mail: row.mail || "",
          carrera_interes: row.carrera_interes || "",
          departamento_interes: row.departamento_interes || "",
          fecha_inscripcion: row.fecha_inscripcion
            ? new Date(row.fecha_inscripcion).toISOString()
            : "",
          fecha_interes: row.fecha_interes
            ? new Date(row.fecha_interes).toISOString()
            : "",
          fecha_entrevista: row.fecha_entrevista
            ? new Date(row.fecha_entrevista).toISOString()
            : undefined,
          fecha_aceptacion: row.fecha_aceptacion
            ? new Date(row.fecha_aceptacion).toISOString()
            : "",
          comite_decision: row.comite_decision || undefined,
          comite_comentarios: row.comite_comentarios || undefined,
        })
      );

      setAllScholarships(scholarshipsData);
      // Apply filters
      applyFilters(scholarshipsData, filterEstado, filterDate);
    } catch (err) {
      console.error("Error fetching Cassandra data:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (data: Scholarship[], estado: string, date: string) => {
    let filtered = [...data];

    // Filter by estado (comite_decision)
    if (estado && estado !== "ALL") {
      filtered = filtered.filter((sch) => sch.comite_decision === estado);
    }

    // Filter by date (fecha_aceptacion)
    if (date) {
      const filterDateObj = new Date(date);
      filterDateObj.setHours(0, 0, 0, 0);
      filtered = filtered.filter((sch) => {
        if (!sch.fecha_aceptacion) return false;
        const schDate = new Date(sch.fecha_aceptacion);
        schDate.setHours(0, 0, 0, 0);
        return schDate.getTime() === filterDateObj.getTime();
      });
    }

    setScholarships(filtered);
  };

  useEffect(() => {
    fetchScholarships();
  }, [institucionSlug, selectedYear, refreshKey]);

  useEffect(() => {
    applyFilters(allScholarships, filterEstado, filterDate);
  }, [filterEstado, filterDate, allScholarships]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Generate year options (current year and previous 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Becas</CardTitle>
          <CardDescription>
            Estudiantes almacenados (ACEPTADO/RECHAZADO)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">
              Cargando datos de Cassandra...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Becas</CardTitle>
          <CardDescription>
            Estudiantes almacenados (ACEPTADO/RECHAZADO)
          </CardDescription>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admisiones</CardTitle>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4 items-end pb-4 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="cassandra-filter-estado"
              className="text-xs text-gray-600 mb-1 block"
            >
              Estado
            </Label>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger id="cassandra-filter-estado" className="w-full">
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los Estados</SelectItem>
                <SelectItem value="ACEPTADO">ACEPTADO</SelectItem>
                <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label
              htmlFor="cassandra-filter-date"
              className="text-xs text-gray-600 mb-1 block"
            >
              Fecha de Resolución
            </Label>
            <Input
              id="cassandra-filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full"
            />
          </div>
          {filterDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterDate("")}
              className="h-9"
            >
              Limpiar Fecha
            </Button>
          )}
        </div>

        {scholarships.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            {allScholarships.length === 0
              ? `No se encontraron datos de Cassandra para ${selectedYear}. Los estudiantes solo se almacenan en Cassandra cuando alcanzan el estado ACEPTADO o RECHAZADO.`
              : "No hay estudiantes que coincidan con los filtros seleccionados."}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Se encontraron {scholarships.length} estudiante
              {scholarships.length !== 1 ? "s" : ""} para {selectedYear}
              {allScholarships.length !== scholarships.length &&
                ` (filtrados de ${allScholarships.length} total)`}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Fecha Resolución</TableHead>
                    <TableHead>Decisión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships.map((scholarship, index) => (
                    <TableRow key={`${scholarship.dni}-${index}`}>
                      <TableCell className="font-mono text-xs">
                        {scholarship.id_postulante}
                      </TableCell>
                      <TableCell>
                        {scholarship.nombre} {scholarship.apellido}
                      </TableCell>
                      <TableCell>{scholarship.dni}</TableCell>
                      <TableCell>{scholarship.mail}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {scholarship.carrera_interes}
                          </div>
                          <div className="text-xs text-gray-500">
                            {scholarship.departamento_interes}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(scholarship.fecha_aceptacion)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            scholarship.comite_decision === "ACEPTADO"
                              ? "bg-green-100 text-green-800"
                              : scholarship.comite_decision === "RECHAZADO"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {scholarship.comite_decision || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
