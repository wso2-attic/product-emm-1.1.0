var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var user_group = (function () {

    var userModule = require('user.js').user;
    var user = '';
    var groupModule = require('group.js').group;
    var group = '';
    var common = require('common.js');
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
        user = new userModule(db);
        group = new groupModule(db);

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
        /*
         * This function return all roles belong to particular user. Also return other roles as well with a flag. Consume by role assignment for user.
         *
         * */
        getUserRoles:function(ctx){
            return  user.getUserRoles(ctx);
        },
        getRolesOfUserByAssignment:function(ctx){
            var totalGroups = group.getAllGroups({});
            var removeRoles = new Array("Internal/store", "Internal/publisher", "Internal/reviewer","Internal/mdmadmin");
            var allRoles = common.removeNecessaryElements(totalGroups,removeRoles);
            log.debug("getRolesOfUserByAssignment :"+stringify(allRoles));
            var userRoles = user.getUserRoles(ctx);
            log.debug("User Roles"+stringify(userRoles));
            var array = new Array();
            if(userRoles.length == 0){
                for(var i=0;i < allRoles.length;i++){
                    var obj = {};
                    obj.name = allRoles[i];
                    obj.available = false;
                    array.push(obj);
                }
            }else{
                for(var i=0;i < allRoles.length;i++){
                    var obj = {};
                    for(var j=0;j< userRoles.length;j++){
                        if(allRoles[i]==userRoles[j]){
                            obj.name = allRoles[i];
                            obj.available = true;
                            break;
                        }else{
                            obj.name = allRoles[i];
                            obj.available = false;
                        }
                    }
                    array.push(obj);
                }
            }
            return array;
        },/*
         getUsersOfRoleByAssignment :function(ctx){
         var usersOfGroup = group.getUsersOfGroup(ctx);
         var allUsers = user.getAllUsers(ctx);
         if(usersOfGroup.length==0){
         for(var i=0;i<allUsers.length;i++){
         allUsers[i].available = false;
         }
         }else{
         for(var i=0;i<allUsers.length;i++){
         for(var j=0;j<usersOfGroup.length;j++){
         if(allUsers[i].username==usersOfGroup[j].username){
         allUsers[i].available = true;
         break;
         }else{
         allUsers[i].available = false;
         }
         }
         }
         }
         return allUsers;
         },*/
        getUsersOfRoleByAssignment :function(ctx){
            var usersOfGroup = group.getUsersOfGroup(ctx);

            var allUsers = user.getAllUserNames();

            var userArray = new Array();
            if(usersOfGroup.length==0){
                for(var i=0;i<allUsers.length;i++){
                    var obj = {};
                    obj.available = false;
                    obj.username = allUsers[i];//can be changed as email
                    userArray.push(obj);
                }
            }else{
                for(var i=0;i<allUsers.length;i++){
                    var flag = 0;
                    for(var j=0;j<usersOfGroup.length;j++){
                        log.info("T"+allUsers[i]+"---"+usersOfGroup[j].username);
                        if(allUsers[i]==usersOfGroup[j].username){
                            flag = 1;
                            break;
                        }
                        flag =0;
                    }
                    if(flag == 1){
                        var obj = {};
                        obj.available = true;
                        obj.username = allUsers[i];
                        userArray.push(obj);

                    }else if(flag == 0){
                        var obj = {};
                        obj.available = false;
                        obj.username = allUsers[i];
                        userArray.push(obj);
                    }
                }
            }
            return userArray;
        },
        sendEmailToGroup: function(ctx){
            var users = group.getUsersOfGroup(ctx);
            for(var i=0;i<users.length;i++){
                user.sendEmail({'username':users[i].email});
            }
        }
    };
    return module;
})();