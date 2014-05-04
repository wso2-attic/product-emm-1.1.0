describe('device module', function() {
    var log = new Log('DeviceModule');
    var DeviceModule = require('/features/device_management/modules/device/device_module.js').DeviceModule;
    var PolicyModule = require('/features/device_management/modules/policy/policy_module.js').PolicyModule;
    beforeEach(function() {});
    afterEach(function() {});
    it('Perform operations to a set of Devices', function() {
        var operation = "LOCK"; // This comes from the UI
        var devices = DeviceModule.getDevices({
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
            var device = DeviceModule.getDevice(id);
            device.operate(operation);
        } catch (e) {
            //Handle situation where device is invalid
            //Handle situtation where operation is invalid
            //Handle situation where operation is not permitted to user
        }
    });
    it("Add policy", function(){
        try{
            var policy = PolicyModule.createPolicy("dulithaz@gmail.com", "-1234", options);    
        }catch(e){

        }
        policy.save();
    });
    it("Associate policy to device", function(){
        var policy = PolicyModule.getPolicy(policyid);

        // internally store the added and removed users
        policy.addUsers(added_users, removed_users);
        policy.addPlatforms(added_platforms, removed_platforms);
        policy.addOwnership(DeviceModule.BYOD);

        // apply the policy in a manner where it should be 
        // enforced only
        // revoked and enforced 
        // revoked only 
        policy.update();
    });

    /*
        message status 
            pending
            recieving
            intermediate
            deleted 
    */
    it("Device registration Android", function() {
        try {
            //Pass all the information necessary for registration
            var device = DeviceModule.registerDevice("dulithaz@gmail.com", "-1234", {
                platform: "1",
                udid: "sdkfjo2342",
                ownership: "1",
                os_version: "4.1.0"
            });
        } catch (e) {
            log.error(e);
        }
    });
    it("Device contacting the Server", function(){
        var deviceid, notifier, messageid, result;
        var device = DeviceModule.getDevice(deviceid);
        // we are calling it payload since it might combine messages
        try{
            //consume the resultset if a resultset is available
            device.consumeResult(result, notifier);
            //obtain pending payload
            var payload = device.getPendingPayload();
            print(payload);
        }catch(e){
            // handle end of message and send 401 code
        }
    });
    it("Server performing monitoring of the Devices", function(){

    });
});