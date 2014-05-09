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
                    //prop = prop.toLowerCase();
                    if(result[prop] == null) {
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
    this.query = function(){
        // convert arguments to array
        var args = Array.prototype.slice.call(arguments, 0);
        var query = args[0];
        if (args.length>1) {
            result = db.query.apply(db, args) || [];
        }
        else {
            result = db.query(query) || [];
        }
        var processed = translate(result);
        return processed;
    }
}

 