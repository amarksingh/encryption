const HasherContract = require('@ostro/contracts/encryption/hasher');
const RuntimeException = require('@ostro/support/exceptions/runtimeException');
const bcrypt = require('bcrypt');
class BcryptHasher extends HasherContract {

    $rounds = 10;

    constructor($options = {}) {
        super()
        this.$rounds = $options['rounds'] || this.$rounds;
    }

    make($value, $options = {}) {

        let salt = bcrypt.genSaltSync(this.cost());

        let $hash = bcrypt.hashSync($value, salt);
        if ($hash === false) {
            throw new RuntimeException('Bcrypt hashing not supported.');
        }

        return $hash;
    }

    check($value, $hashedValue, $options = {}) {
        return bcrypt.compareSync($value, $hashedValue);
    }

    setRounds($rounds) {
        this.$rounds = $rounds;

        return this;
    }

    info($hashedValue) {
        return {
            algo: '2y',
            algoName: 'bcrypt',
            options: { cost: this.cost() }
        };
    }

    needsRehash($hashedValue, $options = {}) {
        return this.cost($options) !== this.cost();
    }

    cost($options = {}) {
        return $options['rounds'] || this.$rounds;
    }
}

module.exports = BcryptHasher;