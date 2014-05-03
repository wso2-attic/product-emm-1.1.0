
var device = (function () {
    var sqlscripts = require('/sqlscripts/mysql.js');
    var userModule = require('user.js').user;
    var common = require("/modules/common.js");
    var user;
    var module = function (db,router) {
		var deviceModule = require('modules/device.js').device;
		var device = new deviceModule(db);
		user = new userModule(db);
        var Handle = require("/modules/handlebars.js").Handlebars;

        var validateDevice = function() {

            //Allow Android version 4.0.3 and above
            //Allow iOS (iPhone and iPad) version 5.0 and above

            var userOS; //will either be iOS, Android or unknown
            var userOSversion;  //will be a string, use Number(userOSversion) to convert

            var useragent = arguments[0];
            var uaindex;

            //determine the OS
            if(useragent.match(/iPad/i) || useragent.match(/iPhone/i)) {
                userOS = 'iOS';
                uaindex = useragent.indexOf('OS ');
            } else if (useragent.match(/Android/i)) {
                userOS = 'Android';
                uaindex = useragent.indexOf('Android ');
            } else {
                userOS = 'unknown';
            }

            //determine version
            if (userOS == 'iOS' && uaindex > -1) {
                userOSversion = useragent.substr(uaindex + 3, 3).replace('_', '.');
            } else if (userOS == 'Android' && uaindex > -1) {
                userOSversion = useragent.substr(uaindex + 8, 3);
            } else {
                userOSversion = 'unknown';
            }

            if (userOS == 'Android' && userOSversion.substr(0, 4) == '4.0.') {
                if(Number(userOSversion.charAt(4)) >= 3 ) {
                    //Allow device
                    return true;
                }else {
                    //Android version not allowed
                    return false;
                }
            } else if (userOS == 'Android' && Number(userOSversion.substr(0,3)) >= 4.1) {
                //Allow device
                return true;
            } else if(userOS == 'iOS' && Number(userOSversion.charAt(0)) >= 5) {
                //Allow device
                return true;
            } else {
                return false;
            }
        }

        var isAdmin = function(userid){
            var roleList = user.getUserRoles({username:userid});
            for(var i=0; i<roleList.length;i++){
                if(roleList[i]=='admin'||roleList[i]=='mdmadmin'){
                    return true;
                }
            }
	        return false;
        }

       function getResource(name){
            var f = new File(name);
            f.open("r");
            var cont = f.readAll();
            f.close();
            return cont;
        }

        var compileTemplate = function(templatePath, context){
            var template = Handle.compile(getResource(templatePath));
            return template(context);
        }

        var checkOwnership = function(deviceID,username){
            log.debug("Device ID :"+deviceID);
            var result =  db.query(sqlscripts.devices.select1,deviceID);
            log.debug("Result :"+stringify(result));
            if(typeof result != 'undefined' && result!= null && typeof result[0] != 'undefined' && result[0]!= null && result[0].user_id == username ){
                return true;
            }else{
                return false;
            }
        }

        router.get('devices/ios/download', function(ctx) {
            log.debug(">>>>>>>>>");
            config = require('/config/config.json');
            var iosManifest = compileTemplate("/ios_utils/plisttemplate.hbs", {url:config.device.ios.location, bundleid: config.device.ios.bundleid, bundleversion: config.device.ios.version,  appname: config.device.ios.appname});
            response.contentType = "application/xml";
            print(iosManifest);
        });

		router.post('devices/isregistered', function(ctx){
		    var result = device.isRegistered(ctx);
            log.debug(result);
		    if(result){
                log.debug("Check isRegistered registered");
		        print("registered");
		        response.status = 200;
		    }else{
                log.debug("Check isRegistered notregistered");
                print("notregistered");
		        response.status = 404;
		    }
		});


		router.get('device_enroll', function(ctx){
            response.sendRedirect("/mdm/downloadapp");
		});

		router.post('devices/register', function(ctx){
		    var userAgent= request.getHeader("User-Agent");
		    var android = userAgent.indexOf("Android");

		    if(android > 0){
		        device.registerAndroid(ctx);
                	response.status = 201;
                	response.content = "registered"
		    }else{
                	var content = device.registerIOS(ctx);
		    }
		});
		
		router.post('devices/pushtoken', function(ctx){
		    var result = device.saveiOSPushToken(ctx);
		});
		
		router.post('devices/location', function(ctx){
		    var result = device.updateLocation(ctx);
		});
		
		router.post('devices/wifimac', function(ctx){
		    var result = device.getWIFIMac(ctx);
		    print(result);
		});

		router.post('devices/unregister', function(ctx){
		    var result = device.unRegisterAndroid(ctx);
		});
		
		router.post('devices/unregisterios', function(ctx){
            var devices = db.query(sqlscripts.devices.select20, ctx.udid);
            if (devices != null && devices != undefined && devices[0] != null && devices[0] != undefined) {
                if (devices[0].id != null) {
                    var result = device.sendMessageToIOSDevice({"data" : null, "operation" : "ENTERPRISEWIPE", "deviceid" : devices[0].id});
                }
            }
		});
		router.post('devices/AppInstall', function(ctx){
            if(common.checkAuth(ctx)){
                 ctx.operation = "INSTALLAPP";
                for (var i = ctx['data'].length - 1; i >= 0; i--){
                    var operation =  ctx['data'][i];
                    var result = device.sendToDevice({data:operation, operation: ctx.operation, platform_id: operation.platform_id, deviceid: String(operation.deviceid)});
                };
            }
		});

		router.post('devices/AppUNInstall', function(ctx){
            if(common.checkAuth(ctx)){
                ctx.operation = "UNINSTALLAPP";
                for (var i = ctx['data'].length - 1; i >= 0; i--){
                    var operation =  ctx['data'][i];
                    var result = device.sendToDevice({data:operation, operation: ctx.operation, platform_id: operation.platform_id, deviceid: String(operation.deviceid)});
                };
            }
		});

		router.post('devices/{deviceid}/operations/{operation}', function(ctx){
    		log.debug("Device id = "+ctx.deviceid);
    		var username = common.getCurrentLoginUser();
    		if(username==null){
        		response.status = 404;
        		response.content = "Please Login Again";
    		}
    		log.debug(isAdmin(username));
    		log.debug(checkOwnership(ctx.deviceid,username));
    		if(isAdmin(username)||checkOwnership(ctx.deviceid,username)){
        		if(ctx.operation == "INSTALLAPP" || ctx.operation == "UNINSTALLAPP"){
            			var state = device.getCurrentDeviceState();
            			if(state == "A"){
                			device.sendToDevice(ctx);
                			response.status = 200;
                			response.content = "success";
           			 }
        		}else{
            			device.sendToDevice(ctx);
            			response.status = 200;
            			response.content = "success";
        		}
    		}else{
        		print("You are not Authorized to Perform Operations for Others Devices");
    		}

		});

        router.post('devices/operations/{operation}', function(ctx){
            device.sendToDevices(ctx);
            response.status = 200;
            response.content = "success";

        });

		router.get('devices/{deviceid}/features', function(ctx){
		    var result = device.getFeaturesFromDevice(ctx);
		    if(result!= null && result != undefined && result[0] != null && result[0] != undefined){
		        response.content = result;
		        response.status = 200;
		    }else{
		        response.status = 404;
		    }
		});

		router.post('devices/{deviceid}', function(ctx){
		    var result = device.updateiOSTokens(ctx);
		});

        router.get('devices/license', function(ctx){
            //var result = device.testingService();
            var result = device.getLicenseAgreement(ctx);
            if (result == "400") {
                response.status = 400;
            } else {
                print(result);
                response.status = 200;
            }
        });

        router.get('devices/sender_id', function(ctx){
            var result = device.getSenderId(ctx);
            print(result);
            response.status = 200;
        });

		router.get('pending/devices/{udid}/operations', function(ctx){
		    var result = device.getPendingOperationsFromDevice(ctx);
		    if(result!= null && result != undefined){
		        response.content = result;
		        response.status = 200;
		    }else{
		        response.status = 404;
		    }
		});
		
        router.post('devices/{deviceid}/WEBCLIP', function(ctx){
            if(common.checkAuth(ctx)){
                ctx.operation = "WEBCLIP";
                var result = device.sendToDevice(ctx);
            }
        });
		router.post('devices/{deviceid}/AppInstall', function(ctx){
            if(common.checkAuth(ctx)){
                ctx.operation = "INSTALLAPP";
                var result = device.sendToDevice(ctx);
            }
		});

		router.post('devices/{deviceid}/AppUNInstall', function(ctx){
            if(common.checkAuth(ctx)){
                ctx.operation = "UNINSTALLAPP";
                var result = device.sendToDevice(ctx);
            }
		});
    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();
