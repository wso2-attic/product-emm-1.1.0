var Device = require('device.js').Device;
var uniqueIdentifier = require('uuid');
var complexQueries = require('/modules/queries.json');

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

            var devices = this.DeviceModel.findOne({CHALLENGE_TOKEN: profileResponse.challengeToken, STATUS: DeviceModule.Device.Pending});
            if(devices.length == 0) {
                throw lang.INVALID_DEVICE;
            }
            var device = devices[0];

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
        Unregister iOS device
     */
    this.unRegister = function(udid) {
        try {
            if(udid != null) {
                var devices = this.DeviceModule.findOne({UDID: udid, STATUS: DeviceModule.Device.Active});
                if(devices.length == 0) {
                    throw lang.NO_ACTIVE_DEVICE;
                }
                device = devices[0];

//            var notification = new this.NotificationModel();
//            notification.status = DeviceModule.NOTIFIER.DELETED;
//            notification.update({ID: device.id, STATUS: DeviceModule.NOTIFIER.SENT});

                this.NotificationModel.query((complexQueries.notification.setDeviceStatus, DeviceModule.Notifier.Deleted, device.id, DeviceModule.Notifier.Pending), function(complexObject, model) {
                });

//            var devicePolicy = new this.DevicePolicyModel();
//            devicePolicy.status = "D";
//            devicePolicy.update({DEVICE_ID: device.id, STATUS: "A"});
                this.DevicePolicyModel.query((complexQueries.devicePolicy.setDevicePolicyStatus, DeviceModule.DevicePolicy.Deleted, device.id, DeviceModule.DevicePolicy.Active), function(complexObject, model) {
                });

//            var deviceInfo = new this.DeviceInfoModel();
//            deviceInfo.status = "D";
//            deviceInfo.update({DEVICE_ID: device.id, STATUS: "S"});
                this.DeviceInfoModel.query((complexQueries.deviceInfo.setDeviceInfoStatus, DeviceModule.DeviceInfo.Deleted, device.id, DeviceModule.DeviceInfo.Pending), function(complexObject, model) {
                });

//            var updateDevice = new this.DeviceModel();
//            updateDevice.status = this.DeviceModule.Device.Deleted;
//            updateDevice.update({ID: device.id, STATUS: DeviceModule.Device.Active});
                this.DeviceModel.query((complexQueries.device.setDeviceStatus, DeviceModule.Device.Deleted, device.id, DeviceModule.Device.Active), function(complexObject, model) {
                });

                return true;
            }
        } catch(e) {
            throw "Error un-enrolling device";
        }
    }

    /*
        Update MDM Tokens
     */
    this.UpdateTokens = function(deviceToken) {
        var device;
        var token;
        try {
            var devicesExist = this.DeviceModel.findOne({UDID: deviceToken.udid, STATUS: DeviceModule.Device.Active});
            if(devicesExist.length > 0) {
                device = devicesExist[0];
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
                var devices = this.DeviceModel.findOne({UDID: deviceToken.udid, STATUS: DeviceModule.Device.Pending});
                if (devices.length > 0) {
                    device = devices[0];
                    var token = device.token;
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
                    device.status = DeviceModule.Device.Active;
                    device.update(["id", "status"]);

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