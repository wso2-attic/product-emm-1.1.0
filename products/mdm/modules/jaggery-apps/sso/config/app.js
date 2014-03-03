var configs = require('/config/sso.js').config();

var server = require('/modules/server.js');
server.init(configs);

var user = require('/modules/user.js');
user.init(configs);

var event = require('/modules/event.js');


var STORE_CONFIG_PATH = '/_system/config/sso/configs/sso.json';

var server = require('/modules/server.js');
server.init(configs);

var user = require('/modules/user.js');
user.init(configs);

var log = new Log();

event.on('tenantCreate', function (tenantId) {
    var carbon = require('carbon'),
        system = server.systemRegistry(tenantId);
    system.put(STORE_CONFIG_PATH, {
        content: JSON.stringify({
            "permissions": {
                "login": {
                    "/permission/admin/login": ["ui.execute"]
                }
            }
        }),
        mediaType: 'application/json'
    });
});

event.on('tenantLoad', function (tenantId) {
    var carbon = require('carbon'),
        config = server.configs(tenantId),
        reg = server.systemRegistry(tenantId),
        um = server.userManager(tenantId);

    //check whether tenantCreate has been called
    if (!reg.exists(STORE_CONFIG_PATH)) {
    }
    event.emit('tenantCreate', tenantId);

    config[user.USER_OPTIONS] = {
        "permissions": {
            "login": {
                "/permission/admin/login": ["ui.execute"]
            }
        }
    };
});

/*
var log = new Log();
log.debug('XXXXXXXXXXXXXXXXXXXXXXX');

event.on('tenantLoad', function (tenantId) {

    var log = new Log();
    log.debug('======================================================================================');
    event.emit('tenantCreate', tenantId);
    var server = require('/modules/server.js');
    var user = require('/modules/user.js');
    var config = server.configs(tenantId);
    config[user.USER_OPTIONS] = {
        "permissions": {
            "login": {
                "/permission/admin/login": ["ui.execute"]
            }
        }
    };
});*/
