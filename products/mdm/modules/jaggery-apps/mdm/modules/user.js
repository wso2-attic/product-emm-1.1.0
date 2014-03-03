var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var USER_OPTIONS = 'server.user.options';
//Need to change this
var USER_SPACE = '/_system/governance/';
var user = (function () {
    var config = require('/config/mdm.js').config();
    var routes = new Array();

	var log = new Log();
	var db;
	var common = require("/modules/common.js");
    var sqlscripts = require('/sqlscripts/mysql.js');
	var carbon = require('carbon');
	var server = function(){
		return application.get("SERVER");
	}
	
	var claimEmail = "http://wso2.org/claims/emailaddress";
	var claimFirstName = "http://wso2.org/claims/givenname";
	var claimLastName = "http://wso2.org/claims/lastname";
	var claimMobile = "http://wso2.org/claims/mobile";
	
    var module = function (dbs) {
		db = dbs;
        //mergeRecursive(configs, conf);
    };

    /**
     * Returns the user's registry space. This should be called once with the username,
     * then can be called without the username.
     * @param usr user object
     * @return {*}
     */
    var userSpace = function (username, tenantId) {
        try {
            var indexUser = username.replace("@", ":");
            return USER_SPACE + '/' + indexUser;
        } catch (e) {
            log.info(e);
            return null;
        }
    };

	var configs = function (tenantId) {
	    var configg = application.get(TENANT_CONFIGS);
		if (!tenantId) {
	        return configg;
	    }
	    return configs[tenantId] || (configs[tenantId] = {});
	};			
	/**
	 * Returns the user manager of the given tenant.
	 * @param tenantId
	 * @return {*}
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
	
	var createPrivateRolePerUser = function(username, roleState){
		var um = userManager(common.getTenantID());
		var indexUser = username.replace("@", ":");
		var arrPermission = {};
        var space = userSpace(username, common.getTenantID());
	    var permission = [
                carbon.registry.actions.GET,
                carbon.registry.actions.PUT,
                carbon.registry.actions.DELETE,
                carbon.registry.actions.AUTHORIZE
	    ];
	    arrPermission[space] = permission;
        arrPermission["/permission/admin/login"] = ["ui.execute"];
        if(roleState=="mdmadmin"){
            arrPermission["/permission/admin/manage"] = ["ui.execute"];
        }
		if(!um.roleExists("Internal/private_"+indexUser)){
            var private_role = "Internal/private_"+indexUser;
			um.addRole(private_role, [username], arrPermission);
            um.authorizeRole(private_role, arrPermission);
		}
	}			
	var getUserType = function(user_roles){
        for (var i = user_roles.length - 1; i >= 0; i--) {
            var role = user_roles[i];
            if(role=='admin'|| role=='Internal/mdmadmin'|| role=='Internal/mamadmin'){
                return "Administrator";
            }else{
                return "User";
            }
        };
    }
    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }
	
	function generatePassword() {
	    var length = 6,
	        charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	        retVal = "";
	    for (var i = 0, n = charset.length; i < length; ++i) {
	        retVal += charset.charAt(Math.floor(Math.random() * n));
	    }
	    return retVal;
	}
    // prototype
    module.prototype = {
        constructor: module,
        /*User CRUD Operations (Create, Retrieve, Update, Delete)*/
        addUser: function(ctx){
            log.debug("Check Params"+stringify(ctx));
            var claimMap = new java.util.HashMap();
            var roleState = null;
            claimMap.put(claimEmail, ctx.username);
            claimMap.put(claimFirstName, ctx.first_name);
            claimMap.put(claimLastName, ctx.last_name);
            claimMap.put(claimMobile, ctx.mobile_no);
            var proxy_user = {};
            try {
                var tenantId = common.getTenantID();
                var users_list = Array();
                if(tenantId){
                    var um = userManager(common.getTenantID());
                    if(um.userExists(ctx.username)) {
                        proxy_user.error = 'User already exist with the email address.';
                        proxy_user.status = "ALLREADY_EXIST";
                    } else {
						var generated_password =  generatePassword();
                        if(ctx.type == 'user'){
                            um.addUser(ctx.username, generated_password,ctx.groups, claimMap, null);
                        }else if(ctx.type == 'administrator'){
                            roleState = "mdmadmin";
                            um.addUser(ctx.username, generated_password,new Array('Internal/mdmadmin'), claimMap, null);
                        }
                        createPrivateRolePerUser(ctx.username, roleState);
                        proxy_user.status = "SUCCESSFULL";
                        proxy_user.firstName = ctx.first_name;
						proxy_user.generatedPassword = generated_password;
                    }
                }
                else{
                    log.error('Error in getting the tenantId from session');
                    print('Error in getting the tenantId from session');
                }
            } catch(e) {
                proxy_user.status = "BAD_REQUEST";
                log.error(e);
                proxy_user.error = 'Error occurred while creating the user.';
            }
            return proxy_user;
        },
        getUser: function(ctx){
            try {
                var proxy_user = {};
                var tenantUser = carbon.server.tenantUser(ctx.userid);
                if(ctx.login){
                    var um = userManager(tenantUser.tenantId);
                }else{
                    var um = userManager(common.getTenantID());
                }
                var user = um.getUser(tenantUser.username);
                var user_roles = user.getRoles();
                var claims = [claimEmail, claimFirstName, claimLastName];
                var claimResult = user.getClaimsForSet(claims,null);
                proxy_user.email = claimResult.get(claimEmail);
                proxy_user.firstName = claimResult.get(claimFirstName);
                proxy_user.lastName = claimResult.get(claimLastName);
                proxy_user.mobile = claimResult.get(claimMobile);
                proxy_user.username = tenantUser.username;
                proxy_user.tenantId = tenantUser.tenantId;
                proxy_user.roles = stringify(user_roles);
            //  proxy_user.roles = String(user_roles);
                proxy_user.user_type = getUserType(user_roles);
                if(proxy_user.roles.indexOf('admin') >= 0){
                    if(proxy_user.firstName ==null){
                        proxy_user.firstName = 'Admin';
                        proxy_user.lastName = 'Admin';
                    }
                }
                return proxy_user;
            } catch(e) {
                var error = 'Error occurred while retrieving user.';
                return error;
            }
        },
        //Deprecated
        getAllUsers: function(ctx){
            var tenantId = common.getTenantID();
            var users_list = Array();
            if(tenantId){
                var um = userManager(common.getTenantID());
                var allUsers = um.listUsers();
                var removeUsers = new Array("wso2.anonymous.user","admin","admin@admin.com");
                var users = common.removeNecessaryElements(allUsers,removeUsers);
                for(var i = 0; i < users.length; i++) {
                    var user = um.getUser(users[i]);
                    var claims = [claimEmail, claimFirstName, claimLastName];
                    var claimResult = user.getClaimsForSet(claims,null);
                    var proxy_user = {};
                    proxy_user.username = users[i];
                    proxy_user.email = proxy_user.username;
                    proxy_user.firstName = claimResult.get(claimFirstName);
                    proxy_user.lastName = claimResult.get(claimLastName);
                    proxy_user.mobile = claimResult.get(claimMobile);
                    proxy_user.tenantId = tenantId;
                    proxy_user.roles = stringify(user.getRoles());
                    users_list.push(proxy_user);
                }
            }else{
                print('Error in getting the tenantId from session');
            }
            log.debug("LLLLLLLLLLLLLLLLLLLL"+stringify(users_list));
            return users_list;
        },
        getAllUserNames: function(filter){
            var tenantId = common.getTenantID();
            var users_list = [];
            if(tenantId){
                var um = userManager(common.getTenantID());
                if(filter){
                    var allUsers = um.listUsers(filter);
                }else{
                    var allUsers = um.listUsers();
                }
                var removeUsers = new Array("wso2.anonymous.user","admin","admin@admin.com");
                var users = common.removeNecessaryElements(allUsers,removeUsers);
                users_list = users;
            }else{
                print('Error in getting the tenantId from session');
            }
            return users_list;
        },
        getAllUserNamesByRole: function(ctx) {
            var tenantId = common.getTenantID();
            var users_list = [];
            if(tenantId){
                var um = userManager(common.getTenantID());
                var usersByRole = um.getUserListOfRole(ctx.groupid);
                var removeUsers = new Array("wso2.anonymous.user","admin","admin@admin.com");
                var users = common.removeNecessaryElements(usersByRole,removeUsers);
                users_list = users;
            }else {
                print('Error in getting the tenantId from session');
            }
            return users_list;
        },
        deleteUser: function(ctx){
            var result = db.query(sqlscripts.devices.select36, ctx.userid);
            log.debug("Result :"+result);
            if(result != undefined && result != null && result != '' && result[0].length != undefined && result[0].length != null && result[0].length > 0){
                return 404;
            }else{
                var um = userManager(common.getTenantID());
                um.removeUser(ctx.userid);
                var private_role = ctx.userid.replace("@", ":");
                um.removeRole("Internal/private_"+private_role);
                return 200;
            }
        },

        /*End of User CRUD Operations (Create, Retrieve, Update, Delete)*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        /*other user manager functions*/

        /*Get list of roles belongs to particular user*/
        getUserRoles: function(ctx){
            log.debug("User Name >>>>>>>>>"+ctx.username);
            var tenantUser = carbon.server.tenantUser(ctx.username);
            var um = userManager(common.getTenantID());
            var roles = um.getRoleListOfUser(tenantUser.username);
            var roleList = common.removePrivateRole(roles);
            return roleList;
        },
        updateRoleListOfUser:function(ctx){
            var existingRoles = this.getUserRoles(ctx);
            var addedRoles = ctx.added_groups;
            var newRoles = new Array();
            for(var i=0;i<addedRoles.length;i++){
                var flag = false;
                for(var j=0;j<existingRoles.length;j++){
                    if(addedRoles[i]== existingRoles[j]){
                        flag = true;
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(flag == false){
                    newRoles.push(addedRoles[i]);
                }
            }
            var removedRoles = ctx.removed_groups;
            var deletedRoles = new Array();
            for(var i=0;i<removedRoles.length;i++){
                var flag = false;
                for(var j=0;j<existingRoles.length;j++){
                    if(removedRoles[i]== existingRoles[j]){
                        flag = true;
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(flag == true){
                    deletedRoles.push(removedRoles[i]);
                }
            }
            var um = userManager(common.getTenantID());
            um.updateRoleListOfUser(ctx.username, deletedRoles, newRoles);
        },
        getUsersByType:function(ctx){//types are administrator,mam,user
            var type = ctx.type;
            var usersByType = new Array();
            var users = this.getAllUsers();
            for(var i =0 ;i<users.length;i++){
                var roles = this.getUserRoles({'username':users[i].username});
                var flag = 0;
                for(var j=0 ;j<roles.length;j++){
                    log.debug("Test iteration2"+roles[j]);
                    if(roles[j]=='admin'||roles[j]=='Internal/mdmadmin'){                                                                                
                        flag = 1;
                        break;
                    }else if(roles[j]==' Internal/publisher'||roles[j]=='Internal/reviewer'||roles[j]=='Internal/store'|| roles[j]=='Internal/mamadmin'){
                        flag = 2;
                        break;
                    }else{
                        flag = 0;
                    }
                }
                if(flag == 1){
                    users[i].type = 'administrator';
                    if(type == 'admin'){
                        usersByType.push( users[i]);
                    }
                }else if(flag == 2) {
                    users[i].type = 'mam';
                    usersByType.push( users[i]);
                }else{
                    users[i].type = 'user';
                    usersByType.push( users[i]);
                }
                //print(stringify(users[i]));
            }
            return usersByType;
        },
        hasDevicesenrolled: function(ctx){
            //Check if user has any devices enrolled
            try {
                var tenantId = common.getTenantID();
                if(tenantId){
                    var devices = db.query(sqlscripts.devices.select46, ctx.userid, tenantId);
                    if (devices != null && devices != undefined && devices[0] != null && devices[0] != undefined) {
                        if (devices[0].count > 0) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    log.debug("Not able to get Tenant ID from Session");
                    return null;
                }
            } catch(e) {
                log.error(e);
                return null;
            }
        },


        /*end of other user manager functions*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        /*other functions*/

        /*authentication for devices only*/
        authenticate: function(ctx){
			ctx.username = ctx.username;
			log.info("username "+ctx.username);
            try {
                var authStatus = server().authenticate(ctx.username, ctx.password);
            } catch (e){
                return null;
            }

			log.info(">>auth "+authStatus);
			if(!authStatus) {
				return null;
			}
			var user =  this.getUser({'userid': ctx.username, login:true});
//            var result = db.query(sqlscripts.tenantplatformfeatures.select1,  stringify(user.tenantId));
//            if(result[0].record_count == 0) {
//				for(var i = 1; i < 13; i++) {
//                    var result = db.query(sqlscripts.tenantplatformfeatures.select2, stringify(user.tenantId), i);
//				}
//			}
		    return user;
		},

        /*send email to particular user*/
        sendEmail: function(ctx){
			var password_text = "";
			if(ctx.generatedPassword){
				password_text = "Your password to your login : "+ctx.generatedPassword;
			}
            content = "Dear "+ ctx.firstName+", "+config.email.emailTemplate+config.HTTPS_URL+"/mdm/api/device_enroll \n "+password_text+" \n"+config.email.companyName;
            subject = "MDM Enrollment";

            var email = require('email');
            var sender = new email.Sender(config.email.smtp, config.email.port, config.email.senderAddress, config.email.emailPassword, "tls");
            sender.from = config.email.senderAddress;

            log.info("Email sent to -> "+ctx.username);
            sender.to = stringify(ctx.username);
            sender.subject = subject;
            sender.text = content;
            try{
				sender.send();
			}catch(e){
				log.info(e);
			}
        },

        /*Get all devices belongs to particular user*/
		getDevices: function(obj){
            log.debug("begin");
            log.debug(String(obj.userid));
            log.debug(common.getTenantID());
            log.debug("end");

            var devices = db.query(sqlscripts.devices.select26, String(obj.userid), common.getTenantID());

            return devices;
		},

        //To get the tenant name using the tenant domain
        getTenantNameByUser: function() {
            var carbon = require('carbon');
            log.debug("Username >>>>> " + arguments[0]);
            var tenantUser = carbon.server.tenantUser(arguments[0]);
            var tenantDomain = tenantUser.domain;
            log.debug("Domain >>>>>>> " + tenantDomain);

            if (tenantDomain == "carbon.super") {
                return this.getTenantName("carbon.super");
            }

            return this.getTenantName(tenantDomain);
        },

        getTenantNameFromID: function (){
            if (arguments[0] == "-1234") {
                return this.getTenantName("carbon.super");
            }

            var ctx = {};
            ctx.tenantId = arguments[0];
            var tenantDomain = carbon.server.tenantDomain(ctx);
            log.debug("Domain >>>>>>> " + tenantDomain);
            
            return this.getTenantName(tenantDomain);
        },

        getTenantName: function() {
            try {
                var file = new File('/config/tenants/' + arguments[0] + '/config.json');
                if (file.isExists()){
                    var tenantConfig = require('/config/tenants/' + arguments[0] + '/config.json');
                    return tenantConfig.name;
                } else {
                    var tenantConfig = require('/config/tenants/default/config.json');
                    return tenantConfig.name;
                }
            } catch(e) {
                var tenantConfig = require('/config/tenants/default/config.json');
                return tenantConfig.name;
            }
        },

        getLicenseByDomain: function() {
            var message = "";
            var domain;
            if (arguments[0].trim() == "") {
                domain = "carbon.super";
            } else {
                domain = arguments[0];
            }

            var file = new File("/config/tenants/" + domain + '/license.txt');
            if (file.isExists()){
                file.open("r");
                message = file.readAll();
                file.close();
            } else {
                log.error("License is not configured for tenant.");
                message = "400";
            }
            return message;
        },
        getTenantDomainFromID: function() {
            if (arguments[0] == "-1234") {
                return "carbon.super";
            }
            var carbon = require('carbon');
            var ctx = {};
            ctx.tenantId = arguments[0];
            try {
                var tenantDomain = carbon.server.tenantDomain(ctx);
                if (tenantDomain == null){
                    tenantDomain = "default";
                }
            } catch (e) {
                tenantDomain = "default";
            }
			
			var file = new File('/config/tenants/' + tenantDomain + '/config.json');
            if (!file.isExists()){
            	tenantDomain = "default";
            }
			
            return tenantDomain;
        },
        getTouchDownConfig: function(ctx) {
            var data = {};
            var domain = this.getTenantDomainFromID(ctx.tenant_id);
            try {
                var tenantConfig = require('/config/tenants/' + domain + '/config.json');
            } catch(e) {
                var tenantConfig = require('/config/tenants/default/config.json');
            }

            data.userid = ctx.user_id;
            data.domain = tenantConfig.touchdown.domain;
            data.email = ctx.user_id;
            data.server = tenantConfig.touchdown.server;

            return data;
        }
    };
    return module;
})();