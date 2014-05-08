describe('utility-password', function () {
	try{
        db = new Database("EMM_DB");
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
});