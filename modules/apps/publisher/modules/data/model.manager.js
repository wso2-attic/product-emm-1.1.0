/*
 Description: The class is used to create and manage models from schemas
 Filename:model.creator.js
 Created Date:23/9/2013
 */

var modelManager = function () {

    var log = new Log('model.manager');
    var utility = require('/modules/utility.js').rxt_utility();
    var bundler = require('/modules/bundler.js').bundle_logic();


    var PROP_NAME = 'name';
    var PROP_SCHEMA = 'schema';

    var schemaPath = '/schemas/';

    function ModelManager(options) {
        this.driver = null;
        this.connectionInfo = {};
        utility.config(options, this);
        this.managedModels = {};
        this.loadSchemas();
    }

    /*
     The function loads the schemas
     */
    ModelManager.prototype.loadSchemas = function () {
        var bundleManager = new bundler.BundleManager({
            path: schemaPath
        });

        //Obtain the root bundle
        var root = bundleManager.getRoot();

        var that = this;

        root.each(function (bundle) {
            var schema = require(schemaPath + bundle.getName()).schema();
            that.register(schema);
        });
    };


    /*
     The function creates a model from the provided schema and then registers it with the
     model manager.
     @schema: Describes the structure of the model
     */
    ModelManager.prototype.register = function (schema) {

        //Obtain the list of fields in the schema
        var fields = schema.fields || [];

        //Examine the fields in the schema
        var model = function () {

            this[PROP_NAME] = schema.name;
            this[PROP_SCHEMA] = schema;

            var that = this;
            //Create a property for each field
            utility.each(fields, function (field) {
                that[field.name] = 'empty';
            });
        };

        //Attach the functions
        attachDefaultOperations(model, this);

        var temp = new model();

        //Check if the table exists before creating
        if (!temp.checkIfTableExists()) {
            //Create the table
            temp.createTable();
        }

        //Add the model to the list of managed models
        this.managedModels[schema.name] = model;
    };


    /*
     The function creates and returns a new instance of the provided model
     @modelName: The name of the model
     @return: A model instance
     */
    ModelManager.prototype.get = function (modelName) {

        //Check if the model is managed
        if (this.managedModels.hasOwnProperty(modelName)) {
            return new this.managedModels[modelName]();
        }

        return null;
    };

    ModelManager.prototype.connect = function () {
        var that = this;
        require('store').server.privileged(function() {
            that.driver.connect(that.connectionInfo);
        });
    };

    ModelManager.prototype.disconnect = function () {
        var that = this;
        require('store').server.privileged(function () {
            that.driver.disconnect();
        });
    };


    function attachDefaultOperations(model, modelManager) {

        //Find models matching the predicate
        model.prototype.find = function (predicate) {

            modelManager.connect();
            var query = modelManager.driver.queryProvider.select(this.schema, predicate);

            var results=modelManager.driver.query(query,this.schema,modelManager,this);
            modelManager.disconnect();

            return results;
        };

        //Obtain all of the models
        model.prototype.findAll = function () {
            var query = this.driver.queryProvider.selectAll(this.schema);
            var results = this.driver.query(query, this.schema, modelManager);
            return results;
        };

        //Creates a table in the database
        model.prototype.createTable = function () {

            modelManager.connect();
            var query = modelManager.driver.queryProvider.create(this.schema);

            var results = modelManager.driver.query(query, this.schema);
            modelManager.disconnect();
            return results;
        };

        //Checks whether the table already exists
        model.prototype.checkIfTableExists = function () {

            modelManager.connect();
            var query = modelManager.driver.queryProvider.checkIfTableExists(this.schema);

            var results = modelManager.driver.query(query, this.schema, modelManager, model);

            modelManager.disconnect();
            //if the number of results is more than 0 then a table exists
            if (results.length > 0) {
                return true;
            }
            return false;
        };

        //Save the model details to the underlying database
        model.prototype.save = function () {

            modelManager.connect();
            var query = modelManager.driver.queryProvider.insert(this.schema, this);

            var results = modelManager.driver.query(query, this.schema, modelManager, this,{PARAMETERIZED:true});

            modelManager.disconnect();
            return results;
        };
    }

    return{

        ModelManager: ModelManager

    };

};