(function() {

	var log = new Log();

	var ws = require('ws');
	var request = new ws.WSRequest();
	var options = new Array();
	this.urlWs = "https://localhost:9443/admin/services/UserAdmin/";

	this.getUsers = function(skey, filter) {
		log.info(skey)
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:listUsers";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:listUsers xmlns:mgt="http://mgt.user.carbon.wso2.org">' + '<mgt:filter>' + filter + '*</mgt:filter>' + '</mgt:listUsers>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;

			log.info(result);
			var listUsers = new Array();
			var resultOut= result.*::["return"];
			log.info(resultOut.length());
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"error message" : e.toString()
			};
		}
		for(var i = 0; i < resultOut.length(); i++) {
			listUsers[i] = resultOut[i].text();
			log.info(listUsers[i]);
		}
		return {
			UserList : listUsers
		};

	};

	this.listUsers = function(skey) {
		log.info(skey)
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:listUsers";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:listUsers xmlns:mgt="http://mgt.user.carbon.wso2.org">' + '<mgt:filter>*</mgt:filter>' + '</mgt:listUsers>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;

			log.info(result);
			var listUsers = new Array();
			var resultOut= result.*::["return"];
			log.info(resultOut.length());
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"error message" : e.toString()
			};
		}
		for(var i = 0; i < resultOut.length(); i++) {
			listUsers[i] = resultOut[i].text();
			log.info(listUsers[i]);
		}
		return {
			UserList : listUsers
		};

	};

	this.addUser = function(skey, userName, password) {
		log.info("module " + skey + userName + password)
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:addUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:addUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + userName + '</mgt:userName><mgt:password>' + password + '</mgt:password></mgt:addUser>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			return {
				"error" : false,
				"addedUser" : true,
				"userName" : userName
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};

	this.deletUser = function(skey, userName) {
		log.info("module " + skey + userName);
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:deleteUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:deleteUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + userName + '</mgt:userName></mgt:deleteUser>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			return {
				"error" : false,
				"deletedUser" : true,
				"userName" : userName
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};

	this.changePassword = function(skey, userName, newPassword) {
		log.info("module " + skey + userName + newPassword)
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:changePassword";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:changePassword xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + userName + '</mgt:userName><mgt:newPassword>' + newPassword + '</mgt:newPassword></mgt:changePassword>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			var resultOut= result.*::["return"];
			return {
				"error" : false,
				"changePassword" : true,
				"userName" : userName
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};

	this.changePasswordByUser = function(skey, oldPassword, newPassword) {
		log.info("module " + skey + oldPassword + newPassword)
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:changePasswordByUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:changePasswordByUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:oldPassword>' + oldPassword + '</mgt:oldPassword><mgt:newPassword>' + newPassword + '</mgt:newPassword></mgt:changePasswordByUser>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			return {
				"error" : false,
				"changePasswordByUser" : true
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};
	
		this.getRolesOfUser = function(skey, userName) {
		log.info("module " + skey + userName );
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getRolesOfUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = '<mgt:getRolesOfUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + userName + '</mgt:userName></mgt:getRolesOfUser>';
		var result;

		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
			log.info(result);
			return {
				"error" : false,
				"getRolesOfUser" : true,
				"userName" : userName
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};
	
	
	/*
	 * Regards to role Functions
	 * 
	 * 
	 * 
	 */
	
		this.getAllRolesNames = function(skey) {
		log.info("module getAllRolesNames" + skey );
				options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getAllRolesNames";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = null;
		var result;
		var listRoles = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;

			var resultOut= result.*::["return"];
			//log.info(resultOut);
			//log.info("xx" + resultOut.length());
			for(var i = 0; i < resultOut.length(); i++) {
				var role = {"name": resultOut[i].*::["itemName"].text(),
				"editable": resultOut[i].*::["editable"].text(),
				"type": resultOut[i].*::["roleType"].text()				
				};			
				listRoles[i] = role;
				//log.info(listRoles[i]);
			}
			return {
				Roles : listRoles
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}

	};
	
	this.addRole = function(skey,rolename) {		
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:addRole";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload =  '<mgt:addRole xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:roleName>' + rolename + '</mgt:roleName></mgt:addRole>';
		var result;
		var listRoles = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
		return {
				"error" : false,
				"addRole" : true,
				"roleName" : rolename
			};
			
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
	};
	
		this.deleteRole = function(skey,rolename) {		
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:deleteRole";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload =  '<mgt:deleteRole xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:roleName>' + rolename + '</mgt:roleName></mgt:deleteRole>';
		var result;
		var listRoles = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
		return {
				"error" : false,
				"deletedRole" : true,
				"roleName" : rolename
			};
			
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
	};
	
	
		this.getPermissions = function(skey) {	
			
			options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getAllUIPermissions";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = null;
		var result;
		var arrayNum = 0;
		var listPermission = new Array();
		try {
		request.open(options, this.urlWs, false);
		request.send(payload);
		result = request.responseE4X;

		var resultOut= result.*::["return"].*::["nodeList"];

		log.info("xx" + resultOut.length());
		for(var i = 0; i < resultOut.length(); i++) {

		log.info("yy"+resultOut[i].*::["nodeList"].length());
		var resultOutX = resultOut[i].*::["nodeList"];

		if(resultOutX[i].*::["nodeList"].length()==0){
		log.info("ssds"+resultOutX[i].*::["displayName"]);
		log.info("ssds"+resultOutX[i].*::["resourcePath"]);
		var permission = {
		"name":resultOutX[i].*::["displayName"],
		"resourcePath"	:resultOutX[i].*::["resourcePath"]
		};
		listPermission[arrayNum++]=permission;
		
		}else{
			
		for(var j = 0; j < resultOutX.length(); j++) {
		if(resultOutX[j].*::["nodeList"].length()==0){
		log.info("ssds"+resultOutX[j].*::["displayName"]);
		log.info("ssds"+resultOutX[j].*::["resourcePath"]);
		var permission = {
		"name":resultOutX[j].*::["displayName"],
		"resourcePath"	:resultOutX[j].*::["resourcePath"]
		};
		listPermission[arrayNum++]=permission;
		}else{
		log.info("ss"+resultOutX[j].*::["nodeList"].length());
		var resultOutY = resultOutX[j].*::["nodeList"];
		log.info(resultOutY.length());
				if(resultOutY.length()!=0){
			for(var k = 0; k < resultOutY.length(); k++) {		
		log.info("ssds"+resultOutY[k].*::["resourcePath"]);
		var permission = {
		"name":resultOutY[k].*::["displayName"],
		"resourcePath"	:resultOutY[k].*::["resourcePath"]
		};
		listPermission[arrayNum++]=permission;
		}
		}

		}
		}
		}
		}
		return {
			Permissions : listPermission
		};
	} catch(e) {
		log.error(e.toString());
		return {
			"error" : true,
			"errorMsg" : e.toString()
		};
	}
	};
	
	
		this.getRolesOfCurrentUser = function(skey) {	
					options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getRolesOfCurrentUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload = null;
		var result;
		var listRoles = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
			var resultOut= result.*::["return"];
			for(var i = 0; i < resultOut.length(); i++) {
				var role = {"name": resultOut[i].*::["itemName"].text(),
				"editable": resultOut[i].*::["editable"].text(),
				"type": resultOut[i].*::["roleType"].text()				
				};			
				listRoles[i] = role;
			}
			return {
				Roles : listRoles
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
			}
			
	this.getRolesOfUser = function(skey,username) {	
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getRolesOfUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
		var payload =  '<mgt:getRolesOfUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + username + '</mgt:userName></mgt:getRolesOfUser>';
		var result;
		var listRoles = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
			var resultOut= result.*::["return"];
			for(var i = 0; i < resultOut.length(); i++) {
				var role = {"name": resultOut[i].*::["itemName"].text(),
				"editable": resultOut[i].*::["editable"].text(),
				"type": resultOut[i].*::["roleType"].text()				
				};			
				listRoles[i] = role;
			}
			return {
				Roles : listRoles
			};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
		};
			
		this.getUsersOfRole = function(skey,rolename) {	
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getUsersOfRole";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
			var payload =  '<mgt:getUsersOfRole xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:roleName>' + rolename + '</mgt:roleName><mgt:filter>*</mgt:filter></mgt:getUsersOfRole>';
		var result;
		var listUsers = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			result = request.responseE4X;
			var resultOut= result.*::["return"];
			for(var i = 0; i < resultOut.length(); i++) {
			listUsers[i] = resultOut[i].*::["itemName"].text();
			//log.info(listUsers[i].*::["itemName"].text());
			log.info(listUsers[i].text());
		}
		return {
			UserList : listUsers
		};
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
		};
		
				this.updateRoleName = function(skey,rolename,newRolename) {	
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:updateRoleName";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
			var payload =  '<mgt:updateRoleName xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:roleName>' + rolename + '</mgt:roleName>  <mgt:newRoleName>'+newRolename+'</mgt:newRoleName></mgt:updateRoleName>';
		var result;
		var UserList = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			//result = request.responseE4X;
			return {
				"error" : false,
				"updateRoleName" : true,
				"newRoleName" : newRolename
			};
		
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
		};
		
		this.updateRolesOfUser = function(skey,userName,newUserList) {	
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:updateRolesOfUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
			var payload =  '<mgt:updateRolesOfUser xmlns:mgt="http://mgt.user.carbon.wso2.org"><mgt:userName>' + userName + '</mgt:userName>  <mgt:newUserList>'+newUserList+'</mgt:newUserList></mgt:updateRolesOfUser>';
		var result;
		var UserList = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			//result = request.responseE4X;
			return {
				"error" : false,
				"userName":userName,
				"updateRolesOfUser" : true
			};
		
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
		};
		
		this.updateUsersOfRole = function(skey,roleName,itemName) {	
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:updateRolesOfUser";
		options["HTTPHeaders"] = [{
			name : "Cookie",
			value : "JSESSIONID=" + skey
		}];
			var payload =  '<mgt:updateUsersOfRole xmlns:mgt="http://mgt.user.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd"><mgt:roleName>' + roleName + '</mgt:roleName>' 
			+' <mgt:userList><xsd:itemName>'+itemName+'</xsd:itemName><xsd:roleType>External</xsd:roleType></mgt:userList></mgt:updateUsersOfRole>';
		var result;
		var UserList = new Array();
		try {
			request.open(options, this.urlWs, false);
			request.send(payload);
			//result = request.responseE4X;
			return {
				"error" : false,
				"userName":userName,
				"updateRolesOfUser" : true
			};
		
		} catch (e) {
			log.error(e.toString());
			return {
				"error" : true,
				"errorMsg" : e.toString()
			};
		}
		};
	
})();
