const HasherContract = require('@ostro/contracts/encryption/hasher');
const RuntimeException = require('@ostro/support/exceptions/runtimeException');
const bcrypt = require('bcrypt');
class BcryptHasher extends HasherContract {

    /**
     * $rounds property.
     * @type {any}
     */
    $rounds = 10;

    /**
     * constructor method.
     *
     * @param {any} options
     * @returns {any}
     */
    constructor($options = {}) {
        super()
        this.$rounds = $options['rounds'] || this.$rounds;
    }

    /**
     * make method.
     *
     * @param {any} value
     * @param {any} options
     * @returns {any}
     */
    make($value, $options = {}) {

        let salt = bcrypt.genSaltSync(this.cost());

        let $hash = bcrypt.hashSync($value, salt);
        if ($hash === false) {
            throw new RuntimeException('Bcrypt hashing not supported.');
        }

        return $hash;
    }

    /**
     * check method.
     *
     * @param {any} value
     * @param {any} hashedValue
     * @param {any} options
     * @returns {any}
     */
    check($value, $hashedValue, $options = {}) {
        return bcrypt.compareSync($value, $hashedValue);
    }

    /**
     * setRounds method.
     *
     * @param {any} rounds
     * @returns {any}
     */
    setRounds($rounds) {
        this.$rounds = $rounds;

        return this;
    }

    /**
     * info method.
     *
     * @param {any} hashedValue
     * @returns {any}
     */
    info($hashedValue) {
        return {
            algo: '2y',
            algoName: 'bcrypt',
            options: { cost: this.cost() }
        };
    }

    /**
     * needsRehash method.
     *
     * @param {any} hashedValue
     * @param {any} options
     * @returns {any}
     */
    needsRehash($hashedValue, $options = {}) {
        return this.cost($options) !== this.cost();
    }

    /**
     * cost method.
     *
     * @param {any} options
     * @returns {any}
     */
    cost($options = {}) {
        return $options['rounds'] || this.$rounds;
    }
}

module.exports = BcryptHasher;