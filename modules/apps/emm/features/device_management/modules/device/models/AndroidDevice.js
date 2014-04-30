var Device = require('device.js').Device;
var AndroidDevice = function(user, options, DeviceModule) {
	this.platform = DeviceModule.ANDROID;
	this.user = user;
	this.options = options;
	this.DeviceModule = DeviceModule;

     // Persist to the database
    this.register = function() {       
        device = new this.DeviceModel();
        device.tenant_id = this.user.tenant_id;
        device.user_id = this.user.user_id;
        device.platform_id = this.platform;
        device.uuid = this.options.uuid;
        device.os_version = this.options.os_version;
        device.ownership = this.options.ownership;
        device.mac_address = this.options.mac_address;
        device.status = this.DeviceModule.DEVICE_ACTIVE;
        device.created_date = "2012-03-02 08:07:23.234";
        device.updated_date = "2012-03-02 08:07:23.234";
        device.save();
        // AndroidDevice.prototype.register.call(this);
    }
    this.recordNotification = function(){
    	//write to the notification table about the last contact period to the device
    }
    this.lastNotification = function(){

    }
    this.getPendingPayload = function(notifier){
    	var notification = this.lastNotification();
    	var messages = this.getMessages("");// get status, id, eom, operation
    	var complexPayload = this.buildPayload(messages);
    	return complexPayload;
    }
    this.consumeResult = function(result, notifier){
    	for (var i = result.length - 1; i >= 0; i--) {
    		var resultPacket = result[i];
    		var message =this.getMessage(resultPacket.messageid);
    		message.updateResult(resultPacket);
    	};
    	

    }
}
AndroidDevice.prototype = new Device();