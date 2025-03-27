export class ErrorHandler extends Error {
  constructor(message:string, public readonly statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
