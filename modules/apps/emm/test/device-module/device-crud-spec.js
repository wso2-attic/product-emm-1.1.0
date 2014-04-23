describe('device module', function() {
    var log = new Log('device_module');
    var device_module = require('/features/device_management/modules/device/device_module.js').device_module;
    beforeEach(function() {});
    afterEach(function() {});
    it('Perform operations to a set of Devices', function() {
        var operation = "LOCK"; // This comes from the UI
        var devices = device_module.getDevices({
            platform: 'Android'
        });
        try {
            devices.operate(operation);
        } catch (e) {
            //Handle situtation where operation is invalid
            //Handle situation where operation is not permitted to user
        }
    });
    it('Perform operations to a single Device', function() {
        var operation = "LOCK"; // This comes from the UI
        var id = "20348"; // This comes from UI 
        try {
            var device = device_module.getDevice(id);
            device.operate(operation);
        } catch (e) {
            //Handle situation where device is invalid
            //Handle situtation where operation is invalid
            //Handle situation where operation is not permitted to user
        }
    });
    it("Add policy", function(){
        try{
            var policy = policy_module.createPolicy("dulithaz@gmail.com", "-1234", options);    
        }catch(e){

        }
        policy.save();
    });
    it("Associate policy to device", function(){
        var policy = policy_module.getPolicy(policyid);

        // internally store the added and removed users
        policy.applyUsers(added_users, removed_users);
        policy.applyPlatforms(added_platforms, removed_platforms);
        policy.applyOwnership(device_module.BYOD);

        // apply the policy in a manner where it should be 
        // enforced only
        // revoked and enforced 
        // revoked only 
        policy.apply(function(device){
            device.notify();
        });

    });
    it("Device registration Android", function() {
        try {
            //Pass all the information necessary for registration
            var device = device_module.registerDevice("dulithaz@gmail.com", "-1234", {
                platform: "1",
                udid: "sdkfjo2342",
                ownership: "1",
                os_version: "4.1.0"
            });
        } catch (e) {
            log.error(e);
        }
    });
});