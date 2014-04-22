describe('sql-crud operation', function () {
    var entity = require('entity');
    var sql_crud = require('/modules/sql-crud.js').sqlCRUD;
	try{
        var db = application.get("db");
        if(!db){
            db = new Database("JAGH2")
            application.put("db", db);
        }
    }catch(e){
        log.error(e);
    }
	var Device = new entity.Schema("Device", {
      id : Number,
      name : String,
      description : String,
      registrationDate : Date
    }, {
        tablename : "devices"
    });
    Device.plugin(sql_crud, {db: db});

    beforeEach(function () {
    	db.query("CREATE TABLE `devices` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(45) DEFAULT NULL, `description` varchar(45) DEFAULT NULL, `registrationDate` timestamp DEFAULT NULL)");
        this.DeviceModel = entity.model('Device');
    });
    afterEach(function(){
        db.query("DROP TABLE devices;");
    });
    it('Saving of Object', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
    });
    it('Query specific objects', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
        var results = this.DeviceModel.find({"name":"Chan"});
        expect(results.length).toBe(1);
    });
     it('Query all objects', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
        device_1.save();
        device_1.save();
        var results = this.DeviceModel.findAll();
        expect(results.length).toBe(3);
    });
     it('Query specific objects', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
        var results = this.DeviceModel.findOne({"id":"30"});
        expect(results.length).toBe(1);
    });
});