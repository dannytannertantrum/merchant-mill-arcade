interface ResponseNotOk {
    error: string
    message: string
    statusCode: number
}

class FetchException {
    constructor(
        public error: string,
        public message: string,
        public statusCode: number
    ) { }
}

const returnResponseNotOk = ({ error, message, statusCode }: ResponseNotOk) => {
    throw new FetchException(error, message, statusCode)
}

export {
    FetchException,
    returnResponseNotOk
}
