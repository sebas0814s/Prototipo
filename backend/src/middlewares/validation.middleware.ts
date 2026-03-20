import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/** Reads express-validator results and short-circuits with 422 on failure */
export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => e.msg),
    });
    return;
  }
  next();
}
