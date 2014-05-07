var featureModule = require('/modules/feature.js').feature;
var feature = new featureModule(db);

var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);


management = function(appController){   
	context = appController.context();	
	
	
	
	var features
	try{
		features =feature.getAllFeatures({});
	}catch(e){
		 features = [];
	}
	
	try{
		var groups = group.getGroupsByType({type:context.contextData.user.role});		
	}catch(e){
		
		var groups = [];
	}
	
			

	context.title = context.title + " |  Devices Management";
	context.page = "management";
	context.jsFile= "devices/management.js";
	context.data = {		
		tenantId:session.get("mdmConsoleUser").tenantId,
		features: features,
		groups: groups
	};
	return context;

};