import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  code?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message || "Validation Error";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error - Resource already exists";
  }

  if (err.name === "MongoError" && err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error - Resource already exists";
  }

  console.error("Error:", err);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
  error.statusCode = 404;
  next(error);
};
