
var mdm_reports = (function () {

    var deviceModule = require('device.js').device;
    var device;
    var storeModule = require('/modules/store.js').store;
    var store = new storeModule(db);
    var GET_APP_FEATURE_CODE = '502A';
    var common = require("common.js");
    var sqlscripts = require('/sqlscripts/db.js');

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;
    var driver;
    var module = function (dbs) {
        db = dbs;
        device = new deviceModule(db);
        driver = require('driver').driver(db);
    };

    function getComplianceStateFromReceivedData(receivedData){
        for(var i = 0; i< receivedData.length; i++){
            if(receivedData[i].status == false){
                return false;
            }
        }
        return true;
    }

    function getComplianceInfoFromReceivedData(receivedData){
        var newArray = new Array();
        for(var i = 0; i< receivedData.length; i++){
            if(receivedData[i].code == 'notrooted'){
                var obj = {};
                obj.name = 'Not Rooted';
                obj.status = receivedData[i].status;
                newArray.push(obj);
            }else{
                var featureCode = receivedData[i].code;
                try{
                    var obj = {};
                    var features = driver.query(sqlscripts.features.select6, featureCode);
                    obj.name = features[0].description;
                    obj.status = receivedData[i].status;
                    newArray.push(obj);
                }catch(e){
                    log.debug(e);
                }
            }
        }
        return newArray;
    }

    function getComplianceStateChanges(result,deviceID){
        var currentState = device.getCurrentDeviceState(parseInt(deviceID));
        if(currentState == 'A'){
            currentState = "Active";
        }else if(currentState == 'PV'){
            currentState = "Policy Violated";
        }else{
            currentState = "Blocked";
        }
        var state = getComplianceStateFromReceivedData(parse(result[0].received_data));
        var array = new Array();
        var obj = {};
        obj.userID =  result[0].user_id;
        obj.timeStamp = common.getFormattedDate(result[0].received_date);
        obj.resons = getComplianceInfoFromReceivedData(parse(result[0].received_data));
        obj.status = state;
        obj.current_status = currentState;
        array.push(obj);

        for(var i = 1; i<result.length;i++){
            if(getComplianceStateFromReceivedData(parse(result[i].received_data)) !== state){
                state = getComplianceStateFromReceivedData(parse(result[i].received_data));
                var obj = {};
                obj.userID =  result[i].user_id;
                obj.timeStamp = common.getFormattedDate(result[i].received_date);
                obj.resons = getComplianceInfoFromReceivedData(parse(result[i].received_data));
                obj.status = state;
                obj.current_status = currentState;
                array.push(obj);
            }
        }
        return  array;
    }

    module.prototype = {
        constructor: module,
        getDevicesByRegisteredDate:function(ctx){
            var zeros = ' 00:00:00';
            var ends = ' 23:59:59';
            if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){

                ctx.startDate = "2013-01-01";

            }
            var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                var endDate = ctx.endDate+ends;
            }
            var result = [];
            if(typeof ctx.platformType !== 'undefined' && parse(ctx.platformType) !== 0){
                result = driver.query(sqlscripts.devices.select45, ctx.platformType, startDate, endDate, common.getTenantID());
            }else{
                result = driver.query(sqlscripts.devices.select49, startDate, endDate, common.getTenantID());
            }
            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null ){
                for(var i=0; i< result.length;i++){
                    result[i].imei = parse(result[i].properties).imei;
                }
                return  result;
            }else{
                return null;
            }
        },

        getDevicesByComplianceState:function(ctx){
             var zeros = ' 00:00:00';
             var ends = ' 23:59:59';

             if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){
                ctx.startDate = "2013-01-01";
             }
             var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                endDate = ctx.endDate+ends;
            }
            
            var result = driver.query(sqlscripts.devices.select50, startDate, endDate, "%" + ctx.username + "%", "%" + ctx.status + "%", common.getTenantID());
            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null ){
                 for(var i=0; i< result.length;i++){
                     result[i].imei = parse(result[i].properties).imei;
                     if(result[i].status == 'A'){
                        result[i].status = 'Policy Compliance';
                     }else if(result[i].status == 'PV'){
                        result[i].status = 'Policy Violated';
                     }else{
                        result[i].status = 'Blocked';
                     }
                 }
                 return  result;
             }else{
                 return null;
             }
        },

        getComplianceStatus:function(ctx){
            var zeros = ' 00:00:00';
            var ends = ' 23:59:59';
            if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){
                ctx.startDate = "2013-01-01";
            }
            var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                endDate = ctx.endDate+ends;
            }
            
            var result = driver.query(sqlscripts.notifications.select16, ctx.deviceID, startDate, endDate, common.getTenantID());

            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null){
                var stateChangesArray = getComplianceStateChanges(result,ctx.deviceID);
                return stateChangesArray;
            }else{
                return null;
            }
        },

        getInstalledApps:function(params){
        	var queryString;
        	var devicesInfo;
        	var platform = params.platformType;
            var appsStore = store.getAppsFromStorePackageAndName();
            
            try {
                if (platform == 0) {
                    log.info("platform 0 ");
                    devicesInfo = driver.query(sqlscripts.notifications.select17, GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
                } else {
                    devicesInfo = driver.query(sqlscripts.notifications.select18, GET_APP_FEATURE_CODE, platform, GET_APP_FEATURE_CODE);
                }
            } catch(e) {
                log.error(e);
            }

            var deviceInfo;
            var existingApps =[];

            // Checks the device type and put installed application's package name into an array.
            for (var i=0;i<devicesInfo.length;i++) {
                deviceInfo = parse(devicesInfo[i].received_data);
                for(var j=0;j<deviceInfo.length;j++){
                    if (devicesInfo[i].type_name.toUpperCase() === "ANDROID") {
                        existingApps.push(deviceInfo[j].package);
                    } else if (devicesInfo[i].type_name.toUpperCase() === "IOS") {
                        existingApps.push(deviceInfo[j].Identifier);
                    }
                }       
            }

            // Gets the installed application's package names which are in the store.   
            var installedApps = [];
            var count; // Installations count.
        	var appName;
            for (var i=0;i<appsStore.length;i++) {
            	count = 0;
            	for (var j=0;j<existingApps.length;j++) {          		
            		if (appsStore[i].package === existingApps[j]) {
            			count++;
            			appName = existingApps[j].name;
            		}           		
            	}
            	if (count) {
					var installedApp = new Object();
					// Get the installed application name.
					installedApp.appName = appsStore[i].name;
					installedApp.count = count;
					installedApps.push(installedApp);
            	}      	
            }
            
            installedApps = installedApps.sort(compare);
            // Get the first 10 applications name list.
            installedApps = installedApps.slice(0,10);
            return installedApps;
        },

        getInstalledAppsByUser: function (params) {
            var queryString;
            var results = [], app_info, appData , user_id, tenant_id;
            var deviceInfo, devicesInfo;
            //Create the db query based on user id provided
            user_id = params.userid;
            tenant_id = session.get("emmConsoleUser").tenantId;
            if (user_id) {
                devicesInfo = driver.query(sqlscripts.notifications.select19, GET_APP_FEATURE_CODE, user_id, tenant_id, GET_APP_FEATURE_CODE);
            } else {
                devicesInfo = driver.query(sqlscripts.notifications.select20, GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
            }
            //Get the list of apps in Store
            var appsStore = store.getAppsFromStorePackageAndName();
            var appList = new Object();
            //create a dictionary using the data retrieved from the appStore for quick reference
            for (var i = 0; i < appsStore.length; i++) {
                appList[appsStore[i].package] = {"name": appsStore[i].name, "type": appsStore[i].type};
            }

            //Temporary patch to make report generation easy
            for (var i = 0; i < devicesInfo.length; i++) {
                deviceInfo = parse(devicesInfo[i].received_data);
                for (var j = 0; j < deviceInfo.length; j++) {
                    if (appList[deviceInfo[j].package] || appList[deviceInfo[j].Identifier]) {
                        app_info = new Object();
                        app_info.platform = devicesInfo[i].type_name;
                        app_info.device_id = devicesInfo[i].device_id;
                        app_info.os_version = devicesInfo[i].os_version;
                        if (devicesInfo[i].type_name.toUpperCase() === "ANDROID") {
                            appData = appList[deviceInfo[j].package];
                            app_info.name = appData.name;
                            app_info.type = appData.type;
                            app_info.package = deviceInfo[j].package;
                        } else if (devicesInfo[i].type_name.toUpperCase() === "IOS") {
                            appData = appList[deviceInfo[j].Identifier];
                            app_info.name = appData.name;
                            app_info.type = appData.type;
                            app_info.package = deviceInfo[j].Identifier;
                        }
                        results.push(app_info);
                    }
                }
            }
            return results;
        }
    };

    /* Compares by the count and sort in descending order. */
    function compare(a,b) {
    	  if (a.count > b.count)
    	     return -1;
    	  if (a.count < b.count)
    	    return 1;
    	  return 0;
    }
    
    return module;
})();