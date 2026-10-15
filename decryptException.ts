class DecryptException extends Error {
    /**
     * constructor method.
     *
     * @param {any} message
     * @returns {any}
     */
    constructor(message: string = 'The payload is invalid.') {
        super(message);
        this.name = this.constructor.name;
        this.code = 'ERR_DECRYPT_PAYLOAD';
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DecryptException;
