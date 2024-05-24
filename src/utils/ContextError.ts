export class ContextError extends Error {
  readonly _details?: string | undefined;
  readonly _statusCode?: number | undefined;

  constructor(error: {
    message: string;
    details?: string;
    statusCode?: number;
  }) {
    super();
    super.message = error.message;
    this._details = error?.details;
    this._statusCode = error?.statusCode;
  }

  get details(): string | undefined {
    return this._details;
  }

  get statusCode(): number | undefined {
    return this._statusCode;
  }
}
