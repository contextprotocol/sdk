export enum ContextErrorReason {
  InternalError = 0,
  AuthError = 1,
  DomainNotFound = 2,
  DocumentNotFound = 3,
}

export class ContextError extends Error {
  public reason: ContextErrorReason;

  constructor(reason: ContextErrorReason, message?: string) {
    super();
    super.message = message ?? ContextError._getMessage(reason);
    this.reason = reason;
  }

  private static _getMessage(reason: ContextErrorReason): string {
    return (this.messages as { [reason in ContextErrorReason]: string })[
      reason
    ];
  }

  static messages = {
    [ContextErrorReason.InternalError]: "Internal Error",
    [ContextErrorReason.AuthError]: "Authentication Error",
    [ContextErrorReason.DomainNotFound]: "Domain not found",
    [ContextErrorReason.DocumentNotFound]: "Document not found",
  };
}
