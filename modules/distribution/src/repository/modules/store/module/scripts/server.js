var server = {};

(function (server) {
    var SERVER = 'server';

    var SYSTEM_REGISTRY = 'system.registry';

    var ANONYMOUS_REGISTRY = 'anonymous.registry';

    var USER_MANAGER = 'user.manager';

    var SERVER_OPTIONS = 'server.options';

    var SERVER_EVENTS = 'server.events';

    var TENANT_CONFIGS = 'tenant.configs';

    var USER = 'server.user';

    var log = new Log();

    /**
     * Initializes the server for the first time. This should be called when app is being deployed.
     * @param options
     */
    server.init = function (options) {
        var carbon = require('carbon'),
            event = require('event'),
            srv = new carbon.server.Server({
                url: options.server.https
            });
        application.put(SERVER, srv);
        application.put(SERVER_OPTIONS, options);

        application.put(TENANT_CONFIGS, {});

        event.on('tenantCreate', function (tenantId) {

        });

        event.on('tenantLoad', function (tenantId) {
            var config, domain, service,
                carbon = require('carbon'),
                reg = server.systemRegistry(tenantId),
                TenantAxisUtils = org.wso2.carbon.core.multitenancy.utils.TenantAxisUtils;

            //check whether tenantCreate has been called
            if (!reg.exists(options.tenantConfigs)) {
                event.emit('tenantCreate', tenantId);
            }

            //initialize tenant registry
            if (carbon.server.superTenant.tenantId != tenantId) {
                domain = carbon.server.tenantDomain({
                    tenantId: tenantId
                });
                service = carbon.server.osgiService('org.wso2.carbon.utils.ConfigurationContextService');
                TenantAxisUtils.getTenantConfigurationContext(domain, service.getServerConfigContext());
            }

            config = server.configs(tenantId);
            //loads tenant's system registry
            config[SYSTEM_REGISTRY] = new carbon.registry.Registry(server.instance(), {
                system: true,
                tenantId: tenantId
            });
            //loads tenant's anon registry
            config[ANONYMOUS_REGISTRY] = new carbon.registry.Registry(server.instance(), {
                tenantId: tenantId
            });
            //loads tenant's user manager
            config[USER_MANAGER] = new carbon.user.UserManager(server.instance(), tenantId);
        });

        event.on('tenantUnload', function (tenantId) {
            var config = server.configs(tenantId);
            delete config[tenantId];
        });

        event.on('login', function (tenantId, user, session) {
            //we check the existence of user manager in the application ctx and
            //decide whether tenant has been already loaded.
            /*log.info('login : ' + tenantId + ' User : ' + JSON.stringify(user));
             if (application.get(tenantId + USER_MANAGER)) {
             //return;
             }
             event.emit('tenantCreate', tenantId);
             event.emit('tenantLoad', tenantId);*/
            var carbon = require('carbon'),
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
    server.tenant = function (request, session) {
        var obj, domain, user,
            carbon = require('carbon');
        /*matcher = new URIMatcher(request.getRequestURI());
         if (matcher.match('/{context}/' + opts.tenantPrefix + '/{domain}') ||
         matcher.match('/{context}/' + opts.tenantPrefix + '/{domain}/{+any}')) {
         domain = matcher.elements().domain; */
        user = server.current(session);
        if (user) {
            obj = {
                tenantId: user.tenantId,
                domain: carbon.server.tenantDomain({
                    tenantId: user.tenantId
                }),
                username: user.username,
                secured: true
            };
        } else {
            carbon = require('carbon');
            domain = request.getParameter('domain') || carbon.server.superTenant.domain;
            obj = {
                tenantId: carbon.server.tenantId({
                    domain: domain
                }),
                domain: domain,
                username: carbon.user.anonUser,
                secured: false
            };
        }
        //loads the tenant if it hasn't been loaded
        server.loadTenant(obj);
        return obj;
    };

    server.loadTenant = function (o) {
        var service, ctxs, TenantAxisUtils,
            carbon = require('carbon'),
            config = server.configs(o.tenantId);
        //log.info(java.lang.Thread.currentThread().getId() + ' : ' + stringify(o));
        if (o.tenantId == carbon.server.superTenant.tenantId) {
            if (config[ANONYMOUS_REGISTRY]) {
                return;
            }
        } else {
            service = carbon.server.osgiService('org.wso2.carbon.utils.ConfigurationContextService');
            TenantAxisUtils = org.wso2.carbon.core.multitenancy.utils.TenantAxisUtils;
            ctxs = TenantAxisUtils.getTenantConfigurationContexts(service.getServerConfigContext());
            if (config[ANONYMOUS_REGISTRY] && ctxs.get(o.domain) != null) {
                return;
            }
        }
        require('event').emit('tenantLoad', o.tenantId);
    };

    /**
     * Returns server options object.
     * @return {Object}
     */
    server.options = function () {
        return application.get(SERVER_OPTIONS);
    };

    /**
     * Returns the server instance.
     * @return {Object}
     */
    server.instance = function () {
        return application.get(SERVER);
    };

    /**
     * Loads the tenant configs object or the tenant config of the given tenant.
     * @param tenantId
     * @return {*}
     */
    server.configs = function (tenantId) {
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
    server.systemRegistry = function (tenantId) {
        var carbon,
            config = server.configs(tenantId);
        if (!config || !config[SYSTEM_REGISTRY]) {
            carbon = require('carbon');
            return new carbon.registry.Registry(server.instance(), {
                system: true,
                tenantId: tenantId
            });
        }
        return server.configs(tenantId)[SYSTEM_REGISTRY];
    };

    /**
     * Returns the anonymous registry of the given tenant.
     * @param tenantId
     * @return {Object}
     */
    server.anonRegistry = function (tenantId) {
        var carbon,
            config = server.configs(tenantId);
        if (!config || !config[ANONYMOUS_REGISTRY]) {
            carbon = require('carbon');
            return new carbon.registry.Registry(server.instance(), {
                tenantId: tenantId
            });
        }
        return server.configs(tenantId)[ANONYMOUS_REGISTRY];
    };


    /**
     * Returns the currently logged in user
     */
    server.current = function (session, user) {
        if (arguments.length > 1) {
            session.put(USER, user);
            return user;
        }
        return session.get(USER);
    };

    /**
     * Returns the user manager of the given tenant.
     * @param tenantId
     * @return {*}
     */
    server.userManager = function (tenantId) {
        var carbon,
            config = server.configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            carbon = require('carbon');
            return new carbon.user.UserManager(server.instance(), tenantId);
        }
        return server.configs(tenantId)[USER_MANAGER];
    };

    server.privileged = function (fn, username) {
        return server.sandbox({
            tenantId: require('carbon').server.superTenant.tenantId,
            username: username
        }, fn);
    };

    server.sandbox = function (options, fn) {
        var context,
            log = new Log(),
            carbon = require('carbon'),
            PrivilegedCarbonContext = org.wso2.carbon.context.PrivilegedCarbonContext;
        PrivilegedCarbonContext.startTenantFlow();
        log.debug('startTenantFlow');
        try {
            context = PrivilegedCarbonContext.getThreadLocalCarbonContext();
            context.setTenantDomain(carbon.server.tenantDomain({
                tenantId: options.tenantId
            }));
            context.setTenantId(options.tenantId);
            context.setUsername(options.username || null);
            return fn();
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
            log.debug('endTenantFlow');
        }
    };
}(server));
