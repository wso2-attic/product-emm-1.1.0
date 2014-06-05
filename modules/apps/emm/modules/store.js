var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';

var store = (function() {
    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var carbon = require('carbon');
    var db;
    
    var userModule = require('user.js').user;
    var user = new userModule();

    var deviceModule = require('device.js').device;
    var device;
    
    var sqlscripts = require('/sqlscripts/db.js');

    var configsFile = require('/config/emm.js').config();
    var GET_APP_FEATURE_CODE = '502A';
    var driver;
    var module = function(dbs) {
        db = dbs;
        driver = require('driver').driver(db);
        device = new deviceModule(db);
    };
    var server = function() {
        return application.get("SERVER");
    }
    var configs = function(tenantId) {
        var configg = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return configg;
        }
        return configs[tenantId] || (configs[tenantId] = {});
    };
    var userManager = function(tenantId) {
        var config = configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        return configs(tenantId)[USER_MANAGER];
    };
    var getTenantID = function() {
        if (!(typeof session === "undefined")) {
            if (session.get("emmConsoleUser") && session.get("emmConsoleUser").tenantId != 0) {
                var tenantID = session.get("emmConsoleUser").tenantId;
                return tenantID;
            } else {
                return "-1234";
            }
        }
    }
    var getTenantDomainFromID = function() {
        if (arguments[0] == "-1234") {
            return "carbon.super";
        }
        var carbon = require('carbon');
        var ctx = {};
        ctx.tenantId = arguments[0];
        var tenantDomain = carbon.server.tenantDomain(ctx);
        return tenantDomain;
    }
    var getAllDeviceCountForGroup = function(role, platform) {
        var um = userManager(getTenantID());
        if (role != 'Internal/everyone') {
            var userList = um.getUserListOfRole(role);
            var deviceCountAll = 0;
            for (var j = 0; j < userList.length; j++) {
                var role = userList[j];
                if (role.indexOf('/') !== -1) {
                    role = role.split('/')[1];
                    log.debug(role);
                }
                var resultDeviceCount = driver.query("SELECT COUNT(id) AS device_count FROM devices WHERE user_id = ? AND tenant_id = ? and " + buildPlatformString(platform), String(role), getTenantID());
                deviceCountAll += parseInt(resultDeviceCount[0].device_count);
            }
        } else {
            deviceCountAll = driver.query("SELECT COUNT(id) AS device_count FROM devices WHERE tenant_id = ? and " + buildPlatformString(platform), getTenantID())[0].device_count;
            log.debug(deviceCountAll);
        }
        return deviceCountAll;
    };
    var getAllDeviceCountForUser = function(user, platform) {
        var deviceCountAll = 0;
        var resultDeviceCount = driver.query("SELECT COUNT(id) AS device_count FROM devices WHERE user_id = ? AND tenant_id = ? and " + buildPlatformString(platform), String(user), getTenantID());
        deviceCountAll += parseInt(resultDeviceCount[0].device_count);
        return deviceCountAll;
    };
    var removePrivateRole = function(roleList) {
        var roles = new Array();
        for (var i = 0; i < roleList.length; i++) {
            var prefix = '';
            try {
                prefix = roleList[i].substring(0, 17);
            } catch (e) {
                //   log.info('error occured while removing private role');
            }
            if (prefix == 'Internal/private_') {
                continue;
            } else {
                roles.push(roleList[i]);
            }
        }
        return roles;
    }
    var buildPlatformString = function(platform) {
        var platform = platform.toUpperCase();
        if (platform == 'ANDROID') {
            platform = 'devices.platform_id=1';
        } else if (platform == 'IOS') {
            platform = '(devices.platform_id=2 or devices.platform_id=3 or devices.platform_id=4)';
        }
        return platform;
    }
    var manipulatePackageId = function(packageid) {
        return "%" + packageid + "%";
    }
    var buildDynamicQuery = function(platform, type, tenantId) {
        var platform = buildPlatformString(platform);
        var query;
        if (type == 1) {
            query = "select out_table.id, out_table.user_id, out_table.device_id, out_table.received_data, devices.platform_id from notifications as out_table , devices where out_table.`feature_code`='" + GET_APP_FEATURE_CODE + "' and out_table.`status`='R' and out_table.`tenant_id`=" + tenantId + " and out_table.`id` in (select MAX(inner_table.`id`) from notifications as inner_table where inner_table.`feature_code`= '" + GET_APP_FEATURE_CODE + "' and inner_table.`status`='R' and out_table.device_id =inner_table.device_id)  and devices.id=out_table.device_id and " + platform + "  and  `received_data` like ?;";
        } else if (type == 2) {
            query = "select out_table.id, out_table.user_id, out_table.device_id, out_table.received_data, devices.platform_id  from notifications as out_table , devices where out_table.`feature_code`= '" + GET_APP_FEATURE_CODE + "' and out_table.`status`='R' and out_table.`tenant_id`=" + tenantId + " and out_table.`id` in (select MAX(inner_table.`id`) from notifications as inner_table where inner_table.`feature_code`= '" + GET_APP_FEATURE_CODE + "' and inner_table.`status`='R' and out_table.device_id =inner_table.device_id)  and devices.id=out_table.device_id and " + platform + " and `received_data` not like ?;";
        }
        return query;
    }
    /*
    ctx - url, platform, ctx.id, ctx.packageid
  */
    
    var getApp = function(id, tenantDomain){
        var app =  module.prototype.getAppFromStore(id, tenantDomain);
        
        return app;
    }
    
    
    
    var buildInstallParam = function(ctx) {
        
        var installParam = configsFile.mam.archieve_location_android + ctx.url;
        if (ctx.platform.toUpperCase() == 'IOS') {
            installParam = configsFile.mam.archieve_location_ios + "/emm/api/apps/install/ios/" + ctx.id + "?tenantDomain=" + getTenantDomainFromID(getTenantID());
        }
        if (ctx.type == "Market" || ctx.type == "VPP") {
            
            if (ctx.platform.toUpperCase() == 'IOS') {
                
                installParam = getApp(ctx.id).attributes.overview_appid;
               
            } else {
                installParam = ctx.packageid;
            }
        }
        return installParam;
    }
    // prototype
    module.prototype = {
        constructor: module,
        getAllDevicesFromEmail: function(ctx) {
            log.debug("EMM called >>>>>");
            var devicesArray;
            if (ctx.data.platform == 'webapp') {
                user.getUser(ctx.user)
                var userID = user.getUser({
                    userid: ctx.data.email
                }).id;
                var devices = driver.query("select * from devices where devices.user_id=" + userID);
                devicesArray = new Array();
                for (var i = 0; i < devices.length; i++) {
                    var deviceID = devices[i].id;
                    var properties = devices[i].properties;
                    var propertiesJsonObj = parse(properties);
                    var name = propertiesJsonObj.device;
                    var model = propertiesJsonObj.model;
                    var platforms = driver.query("select platforms.type_name as platform from devices, platforms where platforms.id = devices.platform_id && devices.id=" + deviceID);
                    var platform = platforms[0].platform
                    var packet = {};
                    packet.id = deviceID;
                    packet.name = name;
                    packet.model = model;
                    packet.platform = platform;
                    devicesArray.push(packet);
                }
                return devicesArray;
            }
            if (ctx.data.platform != undefined && ctx.data.platform != null) {
                var userID = user.getUser({
                    userid: ctx.data.email
                }).id;
                var devices = driver.query("select * from devices where devices.user_id=" + userID);
                //    ctx.data.platform = "iOS";
                var platforms = driver.query("select * from platforms where type_name ='" + ctx.data.platform + "'");
                // platformId = platforms[0].id;
                devicesArray = new Array();
                for (var j = 0; j < platforms.length; j++) {
                    var devices = driver.query("select * from devices where devices.user_id=" + userID + " and devices.platform_id = " + platforms[j].id);
                    for (var i = 0; i < devices.length; i++) {
                        var deviceID = devices[i].id;
                        var properties = devices[i].properties;
                        var propertiesJsonObj = parse(properties);
                        var name = propertiesJsonObj.device;
                        var model = propertiesJsonObj.model;
                        var packet = {};
                        packet.id = deviceID;
                        packet.name = name;
                        packet.model = model;
                        packet.platform = ctx.data.platform;
                        devicesArray.push(packet);
                    }
                }
            } else {
                
                log.debug(stringify(user.getUser({
                    userid: ctx.data.email
                })));
                var userID = user.getUser({
                    userid: ctx.data.email
                }).username;
                var devices = driver.query("select * from devices where devices.user_id='" + String(userID) + "'");
                devicesArray = new Array();
                for (var i = 0; i < devices.length; i++) {
                    var deviceID = devices[i].id;
                    var properties = devices[i].properties;
                    var propertiesJsonObj = parse(properties);
                    var name = propertiesJsonObj.device;
                    var model = propertiesJsonObj.model;
                    var platforms = driver.query("select platforms.type_name as platform from devices, platforms where platforms.id = devices.platform_id && devices.id=" + deviceID);
                    var platform = platforms[0].platform
                    var packet = {};
                    packet.id = deviceID;
                    packet.name = name;
                    packet.model = model;
                    packet.platform = platform;
                    devicesArray.push(packet);
                }
            }
            return devicesArray;
        },
        // [{"id" : "6a680b0a-4f7a-42a2-9f68-3bc6ff377818", "type" : "mobileapp", "path" : "/_system/governance/mobileapps/android/Batman/1.0", "lifecycle" : "MobileAppLifeCycle", "lifecycleState" : "Published", "mediaType" : "application/vnd.wso2-mobileapp+xml", "attributes" : {"overview_status" : "null", "overview_name" : "Batman", "overview_url" : "/upload/MbAk3app.apk", "overview_bundleversion" : "1.0.1", "overview_packagename" : "com.wb.goog.ArkhamCity", "overview_category" : "iOS,Android,Web Clips", "images_thumbnail" : "/publisher//upload/GTbdSicon.png", "overview_type" : "Enterprise", "overview_description" : "sdfjkdslfj ", "overview_recentchanges" : "wieruweoir ", "overview_version" : "1.0", "images_screenshots" : "/publisher//upload/8UISPscreenshot1.jpg,/publisher//upload/ElLTAscreenshot2.jpg,", "overview_provider" : "admin@admin.com", "images_banner" : "/publisher//upload/8PnYgbanner.jpg", "overview_appid" : "null", "overview_platform" : "android"}, "content" : {}, "rating" : {"average" : 0.0, "user" : 0}, "indashboard" : false}, {"id" : "e23f5cf0-d1be-421d-a44e-74bd0ab65fff", "type" : "mobileapp", "path" : "/_system/governance/mobileapps/android/Zip Archiver/1.0", "lifecycle" : "MobileAppLifeCycle", "lifecycleState" : "Published", "mediaType" : "application/vnd.wso2-mobileapp+xml", "attributes" : {"overview_status" : "null", "overview_name" : "Zip Archiver", "overview_url" : "/upload/mGc3Happ.apk", "overview_bundleversion" : "0.6.1", "overview_packagename" : "org.b1.android.archiver", "overview_category" : "iOS,Android,Web Clips", "images_thumbnail" : "/publisher//upload/1eLXXicon.png", "overview_type" : "Enterprise", "overview_description" : "dfdslkfj ", "overview_recentchanges" : "wurowieur ", "overview_version" : "1.0", "images_screenshots" : "/publisher//upload/n5iv6screenshot2.jpg,/publisher//upload/Zu0Qkscreenshot1.jpg,", "overview_provider" : "admin@admin.com", "images_banner" : "/publisher//upload/s6jCKbanner.png", "overview_appid" : "null", "overview_platform" : "android"}, "content" : {}, "rating" : {"average" : 0.0, "user" : 0}, "indashboard" : false}]
        getAppsFromStore: function(page) {

        /*
            Processing pagniation
        */
            var pagination = true;
            var fApps = [];
            var page = 1;
            log.info("Tenant ID: " + getTenantID());
            do {
                var url = configsFile.mam.store_location + "/apis/assets/mobileapp" + "?domain=" + getTenantDomainFromID(getTenantID()) + "&page=" + page;
                log.debug("url: " + url);
                var data = get(url, {});
                data = parse(data.data);
                if (data.length == 0) {
                    pagination = false;
                }
                for (var i = data.length - 1; i >= 0; i--) {
                    var app = data[i];
                    if (app.attributes.overview_platform.toUpperCase() != "WEBAPP") {
                        fApps.push(app);
                    }
                }
                page++;
            } while (pagination);
            return fApps;
        },
        getAppsFromStoreFormatted: function() {
            var apps = this.getAppsFromStore();
            
            var fApps = [];
            for (var i = apps.length - 1; i >= 0; i--) {
                var app = apps[i];
                var fApp = {
                    'identity': buildInstallParam({
                        'url': app.attributes.overview_url,
                        'platform': app.attributes.overview_platform,
                        'id': app.id,
                        'packageid': app.attributes.overview_packagename,
                        'type': app.attributes.overview_type
                    }),
                    'os': app.attributes.overview_platform,
                    'type': app.attributes.overview_type,
                    'name': app.attributes.overview_name
                };
                fApps.push(fApp);
            }
           
            return fApps;
        },
        getAppFromStore: function(id, tenantDomain) {
           
            if (!tenantDomain) {
                tenantDomain = getTenantDomainFromID(getTenantID());
            }
            var url = configsFile.mam.store_location + "/apis/asset/mobileapp?id=" + id + "&domain=" + tenantDomain;
            var data = get(url, {});
            data = parse(data.data);
            return data;
        },
        // Get the package and application name of the appications in the store.
        getAppsFromStorePackageAndName: function() {
            var apps = this.getAppsFromStore();
            var appsInfo = [];
            for (var i = apps.length - 1; i >= 0; --i) {
                var app = apps[i];
                var appData = new Object();
                appData.package = app.attributes.overview_packagename;
                appData.name = app.attributes.overview_name;
                appData.type = app.attributes.overview_type;
                appsInfo.push((appData));
            }
            return appsInfo;
        },
        getUsersForAppInstalled: function(package_identifier, platform) {
            var query = buildDynamicQuery(platform, 1, getTenantID());
            var package_identifier = manipulatePackageId(package_identifier);
            var returnResult = {};
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    var userVal = returnResult[result.user_id];
                    if (userVal == undefined) {
                        returnResult[result.user_id] = {
                            device_count: 0,
                            devices: [],
                            roles: []
                        }
                        userVal = returnResult[result.user_id];
                    }
                    userVal.total_devices = getAllDeviceCountForUser(result.user_id, platform);
                    userVal.device_count = userVal.device_count + 1;
                    userVal.devices.push(result.device_id);
                    if(userObj.roles!=null){
                        userVal.roles = parse(userObj.roles);
                    }
                }
            };
            return returnResult;
        },
        getUsersForAppNotInstalled: function(package_identifier, platform) {
            var query = buildDynamicQuery(platform, 2, getTenantID());
            var package_identifier = manipulatePackageId(package_identifier);
            var returnResult = {};
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    var userVal = returnResult[result.user_id];
                    if (userVal == undefined) {
                        returnResult[result.user_id] = {
                            device_count: 0,
                            devices: [],
                            roles: []
                        }
                        userVal = returnResult[result.user_id];
                    }
                    userVal.total_devices = getAllDeviceCountForUser(result.user_id, platform);
                    userVal.device_count = userVal.device_count + 1;
                    userVal.devices.push(result.device_id);
                    userVal.roles = parse(userObj.roles);
                }
            };
            return returnResult;
        },
        getRolesForApp: function(package_identifier, platform, query_type) {
            //If query_type is 2 device ids are returned
            var query = buildDynamicQuery(platform, 1, getTenantID());
            var package_identifier = manipulatePackageId(package_identifier);
            var returnResult = {};
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    if (userObj.roles != undefined) {
                        userObj.roles = parse(userObj.roles);
                        userObj.roles = removePrivateRole(userObj.roles);
                        for (var j = userObj.roles.length - 1; j >= 0; j--) {
                            var role = userObj.roles[j];
                            var roleVal = returnResult[role];
                            if (roleVal == undefined) {
                                returnResult[role] = {
                                    device_install_count: 0,
                                    device_not_install_count: 0,
                                    devices: []
                                }
                                roleVal = returnResult[role];
                            }
                            roleVal.total_devices = getAllDeviceCountForGroup(role, platform);
                            roleVal.device_install_count = roleVal.device_install_count + 1;
                            if (query_type == 2) {
                                roleVal.devices.push(result.device_id);
                            }
                        };
                    }
                }
            };
            query = buildDynamicQuery(platform, 2, getTenantID());
            log.debug(package_identifier);
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    if (userObj.roles != undefined) {
                        userObj.roles = parse(userObj.roles);
                        userObj.roles = removePrivateRole(userObj.roles);
                        for (var j = userObj.roles.length - 1; j >= 0; j--) {
                            var role = userObj.roles[j];
                            var roleVal = returnResult[role];
                            if (roleVal == undefined) {
                                returnResult[role] = {
                                    device_install_count: 0,
                                    device_not_install_count: 0,
                                    devices: []
                                }
                                roleVal = returnResult[role];
                            }
                            roleVal.device_not_install_count = roleVal.device_not_install_count + 1;
                            roleVal.total_devices = getAllDeviceCountForGroup(role, platform);
                            if (query_type == 2) {
                                roleVal.devices.push(result.device_id);
                            }
                        };
                    }
                }
            };
            return returnResult;
        },
        getRolesForAppInstalled: function(package_identifier, platform) {
            var query = buildDynamicQuery(platform, 1, getTenantID());
            var package_identifier = manipulatePackageId(package_identifier);
            var returnResult = {};
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    if (userObj.roles != undefined) {
                        userObj.roles = parse(userObj.roles);
                        userObj.roles = removePrivateRole(userObj.roles);
                        for (var j = userObj.roles.length - 1; j >= 0; j--) {
                            var role = userObj.roles[j];
                            var roleVal = returnResult[role];
                            if (roleVal == undefined) {
                                returnResult[role] = {
                                    device_count: 0,
                                    devices: []
                                }
                                roleVal = returnResult[role];
                            }
                            roleVal.total_devices = getAllDeviceCountForGroup(role, platform);
                            roleVal.device_count = roleVal.device_count + 1;
                            roleVal.devices.push(result.device_id);
                        };
                    }
                }
            };
            return returnResult;
        },
        getRolesForAppNotInstalled: function(package_identifier, platform) {
            var query = buildDynamicQuery(platform, 2, getTenantID());
            var package_identifier = manipulatePackageId(package_identifier);
            var returnResult = {};
            query = driver.query(query, package_identifier);
            for (var i = query.length - 1; i >= 0; i--) {
                var result = query[i];
                var userObj = user.getUser({
                    userid: result.user_id
                });
                if (userObj != undefined) {
                    if (userObj.roles != undefined) {
                        userObj.roles = parse(userObj.roles);
                        userObj.roles = removePrivateRole(userObj.roles);
                        for (var j = userObj.roles.length - 1; j >= 0; j--) {
                            var role = userObj.roles[j];
                            var roleVal = returnResult[role];
                            if (roleVal == undefined) {
                                returnResult[role] = {
                                    device_count: 0,
                                    devices: []
                                }
                                roleVal = returnResult[role];
                            }
                            roleVal.total_devices = getAllDeviceCountForGroup(role, platform);
                            roleVal.device_count = roleVal.device_count + 1;
                            roleVal.devices.push(result.device_id);
                        };
                    }
                }
            };
            return returnResult;
        },
        uninstallApp: function(payload) {
            payload = {devices: payload, operation: "UNINSTALLAPP"}
            device.sendToDevices(payload);
        },
        installApp: function(payload) {
            payload = {devices: payload, operation: "INSTALLAPP"}
            device.sendToDevices(payload);
        },
        getAllAppFromDevice: function(ctx) {
            var deviceId = ctx.deviceId;
            var last_notification = driver.query("select * from notifications where `device_id`=? and `feature_code`= '" + GET_APP_FEATURE_CODE + "' and `status`='R' and `id` = (select MAX(`id`) from notifications where `device_id`=? and `feature_code`= '" + GET_APP_FEATURE_CODE + "' and `status`='R')", deviceId, deviceId);
            last_notification[0].received_data = JSON.parse(unescape(last_notification[0].received_data));
            return last_notification[0];
        },
        getAllDevicesFromEmail: function(ctx) {
            log.debug("Test platform :" + ctx.data.platform);
            var devicesArray;
            if (ctx.data.platform == 'webapp') {
                user.getUser(ctx.user)
                var userID = user.getUser({
                    userid: ctx.data.email,
                    login: true
                }).id;
                var devices = driver.query(sqlscripts.devices.select29, userID);
                devicesArray = new Array();
                for (var i = 0; i < devices.length; i++) {
                    var deviceID = devices[i].id;
                    var properties = devices[i].properties;
                    var propertiesJsonObj = parse(properties);
                    var name = propertiesJsonObj.device;
                    var model = propertiesJsonObj.model;
                    var platforms = driver.query(sqlscripts.devices.select30, deviceID);
                    log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));
                    var platform = platforms[0].platform
                    var packet = {};
                    packet.id = deviceID;
                    packet.name = name;
                    packet.model = model;
                    packet.platform = platform;
                    devicesArray.push(packet);
                }
                return devicesArray;
            }
            if (ctx.data.platform != undefined && ctx.data.platform != null) {
                var userID = user.getUser({
                    userid: ctx.data.email,
                    login: true
                }).id;
                var devices = driver.query(sqlscripts.devices.select29, userID);
                var platforms = driver.query(sqlscripts.platforms.select2, ctx.data.platform);
                log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));
                devicesArray = new Array();
                for (var j = 0; j < platforms.length; j++) {
                    var devices = driver.query(sqlscripts.devices.select31, userID, platforms[j].id);
                    log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(devices));
                    for (var i = 0; i < devices.length; i++) {
                        var deviceID = devices[i].id;
                        var properties = devices[i].properties;
                        var propertiesJsonObj = parse(properties);
                        var name = propertiesJsonObj.device;
                        var model = propertiesJsonObj.model;
                        var packet = {};
                        packet.id = deviceID;
                        packet.name = name;
                        packet.model = model;
                        packet.platform = ctx.data.platform;
                        devicesArray.push(packet);
                    }
                }
            } else {
                var userID = user.getUser({
                    userid: ctx.data.email,
                    login: true
                }).username;
                var devices = driver.query(sqlscripts.devices.select29, String(userID));
                log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(devices));
                devicesArray = new Array();
                for (var i = 0; i < devices.length; i++) {
                    var deviceID = devices[i].id;
                    var properties = devices[i].properties;
                    var propertiesJsonObj = parse(properties);
                    var name = propertiesJsonObj.device;
                    var model = propertiesJsonObj.model;
                    var platforms = driver.query(sqlscripts.devices.select30, deviceID);
                    log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));
                    var platform = platforms[0].platform
                    var packet = {};
                    packet.id = deviceID;
                    packet.name = name;
                    packet.model = model;
                    packet.platform = platform;
                    devicesArray.push(packet);
                }
            }
            return devicesArray;
        },
        getAllAppFromDevice: function(ctx) {
            var deviceId = ctx.data.deviceId;
            var GET_APP_FEATURE_CODE = '502A';
            var last_notification = driver.query(sqlscripts.notifications.select12, deviceId, GET_APP_FEATURE_CODE, deviceId, GET_APP_FEATURE_CODE);
            log.debug("getAllAppFromDevice: SQL Check - injection >>>>>>>>> " + stringify(last_notification));
            last_notification[0].received_data = JSON.parse(unescape(last_notification[0].received_data));
            return last_notification[0];
        }
        
        
    };
    // return module
    return module;
})();