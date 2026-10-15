require('@ostro/support/helpers')
const Manager = require('@ostro/support/manager');
const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException');
const { pascal } = require('@ostro/support/string');
const { isset, method_exists } = require('@ostro/support/function');
class HashManager extends Manager {

    /**
     * $type property.
     * @type {any}
     */
    $type = 'hashing';

    /**
     * resolve method.
     *
     * @param {any} driver
     * @returns {any}
     */
    resolve($driver: any) {
        if (isset(this.$customCreators[$driver])) {
            return this.callCustomCreator($driver);
        } else {
            let $method = 'create' + pascal($driver) + 'Driver';

            if (method_exists(this, $method)) {
                return this[$method]();
            }
        }

        throw new InvalidArgumentException("Driver [" + $driver + "] not supported.");
    }

    /**
     * callCustomCreator method.
     *
     * @param {any} driver
     * @returns {any}
     */
    callCustomCreator($driver: any) {
        return this.$customCreators[$driver].call(this, this.$container, $driver, this.$config);
    }

    /**
     * createBcryptDriver method.
     *
     * @returns {any}
     */
    createBcryptDriver() {
        return new(require('./bcryptHasher'))(this.getConfig('bcrypt') || {});
    }

    /**
     * createCryptoDriver method.
     *
     * @returns {any}
     */
    createCryptoDriver() {
        return new(require('./cryptoHasher'))(this.getConfig('crypto') || {});
    }

    /**
     * info method.
     *
     * @param {any} hashedValue
     * @returns {any}
     */
    info($hashedValue: boolean) {
        return this.driver().info($hashedValue);
    }

    /**
     * make method.
     *
     * @param {any} value
     * @param {any} options
     * @returns {any}
     */
    make($value: any, $options: any[] = []) {
        return this.driver().make($value, $options);
    }

    /**
     * check method.
     *
     * @param {any} value
     * @param {any} hashedValue
     * @param {any} options
     * @returns {any}
     */
    check($value: string = '', $hashedValue: boolean, $options: any[] = []) {
        if ($hashedValue.length === 0) {
            return false;
        }
        return this.driver().check($value, $hashedValue, $options);
    }

    /**
     * needsRehash method.
     *
     * @param {any} hashedValue
     * @param {any} options
     * @returns {any}
     */
    needsRehash($hashedValue: boolean, $options: any[] = []) {
        return this.driver().needsRehash($hashedValue, $options);
    }

    /**
     * getDefaultDriver method.
     *
     * @returns {any}
     */
    getDefaultDriver() {
        return this.getConfig('driver', 'bcrypt');
    }
}

module.exports = HashManager