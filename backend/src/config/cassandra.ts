import { Client } from "cassandra-driver";
import dotenv from "dotenv";

dotenv.config();

let client: Client | null = null;

export const connectCassandra = async (): Promise<void> => {
  const contactPoints = (
    process.env.CASSANDRA_CONTACT_POINTS || "localhost"
  ).split(",");
  const port = parseInt(process.env.CASSANDRA_PORT || "9042");
  const localDataCenter = process.env.CASSANDRA_DC || "datacenter1";
  const keyspace = process.env.CASSANDRA_KEYSPACE || "eduscale_scholarships";

  client = new Client({
    contactPoints,
    localDataCenter,
    keyspace: "system", // Conectar primero a system para crear keyspace
  });

  await client.connect();
  console.log("Cassandra conectado exitosamente");

  // Crear keyspace si no existe
  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    }
  `);

  // Cambiar a keyspace de la aplicación
  await client.shutdown();

  client = new Client({
    contactPoints,
    localDataCenter,
    keyspace,
  });

  await client.connect();
  console.log(`Cassandra usando keyspace: ${keyspace}`);

  // Crear tabla si no existe
  await createScholarshipTable();
};

const createScholarshipTable = async (): Promise<void> => {
  if (!client) throw new Error("Cassandra client no inicializado");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS estudiantes_becados (
      institucion_slug text,
      anio int,
      dni text,
      id_postulante text,
      nombre text,
      apellido text,
      sexo text,
      mail text,
      carrera_interes text,
      departamento_interes text,
      fecha_inscripcion timestamp,
      fecha_interes timestamp,
      fecha_entrevista timestamp,
      fecha_aceptacion timestamp,
      documentos map<text, text>,
      comite_id text,
      comite_decision text,
      comite_comentarios text,
      comite_fecha_revision timestamp,
      PRIMARY KEY ((institucion_slug, anio), dni)
    ) WITH CLUSTERING ORDER BY (dni ASC)
  `);

  console.log("Tabla estudiantes_becados creada/verificada");
};

export const getCassandraClient = (): Client => {
  if (!client) {
    throw new Error(
      "Cassandra no inicializado. Llama a connectCassandra() primero."
    );
  }
  return client;
};

export const closeCassandra = async (): Promise<void> => {
  if (client) {
    await client.shutdown();
  }
};
