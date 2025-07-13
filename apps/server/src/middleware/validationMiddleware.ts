import { Request, Response, NextFunction } from "express";
import { validationSchemas } from "@/utils/validation";

type SchemaName = keyof typeof validationSchemas;

export const validate = (schemaName: SchemaName) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = validationSchemas[schemaName];

    if (!schema) {
      res.status(500).json({
        success: false,
        message: "Validation schema not found",
      });
      return;
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(
        (detail: { path: any[]; message: any }) => ({
          field: detail.path.join("."),
          message: detail.message,
        })
      );

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    req.body = value; // Overwrite with validated data
    next();
  };
};
