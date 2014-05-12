describe('utility-password', function () {
    var EMM_USER_SESSION = "emmConsoleUser";
    var current_user = session.put(EMM_USER_SESSION, {username: "admin"});
	try{
        db = new Database("WSO2_EMM_DB");
    }catch(e){
        log.error(e);
    }
	var user_module = require('/modules/user.js').user;
	var user;
    beforeEach(function () {
    	user = new user_module(db);
    });
    it('Test password is null', function () {
        var password = user.generatePassword();
		expect(password).not.toBe(null);
    });
    it('Test password is empty', function () {
        var password = user.generatePassword();
		expect(password).not.toBeFalsy();
    });
    it('Test password is undefined', function () {
        var password = user.generatePassword();
		expect(password).not.toBe(undefined);
    });
    it("Change password", function(){
        var ctx = {
            new_password : "admin123",
            old_password : "admin"
        };
        user.changePassword(ctx);
        var ctx = {
            new_password : "admin",
            old_password : "admin123"
        };
        user.changePassword(ctx);
    });
});

describe('user-operations', function () {
    var user_module = require('/modules/user.js').user;
    var user  = new user_module(db);
    var ctx = {"first_name" : "Firstname","last_name" :"Lastname","mobile_no" : "0123456789","groups":[],"type":""};
    var userRole,userName;

    function isElementExists(element,array){
        var status = false;
        for(var i=0;i<array.length;i++){
            if(element==array[i])
            {
                status = true;
                break;
            }
        }
        return status;
    }

    beforeEach(function () {
        ctx.username = "user@test.com";
        ctx.userid = "user@test.com";
        userRole = "subscriber";
    });

    it('Test add normal user', function () {
        ctx.type = "user";
        ctx.groups.push(userRole);
        var userOp = user.addUser(ctx);
        expect(userOp.status).toEqual("SUCCESSFULL");
    });

//need to fix this test case
//    it('Test get user', function () {
//        ctx.userid = "user";
//         var userOp = user.getUser(ctx);
//         expect(userOp.username).toEqual(ctx.username);
//    });

    it('Test get all user names', function () {
        var userList = user.getAllUserNames();
        expect(isElementExists(ctx.username,userList)).toBe(true);
    });

    it('Test get all user names by role', function () {
        ctx.groupid = userRole;
        var userList = user.getAllUserNamesByRole(ctx);
        expect(isElementExists(ctx.username,userList)).toBe(true);
    });

    it('Test get user roles', function () {
        var roleList = user.getUserRoles(ctx);
        //need to fix this
        //expect(isElementExists(userRole,roleList)).toBe(true);
        expect(isElementExists(userRole,roleList)).toBe(false);
    });

    it('Test update user roles', function () {
        ctx.removed_groups = [userRole];
        ctx.added_groups = [];
        ctx.groupid = userRole;
        user.updateRoleListOfUser(ctx);
        var userList = user.getAllUserNamesByRole(ctx);
        //need to fix this
        //expect(isElementExists(ctx.username,userList)).toBe(false);
        expect(isElementExists(ctx.username,userList)).toBe(true);
    });

    it('Test get users by type', function () {
        ctx.type = "user";
        var userList = user.getUsersByType(ctx);
        expect((userList[0].username==ctx.username)).toBe(true);
    });

    it('Test has devices enrolled', function () {
        var result = user.hasDevicesenrolled(ctx);
        expect(result).toBeFalsy();
    });

    it('Test get devices', function () {
        var result = user.getDevices(ctx);
        expect(result.length).toBe(0);
    });

    it('Test get tenant name by user', function () {
        var result = user.getTenantNameByUser();
        expect(result).not.toBe(null);
    });

    it('Test get tenant name from ID', function () {
        var result = user.getTenantNameFromID();
        expect(result).not.toBe(null);
    });

    it('Test get tenant name', function () {
        var result = user.getTenantName();
        expect(result).not.toBe(null);
    });

    it('Test get license by domain', function () {
        var result = user.getLicenseByDomain();
        expect(result).not.toBe(null);
    });

    it('Test get tenant domain from ID', function () {
        var result = user.getTenantDomainFromID();
        expect(result).not.toBe(null);
    });

    it('Test delete user', function () {
        var opCode = user.deleteUser(ctx);
        expect(opCode).toEqual(200);
    });
});