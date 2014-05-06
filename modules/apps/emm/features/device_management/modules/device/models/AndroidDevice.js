var Device = require('Device.js').Device;
var utilityModule = require('/features/utility_module.js');

var AndroidDevice = function(user, platform, options, DeviceModule) {
	this.user = user;
    this.platform = platform;
	this.options = options;
	this.DeviceModule = DeviceModule;

    // Persist to the database
    this.registerNewDevice = function() {
        deviceModel = new DeviceModel();
        deviceModel.tenant_id = this.user.tenant_id;
        deviceModel.user_id = this.user.user_id;
        deviceModel.platform_id = this.platform.id;
        deviceModel.udid = this.options.udid;
        deviceModel.os_version = this.options.osVersion;
        deviceModel.ownership = this.options.ownership;
        deviceModel.mac_address = this.options.macAddress;
        deviceModel.token = this.options.token;
        deviceModel.extra_info = this.options.extraInfo;
        deviceModel.status = CONSTANTS.DEVICE.ACTIVE;
        deviceModel.created_date = utilityModule.getCurrentDateTime();
        deviceModel.modified_date = utilityModule.getCurrentDateTime();
        log.info("Saving");
        try {
            deviceModel.save();
        } catch (e) {
            log.error(e);
            return null;
        }
        var registerData = {};
        registerData.contentType = CONSTANTS.CONTENTTYPE.JSON;
        registerData.data = deviceModel;
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