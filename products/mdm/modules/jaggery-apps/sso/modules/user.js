var USER = 'server.user';

var USER_REGISTRY = 'server.user.registry';

var USER_OPTIONS = 'server.user.options';

var USER_SPACE = 'server.user.space';

var USER_ROLE_PREFIX = 'Internal/private_';

/**
 * Initializes the user environment for the specified tenant. If it is already initialized, then will be skipped.
 */
var init = function (options) {
    var event = require('/modules/event.js');
    event.on('tenantCreate', function (tenantId) {
        var role, roles,
            server = require('/modules/server.js'),
            um = server.userManager(tenantId),
            options = server.options();
        roles = options.roles;
        for (role in roles) {
            if (roles.hasOwnProperty(role)) {
                if (um.roleExists(role)) {
                    um.authorizeRole(role, roles[role]);
                } else {
                    um.addRole(role, [], roles[role]);
                }
            }
        }
        /*user = um.getUser(options.user.username);
         if (!user.hasRoles(options.userRoles)) {
         user.addRoles(options.userRoles);
         }*/
        //application.put(key, options);
    });

    event.on('tenantLoad', function (tenantId) {

    });

    event.on('tenantUnload', function (tenantId) {

    });

    event.on('login', function (tenantId, user, session) {
        var space, um, perms,
            log = new Log(),
            server = require('/modules/server.js'),
            carbon = require('carbon'),
            registry = server.systemRegistry(tenantId);
        session.put(USER, user);
        session.put(USER_REGISTRY, new carbon.registry.Registry(server.server(), {
            username: user.username,
            tenantId: tenantId
        }));
        space = userSpace(user.username);
        session.put(USER_SPACE, space);
        if (!registry.exists(space)) {
            registry.put(space, {
                collection: true
            });
            if (log.isDebugEnabled()) {
                log.debug('user space was created for user : ' + user.username + ' at ' + space);
            }
        }
        if (!user.isAuthorized(space, carbon.registry.actions.PUT)) {
            um = server.userManager(tenantId);
            perms = {};
            perms[space] = [carbon.registry.actions.GET, carbon.registry.actions.PUT, carbon.registry.actions.DELETE];
            um.authorizeRole(privateRole(user.username), perms);
            if (log.isDebugEnabled()) {
                log.debug('user role ' + privateRole(user.username) + ' was authorized to access user space ' + space);
            }
        }
    });

    event.on('logout', function (tenantId, user, session) {
        session.remove(USER);
        session.remove(USER_SPACE);
        session.remove(USER_REGISTRY);
    });
};

/**
 * Returns user options of the tenant.
 * @return {Object}
 */
var options = function (tenantId) {
    var server = require('/modules/server.js');
    return server.configs(tenantId)[USER_OPTIONS];
};

/**
 * Logs in a user to the store. Username might contains the domain part in case of MT mode.
 * @param username ruchira or ruchira@ruchira.com
 * @param password
 * @param session
 * @return {boolean}
 */
var login = function (username, password, session) {
    var carbon = require('carbon'),
        event = require('/modules/event.js'),
        server = require('/modules/server.js'),
        serv = server.server();
    if (!serv.authenticate(username, password)) {
        return false;
    }
    return permitted(username, session);
};

var permitted = function (username, session) {
    //load the tenant if it hasn't been loaded yet.
    var opts, um, user, perms, perm, actions, length, i,
        authorized = false,
        carbon = require('carbon'),
        server = require('/modules/server.js'),
        event = require('/modules/event.js'),
        usr = carbon.server.tenantUser(username);
    if (!server.configs(usr.tenantId)) {
        event.emit('tenantCreate', usr.tenantId);
    }
    if (!server.configs(usr.tenantId)[USER_OPTIONS]) {
        event.emit('tenantLoad', usr.tenantId);
    }

    opts = options(usr.tenantId);
    //log.debug(usr.tenantId);
    um = server.userManager(usr.tenantId);
    user = um.getUser(usr.username);
    perms = opts.permissions.login;
    L1:
        for (perm in perms) {
            if (perms.hasOwnProperty(perm)) {
                actions = perms[perm];
                length = actions.length;
                for (i = 0; i < length; i++) {
                    if (user.isAuthorized(perm, actions[i])) {
                        authorized = true;
                        break L1;
                    }
                }
            }
        }
    if (!authorized) {
        return false;
    }
    event.emit('login', usr.tenantId, user, session);
    //TODO: ??
    if (opts.login) {
        opts.login(user, password, session);
    }
    return true;
};

/**
 * Checks whether the logged in user has permission to the specified action.
 * @param user
 * @param permission
 * @param action
 * @return {*}
 */
var isAuthorized = function (user, permission, action) {
    var server = require('/modules/server.js'),
        um = server.userManager(user.tenantId);
    return um.getUser(user.username).isAuthorized(permission, action);
};

/**
 * Returns the user's registry space. This should be called once with the username,
 * then can be called without the username.
 * @param username ruchira
 * @return {*}
 */
var userSpace = function (username) {
    try {
        return require('/modules/server.js').options().userSpace.store + '/' + username;
    } catch (e) {
        return null;
    }
};

/**
 * Get the registry instance belongs to logged in user.
 * @return {*}
 */
var userRegistry = function (session) {
    try {
        return session.get(USER_REGISTRY);
    } catch (e) {
        return null;
    }
};

/**
 * Logs out the currently logged in user.
 */
var logout = function () {
    var user = current(session),
        event = require('/modules/event.js'),
        opts = options(user.tenantId);
    if (opts.logout) {
        opts.logout(user, session);
    }
    event.emit('logout', user.tenantId, user, session);
};

/**
 * Checks whether the specified username already exists.
 * @param username ruchira@ruchira.com(multi-tenanted) or ruchira
 * @return {*}
 */
var userExists = function (username) {
    var server = require('/modules/server.js'),
        carbon = require('carbon'),
        usr = carbon.server.tenantUser(username);
    return server.userManager(usr.tenantId).userExists(usr.username);
};

var privateRole = function (username) {
    return USER_ROLE_PREFIX + username;
};

var register = function (username, password) {
    var user, role, id, perms, r, p,
        server = require('/modules/server.js'),
        carbon = require('carbon'),
        event = require('/modules/event.js'),
        usr = carbon.server.tenantUser(username),
        um = server.userManager(usr.tenantId);



    if (!server.configs(usr.tenantId)) {
        event.emit('tenantCreate', usr.tenantId);
    }
    if (!server.configs(usr.tenantId)[USER_OPTIONS]) {
        event.emit('tenantLoad', usr.tenantId);
    }

    var opts = options(usr.tenantId);

    um.addUser(usr.username, password, opts.userRoles);
    user = um.getUser(usr.username);
    role = privateRole(usr.username);
    id = userSpace(usr.username);
    perms = {};
    perms[id] = [
        'http://www.wso2.org/projects/registry/actions/get',
        'http://www.wso2.org/projects/registry/actions/add',
        'http://www.wso2.org/projects/registry/actions/delete',
        'authorize'
    ];
    p = opts.permissions.login;
    for (r in p) {
        if (p.hasOwnProperty(r)) {
            perms[r] = p[r];
        }
    }
    um.addRole(role, [], perms);
    user.addRoles([role]);
    if (opts.register) {
        opts.register(user, password, session);
    }
    event.emit('userRegister', usr.tenantId, user);
    //login(username, password);
};

/**
 * Returns the currently logged in user
 */
var current = function (session) {
    try {
        return session.get(USER);
    } catch (e) {
        return null;
    }
};

var loginWithSAML = function (username) {
    return permitted(username, session);
};