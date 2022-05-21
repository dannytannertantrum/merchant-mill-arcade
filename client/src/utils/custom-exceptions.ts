class FetchException {
    constructor(
        public error: string,
        public message: string,
        public statusCode: number
    ) { }
}

export default FetchException
