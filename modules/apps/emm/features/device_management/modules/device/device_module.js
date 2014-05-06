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
var Device = require('models/Device.js').Device;
var Operation = require('Operation.js').Operation;
var AndroidDevice = require('models/AndroidDevice.js').AndroidDevice;
var IOSDevice = require('models/IOSDevice.js').IOSDevice;

// entity models
var DeviceModel = entity.model('Device');
var OperationModel = entity.model('Operation');
var PlatformModel = entity.model('Platform');

var DeviceModule = {};


// DeviceModule.WINDOWS = "3";
// DeviceModule.RPIE = "4";

//DeviceModule.DEVICE_ACTIVE = "1";
//DeviceModule.DEVICE_REGISTRATION_PENDING = "2";

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
        throw lang.INVALID_OPERATIONCODE;
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
    Get device object by UDID
*/
DeviceModule.getDeviceObjectByUDID = function(udid) {
    var devicesModel = DeviceModel.findOne({UDID: udid});
    if (devices.length == 0) {
        throw lang.DEVICE_NOT_FOUND;
    }
    var deviceModel = devicesModel[0];
    var platformsModel = PlatformModel.findOne({id: deviceModel.platform_id});

}

DeviceModule.getDeviceObjectByDevice = function() {

}


/*
	Return a device matching the id
 	Exceptions:-
 		DeviceNotFound
*/
DeviceModule.getDevice = function(id) {
    var devices =  DeviceModel.findOne({ID: deviceid});
    if(devices.length==0){
        throw lang.DEVICE_NOT_FOUND;
    }
    return devices[0];    
};
/*
   Register a device to EMM
*/
DeviceModule.registerDevice = function(user, options) {
    var deviceObject;
    var platformsModel = PlatformModel.findOne({"OS": options.platform, "TYPE": options.platformType});
    if (platformsModel.length == 0) {
        throw lang.INVALID_PLATFORM;
    }
    var platformModel = platformsModel[0];
    var registerData, deviceObject;
    try {
        switch (options.platform) {
            case CONSTANTS.ANDROID:
                deviceObject = new AndroidDevice(user, platformModel, options, DeviceModule);
                registerData = deviceObject.registerNewDevice();
                break;
            case CONSTANTS.IOS:
                deviceObject = new IOSDevice(user, platformModel, options, DeviceModule);
                break;
        }

    } catch (e) {
        log.error(e);
        return null;
    }

    return registerData;

}

/*
    Generate the profile for iOS
 */
DeviceModule.handleProfile = function(inputStream) {
    try {

        log.debug("Handle Profile Request!");
        var signedData = IOSDevice.handleProfileRequest();
        return signedData;
    }catch (e) {
        log.error(e);
        return null;
    }
}

/*
    Update iOS tokens
 */
DeviceModule.extractDeviceTokens = function(inputStream) {
    try {
        var writer = new Packages.java.io.StringWriter();
        //Packages.org.apache.commons.io.IOUtils.copy(inputStream, writer, "UTF-8");
        var contentString = writer.toString();

        var plistExtractor = new Packages.org.wso2.mobile.ios.mdm.plist.PlistExtractor();
        var checkinMessageType = plistExtractor.extractTokens(contentString);
        log.debug("CheckinMessageType >>>>>> " + checkinMessageType.getMessageType());

        if (checkinMessageType.getMessageType() == "CheckOut") {
            var udid = checkinMessageType.getUdid();
//            var device = new Device();
//            device.platform = CONSTANTS.IOS;
//            device.UDID = udid;
//            device.unRegister();
//            IOSDevice.unRegister(udid);
              var deviceObject = DeviceModule.getDeviceObjectByUDID(udid);

        } else if(checkinMessageType.getMessageType() == "TokenUpdate") {
            var deviceToken = {};
            deviceToken.token = checkinMessageType.getToken();
            deviceToken.unlockToken = checkinMessageType.getUnlockToken();
            deviceToken.magicToken = checkinMessageType.getPushMagic();
            deviceToken.udid = checkinMessageType.getUdid();

            IOSDevice.UpdateTokens(deviceToken);
        }
        return checkinMessageType.getMessageType();

    }catch (e) {
        log.error(e);
        return null;
    }


}

/*
    Perform the operation for the device
 */
DeviceModule.deviceOperation = function (deviceid, operationCode, options) {

    try{
        var device = DeviceModule.getDevice(deviceid);
        device.operate(operationCode, options);
    }catch(e){
        log.error(e);
    }

}