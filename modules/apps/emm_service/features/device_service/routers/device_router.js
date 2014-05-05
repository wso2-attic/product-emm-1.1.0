var api_router = function(router){
	var entity = require('entity');
	var log = new Log('device-router');

    // var moment = require("modules/moment.js").moment();
	var sql_crud = require('/modules/sql-crud.js').sqlCRUD;
	var Device = new entity.Schema("Device", {
	  id : Number,
	  name : String,
	  description : String,
	  registrationDate : Date
	}, {
		tablename : "devices"
	});
	var db = application.get("db");
	if(!db){
		db = new Database("JAGH2")
		application.put("db", db);
	}
	Device.plugin(sql_crud, {db: db});

	router.get('/api/device/register/:id', function(req, res){
		var id = req.params.id;
		var log = new Log();
		log.info(id);
		// call in device_module to get a device object
	});
	router.post('/api/device/register/', function(req, res){
		// Create new Device entity object
		var Device=entity.model('Device');
		var device_1 = new Device();
		device_1.id = 12;
		device_1.name = "Chan";
		device_1.description = "Damn right!";
		device_1.registrationDate = "2012-03-02 08:07:23.234";
		//Persist to DB
		device_1.save();

		// Read multiple devices
		var results = Device.find({"name":"Chan"});
		var results = Device.findAll();
		try{
			// Get one device. Will throw exception if more than one found
			var device = Device.findOne({"id":"12"});
		}catch(e){
			log.error(e);
		}
	});
}