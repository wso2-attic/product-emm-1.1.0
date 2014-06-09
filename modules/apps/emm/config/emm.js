var config;
(function () {
    /* 
        Will be removing the confusion with the host and ip. 
        If carbon.xml hostname is available it will use it. 
        Otherwise it will use the ip. 
    */
    config = function () {
        var log = new Log(),
            pinch = require('/modules/pinch.min.js').pinch,
            config = require('/config/config.json'),
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
