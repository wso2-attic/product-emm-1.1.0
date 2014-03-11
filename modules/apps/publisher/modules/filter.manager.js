/*
 Descripiton:The filter manager is used to filter assets before been presented to the user
 Filename: filter.manager.js
 Created Date: 7/10/2013
 */

var filterManagementModule = function () {

    var log = new Log('filter.manager');
    var bundler = require('/modules/bundler.js').bundle_logic();
    var config = require('/config/publisher-tenant.json');
    var FILTER_PATH = '/modules/filters';
    var EXT_PATH = config.paths.RXT_EXTENSION_PATH;
    var APP_FM = 'filter.manager';
    var LOGGED_IN_USER = 'LOGGED_IN_USER';

    function FilterManager() {
        this.filters = [];
        this.um = null;
        this.bundleManager = new bundler.BundleManager({path: FILTER_PATH});
        this.configs = {};

        this.init();
        this.readConfig();
    }

    /*
     The function checks the filters directory for any filters and loads them to memory
     */
    FilterManager.prototype.init = function () {

        var root = this.bundleManager.getRoot();

        var that = this;

        //Go through each bundle
        root.each(function (bundle) {

            var file = require(FILTER_PATH + '/' + bundle.getName()).filterModule();

            //Load up the filter
            that.filters.push({name: bundle.getName(), script: file});
        });

    };

    /*
     The function is used to read the asset extension files
     */
    FilterManager.prototype.readConfig = function () {

        var configBundleManager = new bundler.BundleManager({path: EXT_PATH});

        //Obtain the reference to the root directory of the extensions directory
        var root = configBundleManager.getRoot();

        var that = this;

        root.each(function (bundle) {

            //We only examine the configuration files
            if (bundle.getExtension() == 'json') {

                var name = bundle.getName().replace('.' + bundle.getExtension(), '');

                that.configs[name] = require(EXT_PATH + '/' + bundle.getName());
            }
        });
    };

    /*
     The function applies a set of filters on the provided data.The data can either be a
     an object or an array of objects
     @data: The data to be filtered
     @return: A filtered array of data
     */
    FilterManager.prototype.filter = function (data,session) {

        var filter;
        var context = {};
        var isContinued = true;

        var assetType;
        var isObject = true;
        var filterName;

        //Determine if we are filtering a single object or an array
        if (data instanceof Array) {

            isObject = false;
        }

        var user = require('store').server.current(session);

        context['data'] = getData(data);
        context['roles'] = user.getRoles();
        context['username'] = user.username;

        //Obtain the configuration
        assetType = getConfigType(context['data']);

        //We have to stop filtering as we cannot determine the type of the data
        if (!assetType) {
            log.debug('cannot apply filters as the asset type is not known');
            return;
        }

        context['config'] = this.configs[assetType];

        log.debug('applying filters for asset type: '+assetType);

        //Go through all of the filters
        for (var index in this.filters) {
            filter = this.filters[index].script;
            filterName = this.filters[index].name;


            //Check if the filter can be applied
            if (filter.isApplicable(context)) {

                log.debug('executing filter ' + filterName);

                //A filter can stop processing if false is returned
                isContinued = filter.execute(context);

                //Stop processing if the filter signals it to stop
                if (!isContinued) {

                    log.debug('stopping execution of filters as a kill signal was provided by ' + filterName);

                    return prepareOutput(isObject, context['data']);
                }
            }

        }

        log.debug('finished applying filters for asset type: '+assetType);

        return prepareOutput(isObject, context['data']);
    };

    /*
     The function is used to set required objects (e.g. User Manager)
     */
    FilterManager.prototype.setContext = function (um) {
        this.um = um;
    };

    /*
     The function is used to build the output object
     @isObject: A flag indicating the form of input to the filter manager
     @data: An array of data that has been filtered
     @return: If the original input was an object a single object is returned,else an array
     */
    function prepareOutput(isObject, data) {

        //If there is no data then create an empty array
        data = data || [];

        if (isObject) {
            return data[0];
        }
        else {
            return data;
        }
    }

    /*
     The function is used to determine the type of the asset been filtered
     @data: An array of assets of the same type
     @return: If an array is passed in the tye of the assets is returned,else null
     */
    function getConfigType(data) {

        //Check if there is any data
        if (data.length == 0) {
            return null;
        }

        //We assume that the array consists of assets of the same type
        var item = data[0];

        if (item.hasOwnProperty('type')) {
            return item['type'];
        }

        log.debug('data passed into filter manager is not in a valid format (not an object or array)');

        return null;

    }


    /*
     The function is used to convert a single object into an array
     @data: An array or an object
     @return: An array of data
     */
    function getData(data) {

        var list = [];

        if (data instanceof Array) {
            list = data;

        } else {
            list.push(data);
        }

        return list;
    }

    /*
    The function returns a cached copy of the filter manager
     */
    function getCached() {
        var instance=application.get(APP_FM);

        if(!instance){
            instance=new FilterManager();
            application.put(APP_FM,instance);
        }

        return instance;
    }

    return{
        FilterManager: FilterManager,
        cached:getCached
    }
}
