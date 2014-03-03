var SERVER = 'server';

var SYSTEM_REGISTRY = 'system.registry';

var ANONYMOUS_REGISTRY = 'anonymous.registry';

var USER_MANAGER = 'user.manager';

var SERVER_OPTIONS = 'server.options';

var SERVER_EVENTS = 'server.events';

var TENANT_CONFIGS = 'tenant.configs';

/**
 * Initializes the server for the first time. This should be called when app is being deployed.
 * @param options
 */
var init = function (options) {
    var carbon = require('carbon'),
        event = require('/modules/event.js'),
        srv = new carbon.server.Server({
            tenanted: options.tenanted,
            url: options.server.https
        });
    application.put(SERVER, srv);
    application.put(SERVER_OPTIONS, options);

    application.put(TENANT_CONFIGS, {});

    event.on('tenantCreate', function (tenantId) {

    });

    event.on('tenantLoad', function (tenantId) {
        var log = new Log(),
            carbon = require('carbon'),
            config = configs(tenantId);
        //loads tenant's system registry
        config[SYSTEM_REGISTRY] = new carbon.registry.Registry(server(), {
            system: true,
            tenantId: tenantId
        });
        //loads tenant's anon registry
        config[ANONYMOUS_REGISTRY] = new carbon.registry.Registry(server(), {
            tenantId: tenantId
        });
        //loads tenant's user manager
        config[USER_MANAGER] = new carbon.user.UserManager(server(), tenantId);
    });

    event.on('tenantUnload', function (tenantId) {
        var config = configs(tenantId);
        delete config[tenantId];
    });

    event.on('login', function (tenantId, user, session) {
        //we check the existence of user manager in the application ctx and
        //decide whether tenant has been already loaded.
        /*log.debug('login : ' + tenantId + ' User : ' + JSON.stringify(user));
         if (application.get(tenantId + USER_MANAGER)) {
         //return;
         }
         event.emit('tenantCreate', tenantId);
         event.emit('tenantLoad', tenantId);*/
        var carbon = require('carbon'),
            server = require('/modules/server.js'),
            loginManager = carbon.server.osgiService('org.wso2.carbon.core.services.callback.LoginSubscriptionManagerService'),
            configReg = server.systemRegistry(tenantId).registry.getChrootedRegistry("/_system/config"),
            domain = carbon.server.tenantDomain({
                tenantId: tenantId
            });
        loginManager.triggerEvent(configReg, user.username, tenantId, domain);
    });
};

/**
 * This is just a util method. You need to validate the tenant before you use.
 * So, USE WITH CARE.
 * @param request
 * @param session
 */
var tenant = function (request, session) {
    var obj, domain, user, matcher,
        opts = options(),
        carbon = require('carbon');
    if (!opts.tenanted) {
        return {
            tenantId: carbon.server.superTenant.tenantId,
            domain: carbon.server.superTenant.domain,
            secured: false
        };
    }
    /*matcher = new URIMatcher(request.getRequestURI());
     if (matcher.match('/{context}/' + opts.tenantPrefix + '/{domain}') ||
     matcher.match('/{context}/' + opts.tenantPrefix + '/{domain}/{+any}')) {
     domain = matcher.elements().domain; */
    domain = request.getParameter('domain');
    user = require('/modules/user.js').current(session);
    if (user) {
        obj = {
            tenantId: user.tenantId,
            domain: user.domain,
            secured: true
        };
    } else {
        carbon = require('carbon');
        obj = {
            tenantId: carbon.server.tenantId({
                domain: domain
            }),
            domain: domain,
            secured: false
        };
    }
    //loads the tenant if it hasn't been loaded
    loadTenant(obj.tenantId);
    return obj;
};

var loadTenant = function (tenantId) {
    var config = configs(tenantId);
    if (config[ANONYMOUS_REGISTRY]) {
        return;
    }
    require('/modules/event.js').emit('tenantLoad', tenantId);
};

/**
 * Returns server options object.
 * @return {Object}
 */
var options = function () {
    return application.get(SERVER_OPTIONS);
};

/**
 * Returns the server instance.
 * @return {Object}
 */
var server = function () {
    return application.get(SERVER);
};

/**
 * Checks whether server runs on multi-tenanted mode.
 * @return {*}
 */
var tenanted = function () {
    return options().tenanted;
};

/**
 * Loads the tenant configs object or the tenant config of the given tenant.
 * @param tenantId
 * @return {*}
 */
var configs = function (tenantId) {
    var config = application.get(TENANT_CONFIGS);
    if (!tenantId) {
        return config;
    }
    return config[tenantId] || (config[tenantId] = {});
};

/**
 * Returns the system registry of the given tenant.
 * @param tenantId
 * @return {Object}
 */
var systemRegistry = function (tenantId) {
    var carbon,
        config = configs(tenantId);
    if (!config || !config[SYSTEM_REGISTRY]) {
        carbon = require('carbon');
        return new carbon.registry.Registry(server(), {
            system: true,
            tenantId: tenantId
        });
    }
    return configs(tenantId)[SYSTEM_REGISTRY];
};

/**
 * Returns the anonymous registry of the given tenant.
 * @param tenantId
 * @return {Object}
 */
var anonRegistry = function (tenantId) {
    var carbon,
        config = configs(tenantId);
    if (!config || !config[ANONYMOUS_REGISTRY]) {
        carbon = require('carbon');
        return new carbon.registry.Registry(server(), {
            tenantId: tenantId
        });
    }
    return configs(tenantId)[ANONYMOUS_REGISTRY];
};

/**
 * Returns the user manager of the given tenant.
 * @param tenantId
 * @return {*}
 */
var userManager = function (tenantId) {
    var carbon,
        config = configs(tenantId);
    if (!config || !config[USER_MANAGER]) {
        carbon = require('carbon');
        return new carbon.user.UserManager(server(), tenantId);
    }
    return configs(tenantId)[USER_MANAGER];
};

