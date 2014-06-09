var tenant = (function () {

    var log = new Log();
    var module = function (db,router) {
        //var permissionModule = require('modules/tenant.js').permission;
        //var permission = new permissionModule(db);

        
        router.get('tenant/configuration', function(ctx){
            print('{ "uiCopyright": "dfdf", "uiLicence": "fdfdf", "uiTitle": "fdfd" }');
        });

    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();