import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import { connectRedis } from "./config/redis";
import { connectNeo4j } from "./config/neo4j";
import { connectCassandra } from "./config/cassandra";
import institucionRoutes from "./routes/institucion";
import estudianteRoutes from "./routes/estudiante";
import enrollmentRoutes from "./routes/enrollment";
import analyticsRoutes from "./routes/analytics";
import scholarshipRoutes from "./routes/scholarship";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/instituciones", institucionRoutes);
app.use("/api/v1/estudiantes", estudianteRoutes);
app.use("/api/v1/enrollment", enrollmentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/scholarships", scholarshipRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();
    await connectNeo4j();
    await connectCassandra();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API endpoints available at http://localhost:${PORT}/api/v1/instituciones`
      );
      console.log(
        `API endpoints available at http://localhost:${PORT}/api/v1/estudiantes`
      );
      console.log(
        `API endpoints available at http://localhost:${PORT}/api/v1/enrollment`
      );
      console.log(
        `API endpoints available at http://localhost:${PORT}/api/v1/analytics`
      );
      console.log(
        `API endpoints available at http://localhost:${PORT}/api/v1/scholarships`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
