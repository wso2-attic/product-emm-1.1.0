/*
 Description: The class provides the template for a database driver which is capable of;
               1. connecting
               2. disconnecting
               3. querying
              A connection to the database can be made either usinga  connection string or a datasource.
              The datasource should be defined in the repository/datasources/master.datasource.xml.
Filename: driver.js
Created Date: 15/10/2013
 */

var driver = function () {
    var log = new Log('default.driver');
    var utility = require('/modules/utility.js').rxt_utility();

    function DBDriver() {
        this.queryProvider = null;
        this.queryTranslator = null;
        this.instance = null; //The instance of the db
    }

    DBDriver.prototype.init = function (options) {
        utility.config(options, this);
    };

    /*
    The function creates a database connection either using a query string or
    using a Datasource.
     The datasource should be defined in the repository/datasources/master.datasource.xml.
    @config: A configuration object containing the connection information
     */
    DBDriver.prototype.connect = function (config) {
        var connectionString = '' || config.connectionString;
        var username = config.username;
        var password = config.password;
        var dbConfig = config.dbConfig || {};
        var dataSource = config.dataSource || null;
        try {
            if (dataSource) {
                this.instance = new Database(dataSource);
            }
            else {
                this.instance = new Database(connectionString, username, password, dbConfig);
            }

        }
        catch (e) {
            throw e;
        }
    };

    /*
    The function closes the connection to the database
     */
    DBDriver.prototype.disconnect = function () {
        this.instance.close();
    };

    /*
     The function is used to issue a query to the database
     @query: The query to be executed
     @modelManager: An instance of the model manager which is using the db driver
     @cb: An optional callback
     @return: The results of the query after translation
     */
    DBDriver.prototype.query = function (query, schema, modelManager, model, options) {

        var options = options || {};
        var isParam = options.PARAMETERIZED || false;
        var result;


        if (isParam) {
            var args = getValueArray(model, schema, query);

            result = this.instance.query.apply(this.instance, args) || [];
        }
        else {
            result = this.instance.query(query) || [];
        }


        var processed;
        processed = this.queryTranslator.translate(schema, modelManager, result);


        return processed;
    };

    /*
     The function creates an argument array that will be used to execute the database query
     @model: The model containing the data
     @schema: The schema of the model
     @query: The query to be executed
     @return: An argument array containing the query and values to be used in order.
     */
    function getValueArray(model, schema, query) {
        var values = [];
        values.push(query);
        var field;
        for (var index in schema.fields) {
            field = schema.fields[index];
            if (model[field.name] instanceof File) {
                values.push(model[field.name].getStream());
            }
            else {
                values.push(model[field.name]);
            }

        }
        return values;
    }

    return{
        DBDriver: DBDriver
    }
}


