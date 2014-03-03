/*
 The class is used to manage the assets which are deployed in the store
 */
var deploymentManagementModule = function () {

    var publisher = require('/modules/publisher.js').publisher(request, session);
    var rxtManager = publisher.rxtManager;
    var bundler = require('/modules/bundler.js').bundle_logic();
    var config = require('/config/publisher-tenant.json');


    var RXT_EXTENSION_PATH = config.paths.RXT_EXTENSION_PATH;
    var UI_CONFIG_FILE = '/config/ui.json';
    var ASSETS_URL = '/publisher/assets/';
    var APPLICATION_DM='deployment.manager';
    var log=new Log();


    function DeploymentManager() {
        this.bundleManager = new bundler.BundleManager({path: RXT_EXTENSION_PATH});
        this.deployedAssets = []; //The list of deployed assets
        this.deployedAssetData = [];
        this.uiConfig = {};
        this.init();
    }

    /*
     The function is used to load
     */
    DeploymentManager.prototype.init = function () {

        //Read the extension directory to check which assets have been deployed
        var rootBundle = this.bundleManager.getRoot();
        var that=this;
        //Go through each bundle in the extensions folder
        rootBundle.each(function (bundle) {

            //Check if the bundle is a json file
            if (bundle.getExtension() == 'json') {

                //The extension needs to include the .
                var bundleName = bundle.getName().replace('.'+bundle.getExtension(), '');

                //Add to the list of deployed assets
                that.deployedAssets.push(bundleName);
            }
            else{
                log.debug('non config file '+bundle.getName()+'present in '+RXT_EXTENSION_PATH);
            }
        });


        this.uiConfig = loadConfigFile(UI_CONFIG_FILE);
        this.deployedAssets = applyUiConfigSettings(this.uiConfig,this.deployedAssets);
        this.buildDeploymentData();
    };

    /*
     The function obtains the asset types that are visible in the UI
     */
    DeploymentManager.prototype.buildDeploymentData = function () {

        var assetName;

        //Go through rxtManager and check for similar templates
        for (var assetIndex in this.deployedAssets) {

            assetName = this.deployedAssets[assetIndex];

            //Find the template in the rxt manager
            var template = rxtManager.findAssetTemplate(function (template) {
                return (template.shortName == assetName);
            });

            var that = this;

            //If a template was returned we add required data
            this.deployedAssetData.push({
                assetType: template.shortName,
                assetTitle: template.pluralLabel,
                url: ASSETS_URL + template.shortName+'/',
                assetIcon: getIcon(that.uiConfig, template.shortName)
            });

        }
    };

    /*
    The function returns the asset data
    @return: A list containing the asset data
     */
    DeploymentManager.prototype.getAssetData=function(){
        return this.deployedAssetData;
    };

    /*
     The function applies the settings specified in the UI config file.If one is present
     the ignore list is checked and any ignored items in the deployedAssets is removed
     @deployedAssets: The list of deployed assets
     @return: A list of updated deployed assets based on the UI config file
     */
    function applyUiConfigSettings(uiConfig, deployedAssets) {

        var assetsBlock = uiConfig.assets || {};
        var ignored = assetsBlock.ignore || [];

        //Update the ignored list
        var newDeployedList = [];
        var currentAsset;

        //Check if there are any ignored assets
        for (var index in deployedAssets) {
            currentAsset = deployedAssets[index];
            if (ignored.indexOf(currentAsset) == -1) {
                log.debug('ignoring asset '+currentAsset+' as it is ignored in the ui config file: '+UI_CONFIG_FILE);
                newDeployedList.push(currentAsset);
            }
        }

        //Update the  deployed assets if an ignore block was specified
        if (newDeployedList.length > 0) {
            deployedAssets = newDeployedList;
        }


        return deployedAssets;
    }

    /*
     The function obtains icon information
     @uiConfig: A JSON containing UI configuration information
     @assetName: The name of the asset to be queried
     @return: The icon name of the provided assetName
     */
    function getIcon(uiConfig, assetName) {

        var assets = uiConfig.assets || {};
        var icons =assets.icons||{};

        if (icons.hasOwnProperty(assetName)) {
            return icons[assetName];
        }

        //Check if there is a default icon specified
        if (icons.hasOwnProperty('default')) {
            log.debug('using default icon for '+assetName+' specify a custom icon in the ui config file: '
                +UI_CONFIG_FILE);
            return icons['default'];
        }

        return '';
    }

    /*
     The function loads the configuration file from the file system
     @path: The path of the UI configuration file
     @return: A configuration object containing UI data
     */
    function loadConfigFile(path) {

        var config = {};

        var checkUIFile = new File(path);

        if (checkUIFile.isExists()) {
            config = require(path);
        }
        else{
            log.debug('a ui config file is not present at '+path);
        }

        return config;
    }

    function cached(){

        var instance=application.get(APPLICATION_DM);

       if(!instance){
            log.debug('returning a cached copy of the DeploymentManager');
            instance=new DeploymentManager();
            application.put(APPLICATION_DM,instance);
        }

        return instance;
    }

    return{
        DeploymentManager:DeploymentManager,
        cached:cached
    }

}
