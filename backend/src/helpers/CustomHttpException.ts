export class CustomHttpException extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = "CustomHttpException";
    Error.captureStackTrace(this);
  }
}
