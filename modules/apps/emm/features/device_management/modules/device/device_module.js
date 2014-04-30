var entity = require('entity');
var Device = require('models/device.js').Device;
var AndroidDevice = require('models/AndroidDevice.js').AndroidDevice;
var IOSDevice = require('models/IOSDevice.js').IOSDevice;

var DeviceModule = {};
DeviceModule.BYOD = "1";
DeviceModule.COPE = "2";
DeviceModule.ANDROID = "1";
DeviceModule.IOS = "2";
DeviceModule.WINDOWS = "3";
DeviceModule.RPIE = "4";

DeviceModule.DEVICE_ACTIVE = "1";
DeviceModule.DEVICE_REGISTRATION_PENDING = "2";
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

}

/*
	Returns the operation object if valid
	Exceptions:-
		InvalidOperation
*/
DeviceModule.operations = function(operation) {}

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

};
/* 
	Register the device to EMM
	create a device object based on the platform type

*/
DeviceModule.registerDevice = function(userid, tenantid, options) {
	// var user = user_module.getUser(userid, tenantid);
	var user = {user_id:"dulithaz@gmail.com", tenant_id:"-1234"};
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
    /* 
		Call registratio 
    */
    device.register();
}