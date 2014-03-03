var isAdmin = function () {
	var objUser = session.get("userFeed");
	var roles = objUser["roles"];
	
	if(roles == null) {
		return false;
	}
	
	var parsedRoles = parse(roles);
	
	for (var i = 0; i < parsedRoles.length; i++) {
		if(parsedRoles[i] == 'admin') {
			return true;
		}
	}
	
	return false;
};

var getTenantIdByDomain = function (domain) {
	var carbon = require('carbon');
	var server = new carbon.server.Server(configs.HTTPS_URL + '/admin');
	return server.getTenantIdByDomain(domain);
};

var getLoggedInUserId = function () {
	var objUser = session.get("userFeed");
	return objUser["username"];
};

var getLoggedInTenantId = function () {
	var objUser = session.get("userFeed");
	return objUser["tenantId"];
};