var tokens = function (username, password) {
    var token,
        log = new Log(),
        base64 = require('/modules/base64.js'),
        store = require('/config/store.js').config();

    token = post(store.oauthEPR + '/token', {
        grant_type: 'password',
        username: username,
        password: password
    }, {
        'Authorization': 'Basic ' + base64.encode(store.oauth.clientId + ':' + store.oauth.clientSecret)
    }, 'json').data;
    log.debug(token);
    return token;
};

var validate = function () {

};

var register = function () {

};