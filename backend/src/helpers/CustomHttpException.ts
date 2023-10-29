/* eslint-disable no-extend-native */
export class CustomHttpException extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.status = status;
    this.message = message;

    Error.captureStackTrace(this);
    Error.prototype.name = 'CustomHttpException';
  }
}
