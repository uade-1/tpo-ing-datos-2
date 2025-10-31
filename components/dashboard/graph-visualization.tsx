"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

interface GraphNode {
  id: string;
  label: string;
  type: "Institucion" | "Carrera" | "Estudiante";
  slug?: string;
  departamento?: string;
  dni?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphVisualizationProps {
  institucionSlug: string;
  refreshKey?: number;
}

const estadoColors: Record<string, string> = {
  INTERES: "#3b82f6", // blue
  ENTREVISTA: "#eab308", // yellow
  ACEPTADO: "#22c55e", // green
  RECHAZADO: "#ef4444", // red
  OFRECE: "#6b7280", // gray
};

const nodeTypeColors: Record<string, string> = {
  Institucion: "#1e40af", // dark blue
  Carrera: "#7c3aed", // purple
  Estudiante: "#059669", // teal
};

const nodeTypeSizes: Record<string, number> = {
  Institucion: 12,
  Carrera: 8,
  Estudiante: 6,
};

export function GraphVisualization({ institucionSlug, refreshKey }: GraphVisualizationProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>("ALL");
  const graphRef = useRef<any>();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(
          `/api/v1/analytics/graph/institucion/${encodeURIComponent(institucionSlug)}`
        );
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to fetch graph data");
        }

        setGraphData(json.data);
      } catch (err) {
        console.error("Error fetching graph data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphData();
  }, [institucionSlug, refreshKey]);

  // Filter graph data based on estado selection
  const filteredGraphData = useMemo(() => {
    if (!graphData) return null;

    if (filterEstado === "ALL") {
      // Normalize links to ensure source/target are string IDs
      const normalizedLinks = graphData.links.map((link) => ({
        ...link,
        source: typeof link.source === 'string' ? link.source : String((link.source as any)?.id || link.source),
        target: typeof link.target === 'string' ? link.target : String((link.target as any)?.id || link.target),
      }));
      return {
        nodes: graphData.nodes,
        links: normalizedLinks,
      };
    }

    // Filter links by estado
    const filteredLinks = graphData.links.filter(
      (link) => link.type === filterEstado
    );

    if (filteredLinks.length === 0) {
      return {
        nodes: [],
        links: [],
      };
    }

    // Get node IDs that are connected to filtered links
    // Handle both string IDs and node objects
    const connectedNodeIds = new Set<string>();
    filteredLinks.forEach((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any)?.id || (link.source as any)?.toString();
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any)?.id || (link.target as any)?.toString();
      if (sourceId) connectedNodeIds.add(String(sourceId));
      if (targetId) connectedNodeIds.add(String(targetId));
    });

    // Filter nodes: keep all nodes that are connected to filtered links
    // This includes Institution, Carrera, and Estudiante nodes
    const filteredNodes = graphData.nodes.filter(
      (node) => connectedNodeIds.has(String(node.id))
    );

    // Create a set of filtered node IDs for link validation
    const filteredNodeIds = new Set(filteredNodes.map(n => String(n.id)));

    // Filter links to only include those where both source and target are in filtered nodes
    // Normalize source/target to strings for comparison
    const validFilteredLinks = filteredLinks.map((link) => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any)?.id || (link.source as any)?.toString();
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any)?.id || (link.target as any)?.toString();
      
      // Return link with normalized source/target IDs
      return {
        ...link,
        source: String(sourceId),
        target: String(targetId),
      };
    }).filter((link) => {
      return filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target);
    });

    return {
      nodes: filteredNodes,
      links: validFilteredLinks,
    };
  }, [graphData, filterEstado]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualization</CardTitle>
          <CardDescription>Relationships between students, careers, and institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Loading graph data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualization</CardTitle>
          <CardDescription>Relationships between students, careers, and institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-red-600">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Graph Visualization</CardTitle>
          <CardDescription>Relationships between students, careers, and institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-gray-500">
            No graph data available. Create enrollments to see relationships.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredGraphData || filteredGraphData.nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Visualización de Grafo</CardTitle>
              <CardDescription>
                Diagrama interactivo mostrando relaciones entre estudiantes, carreras e institución.
                Arrastra nodos para explorar. Haz clic en nodos para ver detalles.
              </CardDescription>
            </div>
            <div className="w-48">
              <Label htmlFor="filter-estado" className="text-xs text-gray-600 mb-1 block">
                Estado
              </Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger id="filter-estado" className="w-full">
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los Estados</SelectItem>
                  <SelectItem value="INTERES">INTERES</SelectItem>
                  <SelectItem value="ENTREVISTA">ENTREVISTA</SelectItem>
                  <SelectItem value="ACEPTADO">ACEPTADO</SelectItem>
                  <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-gray-500">
            No hay datos disponibles para el estado seleccionado.
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
            <CardTitle>Visualización de Grafo</CardTitle>
            <CardDescription>
              Diagrama interactivo mostrando relaciones entre estudiantes, carreras e institución.
              Arrastra nodos para explorar. Haz clic en nodos para ver detalles.
            </CardDescription>
          </div>
          <div className="w-48">
            <Label htmlFor="filter-estado" className="text-xs text-gray-600 mb-1 block">
              Estado
            </Label>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger id="filter-estado" className="w-full">
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los Estados</SelectItem>
                <SelectItem value="INTERES">INTERES</SelectItem>
                <SelectItem value="ENTREVISTA">ENTREVISTA</SelectItem>
                <SelectItem value="ACEPTADO">ACEPTADO</SelectItem>
                <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-white">
          <ForceGraph2D
            ref={graphRef}
            graphData={filteredGraphData}
            nodeLabel={(node: any) => {
              if (node.type === "Estudiante") {
                return `${node.label}\nDNI: ${node.dni}`;
              } else if (node.type === "Carrera") {
                return `${node.label}\n${node.departamento ? `Dept: ${node.departamento}` : ""}`;
              }
              return node.label;
            }}
            nodeColor={(node: any) => nodeTypeColors[node.type] || "#6b7280"}
            nodeVal={(node: any) => nodeTypeSizes[node.type] || 5}
            linkColor={(link: any) => estadoColors[link.type] || "#9ca3af"}
            linkWidth={2}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkLabel={(link: any) => link.type}
            onNodeClick={(node: any) => {
              // Center view on clicked node
              if (graphRef.current) {
                graphRef.current.centerAt(node.x, node.y, 1000);
              }
            }}
            nodeCanvasObjectMode={() => "after"}
            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#374151";
              ctx.fillText(label, node.x, node.y + nodeTypeSizes[node.type] + fontSize);
            }}
            width={800}
            height={600}
            cooldownTicks={100}
            onEngineStop={() => {
              if (graphRef.current) {
                graphRef.current.zoomToFit(400);
              }
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span>Institution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span>Career</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-teal-600"></div>
            <span>Student</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-6 h-1 bg-blue-500"></div>
            <span>INTERES</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-yellow-500"></div>
            <span>ENTREVISTA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-green-500"></div>
            <span>ACEPTADO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-red-500"></div>
            <span>RECHAZADO</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

