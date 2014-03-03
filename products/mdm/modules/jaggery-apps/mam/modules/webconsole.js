var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var webconsole = (function () {

    var groupModule = require('group.js').group;
    var group = '';

    var userModule = require('user.js').user;
    var user = '';

    var routes = new Array();
    var log = new Log();
    var db;
    var module = function (dbs) {
        group = new groupModule();
        user = new userModule();
        db = dbs;
        //mergeRecursive(configs, conf);
    };
    var carbon = require('carbon');
    var server = function(){
        return application.get("SERVER");
    }
	var common = require('common.js');


    var configs = function (tenantId) {
        var configg = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return configg;
        }
        return configs[tenantId] || (configs[tenantId] = {});
    };

    var userManager = function (tenantId) {
        var config = configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        return configs(tenantId)[USER_MANAGER];
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
        getAllUsers: function(ctx){
                       ctx.type = 'admin';
            var type = ctx.type;
            if(typeof ctx.iDisplayStart == 'undefined'){
                ctx.iDisplayStart = 0;
            }
            if(typeof ctx.sEcho == 'undefined'){
                ctx.sEcho = 0;
            }
            var pageSize = 10;
            var all_users;
            var search = ctx.sSearch;
            var userType = ctx.userType;
            if(userType){
                userType = userType.toLowerCase();
            }
            if(ctx.groupid != null || ctx.groupid != undefined) {
                all_users = user.getAllUserNamesByRole(ctx);
            } else {
                if(search){
                    all_users = user.getAllUserNames(search+"*");
                }else{
                    all_users = user.getAllUserNames();
                }
            }

            var totalRecords = all_users.length;
            var upperBound = parseInt(ctx.iDisplayStart)+parseInt(ctx.iDisplayLength);
            var lowerBound =  parseInt(ctx.iDisplayStart);
            
            var dataArray = new Array();
            main:
            for(var i = lowerBound; i < upperBound; i++){
                if(totalRecords - 1 < i){
                    break;
                }
                var userObj = user.getUser({"userid": all_users[i]});
                var proxyObj = [userObj.username, userObj.firstName, userObj.lastName];
                var roles = userObj.roles;
                roles = parse(roles);
                var flag = 0;
                for(var j=0 ;j<roles.length;j++){
                    log.debug("Test iteration2"+roles[j]);
                    if(roles[j]=='admin'||roles[j]=='Internal/mdmadmin'||roles[j]=='Internal/mamadmin'){
                        flag = 1;
                        if(userType){
                            if(userType=="mam" || userType=="user"){
                                continue main;
                            }
                        }
                        break;
                    }else if(roles[j]==' Internal/publisher'||roles[j]=='Internal/reviewer'||roles[j]=='Internal/store'){
                        flag = 2;
                        if(userType){
                            if(userType=="admin" || userType=="user"){
                                continue main;
                            }
                        }
                        break;
                    }else{
                        flag = 0;
                        if(userType){
                            if(userType=="admin" || userType=="mam"){
                                continue main;
                            }
                        }
                    }
                }
                if(flag == 1){
                    if(type == 'admin'){
                        proxyObj.push('administrator');
                        proxyObj.push('');
                        proxyObj.push('');
                    }
                }else if(flag == 2) {;
                    proxyObj.push('mam');
                    proxyObj.push('');
                    proxyObj.push('');
                }else{
                    proxyObj.push('user');
                    proxyObj.push('');
                    proxyObj.push('');
                }
                dataArray.push(proxyObj);
            };
            var finalObj = {};
            finalObj.sEcho = ctx.sEcho;
            finalObj.iTotalRecords = totalRecords;
            finalObj.iTotalDisplayRecords = totalRecords;
            finalObj.aaData = dataArray;
            return finalObj;
        }
    };
    return module;
})();