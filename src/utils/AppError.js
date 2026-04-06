/**
 * Custom error class for operational errors that should be sent to the client.
 */
export class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;

    if (errors) {
      this.errors = errors;
    }

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
