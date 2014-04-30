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
var api_router = function(router){
	var log = new Log('device-router');
	var db = application.get("db");

	var DeviceModule = require('/features/device_management/modules/device/DeviceModule.js').DeviceModule;
    var PolicyModule = require('/features/device_management/modules/policy/PolicyModule.js').PolicyModule;
	/*
		Usage:- Check if the provided deviceId is registered
		Sample:-
			Input:- 
				URL Param - id
			Output:-
				true, false
	*/
	router.get('/api/device/register/:id', function(req, res){
		var id = req.params.id;
		// Output 
		var status = DeviceModule.isDeviceRegistered(id);
		print(status);
	});
	/*
		Usage:- Register a Device with provided details to EMM
		Sample:-
			Input:- 
				Body - {
					"platform" : "ANDROID",
					"device_type" : "PHONE",
					"ownership": "BYOD",
					"os_version": "4.2",
					"userid": "admin",
					"password" : "****"
					"tenant_domain": "wso2.com"
				}
				(or)
				Body - {
				    "userid" : "admin",
				    "password" : "****",
				    "ownership" : "BYOD",
				    "tenant_domain" : "wso2.com"
				}
			Output:-
				true, false
	*/
	router.post('/api/device/register/', function(req, res){

        var userid = req.body.userid;
        var tenant_domain = req.body.tenant_domain;
        var password = req.body.password;

        //authentiate user



        //Check if "platform" parameter is passed and if so check if it Android
        //else find out using useragent.
        request.getHeader("User-Agent");


		var platform = req.body.platform;
		var ownership = req.body.ownership;
		var os_version = req.body.os_version;
		var udid = req.body.udid;
		var mac_address = req.body.mac_address;

		try {
            var device = DeviceModule.registerDevice(userid, tenant_domain, {
                platform: platform,
                ownership: ownership,
                os_version: os_version,
                udid: udid,
                mac_address: mac_address
            });
        } catch (e) {
            log.error(e);
            print("Device Registration failed");
            response.sendError(500);
        }
	});

	/*
		Usage:- Perform operation on a device
		Sample:-
			Input:- 
				URL Param - id, operationcode
				Body - 
					{
						options: {"wifi-id": "WSO2"}
					}
			Output:-
				200, 500
	*/
	router.post('api/device/{id}/operate/{operationcode}', function(req, res){
		try{
			var id = req.params.id;
			var operation_code = req.params.operationcode;
			var options = req.param.options;
			var device = DeviceModule.getDevice(id);
			device.operate(operation_code, options);
		}catch(e){
			log.error(e);
            print("Device Operation failed");
            response.sendError(500);
		}
	});
}