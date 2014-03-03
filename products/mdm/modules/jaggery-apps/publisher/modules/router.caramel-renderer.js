
	/*
	Description: The file provides Caramel rendering logic to the router-g
	Filename:rxt.domain.js
	Created Date: 28/7/2013
	*/
var adapter=function(){
	function CaramelRenderer(){
	}

	CaramelRenderer.prototype.success=function(data){
		print('success');
		var caramel=require('caramel');	
		caramel.render(data);
	}

	CaramelRenderer.prototype.successCode=function(code){
		print('oops! - no implementationww '+code);
	}

	CaramelRenderer.prototype.error=function(data){
		var caramel=require('caramel');
		caramel.render(data);
	}

	CaramelRenderer.prototype.errorCode=function(code){
		print('oops! - no implementationww6 '+code);
	}
	
	return {
		Renderer:CaramelRenderer,
		inst:new CaramelRenderer()
	};
};
