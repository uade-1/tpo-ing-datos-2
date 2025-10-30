"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graph Visualization</CardTitle>
        <CardDescription>
          Interactive diagram showing relationships between students, careers, and institution.
          Drag nodes to explore. Click nodes to see details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-white">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
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

