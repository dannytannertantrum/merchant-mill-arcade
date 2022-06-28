import { FastifyReply } from 'fastify'


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
        public name = 'Internal server error',
        public statusCode = httpStatuses.InternalServerError
    ) {
        super()
    }
}

class NotFoundError extends Error {
    constructor(
        public message: string,
        public name = 'Not found error',
        public statusCode = httpStatuses.NotFound
    ) {
        super()
    }
}

class OnConflictError extends Error {
    constructor(
        public message: string,
        public name = 'Conflict error',
        public statusCode = httpStatuses.Conflict
    ) {
        super()
    }
}

class ValidationError extends Error {
    constructor(
        public message: string,
        public name = 'Validation error',
        public statusCode = httpStatuses.BadRequest
    ) {
        super()
    }
}

const handleApiError = (message: string): never => {
    throw new APIError(message)
}

const handleError = (message: string, reason: unknown, reply: FastifyReply): void => {
    console.error(message, reason)

    reply.send(reason)
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
    handleError,
    handleDuplicateEntryError,
    handleNotFoundError,
    handleValidationError
}
