var Device = function() {
    var entity = require('entity');
    var sql_crud = require('/modules/sql-crud.js').sqlCRUD;
    var DeviceSchema = new entity.Schema("Device", {
        id: Number,
        tenant_id: Number,
        user_id: String,
        platform_id: String,
        udid: String,
        os_version: String,
        ownership: Number,
        mac_address: String,
        status: String,
        created_date: Date,
        updated_date: Date
    }, {
        tablename: "devices"
    });
    try {
        var db = application.get("db");
        if (!db) {
            db = new Database("JAGH2")
            application.put("db", db);
        }
    } catch (e) {
        log.error(e);
    }
    // Need to know the database
    DeviceSchema.plugin(sql_crud, {
        db: db
    });
    var DeviceModel = entity.model('Device');
    this.register = function() {
        // Persist to the database
        var device = new DeviceModel();
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
		Performs operations based on 
	*/
    this.operate = function(operation) {
        var operation = device_module.features(operation);

    }
    /* 
		Returns info about object in an options object
	*/
    this.info = function() {}
};

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