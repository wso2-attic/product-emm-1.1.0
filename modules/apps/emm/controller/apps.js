management = function(appController){   
	context = appController.context();	
	context.title = context.title + " |  Devices Management";
	context.page = "appmanagement";
	context.jsFile= "apps/management.js";
	var storeModule = require('/modules/store.js').store;
	var store = new storeModule();
	context.data = {
		apps: store.getAppsFromStore()		
	};
	return context;

};