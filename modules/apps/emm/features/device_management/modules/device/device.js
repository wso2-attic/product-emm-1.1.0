var entity = require('entity');
var Device = function() {
    var DeviceModel = entity.model('Device');
    var device;
    this.register = function() {
        // Persist to the database
        device = new this.DeviceModel();
        device.id = "kjlksdf"; // generate udid
        device.tenant_id = this.user.tenant_id;
        device.user_id = this.user.user_id;
        device.platform_id = this.platform;
        device.uuid = this.options.uuid;
        device.os_version = this.options.os_version;
        device.ownership = this.options.ownership;
        device.mac_address = this.options.mac_address;
        device.status = this.device_module.DEVICE_ACTIVE;
        device.created_date = "2012-03-02 08:07:23.234";
        device.updated_date = "2012-03-02 08:07:23.234";
        // device.save();
    }
    /*
		Performs operation 
        Accept feature code and options
	*/
    this.operate = function(feature, options) {
        // get the valid operation object
        var operation = device_module.features(feature);
        // check if operation is valid for device
        if(operation.valid(this)){
            var notification = new Notification(this, operation);
            try{
                device_module.wakeup(notification);
                var message = new Message(this, operation, options);
            }catch(e){
                // Handle if wakeup manager has issues
                // for example ports are not open
            }

        }else{
            //handle if not valid
        }
        // create the notification object
        // create the message object
    }
    /* 
		Returns info about object in an options object
	*/
    this.info = function() {}
};
// operation object will wrap functionlity for features for platform
var Operation = function(){
    // Check with platform features table to see if device is eligible for operation
    this.valid = function(device){

    }
}
var Message = function(device, operation, options){

}
// notification is the object that gets pased to wakeup manager
var Notification = function(device, operation, options){
    this.device = device;
    this.operation = operation;
    this.options = options;
}

/*
	Device Module will satisfy the wakeup manager dependency  
*/
var AndroidDevice = function(user, options, device_module) {
	this.platform = device_module.ANDROID;
	this.user = user;
	this.options = options;
	this.device_module = device_module;
    this.register = function() {
        AndroidDevice.prototype.register.call(this);
    }
}
AndroidDevice.prototype = new Device();
var IOSDevice = function(device_module) {
	var generate = function(){
		
	}
    var registerPendingDevice = function() {
        //iOS specific callback used for second step of iOS registration
    }
}
IOSDevice.prototype = new Device();