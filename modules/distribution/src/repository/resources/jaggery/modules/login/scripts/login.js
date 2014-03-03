(function () {

	var log = new Log();
	
	var ws = require('ws');
 	var request = new ws.WSRequest();
	
	var options = new Array();
	
	var url = "admin/services/AuthenticationAdmin";
	
	this.getHostServer = function (remoteServer) {
		session.get("remoteHost");
		
	}

	this.login = function (usrName,pass,remoteServer,host) {
		if(remoteServer !=null){
			session.put("remoteHost", remoteServer );
		}else{
			session.put("remoteHost", "https://localhost:9443" );
		}
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:login";
		if (host == null){
			host = "localhost";
		}
 		var payload = '<aut:login xmlns:aut="http://authentication.services.core.carbon.wso2.org"><aut:username>' + usrName + '</aut:username><aut:password>' + pass + '</aut:password><aut:remoteAddress>' + host + '</aut:remoteAddress></aut:login>';
		var result;
		
 
		try {

			request.open(options,session.get("remoteHost")+url, false);
			request.send(payload);
			result = request.responseXML;
			var cookie = request.getResponseHeader('Set-Cookie');
			
			
			if(result.*::["return"].text() == true){
				session.put("username", usrName );
				session.put(cookie.split(";")[0].split("=")[1], "true");
				return {"error": false,"sessionId": cookie.split(";")[0].split("=")[1],"login":true};
			}else{
				return {"error": true,"error message":request.error,"login":false};
			}
			
			
			
		} catch (e) {
			log.error(e.toString());
			return {"error": true,"error message":e.toString()};
		}
		
		
   	 };

	this.logout = function (key) {

		options.useSOAP = 1.2;
        	options.action = "urn:logout";
        	options.mep = 'in-only';
		
		
         	options["HTTPHeaders"] = [{ name : "Cookie", value :"JSESSIONID="+key }];
        	var payload = null;
        	var result;

        	try {
                	request.open(options,session.get("remoteHost")+url, false);
                	request.send(payload);
			if( request.readyState == 4){
				session.remove(key);
				return {"error": false,"logout":true};
			}
			else{
				return {"error": true,"logout":false,"error messages":request.error};
			}
			
			
        	} catch (e) {
                	log.error(e.toString());
                	return {"error": true,"logout":false,"error messages":e.toString()};
       		}
        	
       
   	 };
	
	this.isLogin = function (key){
		
		if(session.get(key) != null)
		{
			return {"error":false, "isLogin":true,"SessionId":key}
		}
		else
		{
			return {"error":false, "isLogin":false,"SessionId":key}
		}
		
	}

	

	
	this.loginWithRememberMe = function (username,password,host) {
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:loginWithRememberMeOption";
		if (host == null){
			host = "localhost";
		}
 		var payload = '<aut:loginWithRememberMeOption xmlns:aut="http://authentication.services.core.carbon.wso2.org"><aut:username>' + username + '</aut:username><aut:password>' + password + '</aut:password><aut:remoteAddress>' + host + '</aut:remoteAddress></aut:loginWithRememberMeOption>';
		var result;
 
		try {

			request.open(options,session.get("remoteHost")+url, false);
			request.send(payload);
			result = request.responseText;
			var cookie = request.getResponseHeader('Set-Cookie');
			

			if(request.readyState == 4){
				
				return {"error": false,"sessionId": cookie.split(";")[0].split("=")[1],"login":true};
			}else{
				return {"error": true,"error message":request.error,"login":false};
			}
			
		} catch (e) {

			log.error(e.toString());
			return {"error": true,"error message":e.toString()};
		}
        	
       
   	 };
	
	this.getAuthenticatorName = function () {
		options.useSOAP = 1.2;
		options.useWSA = 1.0;
		options.action = "urn:getAuthenticatorName";
		var payload = null;
		var result;
 
		try {

			request.open(options,session.get("remoteHost")+url, false);
			request.send(payload);
			result = request.responseXML;
			
		} catch (e) {

			log.error(e.toString());
			return {"error":true, "error message":e.toString()}
		}
        	return {"error":false, "authenticatorName":result}
		
       
   	 };


	
})();






