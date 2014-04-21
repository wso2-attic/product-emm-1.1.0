var api_router = function(router){
	router.get('/device/register/:id', function(req, res){
		var id = req.params.id;
		var log = new Log();
		log.info(id);
		// call in device_module to get a device object
	});
}