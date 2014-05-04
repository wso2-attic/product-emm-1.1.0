var Device = require('device.js').Device;
var AndroidDevice = function(user, platform, options, DeviceModule) {
	this.user = user;
    this.platform = platform;
	this.options = options;
	this.DeviceModule = DeviceModule;

    // Persist to the database
    this.registerNewDevice = function() {
        device = new this.DeviceModel();
        device.tenant_id = this.user.tenantid;
        device.user_id = this.user.userid;
        device.platform_id = this.platform.id;
        device.uuid = this.options.uuid;
        device.os_version = this.options.osVersion;
        device.ownership = this.options.ownership;
        device.mac_address = this.options.macAddress;
        device.token = this.options.token;
        device.extraInfo = this.options.extraInfo;
        device.status = this.DeviceModule.Device.Active;
        device.created_date = new Date();
        device.updated_date = new Date();
        try {
            device.save();
        } catch (e) {
            log.error(e);
            return null;
        }
        var registerData = {};
        registerData.contentType = DeviceModule.CONTENTTYPE.JSON;
        registerData.data = device;
        return registerData;

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