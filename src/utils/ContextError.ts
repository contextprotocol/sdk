export interface ContextErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export class ContextError extends Error {
  readonly #error?: string | undefined;
  readonly #statusCode?: number | undefined;

  constructor(error: { message: string; error?: string; statusCode?: number }) {
    super();
    super.message = error.message;
    this.#error = error?.error;
    this.#statusCode = error?.statusCode;
  }

  get error(): string | undefined {
    return this.#error;
  }

  get statusCode(): number | undefined {
    return this.#statusCode;
  }

  public getErrorObject(): ContextErrorResponse {
    return {
      message: this.message,
      statusCode: this.#statusCode,
      error: this.#error ?? "Context Error",
    };
  }
}
