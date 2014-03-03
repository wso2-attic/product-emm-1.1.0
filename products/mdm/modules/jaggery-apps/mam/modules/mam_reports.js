
var mam_reports = (function () {

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var db;
    var module = function (dbs) {
        db = dbs;
        //mergeRecursive(configs, conf);
    };
    var storeModule = require('/modules/store.js').store;
    var store = new storeModule(db);

    var GET_APP_FEATURE_CODE = '502A';

    module.prototype = {
        constructor: module,

        getInstalledApps:function(params){
        	var queryString;
        	var devicesInfo;
        	var platform = params.platformType;
            var appsStore = store.getAppsFromStorePackageAndName();
            
            if (platform == 0) {
            	queryString = "SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code = ? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.id";
            	devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
            } else {
            	queryString = "SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code = ? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id AND p.type = ?) WHERE feature_code = ? ORDER BY n.id";
            	devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, platform, GET_APP_FEATURE_CODE);
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
            tenant_id = session.get("mamConsoleUser").tenantId;
            if (user_id) {
                queryString = "SELECT n.user_id,p.type_name, d.os_version, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code=? AND user_id=? AND tenant_id=? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id,n.device_id";
                devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, user_id, tenant_id, GET_APP_FEATURE_CODE);
            } else {
                queryString = "SELECT n.user_id,p.type_name, d.os_version, n.device_id, n.received_data FROM notifications as n JOIN (SELECT device_id, MAX(received_date) as MaxTimeStamp FROM notifications WHERE feature_code=? AND received_date != 'NULL' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices as d ON (n.device_id = d.id) JOIN platforms as p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id,n.device_id";
                devicesInfo = db.query(queryString, GET_APP_FEATURE_CODE, GET_APP_FEATURE_CODE);
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
