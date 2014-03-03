var DB_SESSION = "db";
var log = new Log();
var getTenantID = function() {
    if(!(typeof session === "undefined")){
        if (session.get("mamConsoleUser") && session.get("mamConsoleUser").tenantId != 0) {
            var tenantID = session.get("mamConsoleUser").tenantId;
            return tenantID;
        } else {
            return "-1234";
        }
    }
}


var removePrivateRole = function(roleList){
    var roles = new Array();
    for(var i = 0; i<roleList.length; i++){
        var prefix = '';
        try{
            prefix = roleList[i].substring(0,17);
        }catch(e){
        //   log.info('error occured while removing private role');
        }
        if(prefix == 'Internal/private_'){
            continue;
        }else{
            roles.push(roleList[i]);
        }
    }
    return roles;
}
/* 
	Function that returns a DB object for the caller
*/
var getDatabase = function(){
    var db = application.get(DB_SESSION);
  	if(db){
  		try{
  			db.query("SELECT 1 FROM dual");
  		}catch(e){
  			log.info("New connection was taken");
  			db = null;
  		}
  	}
    if(!db){
        try{
            db = new Database("EMM_DB");
            application.put(DB_SESSION,db);
        }catch(e){
            // log.error(e);
        }
    }
    return db;
}
var isDatabaseConfigured = function(){
    db = new Database("EMM_DB");
}

var removeNecessaryElements = function(list,removeList){
    var newList = Array();
    for(var i=0; i< list.length; i++){
        var flag = true;
        for(var j=0; j<removeList.length; j++){
            if(list[i]==removeList[j]){
                flag = false;
                break;
            }
        }
        if(flag){
            newList.push(list[i]);
        }
    }
    return newList;
}

var initAPNS = function(deviceToken, magicToken) {
	try {
		var apnsInitiator = new Packages.com.wso2mobile.ios.apns.PushNotificationSender();

		var userData = new Packages.java.util.ArrayList();
		var params = new Packages.java.util.HashMap();
		params.put("devicetoken", deviceToken);
		params.put("magictoken", magicToken);
		userData.add(params);

		apnsInitiator.pushToAPNS(userData);

	} catch (e) {
		log.error(e);
	}
}

var getPayloadIdentifierMap = function() {
	
	var identifierMap = {};
	identifierMap["CAMERA"] = "com.wso2.camera";
	identifierMap["WIFI"] = "com.wso2.wifi";
	identifierMap["APN"] = "com.wso2.apn";
	identifierMap["PASSWORDPOLICY"] = "com.wso2.passcode.policy";
	identifierMap["EMAIL"] = "com.wso2.email.conf";
	identifierMap["VPN"] = "com.wso2.vpn";
	identifierMap["LDAP"] = "com.wso2.ldap";
	identifierMap["GOOGLECALENDAR"] = "com.wso2.calendar";
	identifierMap["WEBCLIP"] = "com.wso2.webclip";

	return identifierMap;
}

var getValueByFeatureIdentifier = function(identifier) {
	
	var identifierMap = getPayloadIdentifierMap();
	
	for(var key in identifierMap) {
		if(identifierMap[key] == identifier) {
			return key;
		}
	}
	
	return null;
	
}

var loadPayload = function(identifier , operationCode, data) {
	return "";
}
