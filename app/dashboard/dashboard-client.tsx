"use client";

import { useState } from "react";
import { EnrollmentsTable } from "@/components/dashboard/enrollments-table";
import { GraphVisualization } from "@/components/dashboard/graph-visualization";
import { CassandraData } from "@/components/dashboard/cassandra-data";

interface DashboardClientProps {
  slug: string;
}

export function DashboardClient({ slug }: DashboardClientProps) {
  const [cassandraRefreshKey, setCassandraRefreshKey] = useState(0);
  const [graphRefreshKey, setGraphRefreshKey] = useState(0);

  const handleStudentUpdated = () => {
    // Increment refresh keys to trigger both Cassandra table and Neo4j graph refresh
    setCassandraRefreshKey((prev) => prev + 1);
    setGraphRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <EnrollmentsTable institucionSlug={slug} onStudentUpdated={handleStudentUpdated} />
      <GraphVisualization institucionSlug={slug} refreshKey={graphRefreshKey} />
      <CassandraData institucionSlug={slug} refreshKey={cassandraRefreshKey} />
    </div>
  );
}

