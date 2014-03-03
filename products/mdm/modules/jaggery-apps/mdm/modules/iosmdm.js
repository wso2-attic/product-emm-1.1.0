var iosmdm = (function() {

	var log = new Log();
	var deviceModule = require('/modules/device.js').device;
	var db = application.get('db');
	var device = new deviceModule(db);
	var common = require("/modules/common.js");
    var sqlscripts = require('/sqlscripts/mysql.js');
	var notificationModule = require('/modules/notification.js').notification;
	var notification = new notificationModule(db);
    var userModule = require('user.js').user;
    var user = '';

	var module = function() {
        user = new userModule(db);
	};

	function mergeRecursive(obj1, obj2) {
		for (var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if (obj2[p].constructor == Object) {
					obj1[p] = MergeRecursive(obj1[p], obj2[p]);
				} else {
					obj1[p] = obj2[p];
				}
			} catch (e) {
				// Property in destination object not set; create it and set its value.
				obj1[p] = obj2[p];
			}
		}
		return obj1;
	}


	module.prototype = {
		constructor : module,
		getCA : function() {
			try {
				var keystoreReader = new Packages.com.wso2.mobile.ios.mdm.impl.KeystoreReader();
				var caCertificate = keystoreReader.getCACertificate();
				return caCertificate.getEncoded();
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		generateMobileConfigurations : function(token) {
			try {

                //Get Tenant from the Token (which is the username)
                var tenantName = user.getTenantNameByUser(token);

				var plistGenerator = new Packages.com.wso2.mobile.ios.mdm.plist.PlistGenerator();
                var result = plistGenerator.generateMobileConfigurations(token, tenantName);
				var data = result.getBytes();

				var pkcsSigner = new Packages.com.wso2.mobile.ios.mdm.impl.PKCSSigner();
				var signedData = pkcsSigner.getSignedData(data);

				return signedData;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		handleProfileRequest : function(inputStream) {

			try {
                log.debug("Handle Profile Request!");

                var commonUtil =  new Packages.com.wso2.mobile.ios.mdm.util.CommonUtil();
                var profileResponse = commonUtil.copyInputStream(inputStream);
                if (profileResponse.challengeToken != null) {
                    db.query(sqlscripts.device_pending.update4, profileResponse.udid, profileResponse.challengeToken);
                }
                var devices = db.query(sqlscripts.device_pending.select4, profileResponse.udid);
                var tenantName = user.getTenantNameFromID(devices[0].tenant_id);

				var requestHandler = new Packages.com.wso2.mobile.ios.mdm.impl.RequestHandler();
				var signedData = requestHandler.handleProfileRequest(profileResponse.inputStream, tenantName);

				return signedData;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		getCACert : function(caPath, raPath) {

			try {
				var requestHandler = new Packages.com.wso2.mobile.ios.mdm.impl.RequestHandler();
				var scepResponse = requestHandler.handleGetCACert();

				return scepResponse;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		getCACaps : function() {

			var postBodyCACaps = "POSTPKIOperation\nSHA-1\nDES3\n";
			var strPostBodyCACaps = new Packages.java.lang.String(postBodyCACaps);

			return strPostBodyCACaps.getBytes();

		},
		getPKIMessage : function(inputStream) {

			try {
				var certGenerator = new Packages.com.wso2.mobile.ios.mdm.impl.CertificateGenerator();
				var pkiMessage = certGenerator.getPKIMessage(inputStream);

				return pkiMessage;
			} catch (e) {
				log.error(e);
			}

		},
		extractDeviceTokens : function(inputStream) {

			var writer = new Packages.java.io.StringWriter();
			Packages.org.apache.commons.io.IOUtils.copy(inputStream, writer, "UTF-8");
			var contentString = writer.toString();

			try {
				var plistExtractor = new Packages.com.wso2.mobile.ios.mdm.plist.PlistExtractor();
				var checkinMessageType = plistExtractor.extractTokens(contentString);

                log.debug("CheckinMessageType >>>>>>>>>>>>>>>>>>>>>> " + checkinMessageType.getMessageType());

				if (checkinMessageType.getMessageType() == "CheckOut") {
					var ctx = {};
					ctx.udid = checkinMessageType.getUdid();
					device.unRegisterIOS(ctx);
				} else if (checkinMessageType.getMessageType() == "TokenUpdate") {
					var tokenProperties = {};
					tokenProperties["token"] = checkinMessageType.getToken();
					tokenProperties["unlockToken"] = checkinMessageType.getUnlockToken();
					tokenProperties["magicToken"] = checkinMessageType.getPushMagic();
					tokenProperties["deviceid"] = checkinMessageType.getUdid();

					device.updateiOSTokens(tokenProperties);
				}
				
				return checkinMessageType.getMessageType();

			} catch (e) {
				log.error(e);
			}
		},
		sendPushNotifications : function(inputStream) {

			var writer = new Packages.java.io.StringWriter();
			Packages.org.apache.commons.io.IOUtils.copy(inputStream, writer, "UTF-8");
			var contentString = writer.toString();

			try {
				var plistExtractor = new Packages.com.wso2.mobile.ios.mdm.plist.PlistExtractor();
				var apnsStatus = plistExtractor.extractAPNSResponse(contentString);


         		var commandUUID = apnsStatus.getCommandUUID();

				if (("Acknowledged").equals(apnsStatus.getStatus())) {
					log.debug("Acknowledged >> " + apnsStatus.getOperation());

					var responseData = "";

					if ("QueryResponses" == apnsStatus.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("InstalledApplicationList" == apnsStatus.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("ProfileList" == apnsStatus.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("NeedsRedemption" == apnsStatus.getState()) {

						var notifications = db.query(sqlscripts.notifications.select4, commandUUID);
						var device_id = notifications[0].device_id;
						var message = notifications[0].message;
						message = parse(message);
						
						responseData = apnsStatus.getResponseData();
						var data = {};
						data.identifier = responseData.identifier;
						data.redemptionCode = message.redemptionCode;
						device.sendMessageToIOSDevice({'deviceid':device_id, 'operation': "APPLYREDEMPTIONCODE", 'data': data});
					}

					var ctx = {};
					ctx.data = responseData;
					ctx.msgID = commandUUID;
                    //log.debug(" Command >>>>> " + stringify(ctx) );

					var pendingExist = notification.addIosNotification(ctx);

                    //log.debug("pendingExist >>>>>>>>>>>>>>>>>>>>>>> " + stringify(pendingExist));
                    //log.debug("pendingExist >>>>>>>>>>>>>>>>>>>>>>> " + pendingExist);

                    ctx = {};
                    ctx.id = commandUUID;

                    if (pendingExist != true) {
                        notification.discardOldNotifications(ctx);
                    }

				} else if (("Error").equals(apnsStatus.getStatus())) {
					log.error("Error " + apnsStatus.getError());
					var ctx = {};
					ctx.error = "Error";
					ctx.data = apnsStatus.getError();
					ctx.msgID = commandUUID;
                    var pendingExist = notification.addIosNotification(ctx);
				}

				var ctx = {};
				ctx.udid = stringify(apnsStatus.getUdid());
                //log.debug("ctx.udid >>>>> " + stringify(ctx));

				var operation = device.getPendingOperationsFromDevice(ctx);


                if (operation != null) {
					var deviceInfo = db.query(sqlscripts.devices.select7, parse(ctx.udid));
					if(operation.message=="null"){
						operation.message = deviceInfo[0].reg_id;
					}

                    if (operation.feature_code.indexOf("-") > 0) {
                        var featureCode = operation.feature_code.split("-")[0];
                        var payload;
                        payload = common.loadPayload(new Packages.java.lang.String(operation.id), featureCode, operation.message);
                    } else {
                        payload = common.loadPayload(new Packages.java.lang.String(operation.id), operation.feature_code, operation.message);
                    }

                    return payload;
                }

                //End of all Notifications pending for the device
                var datetime =  common.getCurrentDateTime();
                db.query(sqlscripts.device_awake.update4, datetime, apnsStatus.getUdid());
                log.debug("Device awake completed!!");

                return null;

			} catch (e) {
				log.error(e);
			}
		}
	};

	return module;
})();
