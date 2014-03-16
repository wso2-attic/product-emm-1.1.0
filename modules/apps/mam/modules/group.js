var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var group = (function () {

    var routes = new Array();
    var log = new Log();
    var db;


    var common = require('common.js');
    var claimEmail = "http://wso2.org/claims/emailaddress";
    var claimFirstName = "http://wso2.org/claims/givenname";
    var claimLastName = "http://wso2.org/claims/lastname";
    var claimMobile = "http://wso2.org/claims/mobile";
    
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
        //mergeRecursive(configs, conf);
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
        /*Group CRUD Operations (Create, Retrieve, Update, Delete)*/
        addGroup: function(ctx){
            var proxy_role = {};
            var tenant_id = common.getTenantID();
            if(tenant_id){
                var um = userManager(tenant_id);
                try{
                    if(um.roleExists(ctx.name)) {
                        proxy_role.error = 'Role already exist in the system.';
                        proxy_role.status = "ALLREADY_EXIST";
                    } else {
                        var arrPermission = {};
                        var permission = [
                            'http://www.wso2.org/projects/registry/actions/get',
                            'http://www.wso2.org/projects/registry/actions/add',
                            'http://www.wso2.org/projects/registry/actions/delete',
                            'authorize','login'
                        ];
                        arrPermission[0] = permission;
                        um.addRole(ctx.name, ctx.users, arrPermission);
                        proxy_role.success = 'Role added successfully.';
                        proxy_role.status = "SUCCESSFULL";
                    }
                }catch(e){
                    proxy_role.status = "BAD_REQUEST";
                    log.error(e);
                }
            }else{
                proxy_role.status = "SERVER_ERROR";
                print('Error in getting the tenantId from session');
            }
            return proxy_role;
        },
        editGroup: function(old_name, new_name){
            var proxy_role = {};
            var tenant_id = common.getTenantID();
            if(tenant_id){
                var um = userManager(tenant_id);
                if(old_name==new_name){
                    proxy_role.error = 'Role does not exist in the system.';
                    proxy_role.status = "NOT_EXIST";
                }else{
                    if(um.roleExists(old_name)) {
                        um.updateRole(old_name, new_name);
                        proxy_role = new_name;
                    }else{
                        proxy_role.error = 'Role does not exist in the system.';
                        proxy_role.status = "NOT_EXIST";
                    } 
                }
            }else{
                proxy_role.status = "SERVER_ERROR";
                print('Error in getting the tenantId from session');
            }
            return proxy_role;
        },
        getAllGroups: function(ctx){
            var type = ctx.type;
            var um = userManager(common.getTenantID());
            var allRoles = common.removePrivateRole(um.allRoles());
            var removeRoles = new Array("Internal/everyone", "wso2.anonymous.role", "Internal/mdmadmin");
            var roles = common.removeNecessaryElements(allRoles, removeRoles);
            return roles;
        },
        deleteGroup: function(ctx){
            var um = userManager(common.getTenantID());
            var result = um.removeRole(ctx.groupid);
            if(result){
                return true;
            }else{
                return false;
            }
        },

        /*end of Group CRUD Operations (Create, Retrieve, Update, Delete)*/
 /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
       /*other group manager functions*/
        getGroupsByType: function(ctx){
            var type = ctx.type;//this type attribute identify weather admin or mamadmin
            var um = userManager(common.getTenantID());
            var newRoles = new Array();
            var roles = this.getAllGroups({});
            for(var i=0;i<roles.length;i++){
                    var obj = {};
                    if(roles[i] == 'admin'||roles[i] == 'Internal/mdmadmin'||roles[i]=='Internal/mamadmin'){
                        obj.name = roles[i];
                        obj.type = 'administrator';
                        if(type == 'admin'){
                            newRoles.push(obj);
                        }
                    }else if(roles[i]== 'Internal/publisher'||roles[i]=='Internal/reviewer'||roles[i]=='Internal/store'){
                        obj.name = roles[i];
                        obj.type = 'mam';
                        newRoles.push(obj);
                    }else{
                        obj.name = roles[i];
                        obj.type = 'user';
                        newRoles.push(obj);
                    }

            }
            return newRoles;
        },
        getUserRoles: function(ctx){
            var um = userManager(common.getTenantID());
            var roles = um.getRoleListOfUser(ctx.username);
            var roleList = common.removePrivateRole(roles);
            return roleList;
        },
        getUsersOfGroup: function(ctx){
            var tenantId = common.getTenantID();
            var users_list = Array();
            if(tenantId){
                var um = userManager(common.getTenantID());
                var allUsers = um.getUserListOfRole(ctx.groupid);
                var removeUsers = new Array("wso2.anonymous.user","admin");
                var users = common.removeNecessaryElements(allUsers,removeUsers);
                for(var i = 0; i < users.length; i++) {
                    var user = um.getUser(users[i]);
                    var claims = [claimEmail, claimFirstName, claimLastName];
                    var claimResult = user.getClaimsForSet(claims,null);
                    var proxy_user = {};
                    proxy_user.username = users[i];
                    proxy_user.email = claimResult.get(claimEmail);
                    proxy_user.firstName = claimResult.get(claimFirstName);
                    proxy_user.lastName = claimResult.get(claimLastName);
                    proxy_user.mobile = claimResult.get(claimMobile);
                    proxy_user.tenantId = tenantId;
                    proxy_user.roles = user.getRoles();
                    var resultDeviceCount = db.query("SELECT COUNT(id) AS device_count FROM devices WHERE user_id = ? AND tenant_id = ?", users[i], proxy_user.tenantId);
                    proxy_user.no_of_devices = resultDeviceCount[0].device_count;
                    users_list.push(proxy_user);
                }
            }else{
                log.error('Error in getting the tenantId from session');
                print('Error in getting the tenantId from session');
            }
            return users_list;
        },
        roleExists:function(ctx){
            var um = userManager(common.getTenantID());
            var result = um.roleExists(ctx.groupid);
            return result;
        },
        updateUserListOfRole: function(ctx){
            var existingUsers = this.getUsersOfGroup(ctx);
            var addedUsers = ctx.added_users;
            var newUsers = new Array();

            for(var i=0;i<addedUsers.length;i++){
                var flag = false;
                for(var j=0;j<existingUsers.length;j++){
                    if(addedUsers[i]== existingUsers[j].username){
                        flag = true;
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(flag == false){
                    newUsers.push(addedUsers[i]);
                }
            }

            var removedUsers = ctx.removed_users;
            var deletedUsers = new Array();
            for(var i=0;i<removedUsers.length;i++){
                var flag = false;
                for(var j=0;j<existingUsers.length;j++){
                    if(removedUsers[i]== existingUsers[j].username){
                        flag = true;
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(flag == true){
                    deletedUsers.push(removedUsers[i]);
                }
            }
            var um = userManager(common.getTenantID());
            um.updateUserListOfRole(ctx.groupid , deletedUsers, newUsers);
        }
    };

    // return module
    return module;
})();