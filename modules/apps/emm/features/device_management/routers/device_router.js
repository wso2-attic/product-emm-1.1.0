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
	router.post('/api/device/register/', function(req, res){
		// Create new Device entity object
		var Device=entity.model('Device');
		var device_1 = new Device();
		device_1.id = 12;
		device_1.name = "Chan";
		device_1.description = "Damn right!";
		device_1.registrationDate = "2012-03-02 08:07:23.234";
		//Persist to DB
		device_1.save();

		// Read multiple devices
		var results = Device.find({"name":"Chan"});
		var results = Device.findAll();
		try{
			// Get one device. Will throw exception if more than one found
			var device = Device.findOne({"id":"12"});
		}catch(e){
			log.error(e);
		}
	});
}