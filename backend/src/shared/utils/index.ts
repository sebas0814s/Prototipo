import { ApiResponse } from '../types';

/** Build a standardized success API response */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

/** Build a standardized error API response */
export function errorResponse(message: string, errors?: string[]): ApiResponse<never> {
  return { success: false, message, errors };
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
