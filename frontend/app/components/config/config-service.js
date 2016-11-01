(function () {

'use strict';

wg.service('wg.app.components.config', 'config', () => {

wg.config.SUPPORTED_LANGUAGES = wg.config.SUPPORTED_LANGUAGES.split(',')

return wg.config;

});

})();