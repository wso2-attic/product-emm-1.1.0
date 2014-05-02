/**
 *  Copyright (c) 2011, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * 	Description : - HTTP API Layer for Device communication
 */

//var i18n = require("i18n");
//i18n.localeResourcesBasePath('/config/lang/');

var utilityModule = require('/features/utility_module.js');

var api_router = function(router){
	var log = new Log('device-router');
	var db = application.get("db");

	var DeviceModule = require('/features/device_management/modules/device/DeviceModule.js').DeviceModule;
    var PolicyModule = require('/features/device_management/modules/policy/PolicyModule.js').PolicyModule;

	/*
		Check if the provided deviceId is registered
		Sample:-
			Input:-
				Body - id
			Output:- true, false
	*/
	router.get('/api/device/register', function(req, res){
		var id = req.body.id;
		// Output 
		var status = DeviceModule.isDeviceRegistered(id);
        if(status) {
            response.status = 200;
            response.content = status;
        } else {
            response.status = 401;
            response.content = status;
        }
	});

	/*
		Register a Device with provided details to EMM
		Sample:-
			Input:-
				Body - {"userid" : "admin", "password" : "*****", tenantDomain : "wso2.com", "ownership" : "BYOD",
				     "platform" : "ANDROID", "device_type" : "PHONE", "os_version": "4.2" }
				(or)
				Body - { "userid" : "admin", "password" : "*****", "ownership" : "BYOD", "tenantDomain" : "wso2.com" }
			Output:- COPE - true, false
				     BYOD - send BYOD license
	*/
    router.post('/api/device/login', function (req, res) {

        var userid = req.body.userid;
        var tenantDomain = req.body.tenantDomain;
        var password = req.body.password;
        var ownership = req.body.ownership;

        //authentiate user - usermanager - WSO2
        //Check if tenant is activate for this device
        var authentiate = null;

        if (authentiate) {
            //Get the tenant id from the tenant Domain = WSO2
            var user = userModule.getUser(userid, tenantDomain);
            var registerObject = {};
            registerObject = utilityModule.getPlatform(req);
            if(ownership == "COPE") {
                //register device - WSO2
                try {
                    var device = DeviceModule.registerDevice(user, {
                        platform : registerObject.platform,
                        platformType : registerObject.platformType,
                        ownership : ownership,
                        osVersion : registerObject.osVersion,
                        udid : registerObject.udid,
                        macAddress : registerObject.macAddress
                    });
                } catch (e) {
                    log.error(e);
                    print("Device Registration failed");
                    response.sendError(500);
                }

            } else if(ownership == "BYOD") {
                //Get BYOD License - WSO2
                var byodLicense = null;

                response.content = byodLicense;
                response.status = 200;

            } else {
                response.content = lang.INVALID_OWNERSHIP;
                response.status = 401;
            }
        } else {
            response.content = lang.INVALID_USER;
            response.status = 401;
        }
    });

    /*
        Usage: Register a BYOD device
        Sample:
            Input:
                Body - {"ownership" : "BYOD", "platform" : "ANDROID", "device_type" : "PHONE", "os_version": "4.2"
                    }
                (or)
                Body - { "userid" : "ownership" : "BYOD" }
                Output:- COPE - true, false
                         BYOD - send BYOD license

    */
	router.post('/api/device/register/', function(req, res){

        //Get userid, tenant from token - Android (or) session - iOS - WSO2
        var user = req.user;
        var registerObject = {};
        registerObject = utilityModule.getPlatform(req);

        try {
            var device = DeviceModule.registerDevice(user, {
                platform : platform,
                platformType : platformType,
                ownership : ownership,
                osVersion : osVersion,
                udid : udid,
                macAddress : macAddress
            });
        } catch (e) {
            log.error(e);
            print("Device Registration failed");
            response.sendError(500);
        }
	});

	/*
		Perform operation on a device
		Sample:-
			Input:- 
				Body - { "deviceid": 1, "operationCode": 507A, "options": {"wifi-id": "WSO2"} }
			Output:- 200, 500
	*/
	router.post('api/device/operate', function(req, res){
		try{
            var deviceid = req.body.deviceid;
            var operationCode = req.body.operationCode;
			var options = req.param.options;
			DeviceModule.getDevice(deviceid);
		}catch(e){
			log.error(e);
            response.content = lang.DEVICE_OPERATION_FAILED;
            response.sendError(500);
		}
	});
}