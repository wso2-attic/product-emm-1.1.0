var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);




var userModule = require('/modules/user.js').user;
var user = new userModule(db);


var user_groupModule = require('/modules/user_group.js').user_group;
var user_group = new user_groupModule(db);


configuration = function(appController){

	context = appController.context();
	
	try{
		var groups = group.getGroupsByType({type:context.contextData.user.role});		
	}catch(e){
		log.debug(e)
		var groups = [];
	}
	log.debug(groups);
	context.title = context.title + " | Configuration";
	context.page = "configuration";
	context.jsFile= "roles/configuration.js";
	context.data = {
		configOption : "roles",
		groups : groups
	}
	return context;

}




users = function(appController){
	context = appController.context();
	var role = request.getParameter('role');
	if(!role){
		role = session.get('mamConsoleSelectedRole');
	}
	session.put('mamConsoleSelectedRole', role)
	try{
		var users = group.getUsersOfGroup({'groupid':role});
	}catch(e){
        log.debug(group.getUsersOfGroup({'groupid':role}));
		var users = [];
	}
	for (var i = 0; i < users.length; i++) {

		if(users[i].no_of_devices > 0){
			var devices = user.getDevices({'userid':users[i].username});

			for (var j = 0; j < devices.length; j++) {
		  		devices[j].properties = JSON.parse(devices[j].properties);
		  		try{
		  			featureList = device.getFeaturesFromDevice({"deviceid":devices[j].id});
		  		}catch(e){
		  			featureList = [];
		  		}
		  		devices[j].features = featureList;

			}

			users[i].devices = devices;
		}

	}
	var features = feature.getAllFeatures({});
	context.title = context.title + " | Users";
	context.page = "management";
	context.jsFile= "roles/users.js";
	context.data = {
		configOption : "roles",
		users: users,
		features: features
	}
	return context;

}


add = function(appController){
	context = appController.context();
	try{
		var users = user.getUsersByType({type:context.contextData.user.role});
	}catch(e){
		var users = [];
	}
	
	context.title = context.title + " | Add Group";
	context.page = "configuration";
	context.jsFile= "roles/add.js"
	context.data = {
		configOption : "roles",
		users: users,
		tenantId: session.get("mamConsoleUser").tenantId
	}
	return context;
}




assign_users = function(appController){

	var groupId = request.getParameter('group');

	try{
		var users = user_group.getUsersOfRoleByAssignment({groupid: groupId});
	}catch(e){
		var users = [];
	}
	
	log.debug(session.get("mamConsoleUser"));
	context = appController.context();
	context.title = context.title + " | Assign Users to group";
	context.page = "configuration";
	context.jsFile= "roles/assign_users.js"
	context.data = {
		configOption : "roles",
		users: users,
		tenantId:session.get("mamConsoleUser").tenantId,
		groupId: groupId
	}
	return context;
}



assign_permissions = function(appController){

	var groupId = request.getParameter('group');
	
	context = appController.context();
	context.title = context.title + " | Assign permissions to group";
	context.page = "configuration";
	context.jsFile= "roles/assign_permissions.js"
	context.data = {
		configOption : "roles",		
		tenantId: session.get("mamConsoleUser").tenantId,
		groupId: groupId
	}
	return context;
}

edit = function(appController){
	context = appController.context();
	var role = request.getParameter('group');
	log.debug(session.get("mdmConsoleUser"));
	
	context.title = context.title + " | Edit Role";
	context.page = "configuration";
	context.jsFile= "roles/edit.js";
	context.data = {
		configOption : "roles",
		role: role,
		tenantId:session.get("mamConsoleUser").tenantId
	};
	return context;
};


view_users = function(appController){


	var groupId = request.getParameter('group');



	try{
        log.debug("Test Group ID"+groupId);
		var users = group.getUsersOfGroup({groupid: groupId});
        log.debug("Test Result"+users);
	}catch(e){
		var users = [];
	}
	try{
		var groups = group.getAllGroups({});
	}catch(e){
		var groups = [];
	}
	context = appController.context();
	context.title = context.title + " | Configuration";
	context.page = "configuration";
	context.jsFile= "users/configuration.js";
	context.data = {
		configOption : "roles",
		users: users,
		groups: groups,
		groupId: groupId
	}
	return context;
}

