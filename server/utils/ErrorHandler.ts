export class ErrorHandler extends Error {
  constructor(message:any, public readonly statusCode: Number) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
