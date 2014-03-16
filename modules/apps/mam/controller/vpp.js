configuration = function(appController) {
	context = appController.context();
	
	
	context.title = context.title + " | VPP";
	context.page = "vpp";
	context.jsFile = "vpp/configuration.js";
	context.data = {
		configOption : "vpp",
		
	};
	return context;
};

add = function(appController) {
	context = appController.context();
	
	
	context.title = context.title + " | VPP";
	context.page = "vpp";
	context.jsFile = "vpp/add.js";
	context.data = {
		configOption : "add",
		
	};
	return context;
};
