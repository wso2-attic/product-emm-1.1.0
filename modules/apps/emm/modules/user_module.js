var UserModule = {};
var carbon = require('carbon');
var log = new Log("UserModule");

var claimUserName = "http://wso2.org/claims/username";
var claimEmail = "http://wso2.org/claims/emailaddress";
var claimFirstName = "http://wso2.org/claims/givenname";
var claimLastName = "http://wso2.org/claims/lastname";
var claimMobile = "http://wso2.org/claims/mobile";

var mapClaims = function(userClaims){
	var claimMap = new java.util.HashMap();
	claimMap.put(claimUserName, userClaims.userName);
    claimMap.put(claimEmail, userClaims.email);
    claimMap.put(claimFirstName, userClaims.firstName);
    claimMap.put(claimLastName, userClaims.lastName);
    claimMap.put(claimMobile, userClaims.mobileNumber);
    return claimMap;
}

/**
 * Returns the user manager of the given tenant.
 * @param tenantId
 * @return userManager
 */
var userManager = function (tenantId) {
    var config = configs(tenantId);
    if (!config || !config[USER_MANAGER]) {
		var um = new carbon.user.UserManager(server, tenantId);
		config[USER_MANAGER] = um;
        return um;
    }
    return configs(tenantId)[USER_MANAGER];
};

/*
	Requires passing a set of user cliams and the current user object that is calling the module
	Sample Input:- 
		userClaims = {
			userName: "",
			firstName: "",
			lastName: "",
			mobileNumber: "",
			email: ""
		}
*/
UserModule.addUser = function(userClaims, currentUser){
	log.debug("--Add User Operation--");
	var claimMap = mapClaims(userClaims);
	var tenantId = currentUser.tenantId;
	var um = userManager(common.getTenantID());
}