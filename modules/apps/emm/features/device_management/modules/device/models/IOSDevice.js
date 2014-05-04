var Device = require('device.js').Device;
var uniqueIdentifier = require('uuid');

var IOSDevice = function(user, platform, options, DeviceModule) {
    this.user = user;
    this.platform = platform;
    this.options = options;
    this.DeviceModule = DeviceModule;

    /*
        Generate the Mobile Configurations
     */
    this.registerNewDevice = function() {
        device = new this.DeviceModel();
        device.tenant_id = this.user.tenant_id;
        device.user_id = this.user.user_id;
        device.platform_id = this.platform.id;
        device.status = this.DeviceModule.Device.Pending;
        device.created_date = new Date();
        device.updated_date = new Date();


        try {
            //Generate the challenge token
            var challengeToken = uniqueIdentifier.generate();
            var plistGenerator = new Packages.org.wso2.mobile.ios.mdm.plist.PlistGenerator();
            var result = plistGenerator.generateMobileConfigurations(challengeToken, this.user.tenantDomain);
            var data = result.getBytes();

            var pkcsSigner = new Packages.org.wso2.mobile.ios.mdm.impl.PKCSSigner();
            var signedData = pkcsSigner.getSignedData(data);

            var registerData = {};
            registerData.data = signedData;
            registerData.contentType = DeviceModule.CONTENTTYPE.APPLECONFIG;

            device.challenge_token = challengeToken;
            device.save();

            return signedData;
        } catch (e) {
            log.error(e);
            return null;
        }
    }

    /*
        Generate the profile for iOS
     */
    this.handleProfileRequest = function(inputStream) {
        try {
            var commonUtil =  new Packages.org.wso2.mobile.ios.mdm.util.CommonUtil();
            var profileResponse = commonUtil.copyInputStream(inputStream);
            if (profileResponse.challengeToken != null) {
                var updateDevice = new this.DeviceModel();
                updateDevice.udid = profileResponse.udid;
                updateDevice.challenge_token = profileResponse.challengeToken;
                updateDevice.status = DeviceModule.Device.Pending;
                updateDevice.update(["challenge_token", "status"]);
            }

            devices = this.DeviceModel.findOne({CHALLENGE_TOKEN: profileResponse.challengeToken, STATUS: DeviceModule.Device.Pending});
            if(devices.length == 0) {
                throw lang.INVALID_DEVICE;
            }
            device = devices[0];

            //Get Tenant id from usermanagement - WSO2 Nira
            var tenantName = null

            var requestHandler = new Packages.org.wso2.mobile.ios.mdm.impl.RequestHandler();
            var signedData = requestHandler.handleProfileRequest(profileResponse.inputStream, tenantName);

            return signedData;

        }catch(e) {
            log.error(e);
            return null;
        }
    }

    this.unRegister = function(udid) {
        if(udid != null) {
            var devices = this.DeviceModule.findOne({UDID: udid, STATUS: DeviceModule.Device.Active});
            if(devices.length == 0) {
                throw lang.NO_ACTIVE_DEVICE;
            }
            device = devices[0];

            var notification = new this.NotificationModel();
            notification.device_id = device.id;
            notification.status = DeviceModule.NOTIFIER.DELETED;

//    'update3' : "UPDATE device_awake JOIN devices ON devices.id = device_awake.device_id SET device_awake.status = 'D' WHERE devices.udid = ? AND device_awake.status = 'S'",


            this.DeviceModule.update({SET:{}})
        }
    }


    /*
    unRegisterIOS:function(ctx){

        //sendMessageToIOSDevice({'deviceid':ctx.udid, 'operation': "ENTERPRISEWIPE", 'data': ""});

        if(ctx.udid != null){
            var devices = db.query(sqlscripts.devices.select20, ctx.udid);
            db.query(sqlscripts.device_awake.update3, ctx.udid);
            var result = db.query(sqlscripts.devices.delete2, ctx.udid);
            if(result == 1){
                db.query(sqlscripts.device_policy.update2, devices[0].id);
                return true;
            }else{
                return false
            }
        }else{
            return false;
        }
    },*/



	var generate = function(){
		
	}
    var registerPendingDevice = function() {
        //iOS specific callback used for second step of iOS registration
    }
}
IOSDevice.prototype = new Device();