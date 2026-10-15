require('@ostro/support/helpers')
const EncrypterContract = require('@ostro/contracts/encryption/encrypter');
const RuntimeException = require('@ostro/support/exceptions/runtimeException');
const DecryptException = require('./decryptException');
var crypto = require('crypto');
class Encrypter extends EncrypterContract {

    /**
     * constructor method.
     *
     * @param {any} key
     * @param {any} cipher
     * @returns {any}
     */
    constructor($key: string, $cipher: string = 'AES-128-CBC') {
        super()
        if (this.supported($key, $cipher)) {
            this.$key = $key;
            this.$cipher = $cipher;
        } else {
            throw new RuntimeException('The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.');
        }
    }

    /**
     * supported method.
     *
     * @param {any} key
     * @param {any} cipher
     * @returns {any}
     */
    supported($key: string, $cipher: string) {
        let $length = $key.length;
        return ($cipher === 'AES-128-CBC' && $length === 16) ||
            ($cipher === 'AES-192-CBC' && $length === 24) ||
            ($cipher === 'AES-256-CBC' && $length === 32);
    }

    /**
     * getKeyLength method.
     *
     * @returns {any}
     */
    getKeyLength() {
        return this.$key.length
    }

    /**
     * generateKey method.
     *
     * @returns {any}
     */
    generateKey() {
        return crypto.randomBytes(16);
    }

    /**
     * encrypt method.
     *
     * @param {any} value
     * @param {any} serialize
     * @returns {any}
     */
    encrypt($value: any, $serialize: boolean = true) {

        const iv = this.generateKey()

        const cipher = crypto.createCipheriv(this.$cipher, this.$key, iv)

        $value = ($serialize ? JSON.stringify($value) : $value)

        const encrypted = Buffer.concat([cipher.update($value, 'utf-8'), cipher.final()]).toString('base64')

        return Buffer.from(JSON.stringify({
            iv: iv.toString('base64'),
            value: encrypted,
            mac: this.$cipher
        })).toString('base64')
    }

    /**
     * encryptString method.
     *
     * @param {any} value
     * @returns {any}
     */
    encryptString($value: any) {
        return this.encrypt($value, false);
    }

    /**
     * decrypt method.
     *
     * @param {any} payload
     * @param {any} unserialize
     * @returns {any}
     */
    decrypt($payload: Record<string, any>, $unserialize: boolean = true) {

        $payload = this.getJsonPayload($payload);
        let $iv = Buffer.from($payload['iv'], 'base64');
        const decipher = crypto.createDecipheriv(this.$cipher, this.$key, $iv);
        let $decrypted = Buffer.concat([decipher.update(Buffer.from($payload['value'], 'base64'), 'utf-8'), decipher.final()]).toString()
        return $unserialize ? JSON.parse($decrypted) : $decrypted;
    }

    /**
     * getJsonPayload method.
     *
     * @param {any} payload
     * @returns {any}
     */
    getJsonPayload($payload: Record<string, any>) {
        try {
            $payload = JSON.parse(Buffer.from($payload, 'base64').toString());
        } catch (e) {
            throw new DecryptException('The payload is invalid.');
        }

        if (!this.validPayload($payload)) {
            throw new DecryptException('The payload is invalid.');
        }

        return $payload;
    }

    /**
     * validPayload method.
     *
     * @param {any} payload
     * @returns {any}
     */
    validPayload($payload: Record<string, any>) {

        return is_json($payload) && isset($payload['iv'], $payload['value'], $payload['mac']) &&
            Buffer.from($payload['iv'], 'base64').length === 16;
    }

    /**
     * getKey method.
     *
     * @returns {any}
     */
    getKey() {
        return this.$key;
    }
}

module.exports = Encrypter