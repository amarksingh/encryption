const ServiceProvider = require('@ostro/support/serviceProvider');
const { tap } = require('@ostro/support/function');
const { startsWith, after } = require('@ostro/support/string');
const Encrypter = require('./encrypter');
const HashManager = require('./hashManager');
const MissingAppKeyException = require('./missingAppKeyException');
class EncryptionServiceProvider extends ServiceProvider {

    /**
     * register method.
     *
     * @returns {any}
     */
    register() {
        this.registerEncrypter();
        this.registerHash()
    }

    /**
     * registerHash method.
     *
     * @returns {any}
     */
    registerHash() {
        this.$app.singleton('hash', function($app) {
            return new HashManager($app);
        });

        this.$app.singleton('hash.driver', function($app) {
            return $app['hash'].driver();
        });
    }

    /**
     * registerEncrypter method.
     *
     * @returns {any}
     */
    registerEncrypter() {
        this.$app.singleton('encrypter', ($app) => {
            let $config = $app.make('config').get('app');

            return new Encrypter(this.parseKey($config), $config['cipher']);
        });
    }

    /**
     * parseKey method.
     *
     * @param {any} config
     * @returns {any}
     */
    parseKey($config) {
        let $key = this.key($config)
        let $prefix = 'base64:'
        if (startsWith($key, $prefix)) {
            $key = Buffer.from(after($key, $prefix), 'base64');
            $key = $key.toString('ascii')
        }

        return $key;
    }

    /**
     * key method.
     *
     * @param {any} config
     * @returns {any}
     */
    key($config) {
        return tap($config['key'], function($key) {
            if (!$key) {
                throw new MissingAppKeyException;
            }
        });
    }

}
module.exports = EncryptionServiceProvider