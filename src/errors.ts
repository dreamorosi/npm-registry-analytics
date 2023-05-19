import type { ZodIssue } from 'zod';

/**
 * Error thrown when the response from the API endpoint doesn't
 * match the expected schema.
 */
class ValidationError extends Error {
  public validationErrors: ZodIssue[];

  public constructor(
    message: string,
    validationErrors: ZodIssue[],
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

export { ValidationError };
