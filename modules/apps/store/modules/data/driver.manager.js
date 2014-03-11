/*
Description:The class is used to manage the assembling of the database drivers.
            The script has facilities to load extensions for generating queries provided by the user.
            In order for queryProviders to be loaded they must be placed in a folder matching the
            database type (e.g. h2 ,mysql or oracle) and be named as FILE_QT (refer variable in script below)
Filename:  driver.manager.js
Created Date: 15/10/2013
 */
var driverManager=function(){

    var config=require('/config/storage.json');
    var utility=require('/modules/utility.js').rxt_utility();
    var bundler=require('/modules/bundler.js').bundle_logic();
    var log=new Log('driver.manager');

    var FILE_QP='query.provider.js';
    var FILE_QT='query.translator.js';
    var FILE_DRIVER='driver.js';
    var DEFAULT_DRIVER='h2';
    var EXTENSIONS_DIR='/modules/data/extensions';


    var dsm=org.wso2.carbon.ndatasource.core.DataSourceManager;


    var DB_DRIVERS={
        MYSQL_DRIVER:{key:'jdbc:mysql',value:'mysql'},
        ORACLE_DRIVER:{key:'jdbc:oracle',value:'oracle'},
        H2_DRIVER:{key:'jdbc:h2',value:'h2'},
        UNSUPPORTED:{key:'none',value:'none'}
    };

    /*
   Paths
     */
    var defaultPath='/modules/data/';
    var driverPath=config.driverPath||'/drivers/';



    function DriverManager(){
        this.defaultBundleManager=new bundler.BundleManager({
             path:defaultPath
        });
        this.driverMap={};
        this.defaultQP=null;
        this.defaultQT=null;

        this.queryProviderMap={};
        this.dataSourceManager=new DataSourceManager();

        //Create the default which will be used to build all other drivers
        this.createDefaultDriver();

        //Load the user defined query providers from the extensions directory
        this.loadExtensions();

    }

    /*
    The function constructs a default driver based on the modules/data implementation
     */
    DriverManager.prototype.createDefaultDriver=function(){

        var defaultRootBundle=this.defaultBundleManager.getRoot();

        //Read the modules/data directory to get the default drivers
        var driverBundle=defaultRootBundle.get({name:FILE_DRIVER}).result();

        if(!driverBundle){
            throw 'unable to create default db driver';
        }

        var driver=require(defaultPath+FILE_DRIVER).driver();
        var driverInstance=new driver.DBDriver();

        //Obtain the default query providers
        var queryProviderBundle=defaultRootBundle.get({name:FILE_QP}).result();

        if(!queryProviderBundle){
            throw 'unable to create a default query provider';
        }

        this.defaultQP=require(defaultPath+FILE_QP).queryProvider();

        var queryTranslatorBundle=defaultRootBundle.get({name:FILE_QT}).result();

        if(!queryTranslatorBundle){
            throw 'unable to create default query translator';
        }

        this.defaultQT=require(defaultPath+FILE_QT).queryTranslator();

        this.driverMap[DEFAULT_DRIVER]=driverInstance;
    };

    /*
    The function loads drivers in the driver directory
    Note: Not used
     */
    DriverManager.prototype.loadDrivers=function(){

        var bundleManager=new bundler.BundleManager({
            path:driverPath
        });
    };

    /*
    The function creates a map of the query providers  in the extensions folder.
     */
    DriverManager.prototype.loadExtensions=function(){

        var extensionBundleManager=new bundler.BundleManager({path:EXTENSIONS_DIR});

        //Go through each bundle in the extensions directory
        var extensionRoot=extensionBundleManager.getRoot();

        var that=this;

        //Go through each bundle
        extensionRoot.each(function(bundle){

            //Check if the bundle is a directory
            if(!bundle.isDirectory()){
                return;
            }

            handleQueryProvider(bundle,that.queryProviderMap,that);

        });
    };

    /*
    The function returns the query provider for a given driver type
     */
    DriverManager.prototype.getQueryProvider=function(driverType){

        if(!this.queryProviderMap.hasOwnProperty(driverType)){
            return null;
        }

        if(!this.queryProviderMap[driverType].hasOwnProperty('queryProvider')){
            return null;
        }

        return this.queryProviderMap[driverType]['queryProvider'];
    };

    /*
    The function is used to read a folder defining extensions for a database

     */
    function handleQueryProvider(bundle,map,dm){

        var bundleName=bundle.getName();
        var QUERY_PROVIDER='queryProvider';
        map[bundleName]={};


        var defaultObject=utility.cloneObject(dm.defaultQP);

        //Go through each bundle in the directory
        bundle.each(function(currentScript){

            //Check if the current file matches the query provider
            if(currentScript.getName()==FILE_QP){

                //Load and instaniate script
                var script=require(EXTENSIONS_DIR+'/'+bundle.getName()+'/'+currentScript.getName());

                script=script.queryProvider();

                //Override the default provider with the methods in the script
                utility.extend(defaultObject,script);

                map[bundleName][QUERY_PROVIDER]=defaultObject;
            }
        });
    }

    /*
    The function returns a database driver after calling the drivers initialize method
    @driverType: The type of driver
    @return: A driver instance
     */
    DriverManager.prototype.get=function(source){



        var queryProviderType=this.getDriver(source);

        //Set the driver type to H2
        var driverType=DEFAULT_DRIVER;

        if(!queryProviderType){
            throw 'A driver for the '+queryProviderType+' could not be found.';
        }

        //Obtain the query provider for the driver type
        var queryProvider=this.getQueryProvider(queryProviderType);


        if(!queryProvider){
            throw 'A query provider for '+queryProviderType+' could not be found.';
        }

        //log.debug('source: '+source+' provider '+stringify(queryProvider));

        //Check if the driver is supported
        if(this.driverMap.hasOwnProperty(driverType)){
            this.driverMap[driverType].init({queryProvider:queryProvider, queryTranslator:this.defaultQT});
            return this.driverMap[driverType];
        }

        log.debug('driver for '+driverType+' not found.');
        return null;
    };

    /*
    The function is used to locate a driver that supports the provided datasource
    @name: The name of a datasource to be accessed
    @return: The type of driver (e.g. h2 or mysql)
     */
    DriverManager.prototype.getDriver=function(name){

        //Obain a reference to the datasource
        var datasource=this.dataSourceManager.get(name);


        if(!datasource){
            throw 'Cannot find Datasource: '+name;
        }

        var driverType=datasource.getDriver();

        if(driverType==DB_DRIVERS.UNSUPPORTED){
            throw 'Cannot find a driver for '+name;
        }

        return driverType;
    };


    /*
    The class is used to store information on a DataSource used by a driver
     */
    function DataSource(dsObject){
       this.instance=dsObject;
    }

    /*
    The function returns the type of driver required by the datasource by looking
    at the connection url
    @return: The driver type based on the connection string.If there is no match UNSUPPORTED
            is returned.If there is no connection url the unsupported value is returned.
     */
    DataSource.prototype.getDriver=function(){

       var connectionUrl=this.instance.getUrl();

       if(!connectionUrl){
           return null;
       }

       for(var key in DB_DRIVERS){

           //Check if the url matches one of the DB_DRIVERS
           if(connectionUrl.indexOf(DB_DRIVERS[key].key)!=-1){
               return DB_DRIVERS[key].value;
           }
       }
       log.debug('driver type in '+connectionUrl+' not found.');
       return null;

    };

    /*
    The class is used to access the carbon datasources repository
     */
    function DataSourceManager(){
        this.instance=new dsm();
    }

    /*
    The function is used to obtain a reference to a datasource defined in the
    master.datasources.xml.
    @name: The name of the datasource
    @return: A DataSource object
     */
    DataSourceManager.prototype.get=function(name){
        var server = require('store').server;
        var that = this;
        var datasource = server.privileged(function () {
            return that.instance.getInstance().getDataSourceRepository().getDataSource(name);
        });
        var dsObject=datasource.getDSObject();

        //If the datasource is not found
        if(!datasource){
           return null;
        }

        return new DataSource(dsObject);
    };




    return{
        DriverManager:DriverManager,
        DataSourceManager:DataSourceManager
    }
};
