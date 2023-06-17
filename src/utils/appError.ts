class AppError extends Error {
  status: string;
  isOperational: boolean;
  constructor(public message: string, public statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4")
      ? "Client Error!"
      : "Internal Server Error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // persists the function where the error occured in the Error stack trace. (not 100% sure)
  }
}

export default AppError;
