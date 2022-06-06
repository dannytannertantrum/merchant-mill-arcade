interface HttpStatuses {
    BadRequest: 400
    NotFound: 404
    InternalServerError: 500
    Conflict: 409
}

const httpStatuses: HttpStatuses = {
    BadRequest: 400,
    NotFound: 404,
    InternalServerError: 500,
    Conflict: 409
}

class APIError extends Error {
    constructor(
        public message: string,
        public errorType = 'Internal server error',
        public statusCode = httpStatuses.InternalServerError
    ) {
        super()
    }
}

class NotFoundError extends Error {
    constructor(
        public message: string,
        public errorType = 'Not found error',
        public statusCode = httpStatuses.NotFound
    ) {
        super()
    }
}

class OnConflictError extends Error {
    constructor(
        public message: string,
        public errorType = 'Conflict error',
        public statusCode = httpStatuses.Conflict
    ) {
        super()
    }
}

class ValidationError extends Error {
    constructor(
        public message: string,
        public errorType = 'Validation error',
        public statusCode = httpStatuses.BadRequest
    ) {
        super()
    }
}

const handleApiError = (message: string): never => {
    throw new APIError(message)
}

const handleDuplicateEntryError = (message: string): never => {
    throw new OnConflictError(message)
}

const handleNotFoundError = (message: string): never => {
    throw new NotFoundError(message)
}

const handleValidationError = (message: string): never => {
    throw new ValidationError(message)
}

export {
    handleApiError,
    handleDuplicateEntryError,
    handleNotFoundError,
    handleValidationError
}
