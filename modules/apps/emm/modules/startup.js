var startup = (function () {

    var routes = new Array();
    var log = new Log();
    var db;
    var driver, user;
    var sqlscripts = require('/sqlscripts/db.js');
    var userModule = require('/modules/user.js').user;
    var carbon = require('carbon');






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



                //this is for publisher and reviwer
                var server = application.get("SERVER");
                var um = new carbon.user.UserManager(server,  ctx.tenantId);
                var arrPermission = {};
                arrPermission["/permission/admin/login"] = ["ui.execute"];

                var roles = ["Internal/reviewer", "Internal/publisher", "Internal/store" ];

                for(var i = 0; i < roles.length; i++){

                    if (um.roleExists(roles[i])) {
                        um.authorizeRole(roles[i],  arrPermission);
                    } else {
                        um.addRole(roles[i], [], arrPermission);
                        um.authorizeRole(roles[i], arrPermission);
                    }

                }





                //um.addRole("Internal/reviewer", ctx.username, arrPermission);
                // um.authorizeRole("Internal/reviewer", arrPermission);
                // um.addRole("Internal/publisher", ctx.username, arrPermission);
                // um.authorizeRole("Internal/publisher", arrPermission); 
                // um.addRole("Internal/store", ctx.username, arrPermission);
                // um.authorizeRole("Internal/store", arrPermission);  



            }

            var tenantId = parseInt(common.getTenantID());
            user.defaultTenantConfiguration(tenantId);
        }
    };

    // return module
    return module;
})();