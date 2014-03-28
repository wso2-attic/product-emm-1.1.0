var config;
(function () {
    config = function () {
        var log = new Log(),
            pinch = require('/modules/pinch.min.js').pinch,
            config = require('/config/publisher.json'),
            address = require('/modules/address.js');

        pinch(config, /^/, function (path, key, value) {
            if ((typeof value === 'string') && value.indexOf('%https.ip%') > -1) {
                return value.replace('%https.ip%', address.getAddress("https"));
            }else if ((typeof value === 'string') && value.indexOf('%http.ip%') > -1) {
                return value.replace('%http.ip%', address.getAddress("http"));
            }
            return  value;
        });
        return config;
    };
})();
