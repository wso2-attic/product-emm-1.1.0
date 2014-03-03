/*
 Description: The DBScriptManager class is responsible for loading the storage scripts found in
 dbscripts folder.It first reads the contents of the storage folder and builds a map
 of the scripts based on the type of db (e.g.h2 ).
 The index used for a script is the directory name it is located along with the name.
 The name of the script is used when retrieving a script.
 Note: If an instance is obtained via getInstance(), it will be cached in the application context
 Filename: db,script.manager.js
 Created Date: 15/10/2013
 */
var dbScriptManagerModule = function () {

    var bundler = require('/modules/bundler.js').bundle_logic();
    var carbon = require('carbon');
    var HOME = carbon.server.home;
    var DBSCRIPT_HOME = '/dbscripts';
    var CACHE_DBSCMANAGER = 'db.script.manager';
    var STORAGE = '/storage/';
    var SQL_EXTENSION='sql';
    var log = new Log('db.script.manager');


    /*
     The class is used to read the database scripts from the dbscripts folder
     and index them based on their database type and the name of the resource
     */
    function DBScriptManager() {
        this.map = {};
        this.bundleManager = new bundler.BundleManager({path: HOME + DBSCRIPT_HOME + STORAGE});
    }

    /*
     The function reads the contents of the dbscripts/storage directory
     and loads the scripts for each database type.
     */
    DBScriptManager.prototype.load = function () {

        var rootBundle = this.bundleManager.getRoot();
        var that = this;

        rootBundle.each(function (bundle) {

            //We ignore anything not in a folder
            if (!bundle.isDirectory()) {
                return;
            }

            handleDBType(bundle, that.map);
        });
    };

    /*
     The function returns the schema create script for a given db type
     @dbType: The type of database (e.g. h2, mysql or oracle)
     @schema: The type of schema (e.g. resource where the script is called schema.sql)
     @return: A string copy of the sql script
     */
    DBScriptManager.prototype.find = function (dbType, schema) {

        //Check if the db type is handled
        if (!this.map.hasOwnProperty(dbType)) {
            //throw 'required script repository for database type: '+dbType
            //    +'not found.Please check if {SERVER_HOME}/dbscripts/storage/'+dbType+' is present.';
            return '';
        }

        //Check if the schema is handled
        if (!this.map[dbType].hasOwnProperty(schema)) {
            //throw 'required script repository for database type: '+dbType+' schema: '+schema+' not found.'
            //    +'Please check if {SERVER_HOME}/dbscripts/storage'+dbType+'/'+schema+'.sql is present.';
            return '';
        }

        var script = this.map[dbType][schema];
        return script;
    };


    /*
     The function is used to read a single directory in the storage folder for
     scripts
     @bundle: A bundle object pointing to a script directory in the storage folder
     @map: The map of dbtype to schema
     */
    function handleDBType(bundle, map) {

        //Get the name of bundle
        var bundleName = bundle.getName();
        map[bundleName] = {};


        //Get all of the scripts in the current bundle
        bundle.each(function (scriptBundle) {

            //Get all of the sql files
            if (scriptBundle.getExtension() == SQL_EXTENSION) {

                //Get the name of the file
                var scriptName = scriptBundle.getName().replace('.' + scriptBundle.getExtension(), '');


                //Store the contents of script
                map[bundleName][scriptName] = scriptBundle.getContents();
            }

        });
    }

    /*
     The function caches the DBScriptManager in the application context the first
     time the method is invoked.All subsequent requests get the cached copy.
     */
    function getInstance() {

        var instance = application.get(CACHE_DBSCMANAGER);

        //Check if there is already a cached copy of the script manager
        if (!instance) {
            instance = new DBScriptManager();
            instance.load();
            application.put(CACHE_DBSCMANAGER, instance);
        }

        return instance;
    }

    return {
        DBScriptManager: DBScriptManager,
        getInstance: getInstance
    }

};