var permission = (function () {

    var log = new Log();
    var module = function (db,router) {
        var permissionModule = require('modules/permission.js').permission;
        var permission = new permissionModule(db);

        router.put('permissions/', function(ctx){
            log.debug("check policy router add permission group PUT");
            log.debug(ctx);
            var result = permission.assignPermissionToGroup(ctx);
           /* log.info("Status :"+result.status);
            response.status = result.status;*/
        });

        router.get('permission/groups/features', function(ctx){
            log.debug("check policy router GET");
            log.debug(ctx);
            var result = permission.getPermission(ctx);
            response.status = result.status;
            print(result.content);
        });

    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();