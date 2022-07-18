export class MyForumError extends Error {
  constructor(
    public readonly message: string,
    public readonly name = 'AppError',
    public readonly errorCode = 500,
  ) {
    super(message);

    Error.captureStackTrace(this, MyForumError.captureStackTrace);
  }

  public toString() {
    return `Error: ${this.name} | ${this.message}`;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
    };
  }
}
