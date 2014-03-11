/*
 Description: The following class is used to the sites provided in this directory.
 Filename: install.js
 Created Date: 16/8/2013
 */

var installer = function () {

    var log = new Log();
    var DESIRED_LIFECYCLE_STATE = 'Published';
    var DEFAULT_LIFECYCLE = 'MobileAppLifeCycle';
    var START_STATE='Initial';
    var robot=require('/modules/automation/lifecycle.robot.js').robot();

    var lifeCycleRobot=new robot.LifeCycleRobot();
    lifeCycleRobot.init({lifecycle:DEFAULT_LIFECYCLE});
    var pathToDesiredState=lifeCycleRobot.move(DEFAULT_LIFECYCLE,START_STATE,DESIRED_LIFECYCLE_STATE);

    /*
     The function initializes an asset by checking if an assets rxt is present
     in the registry.If it is not present then rxt template is copied to the directory
     @context: An object containing a reference to the root of an asset
     */

    function onAssetTypeInitialisation(context){
         log.debug('loading site rxt data');
    }

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

        var now = new String(new Date().valueOf());
        var length = now.length;
        var prefix = 20;
        var onsetVal = '';
        if (length != prefix) {
            var onset = prefix - length;
            for (var i = 0; i < onset; i++) {
                onsetVal += '0';
            }
        }
        now = onsetVal + now;


        artifact.attributes.images_thumbnail = context.assetPath + artifact.attributes.images_thumbnail;
        artifact.attributes.images_banner = context.assetPath + artifact.attributes.images_banner;
        artifact.attributes.overview_url = artifact.attributes.overview_url;
        artifact.attributes.overview_createdtime = now;
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
     The function attaches a lifecycle to the asset
     */
    function onAttachLifecycle(context) {
        var artifactManager = context.artifactManager;
        var currentAsset = context.currentAsset;
        var currentLifeCycleName = currentAsset.lifecycle || null;
        var currentLifeCycleState = currentAsset.lifecycleState || null;
        var attempts = 0;

        log.debug('attaching lifecycle to: ' + currentAsset.attributes.overview_name);

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

        log.debug('attempting to execute the robot path: '+stringify(pathToDesiredState));

        executeRobotPath(pathToDesiredState,artifactManager,currentAsset);

        log.debug('finished executing robot path');

        //Try to reach the desired life-cycle state before the attempt limit
        /*while ((currentLifeCycleState != DESIRED_LIFECYCLE_STATE) && (attempts < PROMOTE_COUNT)) {

            artifactManager.promoteLifecycleState(INVOKED_OPERATION, currentAsset);

            //Update the current life-cycle state.
            currentLifeCycleState = artifactManager.getLifecycleState(currentAsset);

            //Increase the attempts by one
            attempts++;

            log.debug('current lifecycle state: ' + currentLifeCycleState);
        }

        log.debug('final state of : ' + currentAsset.attributes.overview_name + ' ' + currentLifeCycleState);  */
    }

    function executeRobotPath(path,artifactManager,asset){
        var operation;

        for(var index in path){
            operation=path[index];

            log.debug('invoking action: '+operation.action);
            artifactManager.promoteLifecycleState(operation.action,asset);
            log.debug('new state: '+artifactManager.getLifecycleState(asset));

        }
    }

    return{
        onAssetTypeInitialisation: onAssetTypeInitialisation,
        onAssetInitialization: onAssetInitialization,
        onAttachLifecycle:onAttachLifecycle
    }
};


