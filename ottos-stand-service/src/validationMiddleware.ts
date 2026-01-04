import type {NextFunction, Request, Response} from "express";
import type Joi from "joi";

export async function buildValidationMiddleware(schema: Joi.ObjectSchema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validateAsync(req.body, {abortEarly: false});
      next();
    } catch (validationError: any) {
      res.status(400).json({
        message: "Validation error",
        details: validationError.details.map((detail: any) => detail.message),
      });
    }
  };
}
