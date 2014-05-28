var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var webconsole = (function () {

    var groupModule = require('group.js').group;
    var group = '';

    var userModule = require('user.js').user;
    var user = '';
    var sqlscripts = require('/sqlscripts/db.js');

    var routes = new Array();
    var log = new Log();
    var db;
    var driver;
    var module = function (dbs) {
        group = new groupModule();
        user = new userModule();
        db = dbs;
        driver = require('driver').driver(db);
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
        getDevicesCountAndUserCountForAllGroups: function(ctx) {
        	var um = userManager(common.getTenantID());
            var arrRole = new Array();
            var allGroups = group.getAllGroups({});
            for(var i = 0; i < allGroups.length; i++) {
                var objRole = {};
                objRole.name = allGroups[i];
                var userList = um.getUserListOfRole(allGroups[i]);
                objRole.no_of_users = userList.length;
                var deviceCountAll = 0;
                for(var j = 0; j < userList.length; j++) {
                    var resultDeviceCount = driver.query(sqlscripts.devices.select25, String(userList[j]), common.getTenantID());
                    deviceCountAll += parseInt(resultDeviceCount[0].device_count);
                }
                objRole.no_of_devices = deviceCountAll;
                arrRole.push(objRole);
            }
            return arrRole;
        },
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
                var proxyObj = [userObj.username, userObj.email, userObj.firstName, userObj.lastName];
                var roles = userObj.roles;
                if(typeof roles == "undefined"){
                    log.debug("test");
                    break main;
                }
                var flag = 0;
                
               
                roles = parse(roles);
                
                //log.info(roles);
                if(contains(roles, "admin")){
                         flag = 1;  
                    
                    if(userType){
                            if(userType=="emmadmin" || userType=="user"){
                                continue main;
                            }
                    }
                    
                }else if(contains(roles, "Internal/emmadmin")){
                         flag = 2;
                    
                    if(userType){
                            if(userType=="admin" || userType=="user"){
                                continue main;
                            }
                    }
                    
                }else{
                         flag = 3;
                    
                    if(userType){
                            if(userType=="emmadmin" || userType=="admin"){
                                continue main;
                            }
                    }
                }
                
                if(flag == 1){
                    proxyObj.push('admin');
                    proxyObj.push('');
                    proxyObj.push('');
                }else if(flag == 2) {;
                    proxyObj.push('emmadmin');
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
        },
        getDevices:function(ctx){
            //return device information
            var userId = '';
            if(ctx.username != undefined && ctx.username != null){
                userId = ctx.username;
            }
            var platformId = ctx.platform_id;

            var byod = ctx.byod;
            var result = '';

            var iDisplayLength = ctx.iDisplayLength;

            if(byod!= undefined && byod != null && byod != '' && platformId!= undefined && platformId != null && platformId != ''){
                result = driver.query(sqlscripts.devices.select32, "%"+userId+"%", common.getTenantID(), byod, platformId);
                var totalRecords = result.length;
                var upperBound = parseInt(ctx.iDisplayStart)+parseInt(iDisplayLength);
                var lowerBound = parseInt(ctx.iDisplayStart);

                var dataArray = new Array();
                for(var i = lowerBound; i < upperBound; i++){
                    if(totalRecords - 1 < i){
                        break;
                    }
                    var device = [];
                    device.push( result[i].id);
                    device.push( parse(result[i].properties).model);
                    device.push( parse(result[i].properties).imei);
                    device.push( result[i].user_id);
                    device.push( result[i].name);
                    device.push( result[i].os_version);
                    device.push( parse(result[i].properties).device);
                    device.push( result[i].created_date);
                    dataArray.push(device);
                }
                var finalObj = {};
                finalObj.sEcho = ctx.sEcho;
                finalObj.iTotalRecords = totalRecords;
                finalObj.iTotalDisplayRecords = totalRecords;
                finalObj.aaData = dataArray;
                return finalObj;
            }else if(byod!= undefined && byod != null && byod != '' ){
                result = driver.query(sqlscripts.devices.select33, "%"+userId+"%", common.getTenantID(), byod);
                var totalRecords = result.length;
                var upperBound = parseInt(ctx.iDisplayStart)+parseInt(iDisplayLength);
                var lowerBound = parseInt(ctx.iDisplayStart);

                var dataArray = new Array();
                for(var i = lowerBound; i < upperBound; i++){
                    if(totalRecords - 1 < i){
                        break;
                    }
                    var device = [];
                    device.push( result[i].id);
                    device.push( parse(result[i].properties).model);
                    device.push( parse(result[i].properties).imei);
                    device.push( result[i].user_id);
                    device.push( result[i].name);
                    device.push( result[i].os_version);
                    device.push( parse(result[i].properties).device);
                    device.push( result[i].created_date);
                    dataArray.push(device);
                }
                var finalObj = {};
                finalObj.sEcho = ctx.sEcho;
                finalObj.iTotalRecords = totalRecords;
                finalObj.iTotalDisplayRecords = totalRecords;
                finalObj.aaData = dataArray;
                return finalObj;
            }else if(platformId!= undefined && platformId != null && platformId != ''){
                result = driver.query(sqlscripts.devices.select34, "%"+userId+"%", common.getTenantID(), platformId);
                var totalRecords = result.length;
                var upperBound = parseInt(ctx.iDisplayStart)+parseInt(iDisplayLength);
                var lowerBound = parseInt(ctx.iDisplayStart);
                var dataArray = new Array();
                for(var i = lowerBound; i < upperBound; i++){
                    if(totalRecords - 1 < i){
                        break;
                    }
                    var device = [];
                    device.push( result[i].id);
                    device.push( parse(result[i].properties).model);
                    device.push( parse(result[i].properties).imei);
                    device.push( result[i].user_id);
                    device.push( result[i].name);
                    device.push( result[i].os_version);
                    device.push( parse(result[i].properties).device);
                    device.push( result[i].created_date);
                    dataArray.push(device);
                }
                var finalObj = {};
                finalObj.sEcho = ctx.sEcho;
                finalObj.iTotalRecords = totalRecords
                finalObj.iTotalDisplayRecords = totalRecords;
                finalObj.aaData = dataArray;
                return finalObj;
            }else{
                result = driver.query(sqlscripts.devices.select35, "%"+userId+"%", common.getTenantID());
                var totalRecords = result.length;
                var upperBound = parseInt(ctx.iDisplayStart)+parseInt(iDisplayLength);
                var lowerBound = parseInt(ctx.iDisplayStart);
                var dataArray = new Array();
                for(var i = lowerBound ;i < upperBound; i++){
                    if(totalRecords - 1 < i){
                        break;
                    }
                    var device = [];
                    device.push( result[i].id);
                    device.push( parse(result[i].properties).model);
                    device.push( parse(result[i].properties).imei);
                    device.push( result[i].user_id);
                    device.push( result[i].name);
                    device.push( result[i].os_version);
                    device.push( parse(result[i].properties).device);
                    device.push( result[i].created_date);
                    dataArray.push(device);
                }
                var finalObj = {};
                finalObj.sEcho = ctx.sEcho;
                finalObj.iTotalRecords = totalRecords
                finalObj.iTotalDisplayRecords = totalRecords;
                finalObj.aaData = dataArray;
                return finalObj;
            }
        }
    };
    return module;
})();

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}
