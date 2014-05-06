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
var DeviceEntity = entity.model('Device');
var OperationEntity = entity.model('Operation');
var PlatformEntity = entity.model('Platform');

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
        var device =  DeviceEntity.findOne({id: deviceid});
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
    try {
        var operation = OperationEntity.findOne({"id":operation});
        return new Operation(operation);
    } catch (e) {
        return null;
    }

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
    try {
        var device = DeviceEntity.findOne({UDID: udid});
        return DeviceModule.getDeviceObjectByDevice(device);
    } catch (e) {
        log.error(e);
        throw lang.EXECPTION;
    }
}

DeviceModule.getDeviceObjectByDevice = function(device) {
    try {
        var deviceObject;
        var platform = PlatformEntity.findOne({id: device.platform_id});
        if(platform.os == CONSTANTS.ANDROID) {
            deviceObject = new AndroidDevice();
            deviceObject.deviceModel = device;
            //deviceObject.
        } else if(platform.os == CONSTANTS.IOS) {

        } else {
            throw lang.INVALID_PLATFORM
        }
    } catch (e){
        throw lang.EXCEPTION;
    }

    return deviceObject;

}


/*
	Return a device matching the id
 	Exceptions:-
 		DeviceNotFound
*/
DeviceModule.getDevice = function(id) {
    var device =  DeviceEntity.findOne({ID: deviceid});
    return device;
};
/*
   Register a device to EMM
*/
DeviceModule.registerDevice = function(user, options) {
    var device;
    var platform = PlatformEntity.findOne({"OS": options.platform, "TYPE": options.platformType});
    var registerData, deviceObject;
    try {
        if (options.platform == CONSTANTS.ANDROID) {
            deviceObject = new AndroidDevice(user, platform, options, DeviceModule);
        } else if(options.platform == CONSTANTS.IOS) {
            deviceObject = new IOSDevice(user, platform, options, DeviceModule);
        } else {
            throw lang.EXCEPTION;
        }
        registerData = deviceObject.registerNewDevice();

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
              var device = IOSDevice.unRegister(udid);

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
    Unregister device
*/
DeviceModule.unRegister = function(options) {
    try {
        var status;
        if(options.udid != null) {
            //iOS - Call device unregister - WSO2 Nira

        } else if (options.deviceId != null) {
            status = AndroidDevice.unRegister(deviceId);
        } else {
            throw lang.EXCEPTION;
        }
        return status;
    } catch (e) {
        throw lang.EXCEPTION;
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