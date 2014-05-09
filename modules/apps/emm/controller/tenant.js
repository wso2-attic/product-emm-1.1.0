configuration = function(appController) {
	context = appController.context();
	context.title = context.title + " | Configuration";
	context.page = "configuration";
	context.jsFile = "tenant/configuration.js";
	context.data = {
		
	};
	return context;
};
