var startup = (function () {

    var routes = new Array();
	var log = new Log();
	var db;
    var driver, user;
    var sqlscripts = require('/sqlscripts/db.js');
    var userModule = require('/modules/user.js').user;

	
    var module = function (dbs) {
		db = dbs;
        driver = require('driver').driver(db);
        user = new userModule(db);
    };

   
    // prototype
    module.prototype = {
        constructor: module,
        
        //this executes after user loggedin
        userLoggedIn: function(ctx){
            log.debug("USER LOGGED " + stringify(ctx));

            if(ctx.isAdmin){
                //Executed only if it is admin
                var rolePermissions = driver.query(sqlscripts.permissions.select1, 'admin', ctx.tenantId);
                log.debug("Role Permissions" + rolePermissions);
                if(rolePermissions == ""){
                     log.debug("No permissions for admin adding");
                    var defaultAdminPermssion = ["ENTERPRISEWIPE", "ENCRYPT", "MUTE", "CAMERA", "CLEARPASSCODE", "WIPE", "LOCK", "NOTIFICATION", "CHANGEPASSWORD", "LDAP", "VPN", "GOOGLECALENDAR", "EMAIL", "PASSWORDPOLICY", "WEBCLIP", "APN", "WIFI"];
                     sucessAddingPermissions = driver.query(sqlscripts.permissions.insert1,'admin',defaultAdminPermssion, ctx.tenantId);
                }
            }

            var tenantId = parseInt(common.getTenantID());
            user.defaultTenantConfiguration(tenantId);
        }
    };

    // return module
    return module;
})();