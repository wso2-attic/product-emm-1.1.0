var policy = (function () {

    var common = require("/modules/common.js");
    var module = function (db,router) {
        var policyModule = require('modules/policy.js').policy;
        var policy = new policyModule(db);
        router.post('policies/external/{policyid}/enforce', function(ctx){
            if(common.checkAuth(ctx)){
                session.put("mdmConsoleUser", {tenantId : ctx.data.tenantId});
                policy.enforcePolicy(ctx);    
            }
        });
        router.get('policies/{policyid}/enforce', function(ctx){
            policy.enforcePolicy(ctx);
        });
        
        router.post('policies/', function(ctx){

            log.debug("check policy router POST");
            var result = policy.addPolicy(ctx);
            response.status = result;

        });
        router.put('policies/', function(ctx){

            log.debug("check policy router PUT");
            var result = policy.updatePolicy(ctx);
            if(result == 1){
                response.status = 200;
            }else{
                response.status = 404;
            }

        });
        router.delete('policies/{policyid}', function(ctx){
            log.debug("Check Delete Router");
            var result = policy.deletePolicy(ctx);
            if(result==1){
                response.status = 200;
            }else{
                response.status = 404;
            }
        });
        router.get('policies/', function(ctx){

            log.debug("check policy router GET");
            var result = policy.getAllPolicies(ctx);
            if(result != undefined && result != null && result[0] != undefined && result[0]!= null){
                print(result);
                response.status = 200;
            }else{
                response.status = 404;
            }

        });
        router.get('policies/{policyid}', function(ctx){

            var result = policy.getPolicy(ctx);

            if(result != undefined && result != null){
                log.debug("Content "+stringify(result));
                print(result);
                response.status = 200;
            }else{
                response.status = 404;
            }

        });
        router.put('policies/{policyid}/groups', function(ctx){
            log.debug("check policy router PUT");
            policy.assignGroupsToPolicy(ctx);


        });
        router.put('policies/{policyid}/users', function(ctx){
            log.debug("check policy router PUT");
            policy.assignUsersToPolicy(ctx);


        });
        router.put('policies/{policyid}/platforms', function(ctx){
            log.debug("check policy router PUT");
            policy.assignPlatformsToPolicy(ctx);


        });
        router.get('policies/{policyid}/groups', function(ctx){

            var result = policy.getGroupsByPolicy(ctx);

        });

    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();