var api_router = function(router){
	var entity = require('entity');

    // var moment = require("modules/moment.js").moment();
	var sql_crud = require('/modules/sql-crud.js').sqlCRUD;
	var Device = new entity.Schema("Device", {
	  id:Number,
	  name:String,
	  description:String,
	  registrationDate:Date
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
		var log = new Log();
		log.info("Dammit");
		var Device=entity.model('Device');
		var device_1 = new Device();
		device_1.id = 11;
		device_1.name = "Chan";
		device_1.description = "Damn right!";
		// try{
		// 	// var bi = moment(new Date()).format('YYYY-MM-DD hh:mm:ss.SS');
		// 	log.info(bi);
		// }catch(e){
		// 	log.info(e);
		// }
		device_1.registrationDate = "2012-03-02 08:07:23.234";
		device_1.save();
		var results = Device.find({"name":"Chan"});
		var results = Device.findOne({"id":"11"});
		log.info(results);
	});
}