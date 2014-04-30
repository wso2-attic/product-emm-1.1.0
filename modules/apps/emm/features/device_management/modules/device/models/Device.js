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
        device.status = this.DeviceModule.DEVICE_ACTIVE;
        device.created_date = "2012-03-02 08:07:23.234";
        device.updated_date = "2012-03-02 08:07:23.234";
        // device.save();
    }
    /*
		Performs operation 
        Accept feature code and options
	*/
    this.operate = function(operation, options) {
        // get the valid operation object
        var operation = DeviceModule.getOperations(this, operation);
        // check if operation is valid for device
        if(operation.valid(this)){
            try{
                var message = new Message(this, operation, options);
                message.queue();
                this.notify(operation);
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
    this.notify = function(operation){
        var notification = new Notification(this, operation);
        DeviceModule.notify(notification);
    }
    /* 
		Returns info about object in an options object
	*/
    this.info = function() {}

    this.enforce = function(){

    }
    //pass the policy object
    this.updatePolicy = function(policy){
        //return a json array
        var filteredPolicy = policy.getPayload(this);
        //write to the device_policy table
        // here we figure out if the policy can be applied or not 
        // we also write the filteredPolicy if decided
        var operation = policy_module.getPolicyOperation();
        for (var i = filteredPolicy.length - 1; i >= 0; i--) {
            var rule = filteredPolicy[i];
            var message = new Message(this, operation, rule);
            message.queue();
        };
        // create end of message
        var eod_message = new EODMessage(this);
        eod_message.queue();
        this.notify(operation);
    }
    // returns the payload that needs to be sent to the device
    this.getPendingPayload = function(){
        // platform dependant method
    }
    this.consumeResult = function(){};
};