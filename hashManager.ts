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
    resolve($driver) {
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
    callCustomCreator($driver) {
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
    info($hashedValue) {
        return this.driver().info($hashedValue);
    }

    /**
     * make method.
     *
     * @param {any} value
     * @param {any} options
     * @returns {any}
     */
    make($value, $options = []) {
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
    check($value='', $hashedValue, $options = []) {
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
    needsRehash($hashedValue, $options = []) {
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