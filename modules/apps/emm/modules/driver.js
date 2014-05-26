/* 
    Usage -
        var driver = require('driver.js').driver(db);
        driver.query();
*/
var driver = function(db){
    var translate = function(results){
        var models = [];
        for (var i = results.length - 1; i >= 0; i--) {
            var result = results[i];
            var changed = {};
            for (var prop in result) {
                if (result.hasOwnProperty(prop)) {
                    prop = prop..toLowerCase();
                    if(result[field] == null) {
                        changed[prop] = result[prop];
                    } else {
                        changed[prop] = result[prop].toString();
                    }
                    models.push(changed);
                }
            }
        };
        return models;
    }
    this.query = function(){
        // convert arguments to array
        var args = Array.prototype.slice.call(arguments, 0);
        var query = args.shift();
        if (args.length>0) {
            result = db.query.apply(db, args) || [];
        }
        else {
            result = db.query(query) || [];
        }
        var processed = result
        log.debug("processed :"+processed);
        log.debug(Object.prototype.toString.call( processed ) === '[object Array]');
        if(Object.prototype.toString.call( processed ) === '[object Array]'){
            processed = driverObject.translate(result);
        }
        return processed;
    }
}

