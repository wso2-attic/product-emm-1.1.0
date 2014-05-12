var platform = (function () {

    var module = function (db,router) {
        
        var platformModule = require('/modules/platform.js').platform;
		var platform = new platformModule(db);
        
        router.get('platforms', function(ctx){
            print(platform.getPlatforms());
        });
    };
    
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
    
})();