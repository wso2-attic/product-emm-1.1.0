var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);

var featureModule = require('/modules/feature.js').feature;
var feature = new featureModule(db);



configuration = function(appController){		
		
	context = appController.context();	
	
	try{
		var permissionGroup = JSON.parse(get(appController.getServiceURLs("permissionsCRUD", "")).data);	
	}catch(e){
		var permissionGroup = [];
	}
	
	try{
		var groups = group.getGroupsByType({type:context.contextData.user.role});		
	}catch(e){
		var groups = [];
	}
	
	
	context.jsFile= "permissions/configuration.js";
	context.title = context.title + " | Configuration";		
	context.page = "configuration";
	context.data = {
			configOption : "permissions",
			permissionGroup: permissionGroup,
			groups: groups
		
	};
	return context;
};


add = function(appController){	
	
	context = appController.context();
	
	
	try{
		var groups = group.getGroups({});		
	}catch(e){
		var groups = [];
	}
	
		
	try{
		var features =feature.getAllFeatures({});
	}catch(e){
		var features = [];
	}
	
	context.jsFile= "permissions/add.js";
	context.title = context.title + " | Configuration";	
	context.page = "configuration";
	context.data = {
			configOption : "permissions",
			groups: groups,
			features: features
	};
	return context;
};





add_bundle = function(appController){	
	
	context = appController.context();
		
	try{
		var groups = group.getGroups({});		
	}catch(e){
		var groups = [];
	}	
	
	try{
		var features = feature.getAllFeatures({});
	}catch(e){
		var features = [];
	}
	
	context.jsFile= "permissions/add_bundle.js";
	context.title = context.title + " | Configuration";	
	context.page = "configuration";
	context.data = {
			configOption : "permissions",
			groups: groups,
			features: features
	};
	return context;
};