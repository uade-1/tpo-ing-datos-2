import { Request, Response, NextFunction } from "express";
import { InstitucionModel } from "../models/institucion";
import { neo4jSyncService } from "../services/neo4jSync";
import {
  CreateInstitucionRequest,
  UpdateInstitucionRequest,
} from "../types/institucion";
import { ApiError } from "../middleware/errorHandler";

export const createInstitucion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institucionData: CreateInstitucionRequest = req.body;

    const existingInstitucion = await InstitucionModel.findOne({
      slug: institucionData.slug,
    });
    if (existingInstitucion) {
      const error = new Error(
        "Institution with this slug already exists"
      ) as ApiError;
      error.statusCode = 409;
      throw error;
    }

    const institucion = new InstitucionModel(institucionData);
    const savedInstitucion = await institucion.save();

    // Sincronizar con Neo4j
    try {
      await neo4jSyncService.syncInstitucion(
        savedInstitucion.slug,
        savedInstitucion.nombre
      );
    } catch (neo4jError) {
      console.error("Error sincronizando institución con Neo4j:", neo4jError);
    }

    res.status(201).json({
      success: true,
      data: savedInstitucion,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllInstituciones = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const instituciones = await InstitucionModel.find({});

    res.status(200).json({
      success: true,
      data: instituciones,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstitucionBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const institucion = await InstitucionModel.findOne({ slug });

    if (!institucion) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: institucion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInstitucion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const updateData: UpdateInstitucionRequest = req.body;

    const institucion = await InstitucionModel.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!institucion) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: institucion,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInstitucion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const institucion = await InstitucionModel.findOneAndDelete({ slug });

    if (!institucion) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
