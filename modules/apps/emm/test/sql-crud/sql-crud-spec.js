describe('sql-crud operation', function () {
    var entity = require('entity');
    var schema = require('/modules/schema.js');
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
//	var Device = new entity.Schema("Device", {
//      id : Number,
//      name : String,
//      description : String,
//      registrationDate : Date,
//      detail: String
//    }, {
//        tablename : "devices"
//    });
//
//    var PlatformSchema = new entity.Schema("Platform", {
//        id: Number,
//        os: String,
//        type: String,
//        description: String
//    }, {
//        tablename: "platforms"
//    });
//    PlatformSchema.plugin(sql_crud, {
//        db: db
//    });
//
//    Device.plugin(sql_crud, {db: db});

    beforeEach(function () {
    	//db.query("CREATE TABLE `devices` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(45) DEFAULT NULL, `description` varchar(45) DEFAULT NULL, `registrationDate` timestamp DEFAULT NULL, `detail` clob DEFAULT NULL)");
        //this.DeviceModel = entity.model('Device');
    });
    afterEach(function(){
        //db.query("DROP TABLE devices;");
    });
    it('Saving of Object', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
        var PlatformModel = entity.model('Platform');
        PlatformModel.findOne({"id":"1"});
    });
    it('Updating of Object', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();

        device_1.name = "Brain";
        device_1.update(["id"]);
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
    it('Complex query with advance query method', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.save();
        var results = this.DeviceModel.query("SELECT * FROM DEVICES WHERE name like '%"+device_1.name+"'", function(complexObject, model){
            model.id = complexObject.id;
            model.name = complexObject.name;
            model.description = complexObject.description;
            model.registrationDate = complexObject.registrationDate;
        });
        expect(results.length).toBe(1);
    });
    it('Test case for Text field ', function () {
        var device_1 = new this.DeviceModel();
        device_1.id = 30;
        device_1.name = "Chan";
        device_1.description = "Damn right!";
        device_1.registrationDate = "2012-03-02 08:07:23.234";
        device_1.detail = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacus nisi, feugiat nec aliquam sed, aliquet ut ligula. Sed vitae pulvinar neque. Duis eu lorem id dolor ullamcorper suscipit at semper ipsum. Vivamus ut arcu magna. Mauris pulvinar metus arcu, id tincidunt purus luctus sit amet. Duis vitae augue velit. Aenean a augue blandit, faucibus felis vel, cursus nisi. Integer sit amet nulla at mi aliquet faucibus vitae ac ligula. Nulla scelerisque velit quis arcu pharetra vehicula.Pellentesque consequat lorem justo, sagittis elementum erat convallis quis. Vivamus a lobortis augue. Suspendisse rhoncus eleifend leo, ac varius urna lacinia non. Praesent libero elit, blandit eu molestie id, hendrerit eget velit. Nulla egestas augue massa, eu commodo nisl suscipit quis. Ut vitae odio dui. Phasellus sollicitudin, arcu quis pellentesque porttitor, eros nisl facilisis ligula, sed viverra erat metus nec nulla.Donec euismod odio mattis iaculis fermentum. Mauris blandit metus vitae urna imperdiet, quis aliquet ante vehicula. Praesent eleifend cursus placerat. Fusce mollis congue dapibus. Praesent consequat risus id libero fermentum egestas quis a lectus. Vivamus et libero nec nunc condimentum placerat sed at sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean faucibus dui eu venenatis dictum. Proin ac magna id ante cursus bibendum. Ut viverra tortor tincidunt, malesuada justo commodo, hendrerit dui. Nulla quis nulla quis elit convallis tincidunt. Suspendisse eleifend libero ut felis lacinia, quis consequat tellus iaculis. Curabitur porta eu nisi at scelerisque. Nam vulputate mi ut sodales facilisis. Morbi dapibus a ligula vitae tristique. Quisque facilisis felis eu erat convallis pretium.Nam sed consectetur ligula. Quisque arcu purus, blandit at enim vel, convallis eleifend lorem. Aenean porta leo quis mi laoreet, sit amet pharetra dolor tristique. Nunc id turpis eu sapien mattis consequat. Pellentesque magna ipsum, rutrum et urna vitae, hendrerit vestibulum diam. Vestibulum placerat magna at massa rutrum varius. Aliquam dignissim non orci vitae scelerisque. Duis ut felis ornare, dictum justo in, vehicula libero. Nullam convallis est mi, ut suscipit ante mattis eget. Suspendisse potenti. Sed suscipit ac urna eget ullamcorper. Praesent dictum rhoncus massa at suscipit.Maecenas nisi erat, ullamcorper eu facilisis sit amet, mattis a lacus. Sed imperdiet erat nec elementum venenatis. Cras at lorem id massa congue vestibulum. Praesent vitae sapien velit. In sapien elit, accumsan at rutrum eget, feugiat vitae magna. Sed eu aliquam justo. Aliquam semper fermentum lacus, scelerisque porttitor augue lobortis non. Sed ac elit vitae mi pretium placerat. Quisque molestie nisi luctus interdum posuere. Suspendisse ac velit ac metus tincidunt vulputate et vel eros. Nunc et est eu ante ullamcorper convallis et eget nulla. Vestibulum laoreet tristique sollicitudin. Aenean a aliquam libero, sit amet malesuada nisl. Donec ac purus tincidunt velit gravida aliquam. Sed dictum malesuada nisi, eu accumsan erat posuere nec. Sed convallis lectus sed magna sollicitudin, ut porta ante pellentesque.Nunc et mattis ante. Vestibulum dolor risus, mollis iaculis convallis in, vehicula vitae magna. Phasellus eros sem, convallis vel massa dapibus, congue ornare dui. Aenean a sagittis odio, eu dapibus neque. Vivamus sed mauris vel orci accumsan porttitor sed a magna. Duis ac massa lacus. Nunc a velit justo. Nulla vulputate iaculis malesuada. Integer molestie viverra lacus in tristique. Proin malesuada magna vel magna porta, et rhoncus massa pharetra. Phasellus luctus dui et erat convallis, nec tincidunt nunc dapibus.Morbi eget fermentum neque. Duis gravida tortor ligula, consequat lobortis quam tincidunt sit amet. Proin tellus nisl, tincidunt vitae vestibulum vel, rutrum a libero. Nullam pretium molestie semper. Sed ac sapien ac est aliquam dignissim. Vivamus ac convallis felis, id tempus nisl. Fusce sit amet convallis leo. Fusce ac lorem sollicitudin, iaculis lacus suscipit, dignissim erat. Curabitur iaculis varius risus eu lobortis. Ut semper nibh eu leo dapibus, vehicula ullamcorper tortor ultrices. Nunc a egestas nibh, at mollis nibh. Quisque non interdum magna. Aenean tristique ac lacus vel sollicitudin. Duis ut metus sed eros imperdiet pulvinar. Quisque vitae ipsum tristique, condimentum ipsum sit amet, consectetur nisl. Quisque pharetra id enim vel porttitor.Vivamus eget consequat nulla, nec bibendum justo. Vestibulum semper euismod est, commodo imperdiet sapien ornare id. Maecenas posuere, felis laoreet porttitor rutrum, ante nulla mattis lectus, vitae elementum odio turpis eget sapien. Phasellus posuere auctor neque nec sodales. Cras quis arcu dapibus elit interdum imperdiet et quis quam. Sed a porta ligula. Proin tincidunt iaculis dolor at eleifend. Proin placerat dictum tellus, vitae luctus lectus pulvinar quis. Nulla justo erat, imperdiet non malesuada nec, pretium a nisi. Pellentesque nec elit ac massa cursus facilisis at nec urna. Integer aliquam augue quis dolor laoreet, vitae feugiat mi laoreet. Vivamus volutpat malesuada turpis at mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lorem eu massa porta tempus. Donec cursus leo quis justo mollis, sed blandit ligula faucibus.Pellentesque nec odio enim. Fusce condimentum felis tellus, ac hendrerit leo pulvinar at. Duis blandit dictum enim, vitae pellentesque risus. Sed rutrum et enim vel euismod. Cras ut enim id nibh blandit consequat quis ac risus. Praesent suscipit nulla magna, vel mattis nisi semper vitae. Fusce blandit a est ultricies pellentesque. Morbi ornare lectus eu tellus pharetra commodo. Aliquam vitae dui ipsum. Fusce egestas mauris ut nibh egestas blandit ac a arcu. Ut eget rhoncus lectus. Etiam malesuada ante sed pretium hendrerit. Vivamus ac dolor est. Nam posuere leo est, ut malesuada ante mattis at. Etiam vehicula egestas lacus at vulputate.Donec tempor purus eu nulla consectetur, in euismod tortor pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus fringilla felis in dictum mattis. Etiam posuere purus id odio dictum, quis vestibulum libero viverra. Nullam leo dolor, cursus vitae odio sit amet, ultricies aliquam tortor. Fusce hendrerit odio quis mollis commodo. Nullam in lorem eros. Ut aliquam eros non rutrum faucibus. Nam lectus augue, dignissim ut sodales ac, mollis at sapien. Pellentesque sed neque eu elit posuere bibendum. Mauris dolor ante, vehicula eget tempor eu, molestie at neque. Vestibulum est dui, molestie eget rutrum id, mollis vel lacus. Morbi fermentum lorem nec libero dignissim vehicula. In volutpat.";
        
        device_1.save();
        var results = this.DeviceModel.findOne({"id":"30"});
        expect(results.length).toBe(1);
    });
});