/*
 Description: Handles the logic related to deployment of assets.
 Filename: asset.deployment.js
 Created Date:13/8/2013
 */
var deployment_logic = function () {

    var utility = require('/modules/utility.js').rxt_utility();
    var bundler = require('/modules/bundler.js').bundle_logic();
    var pubConfig = require('/config/publisher.js').config();
    var storageConfig=require('/config/storage.json');
    var storageModule = require('/modules/data/storage.js').storageModule();
    var dataInjectorModule=require('/modules/data/data.injector.js').dataInjectorModule();


    var log = new Log('asset.deployment');

    /*
     Name of install script and module
     */
    var INSTALL_SCRIPT_NAME = 'install.js';
    var INSTALLER_MODULE_NAME = 'installer';

    /*
     Names of methods used in the install script
     */
    var METHOD_ON_ASSET_INITIALIZATION = 'onAssetInitialization';
    var METHOD_ON_ASSET_TYPE_INITIALIZATION = 'onAssetTypeInitialisation';
    var METHOD_ON_CREATE_ARTIFACT_MANAGER = 'onCreateArtifactManager';
    var METHOD_ON_ASSET_PERMISSION = 'onSetAssetPermissions';
    var METHOD_ON_CHECK_ASSET = 'checkAssetInRegistry';
    var METHOD_ON_ADD_ASSET = 'onAddAsset';
    var METHOD_ON_UPDATE_ASSET = 'onUpdateAsset';
    var METHOD_ON_SET_TAGS = 'onSetTags';
    var METHOD_ON_SET_RATING = 'onSetRatings';
    var METHOD_ON_ATTACH_LIFECYCLE = 'onAttachLifecycle';

    /*
     Deploys the assets in a provided path
     */
    function Deployer(options) {
        this.config = null;
        utility.config(options, this);
        this.bundleManager = null;
        this.handlers = {};
        this.masterScriptObject = {};
        this.dataInjector=new dataInjectorModule.DataInjector();
        this.injectorModes=dataInjectorModule.Modes;

        this.storageManager = new storageModule.StorageManager({
            context: 'storage',
            isCached: false,
            connectionInfo: {
                dataSource: storageConfig.dataSource
            }
        });

        //Add a reference to storageManager which will be used to store files
        this.dataInjector.addToContext('storageManager',this.storageManager);
    }

    /*
     Loads the bundle manager
     */
    Deployer.prototype.init = function () {
        log.debug('initializing bundle manager for ' + this.config.root);

        this.bundleManager = new bundler.BundleManager({
            path: this.config.root
        });

        log.debug('finished initializing bundle manager');

    };

    /*
     The function allows a third party handler to be registered for
     a given asset type
     @assetType: The plural name of the asset to be handled
     @handler: Some handling logic
     */
    Deployer.prototype.register = function (assetType, handler) {
        this.handlers[assetType] = handler;
    };

    /*
     The function is responsible for invoking the logic for a given a asset typ
     @assetType: The asset type to be invoked
     @bundle: The bundle containing information on the asset
     @masterContext: The context inherited from deploying an asset type
     */
    Deployer.prototype.invoke = function (assetType, bundle, masterContext) {

        var artifactManager = masterContext.artifactManager || null;
        var userManager = masterContext.userManager || null;
        var registry = masterContext.registry || null;

        var httpContext = pubConfig.server.http + caramel.configs().context + this.bundleManager.path + '/' + assetType + '/';
        var assetPath=this.bundleManager.path+'/'+assetType+'/';

        //Check if any of the vital resources are missing
        if ((!artifactManager) || (!userManager) || (!registry)) {

            log.debug('there is no artifact manager ,userManager or registry  for ' + assetType + ' that can handle deployment.');
            return;
        }

        //Check if a handler is present
        if (this.handlers.hasOwnProperty((assetType))) {
            var basePath = this.bundleManager.path + '/' + assetType;

            //Check if an install script can be found within the bundle
            var script = getInstallScript(bundle, basePath);

            var scriptObject = this.handlers[assetType];

            var modifiedScriptObject = scriptObject;

            //Only override if there is a script
            if (script) {
                //Obtain a script object with overriden functions if one is present
                modifiedScriptObject = scriptObject.override(script);
            }
            var context = {};
            context['bundle'] = bundle;
            context['httpContext'] = httpContext;
            context['artifactManager'] = artifactManager;
            context['userManager'] = userManager;
            context['registry'] = registry;
            context['assetType'] = assetType;
            context['dataInjector']=this.dataInjector;
            context['dataInjectorModes']=this.injectorModes;
            context['assetPath']=assetPath;

            //Initializes the asset by reading the configuration file
            modifiedScriptObject.invoke(METHOD_ON_ASSET_INITIALIZATION, [context]);

            //Check if the asset exists
            modifiedScriptObject.invoke(METHOD_ON_CHECK_ASSET, [context]);

            //Check if the asset already exists
            if (context.isExisting) {
                modifiedScriptObject.invoke(METHOD_ON_UPDATE_ASSET, [context]);
            }
            else {
                modifiedScriptObject.invoke(METHOD_ON_ADD_ASSET, [context]);
            }

            //Check if there is a current asset to which the operations can be performed
            if (!context.currentAsset) {
                log.debug('there is no current asset.Aborting all other operations.');
                return;
            }

            //Set the default permissions to the asset
            modifiedScriptObject.invoke(METHOD_ON_ASSET_PERMISSION, [context]);

            //Set the tags to the aaset
            modifiedScriptObject.invoke(METHOD_ON_SET_TAGS, [context]);

            //Set the rating
            modifiedScriptObject.invoke(METHOD_ON_SET_RATING, [context]);

            //Attach the life-cycle
            //log.debug('trying to attach lifecycle');
            modifiedScriptObject.invoke(METHOD_ON_ATTACH_LIFECYCLE, [context]);
            //log.debug('finished');

            return;
        }

        /*if (this.handlers.hasOwnProperty(assetType)) {
         this.handlers[assetType](bundle, {currentPath: this.config.root + '/' + assetType + '/' + bundle.getName(), type: assetType});
         }*/

        log.debug('no handler specified for deploying : ' + assetType);
    };

    /*
     The function is used to automatically deploy any assets defined in the configuration
     */
    Deployer.prototype.autoDeploy = function () {
        var that = this;

        log.debug('attempting to locate master install script.');

        //Break up the path x/y/z into its components x,y,and z
        var pathComponents = this.bundleManager.path.split('/');
        var path = '';

        /*Need to omit the last part in the path
         Given a path such as x/y/z
         Then path.length-1 = z
         We are currently in z, so this loop omits the z path */
        for (var index = 0; index < pathComponents.length - 1; index++) {
            path += '/' + pathComponents[index];
        }

        //Load up the master script .
        var masterInstallScript = getInstallScript(this.bundleManager.getRoot(), path);

        if (!masterInstallScript) {
            log.debug('aborting auto deployment as the master install script was not found.This should be present as install.js in the '
                + this.bundleManager.path);
            return;
        }
        //Create a master script object
        this.masterScriptObject = new ScriptObject(masterInstallScript);

        log.debug('starting auto deploying assets in ' + this.config.root);

        this.bundleManager.getRoot().each(function (asset) {

            //Check if the bundle is a directory
            if (!asset.isDirectory()) {

                log.debug('ignoring ' + asset.getName() + ' as it is not a deployable bundle.');
                return;
            }
            log.debug('auto deployment of ' + asset.getName());
            that.deploy(asset.getName());
        })
    }

    /*
     The function deploys a provided asset type by invoking the handlers
     @assetType: The asset type to be deployed
     */
    Deployer.prototype.deploy = function (assetType) {

        //Locate the configuration information for the asset type
        var assetConfiguration = findConfig(this.config, assetType);

        //Check if a configuration block exists for the
        //provided asset type
        if (!assetConfiguration) {
            log.debug('could not deploy ' + assetType + ' as configuration information was not found.');
            return;
        }

        //Check if the asset type has been ignored
        if (isIgnored(this.config, assetType)) {
            log.debug('asset type : ' + assetType + ' is ignored.');
            return;
        }

        //Obtain the bundle for the asset type
        var rootBundle = this.bundleManager.get({name: assetType});
        var context = {};
        //A root bundle exists for the asset type (e.g. gadgets folder)
        if (rootBundle) {

            var that = this;

            log.debug('[' + assetType.toUpperCase() + '] been deployed.');
            var basePath = this.bundleManager.path;

            //Check if there is a root level install script specified
            var script = getInstallScript(rootBundle, basePath);

            //Assume there will not be a script to override the master script
            var scriptObject = this.masterScriptObject;

            //Check if a script is present to override master install script
            if (script) {

                //Create an overridden script object from the master script
                scriptObject = this.masterScriptObject.override(script);
            }

            this.handlers[assetType] = scriptObject;

            //Call the asset type initialization logic
            scriptObject.invoke(METHOD_ON_ASSET_TYPE_INITIALIZATION, [context]);

            //Create the artifact manager which will handle all of the asset creation
            context['assetType'] = findAssetType(assetType);

            //Create the registry, artifactManager and userManager instances
            scriptObject.invoke(METHOD_ON_CREATE_ARTIFACT_MANAGER, [context]);

            //Deploy each bundle
            rootBundle.each(function (bundle) {

                log.debug('deploying ' + assetType + ' : ' + bundle.getName());

                //Check if the bundle is a directory
                if (!bundle.isDirectory()) {
                    log.debug('ignoring bundle: ' + bundle.getName() + ' not a deployable target');
                    return;
                }

                if (isIgnored(assetConfiguration, bundle.getName())) {
                    //log.debug('ignoring ' + assetType + " : " + bundle.getName() + '. Please change configuration file to enable.');
                    return;
                }
                that.invoke(assetType, bundle, context);

                //log.debug('finished deploying ' + assetType + ' : ' + bundle.getName());

            });

            log.debug('[' + assetType.toUpperCase() + '] ending deployment');
        }
        else {
            log.debug('could not deploy asset ' + assetType + ' since a bundle was not found.');
        }

    };


    /*
     The function locates the configuration information on a per asset basis
     */
    function findConfig(masterConfig, assetType) {
        var assetData = masterConfig.assetData || [];
        var asset;

        //Locate the asset type
        for (var index in assetData) {

            asset = assetData[index];

            if (asset.type == assetType) {
                return asset;
            }
        }

        return null;
    }

    /*
     The function returns the asset from its plural name
     */
    function findAssetType(pluralAssetName) {
        var lastCharacter = pluralAssetName.charAt(pluralAssetName.length - 1);

        if (lastCharacter == 's') {
            return pluralAssetName.substring(0, pluralAssetName.length - 1);
        }

        return pluralAssetName;
    }

    /*
     The function checks whether the provided target should be ignored
     based on the presence of an ignore array
     @config: An object containing an ignore property
     @target: The string which will be checked
     @return: True if the target is ignored or if there is no ignore block,else false
     */
    function isIgnored(config, target) {
        var ignored = config.ignore || [];

        if (ignored.indexOf(target) != -1) {
            return true;
        }

        return false;
    }

    /*
     The function locates an install script  within a given bundle
     @bundle:The bundle within which the install script must be located
     @return:An object containing the install script (imported using require)
     */
    function getInstallScript(bundle, rootLocation) {
        var bundleLocation = bundle.getName();
        var script = bundle.get({name: INSTALL_SCRIPT_NAME}).result();
        var scriptInstance;
        var scriptPath;

        if (script) {
            scriptPath = rootLocation + '/' + bundleLocation + '/' + script.getName();
            log.debug('script found : ' + scriptPath);
            scriptInstance = require(scriptPath);
        }

        return scriptInstance;
    }

    /*
     The class is used to encapsulates script logic
     in an invokable form
     */
    function ScriptObject(scriptInstance) {
        this.functionObject = {};

        if (scriptInstance) {
            this.init(scriptInstance);
        }

    }

    /*
     The method creates a functionObject using the script instance
     @scriptInstance: A string containing contents of a script
     */
    ScriptObject.prototype.init = function (scriptInstance) {
        var functionInstance;
        var logicObject = {};
        //Check if the module we need is present
        if (scriptInstance.hasOwnProperty(INSTALLER_MODULE_NAME)) {

            log.debug('installer module found.');

            logicObject = scriptInstance[INSTALLER_MODULE_NAME]();

            //Go through each exposed method
            for (var index in logicObject) {

                functionInstance = logicObject[index];

                this.functionObject[index] = functionInstance;
            }
        }
    };

    /*
     The function invokes a provided method with the given parameters
     @methodName: The method name to be invoked
     @arguments: An array of arguments to be passed into the method
     */
    ScriptObject.prototype.invoke = function (methodName, arguments) {
        if (this.functionObject.hasOwnProperty(methodName)) {
            //log.debug('invoking method: ' + methodName);
            //log.debug(this.functionObject);
            this.functionObject[methodName].apply(this.functionObject, arguments);
            return true;
        }
        log.debug('unable to invoke ' + methodName);
        return false;
    };

    /*
     The function is used to create a new ScriptObject with
     the provided script.Any matching functions are overridden
     @scriptInstance:A script containing overridding logic
     @return: A new ScriptObject with methods given in the scriptInstance
     used to override the base methods
     */
    ScriptObject.prototype.override = function (scriptInstance) {

        //Create a copy of the current object
        var cloned = clone(this.functionObject);
        var logicObject;

        if (scriptInstance.hasOwnProperty(INSTALLER_MODULE_NAME)) {
            logicObject = scriptInstance[INSTALLER_MODULE_NAME]();
            //log.debug('clone: '+stringify(cloned));

            //Go through each property in the logic object
            for (var index in logicObject) {
                log.debug('overriding ' + index);

                //Check if the clone has the property before attempting
                //to replace
                if (cloned.hasOwnProperty(index)) {
                    cloned[index] = logicObject[index];
                }
            }

        }

        //Create a new script object which will host the clone
        var scriptObject = new ScriptObject();
        scriptObject.functionObject = cloned;

        return scriptObject;
    };

    /*
     The function creates a clone of the provided object
     @object: The object to be cloned
     @return: A duplicate(clone) of the provided object
     */
    function clone(object) {
        var cloned = {};
        //Go through each property
        for (var index in object) {
            cloned[index] = object[index];
        }

        return cloned;
    }

    return{
        Deployer: Deployer
    }
};
