var platform = (function () {

    var routes = new Array();
	var log = new Log();
	var db;
    var driver;
    var sqlscripts = require('/sqlscripts/db.js');

	
    var module = function (dbs) {
		db = dbs;
        driver = require('driver').driver(db);
    };

   
    // prototype
    module.prototype = {
        constructor: module,
        getPlatforms: function(ctx){
            var platforms = driver.query(sqlscripts.platform.select1);
            return platforms;
        }
    };

    // return module
    return module;
})();