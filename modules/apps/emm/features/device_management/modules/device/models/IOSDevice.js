var Device = require('Device.js').Device;
var uniqueIdentifier = require('uuid');
var complexQueries = require('/modules/queries.json');
var lang = require('/config/lang/locale_en.json');
var utilityModule = require('/features/utility_module.js');

var IOSDevice = function(user, platform, options, DeviceModule) {
    this.user = user;
    this.platform = platform;
    this.options = options;
    this.DeviceModule = DeviceModule;

    /*
        Generate the Mobile Configurations
     */
    this.registerNewDevice = function() {
        device = new DeviceEntity();
        device.tenant_id = this.user.tenant_id;
        device.user_id = this.user.user_id;
        device.platform_id = this.platform.id;
        device.status = this.DeviceModule.Device.Pending;
        device.created_date = utilityModule.getCurrentDateTime();
        device.modified_date = utilityModule.getCurrentDateTime();


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
            registerData.contentType = CONSTANTS.CONTENTTYPE.APPLECONFIG;

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
                var UpdateDevice = DeviceEntity.findOne({UDID: profileResponse.udid, STATUS: CONSTANTS.DEVICE.PENDING});
                UpdateDevice.udid = profileResponse.udid;
                UpdateDevice.challenge_token = profileResponse.challengeToken;
                UpdateDevice.status = CONSTANTS.DEVICE.PENDING;

                //WSO2 Nira
                UpdateDevice.update(["id"]);
            }

            var device = DeviceEntity.findOne({CHALLENGE_TOKEN: profileResponse.challengeToken, STATUS: CONSTANTS.DEVICE.PENDING});

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

    /*
        Unregister iOS device - Chan
     */
    this.unRegister = function(udid) {
        try {
            if(udid != null) {
                var device = DeviceEntity.findOne({UDID: udid, STATUS: CONSTANTS.DEVICE.ACTIVE});
                this.prototype.unRegister();
                return true;
            }
        } catch(e) {
            throw lang.ERROR_UNREGISTER;
        }
    }

    /*
        Update MDM Tokens
     */
    this.UpdateTokens = function(deviceToken) {
        var device;
        var token = {};
        try {
            device = DeviceEntity.findOne({UDID: deviceToken.udid, STATUS: CONSTANTS.DEVICE.ACTIVE});
            if(device != null) {
                token = device.token;
                if(deviceToken.token != null) {
                    token.token = deviceToken.token;
                }
                if(deviceToken.unlockToken != null) {
                    token.unlockToken = deviceToken.unlockToken;
                }
                if(deviceToken.magicToken != null) {
                    token.magicToken = deviceToken.magicToken;
                }
                device.token = token;
                device.update(["id", "status"]);
            } else {
                device = DeviceEntity.findOne({UDID: deviceToken.udid, STATUS: CONSTANTS.DEVICE.PENDING});
                if (device != null) {

                    token.token = deviceToken.token;
                    token.unlockToken = deviceToken.unlockToken;
                    token.magicToken = deviceToken.magicToken;
                    DeviceEntity.query((complexQueries.device.updateToken, token, CONSTANTS.DEVICE.ACTIVE, device.id, CONSTANTS.DEVICE.PENDING), function(complexObject, entity) {
                    });

                    //Call device monitor for the device - WSO2 Nira

                } else {
                    throw lang.DEVICE_TOKEN_UPDATE_EXCEPTION;
                }
            }
        } catch (e) {
            throw lang.DEVICE_TOKEN_UPDATE_EXCEPTION;
        }
    }


	var generate = function(){
		
	}
    var registerPendingDevice = function() {
        //iOS specific callback used for second step of iOS registration
    }
}
IOSDevice.prototype = new Device();