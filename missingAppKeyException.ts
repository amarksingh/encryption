class MissingAppKeyException extends Error {
    /**
     * constructor method.
     *
     * @param {any} message
     * @returns {any}
     */
    constructor(message: string) {
        super();
        this.name = this.constructor.name;
        this.code = 'ERR_MISS_KEY';
        this.statusCode = 500;
        this.message = message || 'Key is missing on config';
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = MissingAppKeyException