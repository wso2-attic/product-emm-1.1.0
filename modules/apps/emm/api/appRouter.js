var Handle = require("/modules/handlebars.js").Handlebars;

var getTenantID = function() {
    if(!(typeof session === "undefined")){
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

var getApp = function(id, tenantDomain){
	var app =  store.getAppFromStore(id, tenantDomain);
	return app;
}
var buildInstallParam = function(ctx){
	var installParam = configs.mam.archieve_location_android+ctx.url;
	if (ctx.platform.toUpperCase() == 'IOS'){
		installParam = configs.mam.archieve_location_ios+"/emm/api/apps/install/ios/"+ctx.id+"?tenantDomain="+getTenantDomainFromID(getTenantID());;
	}
	if(ctx.type == "Market" || ctx.type == "VPP"){
		if(ctx.platform.toUpperCase() == 'IOS'){
			installParam = getApp(ctx.id).attributes.overview_appid;
		}else{
			installParam = ctx.packageid;
		}
	}
    log.debug("installParam >>>>>>> " + installParam);
	return installParam;
}
//Inserts a VPP code into the payload if the app type is VPP
var injectVPPCode = function(appid, installData){
	if(installData.type=="VPP"){
		installData.coupon = vppManager.getCoupon(appid, installData.deviceid, current_user.username);
	}
	return installData;
}

var compileTemplate = function(templatePath, context){
	var template = Handle.compile(getResource(templatePath));
	return template(context);
}
function getResource(name){
	var f = new File(name);
	f.open("r");
	var cont = f.readAll();
	f.close();
	return cont;
}

var app = {
    route: function(db, router) {
        router.get('webconsole/allUsers', function(ctx) {
            var result = webconsole.getAllUsers(ctx);
            print(result);
        });
        router.get('apps', function(ctx) {
            var result = store.getAppsFromStore(ctx.paging);
            response.content = result;
        });
        /*
		 Sample call - https://localhost:9443/mam/api/apps/roles/installed?platform=iOS&packageid=com.naveenium.foursquare
		*/
        router.get('apps/roles', function(ctx) {
            if (ctx.packageid) {
                var result = store.getRolesForApp(ctx.packageid, ctx.platform, 1);
                response.content = result;
            } else {
                response.status = 400;
            }
        });
		/*
		 Sample call - https://localhost:9443/mam/api/apps/roles/installed?platform=iOS&packageid=com.naveenium.foursquare
		*/
        router.get('apps/users/installed', function(ctx) {
            if (ctx.packageid) {
                var result = store.getUsersForAppInstalled(ctx.packageid, ctx.platform);
                response.content = result;
            } else {
                response.status = 400;
            }
        });
        /*
		 Sample call - https://localhost:9443/mam/api/apps/roles/not-installed?platform=iOS&packageid=com.naveenium.foursquare
		*/
        router.get('apps/users/not-installed', function(ctx) {
            if (ctx.packageid) {
                var result = store.getUsersForAppNotInstalled(ctx.packageid, ctx.platform);
                response.content = result;
            } else {
                response.status = 400;
            }
        });
        router.post('apps/roles/uninstall', function(ctx) {
            if (ctx.packageid) {
                var result = store.getRolesForApp(ctx.packageid, ctx.platform, 2);
                var roles = ctx.roles;
                var uninstallPayload = [];
                for (var i = roles.length - 1; i >= 0; i--) {
                    var role = roles[i];
                    var row = result[role];
                    if (row != undefined) {
                        for (var j = row.devices.length - 1; j >= 0; j--) {
                            var device = row.devices[j];
                            uninstallPayload.push({
                                deviceid: device,
                                identity: ctx.packageid,
                                platform_id: ctx.platform,
                                type: ctx.type
                            });
                        }
                    }
                };
                try {
                    store.uninstallApp(uninstallPayload);
                } catch (e) {
                    response.status = 403;
                    return;
                }
                response.status = 200;
            } else {
                response.status = 400;
            }
        });
        router.post('apps/roles/install', function(ctx) {
            if (ctx.packageid) {
                var installParam = buildInstallParam(ctx);
                var installPayload = [];
                var result = store.getRolesForApp(ctx.packageid, ctx.platform, 2);
                for (var i = ctx.roles.length - 1; i >= 0; i--) {
                    var role = ctx.roles[i];
                    var row = result[role];
                    if (row != undefined) {
                        for (var j = row.devices.length - 1; j >= 0; j--) {
                            var device = row.devices[j];
                            try {
                                installPayload.push(injectVPPCode(ctx.id, {
                                    deviceid: device,
                                    identity: installParam,
                                    platform_id: ctx.platform,
                                    type: ctx.type
                                }));
                            } catch (e) {
                                log.error(e);
                            }
                        };
                    }
                };
                try {
                    store.installApp(installPayload);
                } catch (e) {
                    log.error(e);
                    response.status = 403;
                    return;
                }
                response.status = 200;
            } else {
                response.status = 400;
            }
        });
        router.post('apps/users/uninstall', function(ctx) {
            if (ctx.packageid) {
                var result = store.getUsersForAppInstalled(ctx.packageid, ctx.platform);
                var uninstallPayload = [];
                for (var i = ctx.users.length - 1; i >= 0; i--) {
                    var user = ctx.users[i];
                    var row = result[user];
                    if (row != undefined) {
                        for (var j = row.devices.length - 1; j >= 0; j--) {
                            var device = row.devices[j];
                            uninstallPayload.push({
                                deviceid: device,
                                platform_id: ctx.platform,
                                identity: ctx.packageid,
                                type: ctx.type
                            });
                        };
                    }
                };
                try {
                    store.uninstallApp(uninstallPayload);
                } catch (e) {
                    response.status = 403;
                    return;
                }
                response.status = 200;
            } else {
                response.status = 400;
            }
        });
        router.post('apps/users/install', function(ctx) {
            if (ctx.packageid) {
                var installParam = buildInstallParam(ctx);
                var result = store.getUsersForAppNotInstalled(ctx.packageid, ctx.platform);
                var installPayload = [];
                for (var i = ctx.users.length - 1; i >= 0; i--) {
                    var user = ctx.users[i];
                    var row = result[user];
                    if (row != undefined) {
                        for (var j = row.devices.length - 1; j >= 0; j--) {
                            var device = row.devices[j];
                            try {
                                installPayload.push(injectVPPCode(ctx.id, {
                                    deviceid: device,
                                    identity: installParam,
                                    platform_id: ctx.platform,
                                    type: ctx.type
                                }));
                            } catch (e) {
                                log.error(e);
                            }
                        };
                    }
                };
                try {
                    store.installApp(installPayload, ctx.platform);
                } catch (e) {
                    response.status = 403;
                    return;
                }
                response.status = 200;
            } else {
                response.status = 400;
            }
        });
        router.post("apps/install", function(ctx) {
            if (ctx.packageid) {
                var installParam = buildInstallParam(ctx);
                var result = store.getUsersForAppNotInstalled(ctx.packageid, ctx.platform);
            } else {
                response.status = 400;
            }
        });
        router.post("apps/vpp/callback", function(ctx) {
            try {
                vppManager.installCallback(ctx);
            } catch (error) {
                print(error);
                response.sendError(500);
            }
        });
        router.post("vpp", function(ctx) {
            var csv = ctx.csv;
            var csvReader = require('modules/csv.js').CSV;
            csv = csvReader.parse(csv);
            vppManager.addCoupons();
            return csv;
        });
        router.get("apps/install/ios/{id}", function(ctx) {
            var app = getApp(ctx.id, ctx.tenantDomain);
            var iosManifest = compileTemplate("/template.hbs", {
                url: configs.mam.archieve_location_ios + "" + app.attributes.overview_url,
                bundleid: app.attributes.overview_packagename,
                bundleversion: app.attributes.overview_bundleversion,
                appname: app.attributes.overview_name
            });
            log.info(iosManifest);
            response.contentType = "application/xml";
            print(iosManifest);
        });
        router.get('test', function() {
            var result = store.getUsersForAppInstalled({
                packageid: 'com.naveenium.foursquare',
                platform: 1
            });
            response.content = result;
        });
    }
}
