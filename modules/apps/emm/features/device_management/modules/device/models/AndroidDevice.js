var Device = require('Device.js').Device;
var utilityModule = require('/features/utility_module.js');

var AndroidDevice = function(user, platform, options, DeviceModule) {
	this.user = user;
    this.platform = platform;
	this.options = options;
	this.DeviceModule = DeviceModule;

    // Persist to the database
    this.registerNewDevice = function() {
        device = new DeviceEntity();
        device.tenant_id = this.user.tenant_id;
        device.user_id = this.user.user_id;
        device.platform_id = this.platform.id;
        device.udid = this.options.udid;
        device.os_version = this.options.osVersion;
        device.ownership = this.options.ownership;
        device.mac_address = this.options.macAddress;
        device.token = this.options.token;
        device.extra_info = this.options.extraInfo;
        device.status = CONSTANTS.DEVICE.ACTIVE;
        device.created_date = utilityModule.getCurrentDateTime();
        device.modified_date = utilityModule.getCurrentDateTime();
        log.info("Saving");
        try {
            device.save();
        } catch (e) {
            log.error(e);
            return null;
        }
        var registerData = {};
        registerData.contentType = CONSTANTS.CONTENTTYPE.JSON;
        registerData.data = device;
        return registerData;

        // AndroidDevice.prototype.register.call(this);
    }

    this.unRegister = function() {
        try {
            device = this.DeviceModule.findOne({UDID: udid, STATUS: DeviceModule.Device.Active});
        } catch (e) {
            throw lang.ERROR_UNREGISTER;
        }
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