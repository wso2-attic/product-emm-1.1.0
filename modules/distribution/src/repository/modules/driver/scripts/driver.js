/* 
    Usage - 
        var driver = require('driver.js').driver(db);
        driver.query();
*/
var driverObject = {};
var driver = function(db) {
    var storeRegistry = require('store').server;
    driverObject.translate = function(results) {
        var models = [];
        for (var i = results.length - 1; i >= 0; i--) {
            var result = results[i];
            var changed = {};
            for (var prop in result) {
                if (result.hasOwnProperty(prop)) {
                    //prop = prop.toLowerCase();
                    if (result[prop] == null) {
                        changed[prop.toLowerCase()] = result[prop];
                    } else {
                        changed[prop.toLowerCase()] = result[prop].toString();
                    }
                }
            }
            models.push(changed);
        };
        return models;
    }
    driverObject.query = function() {
        var tenantId = -1234;
        var args = Array.prototype.slice.call(arguments, 0);
        var query = args[0];
        log.debug("DB query:" + query);
        return storeRegistry.sandbox({tenantId: tenantId},
            function () {
                try {
                    db = new Database("WSO2_EMM_DB");
                    log.debug("DB connection is opened.. ");
                    // convert arguments to array

                    if (args.length > 1) {
                        result = db.query.apply(db, args) || 0;
                    } else {
                        result = db.query(query) || 0;
                    }
                    if (result == 0 || result.length == undefined) {
                        return result;
                    }
                    var processed = driverObject.translate(result);
                    return processed;
                } catch (e) {
                    log.error(e);
                } finally {
                    if (db) {
                        db.close();
                        log.debug("DB connection is closed.. ");
                    }
                }
            }
        );
    }
    return driverObject;
}
