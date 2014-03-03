/*
 Description: The class  overrides the CREATE behaviour for the default queryProvider class.
 This script provides the scripts used for H2 database
 Filename: query.provider.js
 Created Date: 15/10/2013
 */

var queryProvider = function () {

    var dbScriptManager = require('/modules/data/common/db.script.manager.js').dbScriptManagerModule().getInstance();

    var H2_DRIVER = 'h2';

    var log = new Log('h2.query.provider');
    /*
     The function builds a CREATE sql statement based on the provided schema for the H2 database
     @schema: The schema to be created
     @return: A CREATE table statement
     */
    function create(schema) {

        var query = dbScriptManager.find(H2_DRIVER, schema.table);

        return query;
    }

    function checkIfTableExists(schema){
        return '';
    }

    return{
        create: create,
        checkIfTableExists:checkIfTableExists
    }

};