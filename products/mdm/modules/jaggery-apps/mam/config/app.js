var log = new Log();
var common = require("/modules/common.js");
try{
	common.isDatabaseConfigured();
}catch(e){
	var fla = 0;
	while(fla<50){
		log.error("");
		fla++;
	}
	log.error("Database is not configured or has not started up");
	Packages.java.lang.System.exit(0);
}
var db = common.getDatabase();


var app_TENANT_CONFIGS = 'tenant.configs';
var app_carbon = require('carbon');
var app_configs = require('mam.js').config();
//Init for all the global objects
var app_server = new app_carbon.server.Server({
    tenanted: app_configs.tenanted,
    url: app_configs.HTTPS_URL + '/admin'
});
application.put("SERVER", app_server);
application.put(app_TENANT_CONFIGS, {});

// var groupModule = require('/modules/group.js').group;
// var group = new groupModule(db);
// var groupName = 'Internal/mamadmin';
// var userList = new Array();
// group.addGroup({'name':groupName,'users':userList});

