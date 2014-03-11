/*
 Description: The following class is used to build the queries that are executed to CREATE,INSERT and SELECT
              data from the default H2 database.In addition , this class is used as the blue print for
              all user defined queryProviders.

              The following methods of this class can be overriden by placing a script which exposes
              a function with the same method name.(Please make sure parameters are processed).
              1. create(schema)
              2. insert(schema,model)
              3. select(schema,predicate)
              4. selectAll(schema,predicate)
              5. checkIfTableExists(schema)

              Any methods not overriden are picked up from this class.

Filename: query.provider.js
Created Date: 16/10/2013
 */
var queryProvider = function () {
    var queryMap = {};
    var H2_DRIVER='h2';
    var dbScriptManager=require('/modules/data/common/db.script.manager.js').dbScriptManagerModule().getInstance();

    var log=new Log();
    queryMap['resource'] = {};
    queryMap['resource']['create'] = 'CREATE TABLE resource ( uuid VARCHAR(250), tenantId VARCHAR(250),fileName VARCHAR(250), contentLength INT,contentType VARCHAR(150), content BLOB );';
    queryMap['resource']['insert'] = 'INSERT INTO resource ({1}) VALUES (?,?,?,?,?,?);';
    queryMap['resource']['select'] = 'SELECT * FROM resource WHERE {1};';

    /*
    The function checks the schema and returns a query for creating a table in the desired database
    @schema: The schema to be created (should have a table property)
    @return: A CREATE TABLE query to construct the
     */
    function create(schema) {
        var query = dbScriptManager.find(H2_DRIVER,schema.table);//queryMap[schema.table]['create'];
        return query;
    }

    /*
    The function creates  a query to insert data into the table defined by the provided schema
    @schema: The schema of the table to be inserted into
    @model: Not used
    @return: An INSERT statement
     */
    function insert(schema, model) {
        var query = queryMap[schema.table]['insert'];
        var fields=[];
        var field;

        //Get the list of properties
        for(var index in schema.fields){
            field=schema.fields[index];
            fields.push(field.name);
        }

        var fieldsString=fields.join(',');

        query=query.replace('{1}',fieldsString);
        return query;
    }

    /*
     The function creates a select statement based on the schema and predicate
     Only AND type queries are supported
     @schema: The schema of the table to be queried
     @predicate: An object containing the desired query parameters
     @return: A SELECT statement with a query based on the predicate
     */
    function select(schema, predicate) {
        var query = queryMap[schema.table]['select'];

        //We need to take the predicate and create the query
        var whereClause=buildWhereClause(predicate);

        query=query.replace('{1}',whereClause);

        return query;
    }

    /*
    The function is used to create a where clause from the provided predicate
    @predicate: A JSON object with the desired mathcing values
    @return: A WHERE clause
     */
    function buildWhereClause(predicate){
        var clause='';
        var clauseArray=[];
        for(var key in predicate){
            clause=" "+key+"='"+predicate[key]+"' ";
            clauseArray.push(clause);
        }
        return clauseArray.join('AND');
    }

    /*
    The function returns a query which is used to obtain all records in a given table defined
    by the schema
    @schema: The schema of the table to be queried
    @predicate: Not used
    @return: A SELECT * statement
     */
    function selectAll(schema, predicate) {
        var query = 'SELECT * FROM {1}; ';

        return query;
    }

    /*
    The function build a query to see if the table specified in the schema exists in the database
    @schema: The schema to be checked in the database (should have a table property)
    @return: A query to check the existence of the schema
     */
    function checkIfTableExists(schema) {
        var tableName = schema.table.toUpperCase();
        var query = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='" + tableName + "' AND TABLE_SCHEMA='PUBLIC'; ";
        //log.debug('checking if table exists '+query);
        return query;
    }



    return{
        create: create,
        insert: insert,
        select: select,
        selectAll: selectAll,
        checkIfTableExists: checkIfTableExists
    }

};