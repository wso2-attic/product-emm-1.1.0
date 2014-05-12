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