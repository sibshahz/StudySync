import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { validationSchemas } from "@/utils/validation";

type SchemaName = keyof typeof validationSchemas;

export const validate = (schemaName: SchemaName) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema: ZodType<any> | undefined = validationSchemas[schemaName];

    if (!schema) {
      res.status(500).json({
        success: false,
        message: "Validation schema not found",
      });
      return;
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
};
