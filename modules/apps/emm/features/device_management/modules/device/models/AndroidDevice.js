var Device = require('device.js').Device;

var AndroidDevice = function(user, options, DeviceModule) {
	this.platform = DeviceModule.ANDROID;
	this.user = user;
	this.options = options;
	this.DeviceModule = DeviceModule;
    this.register = function() {
        AndroidDevice.prototype.register.call(this);
    }
}
AndroidDevice.prototype = new Device();