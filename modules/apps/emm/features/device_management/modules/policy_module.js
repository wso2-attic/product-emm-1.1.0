var policy_module = {}
/*
	Create a policy object 
*/
policy_module.createPolicy = function(){
	// var user = user_module.getUser(userid, tenantid);
	var user = {user_id:"dulithaz@gmail.com", tenant_id:"-1234"};
}

policy_module.getPolicy = function(){

}

policy_module.getPolicies = function(){
	
}

policy_module.getPolicyOperation = function(){

}

var Policy = function(user, rules){
	// update the policy for devices
	this.update = function(){
		//find the devices based on the policy mapping tables
		var devices = Device_Module.getDevices();	
		// update the policy mapping tables
		devices.updatePolicy(this);
	}
	// return a list of rules (in json) that is filtered per the device
	this.getPayload = function(device){

	}
	this.save = function(){
		//save the policy to the db
	}
	this.remove = function(){
		// remove the policy from db if no 
	}
	// Applying a policy to different types 
	this.addUsers = function(){

	}
	this.addPlatforms = function(){

	}
	this.addOwnership = function(){

	}
	this.addRoles = function(){

	}
	// Below methods don't gurrente that it's the applied policy for a user

	// return users mapping 
	// useful for ui
	this.getUsers = function(){

	}
	// return platform mapping
	this.getPlatforms= function(){

	}
	// return whether it's applied for 
	this.getOwnership= function(){

	}
	// returns roles mapping
	this.getRoles = function(){

	}
}