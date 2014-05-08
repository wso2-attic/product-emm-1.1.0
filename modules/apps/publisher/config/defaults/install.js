/*
 Description: The following module contains the logic that can be used to install any asset which uses
 a json configuration file (e.g. sites or gadgets).The functions given above can be overridden by placing
 and install.js script with a module exposing the required method to be overridden.
 Filename: install.js
 Created Date: 16/8/2013
 */

var installer = function () {


    var log = new Log('master.installer');
    var utility = require('/modules/utility.js').rxt_utility();
    var carbon = require('carbon');
    var server = require('store').server;
    var GovernanceUtils = Packages.org.wso2.carbon.governance.api.util.GovernanceUtils;
    var SUPER_TENANT_ID = -1234;
    var SEARCH_INDEX = 'overview_name';
    var DESIRED_LIFECYCLE_STATE = 'Published';
    var PROMOTE_COUNT = 4;    //The number of promote attempts before giving up reaching desired state.
    var INVOKED_OPERATION = 'Promote'; //The action invoked to reach the desired state.
    var DEFAULT_LIFECYCLE = 'SampleLifeCycle2';

    /*
     The function is used to initialize an individual asset by first reading the
     configuration file
     @context: An object containing a reference to the root of an asset
     */
    function onAssetInitialization(context) {
        log.debug('reading configuration data from ' + context.bundle.getName() + ' [json].');

        //obtain the configuration file
        var configFile = context.bundle.get({extension: 'json'}).result();

        //If the configuration file does not exist then stop.
        if (!configFile) {

            log.debug('unable to load configuration file for ' + context.bundle.getName());
            context['stopProcessing'] = true;
            return;
        }

        //Read the contents
        var configContents = configFile.getContents();
        var jsonConfig = parse(configContents);

        //Clone the object but ignore tags and rate
        var artifact = utility.cloneObject(jsonConfig, ['tags', 'rate']);


        artifact.attributes.images_thumbnail = context.assetPath + artifact.attributes.images_thumbnail;
        artifact.attributes.images_banner = context.assetPath + artifact.attributes.images_banner;
        //artifact.attributes.overview_url=context.assetPath+artifact.attributes.overview_url;
        //artifact.attributes.images_thumbnail = context.httpContext + artifact.attributes.images_thumbnail;
        //artifact.attributes.images_banner = context.httpContext + artifact.attributes.images_banner;


        //Create the deployment object
        context['artifact'] = artifact;


        //Set the tags
        context['tags'] = jsonConfig.tags.split(',');

        //Set the ratings
        context['rate'] = jsonConfig.rate;
        context['path'] = '/_system/governance/' + context.assetType + '/' + artifact.attributes.overview_provider +
            '/' + artifact.attributes.overview_name + '/' + artifact.attributes.overview_version;

        log.debug('tags located: ' + context.tags);
        log.debug('rate located: ' + context.rate);
    }

    /*
     The function initializes an asset by checking if an assets rxt is present
     in the registry.If it is not present then rxt template is copied to the directory
     @context: An object containing a reference to the root of an asset
     */
    function onAssetTypeInitialisation(context) {
        log.debug('master asset type initialization called.This should be overridden by using a installer script at the '
            + ' root level of the asset.');
    }

    /*
     The function is called to initialize registry logic.It is used to create an artifact manager instance
     which will be used to handle assets.
     */
    function onCreateArtifactManager(context) {

        //Create a registry instance
        var registry = new carbon.registry.Registry(server.instance(), {
            username: 'admin',
            tenantId: SUPER_TENANT_ID
        });

        //Load the governance artifacts
        GovernanceUtils.loadGovernanceArtifacts(registry.registry);

        try {
            //Create a new artifact manager
            var artifactManager = new carbon.registry.ArtifactManager(registry, context.assetType);
        } catch (e) {
            log.debug('unable to create artifactManager of type: ' + context.assetType);
            return;
        }

        var userManager = server.userManager(SUPER_TENANT_ID);

        context['artifactManager'] = artifactManager;
        context['registry'] = registry;
        context['userManager'] = userManager;

        log.debug('created artifact manager for ' + context.assetType);
    }

    /*
     The function is invoked when setting the permission of an asset.
     @context: An object containing a reference to the current asset bundle been processed
     */
    function onSetAssetPermissions(context) {
        var userManager = context.userManager;

        //log.debug('anon role: '+carbon.user.anonRole);
        log.debug('giving anon role GET rights to ' + context.path);
        userManager.authorizeRole(carbon.user.anonRole, context.path, carbon.registry.actions.GET);
    }

    /*
     The function is used to check if the current asset is present in the registry
     If the asset is present in the registry then the asset is updated.If not it is added.
     */
    function checkAssetInRegistry(context) {
        var artifactManager = context.artifactManager;
        var artifact = context.artifact;

        //Assume that the asset does not exist
        context['isExisting'] = false;

        //Check if the asset exists
        var locatedAssets = artifactManager.find(function (asset) {

            var attributes = asset.attributes;
            //Check if the search index is present
            if (attributes.hasOwnProperty(SEARCH_INDEX)) {

                //Check if the search index values are the same
                if (attributes[SEARCH_INDEX] == artifact.attributes[SEARCH_INDEX]) {

                    return true;
                }
            }
            return false;
        }, null);

        //Check if any assets were located
        if (locatedAssets.length > 0) {
            log.debug('asset is present');
            context['isExisting'] = true;
            context['currentAsset'] = locatedAssets[0];
        }

    }

    /*
     adds the asset to Social Cache DB. (this is a hack to warm up the cache,
     so it want be empty at start up)
     */
    function addToSocialCache(asset) {
        if (asset) {
            var domain = "carbon.super";

            var CREATE_QUERY = "CREATE TABLE IF NOT EXISTS SOCIAL_CACHE (id VARCHAR(255) NOT NULL,tenant VARCHAR(255),type VARCHAR(255), " +
                "body VARCHAR(5000), rating DOUBLE,  PRIMARY KEY ( id ))";
            var server = require('store').server;
            server.privileged(function () {
                var db = new Database("SOCIAL_CACHE");
                db.query(CREATE_QUERY);
                var combinedId = asset.type + ':' + asset.id;
                db.query("MERGE INTO SOCIAL_CACHE (id,tenant,type,body,rating) VALUES('" + combinedId + "','" + domain + "','" + asset.type  + "','',0)");
                db.close();
            });
        }
    }

    /*
     The function is used to add a new asset instance to the registry
     */
    function onAddAsset(context) {
        var artifactManager = context.artifactManager;
        var artifact = context.artifact;
        var name = artifact.attributes.overview_name;


        //Add the asset
        log.debug('about to add the asset : ' + artifact.name);

        //Store any resources in the Storage Manager
        context.dataInjector.inject(artifact, context.dataInjectorModes.STORAGE);

        artifactManager.add(artifact);

        var assets = artifactManager.find(function (adapter) {
            return (adapter.attributes.overview_name == name) ? true : false;
        }, null);

        context['currentAsset'] = assets[0] || null;
        //log.debug('added asset: ' + stringify(context.currentAsset));

        addToSocialCache(context.currentAsset);
        //log.debug('finished');
    }

    /*
     The function is invoked when updating an already existing asset
     */
    function onUpdateAsset(context) {
        var artifactManager = context.artifactManager;
        var currentAsset = context.currentAsset;
        var artifact = context.artifact;

        //Set the id
        artifact.id = currentAsset.id;
        //Disable createdtime update of a default asset
        artifact.attributes.overview_createdtime = currentAsset.attributes.overview_createdtime;

        //Store any resources in the Storage Manager
        context.dataInjector.inject(artifact, context.dataInjectorModes.STORAGE);

        artifactManager.update(artifact);
        //log.debug('finished updating the artifact : '+currentAsset.name);
    }

    /*
     The function attaches a lifecycle to the asset
     */
    function onAttachLifecycle(context) {
        var artifactManager = context.artifactManager;
        var currentAsset = context.currentAsset;
        var currentLifeCycleName = currentAsset.lifecycle || null;
        var currentLifeCycleState = currentAsset.lifecycleState || null;
        var attempts = 0;

        log.debug('attaching lifecycle to: '+currentAsset.attributes.overview_name);

        log.debug('current lifecycle: ' + currentLifeCycleName + ' , current state: ' + currentLifeCycleState);


        //Check if a lifecycle has been attached
        if (!currentLifeCycleName) {

            log.debug('before calling current asset ' + DEFAULT_LIFECYCLE);
            log.debug(currentAsset);

            //Attach the lifecycle
            artifactManager.attachLifecycle(DEFAULT_LIFECYCLE, currentAsset);

            //Update the current asset
            currentAsset = artifactManager.get(currentAsset.id);
        }
        else {
            //We skip moving to the Published state.
            log.debug('skipping promotion operations as a lifecycle has been attached');
            return;
        }

        //Try to reach the desired life-cycle state before the attempt limit
        while ((currentLifeCycleState != DESIRED_LIFECYCLE_STATE) && (attempts < PROMOTE_COUNT)) {

            artifactManager.promoteLifecycleState(INVOKED_OPERATION, currentAsset);

            //Update the current life-cycle state.
            currentLifeCycleState = artifactManager.getLifecycleState(currentAsset);

            //Increase the attempts by one
            attempts++;

            log.debug('current lifecycle state: ' + currentLifeCycleState);
        }

        log.debug('final state of : '+currentAsset.attributes.overview_name+' '+currentLifeCycleState);
    }

    /*
     The function is invoked when setting tags of an asset
     */
    function onSetTags(context) {

        var tags = context.tags;

        log.debug('adding tags [' + context.tags + '] to path ' + context.path);

        //Go through all tags
        for (tag in tags) {
            //Check if the tag is present
            if (tags.hasOwnProperty(tag)) {
                context.registry.tag(context.path, tags[tag]);
            }
        }

        log.debug('finished adding tags');
    }

    /*
     The function is invoked when setting the ratings for an asset
     */
    function onSetRatings(context) {

        var rate = context.rate;

        log.debug('adding rating : ' + context.rate + ' to path ' + context.path);

        if (!rate) {
            context.registry.rate(context.path, rate);
        }
    }


    return{
        onAssetInitialization: onAssetInitialization,
        onAssetTypeInitialisation: onAssetTypeInitialisation,
        onCreateArtifactManager: onCreateArtifactManager,
        onSetAssetPermissions: onSetAssetPermissions,
        checkAssetInRegistry: checkAssetInRegistry,
        onAddAsset: onAddAsset,
        onUpdateAsset: onUpdateAsset,
        onAttachLifecycle: onAttachLifecycle,
        onSetTags: onSetTags,
        onSetRatings: onSetRatings
    }
};


