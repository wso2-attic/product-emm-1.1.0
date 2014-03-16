var user = (function () {
	
    var module = function (db,router) {
		var userModule = require('/modules/user.js').user;
		var user = new userModule(db);
		
		router.post('users/authenticate/', function(ctx){

			var objUser = user.authenticate(ctx);

			if(objUser != null){
				//var devices = user.devices(obj);
				//If user category is admin or if normal user has devices allow login
					response.status=200;
					var userAgent= request.getHeader("User-Agent");
				    var android = userAgent.indexOf("Android");

				    if(android > 0){
						print("200");
					}else{
						var userFeed = {};
						userFeed.tenantId = stringify(objUser["tenantId"]);
						userFeed.username = objUser["username"];
						userFeed.email = objUser["email"];
						userFeed.firstName = objUser["firstName"];
						userFeed.lastName = objUser["lastName"];
						userFeed.mobile = objUser["mobile"];
						
						var parsedRoles = parse(objUser["roles"]);
						var isAdmin = false;
						
						for (var i = 0; i < parsedRoles.length; i++) {
							if(parsedRoles[i] == 'admin') {
								isAdmin = true;
								break;
							}
						}
						
						userFeed.isAdmin = isAdmin;var log = new Log();log.error("USER FEED " + stringify(userFeed));
						print(stringify(userFeed));
					}
					return;
		    }
			response.status=401;
		    print("Authentication Failed");
		});
		router.get('users/authenticate/', function(ctx){
			var obj = session.get("user");
			if(obj!=null){
		        print(obj);
				return;
			}
			response.status=401;
		    print("Authentication Failed");
		});
		router.get('users/unauthenicate/',function(ctx){
			session.put("user", null);
			response.status=200;
		});
        router.get('users/devices/enrolled/{+userid}', function(ctx){
            var hasDevices = user.hasDevicesenrolled(ctx);
            if (hasDevices == null) {
                response.status = 404;
                response.content = "Error occurred!";
            } else {
                response.status = 200;
                response.content = hasDevices;
            }
        });
		router.get('users/{userid}/sendmail',function(ctx){
			log.debug('email sending to user');
			var u = user.getUser(ctx)[0];
			if(u!=null){
				user.sendEmail(u.username, u.first_name);
				log.debug('Email sent to user with id '+u.username);
				return;
			}
			response.status = 404;
		    print("User not found");
		});
		router.get('users/{userid}',function(ctx){
			var log = new Log();
			var userObj = user.getUser(ctx);
		    if(userObj!=null){
		       response.content = userObj;
		       response.status = 200;
		    }else{
		       response.status = 404;
		   	}
		});
		router.put('users/', function(ctx){
            var returnMsg = user.addUser(ctx);
            log.debug(returnMsg.status);
            if(returnMsg.status == 'ALLREADY_EXIST'){
                response.status = 409;
                response.content = "Already Exist";
            }else if(returnMsg.status == 'SUCCESSFULL' ){
                ctx.generatedPassword = returnMsg.generatedPassword;
                ctx.firstName = returnMsg.firstName;
                log.debug("Email :"+ctx.generatedPassword);
                user.sendEmail(ctx);
                response.status = 201;
                response.content = "Successfull";
            }else if(returnMsg.status == 'BAD_REQUEST'){
                response.status = 400;
                response.content = "Name not According to Policy";
            }else if(returnMsg.status == 'SERVER_ERROR'){
                response.status = 500;
                response.content = "Session Expired";
            }else{
                response.status = 400;
            }
		});
        router.delete('users/{+userid}', function(ctx){
            var result = user.deleteUser(ctx);
            if(result == 404){
                response.status = 404;
                response.content = "Cannot delete user, associated devices exist";
            }else if(result == 200){
            response.status = 200;
                response.content = "User Deleted";
            }
        });
		router.get('users/{+username}/groups/',function(ctx){
			var groups = user.getRolesByUser(ctx);
		    /*if(groups[0]!= null){
		     	response.status = 200;
		       	response.content = groups;
		    }*/
		});
        router.put('users/{+username}/groups/',function(ctx){
            var groups = user.updateRoleListOfUser(ctx);
             response.status = 200;
             response.content = groups;
        });
		router.get('users/',function(ctx){
			var obj = session.get("user");
			var log = new Log();
			
			var users= user.getAllUsers(ctx);
		    if(users[0] != null){
		        response.content = users;
		        response.status = 200;
		    }else{
		        response.status = 404;
		    }
		});
		router.get('users/{userid}/devices',function(ctx){
			var devices= user.devices(ctx);
		    if(devices[0]!=null){
		        response.content = devices;
		        response.status = 200;
		    }else{
		        response.status = 404;
		    }
		});
        router.put('users/invite',function(ctx){
			var u = user.getUser(ctx);
			if(u!=null){
				log.debug(u)
				user.sendEmail({'username':String(u.username), 'firstName': String(u.firstName)});
				log.debug('Email sent to user with id '+u.username);
				return;
			}
			response.status = 404;
		    print("User not found");
        });
		router.post('users/{userid}/operations/{operation}',function(ctx){
			device.sendMsgToUserDevices(ctx);
		});
    };
    // prototype
    module.prototype = {
        constructor: module
    };
    // return module
    return module;
})();
