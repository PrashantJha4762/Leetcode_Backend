export interface AppError extends Error {
    StatusCode: number;
    statusCode?: number;
}

export class AppBaseError extends Error implements AppError {
    public StatusCode: number;
    public statusCode: number;

    constructor(name: string, statusCode: number, message: string) {
        super(message);
        this.name = name;
        this.StatusCode = statusCode;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InternalServerError extends AppBaseError {
    constructor(message: string = "Internal Server Error") {
        super("InternalServerError", 500, message);
    }
}

export class BadRequestError extends AppBaseError {
    constructor(message: string = "Bad Request") {
        super("BadRequestError", 400, message);
    }
}

export class NotFoundError extends AppBaseError {
    constructor(message: string = "Not Found") {
        super("NotFoundError", 404, message);
    }
}

export class UnauthorizedError extends AppBaseError {
    constructor(message: string = "Unauthorized") {
        super("UnauthorizedError", 401, message);
    }
}

export class ForbiddenError extends AppBaseError {
    constructor(message: string = "Forbidden") {
        super("ForbiddenError", 403, message);
    }
}

export class ConflictError extends AppBaseError {
    constructor(message: string = "Conflict") {
        super("ConflictError", 409, message);
    }
}
