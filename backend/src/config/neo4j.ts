import neo4j, { Driver, Session } from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

let driver: Driver | null = null;

export const connectNeo4j = async (): Promise<void> => {
  const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
  const user = process.env.NEO4J_USER || "neo4j";
  const password = process.env.NEO4J_PASSWORD || "password123";

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  // Verificar conexión
  const session = driver.session();
  try {
    await session.run("RETURN 1");
    console.log("Neo4j conectado exitosamente");
  } finally {
    await session.close();
  }
};

export const getNeo4jDriver = (): Driver => {
  if (!driver) {
    throw new Error("Neo4j no inicializado. Llama a connectNeo4j() primero.");
  }
  return driver;
};

export const closeNeo4j = async (): Promise<void> => {
  if (driver) {
    await driver.close();
  }
};
