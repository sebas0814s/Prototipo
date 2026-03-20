import { Request } from 'express';

/** Authenticated request with user payload attached by JWT middleware */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'customer' | 'admin';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  totalPages: number;
}
