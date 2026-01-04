import type {NextFunction, Request, Response} from "express";

export function globalErrorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("💥 Oops! Something went wrong:", err.stack); // Log the error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}
