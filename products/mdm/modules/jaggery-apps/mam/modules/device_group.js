var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var device_group = (function () {
    var groupModule = require('group.js').group;
    var group = '';
    var deviceModule = require('device.js').device;
    var device = '';

    var carbon = require('carbon');

    var server = function(){
        return application.get("SERVER");
    }

    var configs = function (tenantId) {
        var configg = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return configg;
        }
        return configs[tenantId] || (configs[tenantId] = {});
    };

    /**
     * Returns the user manager of the given tenant.
     * @param tenantId
     * @return {*}
     */
    var userManager = function (tenantId) {
        var config = configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        return configs(tenantId)[USER_MANAGER];
    };

    var module = function (dbs) {
        db = dbs;
        group = new groupModule(db);
        device = new deviceModule(db);

    };

    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    // prototype
    module.prototype = {
        constructor: module,
        sendMsgToGroup :function(ctx){
            var succeeded="";
            var failed="";

            var userList = group.getUsersOfGroup();

            for(var i = 0; i < userList.length; i++) {

                var objUser = {};

                var result = db.query("SELECT id FROM devices WHERE user_id = ? AND tenant_id = ?", String(userList[i].email), common.getTenantID());

                for(var j = 0; j < result.length; j++) {

                    var status = device.sendToDevice({'deviceid':result[i].id, 'operation': ctx.operation, 'data' : ctx.data});
                    if(status == true){
                        succeeded += result[i].id+",";
                    }else{
                        failed += result[i].id+",";
                    }
                }
            }
            if(succeeded != "" && failed != ""){
                return "Succeeded : "+succeeded+", Failed : "+failed;
            }else{
                return "Succeeded : "+succeeded;
            }
        }
    };
    return module;
})();