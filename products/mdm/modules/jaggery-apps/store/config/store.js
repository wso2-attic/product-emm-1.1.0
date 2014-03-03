var config;
(function () {
    config = function () {
        var log = new Log(),
            pinch = require('/modules/pinch.min.js').pinch,
            config = require('/config/store.json'),
            process = require('process'),
            localIP = process.getProperty('carbon.local.ip'),
            host = process.getProperty('server.host'),
            httpPort = process.getProperty('http.port'),
            httpsPort = process.getProperty('https.port');

        pinch(config, /^/, function (path, key, value) {
            if ((typeof value === 'string') && value.indexOf('%https.ip%') > -1) {
                return value.replace('%https.ip%', 'https://' + localIP + ':' + httpsPort);
            } else if ((typeof value === 'string') && value.indexOf('%http.ip%') > -1) {
                return value.replace('%http.ip%', 'http://' + localIP + ':' + httpPort);
            }else if ((typeof value === 'string') && value.indexOf('%https.host%') > -1) {
                return value.replace('%https.host%', 'https://' + host);
            }else if ((typeof value === 'string') && value.indexOf('%http.host%') > -1) {
                return value.replace('%http.host%', 'http://' + host);
            }
            return  value;
        });
        return config;
    };
})();