var Device = require('device.js').Device;

var IOSDevice = function(user, platform, options, DeviceModule) {
    this.user = user;
    this.platform = platform;
    this.options = options;
    this.DeviceModule = DeviceModule;

    //Persist to the database
    this.register = function() {
        device
    }

    /*
     var Device = require('device.js').Device;
     var AndroidDevice = function(user, platform, options, DeviceModule) {
     this.user = user;
     this.platform = platform;
     this.options = options;
     this.DeviceModule = DeviceModule;

     // Persist to the database
     this.register = function() {
     device = new this.DeviceModel();
     device.tenantid = this.user.tenantid;
     device.userid = this.user.userid;
     device.platformid = this.platform.id;
     device.uuid = this.options.uuid;
     device.osVersion = this.options.osVersion;
     device.ownership = this.options.ownership;
     device.macAddress = this.options.macAddress;
     device.status = this.DeviceModule.Device.Active;
     device.created_date = new Date();
     device.updated_date = new Date();
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
     */

	var generate = function(){
		
	}
    var registerPendingDevice = function() {
        //iOS specific callback used for second step of iOS registration
    }
}
IOSDevice.prototype = new Device();