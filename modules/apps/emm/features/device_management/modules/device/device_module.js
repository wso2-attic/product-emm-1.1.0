
var DeviceClass = require('device.js');

var device_module = {};
device_module.BYOD = "1";
device_module.COPE = "2";
device_module.ANDROID = "1";
device_module.IOS = "2";
device_module.WINDOWS = "3";
device_module.RPIE = "4";
device_module.DEVICE_ACTIVE = "1";
device_module.DEVICE_REGISTRATION_PENDING = "2";


/*
	Returns the operation object if valid
	Exceptions:-
		InvalidOperation
*/
device_module.features = function(operation) {}

device_module.notify = function(notification) {
	// wire the wakeup manager to perform actions
}

/*
	Return a set of devices matching the query
	Exceptions:-
*/
device_module.getDevices = function(query) {

};
/*
	Return a device matching the id
 	Exceptions:-
 		DeviceNotFound
*/
device_module.getDevice = function(id) {

};
/* 
	Register the device to EMM
	create a device object based on the platform type

*/
device_module.registerDevice = function(userid, tenantid, options) {
	// var user = user_module.getUser(userid, tenantid);
	var user = {user_id:"dulithaz@gmail.com", tenant_id:"-1234"};
    var device;
    // make a platform object
    switch (options.platform) {
        case device_module.ANDROID:
        	device = new DeviceClass.AndroidDevice(user, options, device_module);
            break;
        case device_module.IOS:
        	device = new  DeviceClass.IOSDevice(user, options, device_module);
            break;
        case device_module.WINDOWS:
        	device = new  DeviceClass.WindowsDevice(user, options, device_module);
            break;
        case device_module.RPIE:
        	device = new  DeviceClass.RPieDevice(user, options, device_module);
            break;
    }
    /* 
		Call registratio 
    */
    device.register();
}