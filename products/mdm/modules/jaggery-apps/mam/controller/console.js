var dashboard = function(appController){
	context = appController.context();
	context.title = context.ui.TITLE + " | Dashboard";	
	context.jsFile= "console_dashboard.js";
	context.page = "dashboard";
	context.data = {		
	}
	return context;
};

var management = function(appController){
	context = appController.context();
	context.title = context.ui.TITLE + " | Manage Apps";	
	context.jsFile= "console_management.js";
	context.page = "management";
	var storeModule = require('/modules/store.js').store;
	var store = new storeModule();
	context.data = {
		apps: store.getAppsFromStore()		
	};
	return context;
};