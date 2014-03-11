var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);

var featureModule = require('/modules/feature.js').feature;
var feature = new featureModule(db);

var policyModule = require('/modules/policy.js').policy;
var policy = new policyModule(db);

var mamModule = require('/modules/mam.js').mam;
var mam = new mamModule(db);

var userModule = require('/modules/user.js').user;
var user = new userModule(db);



index = function(appController){

	context = appController.context();	
	
	var testData =  notification.getNotifications({deviceid: 998});

	print(testData);
	
	return {};
	

};