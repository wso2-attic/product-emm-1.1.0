management = function(appController){   
	context = appController.context();	
	
		

	context.title = context.title + " |  Devices Management";
	context.page = "appmanagement";
	context.jsFile= "apps/management.js";
	context.data = {		
		
	};
	return context;

};