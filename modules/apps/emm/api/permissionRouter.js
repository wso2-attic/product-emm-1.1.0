var permission = (function () {


    var module = function (db,router) {
        var permissionModule = require('modules/permission.js').permission;
        var permission = new permissionModule(db);

        router.post('permissions/', function(ctx){

            log.debug("check policy router POST");
            log.debug(ctx);
            var result = policy.addPolicy(ctx);
            if(result == 'success'){
                response.status = 200;
            }else{
                response.status = 404;
            }

        });

        router.put('permissions/', function(ctx){
            log.debug("check policy router add permission group PUT");
            log.debug(ctx);
            var result = permission.assignPermissionToGroup(ctx);
            if(result != 'undefined' && result != null){
                response.status = 200;
                response.content = result;
            }else{
                response.status = 404;
            }

        });

        router.get('permissions/', function(ctx){
            log.debug("check policy router GET");
            log.debug(ctx);
            var result = policy.getAllPermissionGroups(ctx);
            log.debug(result);
            if(result != 'undefined' && result != null && result[0] != null){
                response.status = 200;
                response.content = result;
            }else{
                response.status = 404;
            }

        });

        router.delete('policy/{policyid}', function(ctx){
            policy.delete(ctx);
            response.status = 201;
            return true;
        });

    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();