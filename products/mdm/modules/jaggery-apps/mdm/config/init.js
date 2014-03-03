var common = require('/modules/common.js');
var log = new Log();

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

var androidConfig = require('android.json');
var gcm = require('gcm').gcm;
gcm.setApiKey(androidConfig.api_key);

var app_TENANT_CONFIGS = 'tenant.configs';
var app_carbon = require('carbon');
var app_configs = require('mdm.js').config();

var app_server = new app_carbon.server.Server({
    tenanted: app_configs.tenanted,
    url: app_configs.HTTPS_URL + '/admin'
});
application.put("SERVER", app_server);
application.put(app_TENANT_CONFIGS, {});

var deviceModule = require('../modules/device.js').device;
var device = new deviceModule(db);

var policyModule = require('../modules/policy.js').policy;
var policy = new policyModule(db);
policy.monitoring({});