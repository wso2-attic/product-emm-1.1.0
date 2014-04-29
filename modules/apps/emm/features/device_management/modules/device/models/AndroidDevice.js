var Device = require('device.js').Device;

var AndroidDevice = function(user, options, DeviceModule) {
	this.platform = DeviceModule.ANDROID;
	this.user = user;
	this.options = options;
	this.DeviceModule = DeviceModule;
    this.register = function() {
        AndroidDevice.prototype.register.call(this);
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