var userModule = require('/modules/user.js').user;
var user = new userModule(db);

var groupModule = require('/modules/group.js').group;
var group = new groupModule(db);

var userGModule = require('/modules/user_group.js').user_group;
var userG = new userGModule(db);

var common = require('/modules/common.js');


configuration = function(appController) {
	context = appController.context();
	
	context.title = context.title + " | Configuration";
	context.page = "configuration";
	context.jsFile = "users/configuration.js";
	context.data = {
		configOption : "users",
	};
	return context;
};


add = function(appController) {
	context = appController.context();

	try {
		var groups = group.getGroupsByType({type:context.contextData.user.role});	
	} catch(e) {		
		var groups = [];
	}
	

	context.title = context.title + " | Add User";
	context.page = "configuration";
	context.jsFile = "users/add.js";
	context.data = {
		configOption : "users",
		groups : groups,
		tenantId : session.get("mamConsoleUser").tenantId
	};
	return context;

};


edit = function(appController) {
	var userid = request.getParameter('user');
	try {
		var selectedUser = user.getUser({userid: userid});
	} catch(e) {
		var selectedUser = {};
	}
	
	//print(selectedUser);
	
	context = appController.context();
	context.title = context.title + " | Add User";
	context.page = "configuration";
	context.jsFile = "users/edit.js";
	context.data = {
		configOption : "users",
		user : selectedUser
	};
	return context;

};


view = function(appController) {
	context = appController.context();
	var userId = request.getParameter('user');
	if (!userId) {
		userId = session.get('mdmConsoleSelectedUser');
	}
	session.put('mdmConsoleSelectedUser', userId);
	try {
		var objUser = user.getUser({
			"userid" : userId
		});
	} catch(e) {
		var objUser = {};
	}
	
	
	try {
		var groups = userG.getRolesOfUserByAssignment({
			username : userId

		});
	} catch(e) {       
		var groups = [];
	}
	
		
	context.title = context.title + " | View User";
	context.page = "configuration";	
	context.data = {
		user: objUser,
		groups: groups
	};
	return context;

};

assign_groups = function(appController) {

	var username = request.getParameter('user');

	try {
		var groups = userG.getRolesOfUserByAssignment({
			username : username
		});
	} catch(e) {
        print(userG.getRolesOfUserByAssignment({username : username}));
		var groups = [];
	}

	context = appController.context();
	
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
	};
	
	
	if (context.contextData.user.role != 'masteradmin') {
		for (var i = 0; i < groups.length; i++) {
			if (groups[i].name == 'masteradmin' | groups[i].name == "admin") {
				groups.remove(i);
			}
		}
	}
	context = appController.context();
	context.title = context.title + " | Assign Users to group";
	context.page = "configuration";
	context.jsFile = "users/assign_groups.js";
	context.data = {
		configOption : "policies",
		groups : groups,
		tenantId : session.get("mamConsoleUser").tenantId,
		username : username

	};
	return context;
};