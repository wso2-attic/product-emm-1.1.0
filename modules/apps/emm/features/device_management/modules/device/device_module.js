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
 *  Description : - Device object related functions 
 */
var entity = require('entity');
var Device = require('models/device.js').Device;
var Operation = require('Operation.js').Operation;
var AndroidDevice = require('models/AndroidDevice.js').AndroidDevice;
var IOSDevice = require('models/IOSDevice.js').IOSDevice;

// entity models
var DeviceModel = entity.model('Device');
var OperationModel = entity.model('Operation');

var DeviceModule = {};
DeviceModule.BYOD = "1";
DeviceModule.COPE = "2";
DeviceModule.ANDROID = "1";
DeviceModule.IOSPHONE = "2";
DeviceModule.IOSTABLET = "3";
// DeviceModule.WINDOWS = "3";
// DeviceModule.RPIE = "4";

DeviceModule.DEVICE_ACTIVE = "1";
DeviceModule.DEVICE_REGISTRATION_PENDING = "2";


DeviceModule.EXCEPTIONS = {
    "DeviceNotFound": "Device Not Found",
    "InvalidOperationCode": "Invalid Operation Code"
};


/*
    Plural Device object 
    Takes in a devices array
*/
var Devices = function(devices){
    this.updatePolicy = function(policy){
        devices.forEach(function(device){
            device.updatePolicy(policy);
        });
    };
    this.operate = function(operation, options){
        devices.forEach(function(device){
            device.operate(operation, options);
        });
    };
    this.notify = function(operation){
        devices.forEach(function(device){
            device.notify(operation);
        });
    };
    this.enforce = function(){
        devices.forEach(function(device){
            device.enforce();
        });
    };
}

/*
    Usage:- Check if deviceId is used 
*/
DeviceModule.isDeviceRegistered = function(deviceid){
    try{
        var devices =  DeviceModel.findOne({id: deviceid});
        return true;
    }catch(e){
        return false;
    }
}

/*
	Returns the operation object if available
	Exceptions:-
		InvalidOperation
*/
DeviceModule.operations = function(operation) {
    var operations = OperationModel.findOne({"id":operation});   
    if(operations.length==0){
        throw DeviceModule.EXCEPTIONS.InvalidOperationCode;
    }
    return new Operation(operations[0]);
}

DeviceModule.notify = function(notification) {
	// wire the wakeup manager to perform actions
}

/*
	Return a set of devices matching the query
	Exceptions:-
*/
DeviceModule.getDevices = function(query) {

};
/*
	Return a device matching the id
 	Exceptions:-
 		DeviceNotFound
*/
DeviceModule.getDevice = function(id) {
    var devices =  DeviceModel.findOne({id: deviceid});   
    if(devices.length==0){
        throw DeviceModule.EXCEPTIONS.DeviceNotFound;
    }
    return devices[0];    
};
/*
    Usage:- Register a device to EMM
*/
DeviceModule.registerDevice = function(userid, tenant_domain, options) {
	// var user = user_module.getUser(userid, tenantid);
	var user = {user_id:"dulitha", tenant_domain:"wso2.com", tenant_id: "-1234"};
    var device;
    // make a platform object
    switch (options.platform) {
        case DeviceModule.ANDROID:
        	device = new AndroidDevice(user, options, DeviceModule);
            break;
        case DeviceModule.IOS:
        	device = new IOSDevice(user, options, DeviceModule);
            break;
    }
    device.register();
}