var PUBLISHER_CONFIG_PATH = '/_system/config/publisher/configs/publisher.json';

var TENANT_PUBLISHER = 'tenant.publisher';
var log=new Log('modules.publisher');
var utility=require('/modules/utility.js').rxt_utility();
var SUPER_TENANT=-1234;
var cleanUsername = function (username) {
    /**
     * this is a one-way hash function, @ is replaced if the user name is an email
     * if the user name is coming from a secondery user store it will be second.com/user hence
     * "/" will be replaced.
     */

    return username.replace('@', ':').replace('/', ':');
};
var init = function (options) {
    var event = require('event');

    event.on('tenantCreate', function (tenantId) {
        var role, roles,
            carbon = require('carbon'),
            mod = require('store'),
            server = mod.server,
            config = require('/config/publisher-tenant.json'),
            system = server.systemRegistry(tenantId),
            um = server.userManager(tenantId),
            CommonUtil = Packages.org.wso2.carbon.governance.registry.extensions.utils.CommonUtil,
            GovernanceConstants = org.wso2.carbon.governance.api.util.GovernanceConstants;

        system.put(options.tenantConfigs, {
            content: JSON.stringify(config),
            mediaType: 'application/json'
        });
        roles = config.roles;
        for (role in roles) {
            if (roles.hasOwnProperty(role)) {
                if (um.roleExists(role)) {
                    um.authorizeRole(role, roles[role]);
                } else {
                    um.addRole(role, [], roles[role]);
                }
            }
        }

        CommonUtil.addRxtConfigs(system.registry.getChrootedRegistry("/_system/governance"), tenantId);
        um.authorizeRole(carbon.user.anonRole, GovernanceConstants.RXT_CONFIGS_PATH, carbon.registry.actions.GET);
        log.debug('TENANT CREATED');
        addLifecycles(system);
    });

    event.on('tenantLoad', function (tenantId) {
        var store = require('store'),
            server = store.server,
            carbon = require('carbon'),
            config = server.configs(tenantId);
        var reg = server.systemRegistry(tenantId);
        var CommonUtil = Packages.org.wso2.carbon.governance.registry.extensions.utils.CommonUtil;
        var GovernanceConstants = org.wso2.carbon.governance.api.util.GovernanceConstants;
        var um = server.userManager(tenantId);
        var publisherConfig=require('/config/publisher-tenant.json');

        //Load the tag dependencies
        loadTagDependencies(reg);

        //Check if the tenant is the super tenant
        if(tenantId==SUPER_TENANT){

            log.debug('executing default asset deployment logic since super tenant has been loaded.');

            log.debug('attempting to load rxt templates to the registry.');

            //Try to deploy the rxts
            CommonUtil.addRxtConfigs(reg.registry.getChrootedRegistry("/_system/governance"), reg.tenantId);
            um.authorizeRole(carbon.user.anonRole, GovernanceConstants.RXT_CONFIGS_PATH, carbon.registry.actions.GET);

            log.debug('finished loading rxt templates to the registry.');

            //Attempt to load the default assets
            var deployer = require('/modules/asset.deployment.js').deployment_logic();

            log.debug('starting auto deployment of default assets.');

            //Create a deployment manager instance
            var deploymentManager = new deployer.Deployer({
                config: publisherConfig.defaultAssets
            });

            log.debug('initializing deployementManager');

            deploymentManager.init();

            deploymentManager.autoDeploy();

            log.debug('finished auto deployment of default assets.');
        }


    });



    event.on('login', function (tenantId, user, session) {
        configureUser(tenantId, user);
    });
};

var configs = function (tenantId) {
    var server = require('store').server,
        registry = server.systemRegistry(tenantId);
    return JSON.parse(registry.content(PUBLISHER_CONFIG_PATH));
};


var addLifecycles = function (registry) {
    var lc,
        files = new File('/config/lifecycles'),
        rootReg = registry.registry,
        configReg = rootReg.getChrootedRegistry('/_system/config'),
        CommonUtil = Packages.org.wso2.carbon.governance.lcm.util.CommonUtil;
    files.listFiles().forEach(function (file) {
        file.open('r');
        lc = file.readAll();
        file.close();

        //Create an xml from the contents
        var lcXml=new XML(lc);

        //Create a JSON object
        //TODO:This could be a problem -we are passing xml to JSON everytime!
        var lcJSON=utility.xml.convertE4XtoJSON(lcXml);

        //Check if the lifecycle is present
        var isPresent=CommonUtil.lifeCycleExists(lcJSON.name,configReg);

        log.debug('Is life-cycle present: '+isPresent);

        //Only add the lifecycle if it is not present in the registry
        if(!isPresent){

            log.debug('Adding life-cycle since it is not deployed.');

            CommonUtil.addLifecycle(lc, configReg, rootReg);
        }

    });
};

var publisher = function (o, session) {
    var publisher, tenantId, store,
        server = require('store').server;
    tenantId = (o instanceof Request) ? server.tenant(o, session).tenantId : o;
    publisher = session.get(TENANT_PUBLISHER);
    if (publisher) {
        return publisher;
    }
    publisher = new Publisher(tenantId, session);
    session.put(TENANT_PUBLISHER, publisher);
    return publisher;
};

var Publisher = function (tenantId, session) {
    var store = require('store'),
        server = store.server,
        user = store.user,
        managers = buildManagers(tenantId, user.userRegistry(session));
    this.tenantId = tenantId;
    this.modelManager = managers.modelManager;
    this.rxtManager = managers.rxtManager;
    this.routeManager = managers.routeManager;
    this.dataInjector=managers.dataInjector;
    this.DataInjectorModes=managers.DataInjectorModes;
    this.filterManager=managers.filterManager;
    this.storageSecurityProvider=managers.storageSecurityProvider;

};
/*

 Publisher.prototype.rxtManager = function() {
 return this.rxtManager;
 };*/

var buildManagers = function (tenantId, registry) {
    var ext_parser = require('/modules/ext/core/extension.parser.js').extension_parser();
    var ext_domain = require('/modules/ext/core/extension.domain.js').extension_domain();
    var ext_core = require('/modules/ext/core/extension.core.js').extension_core();
    var ext_mng = require('/modules/ext/core/extension.management.js').extension_management();
    var validationManagement=require('/modules/validations/validation.manager.js').validationManagement();
    var rxt_management = require('/modules/rxt.manager.js').rxt_management();
    var route_management = require('/modules/router-g.js').router();
    var dataInjectorModule=require('/modules/data/data.injector.js').dataInjectorModule();
    var filterManagementModule=require('/modules/filter.manager.js').filterManagementModule();
    var securityProviderModule=require('/modules/security/storage.security.provider.js').securityModule();
    var server=require('store').server;
    var userManager=server.userManager(tenantId);
    var storageSecurityProvider=new securityProviderModule.SecurityProvider();
    var filterManager=new filterManagementModule.FilterManager();


    log.debug('tenant: '+tenantId);

    //The security provider requires the registry and user manager to work
    storageSecurityProvider.provideContext(registry,userManager);

    log.debug(userManager);

    filterManager.setContext(userManager);

    var dataInjector=new dataInjectorModule.DataInjector();
    var injectorModes=dataInjectorModule.Modes;

    //var server=new carbon.server.Server(url);
    /*var registry=new carbon.registry.Registry(server,{
     systen:true,
     username:username,
     tenantId:carbon.server.superTenant.tenantId
     });*/
    var rxtManager = new rxt_management.RxtManager(registry);
    var routeManager = new route_management.Router();

    var server = require('store').server;
    var conf = configs(tenantId);
    var config = server.configs(tenantId);

    routeManager.setRenderer(conf.router.RENDERER);

    //All of the rxt xml files are read and converted to a JSON object called
    //a RxtTemplate(Refer rxt.domain.js)
    rxtManager.loadAssets();

    var parser = new ext_parser.Parser();

    //Go through each rxt template
    rxtManager.rxtTemplates.forEach(function (rxtTemplate) {
        parser.registerRxt(rxtTemplate);
    });

    parser.load(conf.paths.RXT_EXTENSION_PATH);

    var adapterManager = new ext_core.AdapterManager({parser: parser});
    adapterManager.init();

    var fpManager = new ext_core.FieldManager({parser: parser});
    fpManager.init();

    var ruleParser = new ext_parser.RuleParser({parser: parser});
    ruleParser.init();

    var actionManager = new ext_core.ActionManager({templates: parser.templates});
    actionManager.init();

    var validationManager=new validationManagement.ValidationManager();

    var modelManager = new ext_mng.ModelManager({parser: parser, adapterManager: adapterManager,
        actionManager: actionManager, rxtManager: rxtManager ,validationManager:validationManager});

    return {
        modelManager: modelManager,
        rxtManager: rxtManager,
        routeManager: routeManager,
        dataInjector:dataInjector,
        DataInjectorModes:injectorModes,
        filterManager:filterManager,
        storageSecurityProvider:storageSecurityProvider
    };
};

/*
The function is used to load tag dependencies
 */
var loadTagDependencies=function(registry){

    var TAGS_QUERY='SELECT RT.REG_TAG_ID FROM REG_RESOURCE_TAG RT ORDER BY RT.REG_TAG_ID';
    var TAGS_QUERY_PATH='/_system/config/repository/components/org.wso2.carbon.registry/queries/allTags';

    //Check if the tag path exists
    var resource=registry.get(TAGS_QUERY_PATH);

    //Check if the tag is present
    if(!resource){

        log.debug('tag query path does not exist.');

        registry.put(TAGS_QUERY_PATH, {
            content: TAGS_QUERY,
            mediaType: 'application/vnd.sql.query',
            properties: {
                resultType: 'Tags'
            }
        });

        log.debug('tag query has been added.');
    }

};

/*
 The function is used to fill the permissions object. The permissions are applied
 to the users space e.g. username= test , and the gadget collection in the /_system/governance
 then the permissions will be applicable to
 /_system/governance/gadget/test.
 @username: The username of the account to which the permissions will be attached
 @permissions: An object of permissions which will be assigned to the newly created user role
 */
var buildPermissionsList = function (tenantId, username, permissions) {
    var log = new Log();
    log.debug('Entered buildPermissionsList');
    var store = require('store');
    var server = store.server;
    var user = store.user;
    //Obtain the accessible collections
    var accessible = user.configs(tenantId).accessible;
    log.debug(stringify(accessible));

    var id;
    var accessibleContext;
    var accessibleCollections;
    var context;
    var actions;
    var collection;
    var sysRegistry = server.systemRegistry(tenantId);

    //Go through all of the accessible directives
    for (var index in accessible) {

        accessibleContext = accessible[index];

        accessibleCollections = accessibleContext.collections;

        context = accessibleContext.context;     //e.g. /_system/governance/
        actions = accessibleContext.actions;     //read,write

        //Go through all of the collections
        for (var colIndex in accessibleCollections) {

            collection = accessibleCollections[colIndex];

            //Create the id used for the permissions
            id = context + '/' + collection + '/' + cleanUsername(username);


            //Check if a collection exists
            var col = sysRegistry.get(id);

            //Only add permissions if the path  does not exist
            if (col == undefined) {
                log.debug('collection: ' + id + ' does not exist.');
                //Assign the actions to the id
                permissions[id] = actions;

                //Create a dummy collection, as once permissions are
                //the user will be unable to create assets in the
                //parent collection.
                //Thus we create a user collection.
                sysRegistry = server.systemRegistry(tenantId);

                //Create a new collection if a new one does not exist
                sysRegistry.put(id, {
                    collection: true
                });
            }
            else {
                log.debug('collection: ' + id + 'is present.');
            }
        }

    }

    return permissions;
};

/*
 The function is used to configure a user that is about to login
 It performs the following;
 1. Add permissions for the accessible collections
 2. Assign a set of default roles (private_username and publisher)
 3. Check if a collection exists,if not create a new one.
 */

var configureUser = function (tenantId, user) {

    //Ignore adding permissions for the admin
    if (user.username == 'admin') {
        return;
    }

    var store = require('store');
    var server = store.server;
    var umod = store.user;
    var um = server.userManager(tenantId);
    var config = configs(tenantId);
    var user = um.getUser(user.username);
    var perms = {};
    var role = umod.privateRole(user.username);
    var defaultRoles = config.userRoles;
    var log = new Log();

    log.debug('Starting configuringUser.');

    //Create the permissions in the options configuration file
    perms = buildPermissionsList(tenantId, user.username, perms, server);

    //Only add the role if permissions are present

    if (!checkIfEmpty(perms)) {

        //log.debug('length: '+perms.length);

        //Register the role
        //We assume that the private_role is already present
        //TODO: This needs to be replaced.
        um.authorizeRole(role, perms);

        //log.debug('after add role');

        //user.addRoles(role);
    }

};

var checkIfEmpty = function (object) {
    for (var index in object) {
        if (object.hasOwnProperty(index)) {
            return false;
        }
    }

    return true;
};

var exec = function (fn, request, response, session) {
    var es = require('store'),
        carbon = require('carbon'),
        tenant = es.server.tenant(request, session),
        user = es.server.current(session);
    if(!user) {
        response.sendError(401, 'Unauthorized');
        return;
    }
    es.server.sandbox({
        tenantId: tenant.tenantId,
        username: user.username
    }, function () {
        //var configs = require('/config/publisher.js').config();
        return fn.call(null, {
            //tenant: tenant,
            //server: es.server,
            //usr: es.user,
            //user: user,
            //publisher: require('/modules/publisher.js').publisher(tenant.tenantId, session),
            //configs: configs,
            request: request,
            response: response,
            session: session,
            application: application
            //event: require('/modules/event.js'),
            //params: request.getAllParameters(),
            //files: request.getAllFiles(),
            //matcher: new URIMatcher(request.getRequestURI()),
            //log: new Log(request.getMappedPath())
        });
    });
};
