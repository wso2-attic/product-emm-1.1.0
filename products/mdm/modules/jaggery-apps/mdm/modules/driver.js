var common = require('/modules/common.js');
var translate = function(results){
    //log.debug("Data Before >>>>>> " + stringify(results));
    var result;
    var field;
    var models = [];
    for (var index in results) {
        result = results[index];
        var model = {};
        for (var prop in result) {
            if (result.hasOwnProperty(prop)) {
                //log.debug(Object.prototype.toString.apply(result[prop]));
                if (Object.prototype.toString.apply(result[prop]) == '[object Stream]') {
                    model[prop.toLowerCase()] = stringify(result[prop]);
                } else {
                    model[prop.toLowerCase()] = result[prop];
                }
            }
        }
        models.push(model);
    }
    //log.debug("Data After >>>> " + stringify(models));
    return models;
}
var driver = {
    execute : function(){
        var query  = arguments[0];
        var args = Array.prototype.slice.call(arguments, 0);
        var argumentArray = args.slice(1, args.length);
        if (argumentArray.length>0) {
            var db = common.getDatabase();
            result = db.query.apply(db, arguments) || [];
        }
        else {
            result = common.getDatabase().query(query) || [];
        }

        var processed = translate(result);
        return processed;
    }
};

 