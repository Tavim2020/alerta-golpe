import { CustomError } from "@/types/global.type";

class ValidationError extends Error implements CustomError {
  readonly action: string;
  readonly statusCode: number;
  readonly errors: unknown;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.action = "Corrija os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

class NotFoundError extends Error implements CustomError {
  readonly action: string;
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.action = "O recurso solicitado não foi encontrado.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

class ConflictError extends Error implements CustomError {
  readonly action: string;
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.action = "O recurso solicitado já existe.";
    this.statusCode = 409;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

class InternalServerError extends Error implements CustomError {
  readonly action: string;
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.action = "Tente novamente mais tarde.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export { ConflictError, InternalServerError, NotFoundError, ValidationError };
