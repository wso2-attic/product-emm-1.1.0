var iosemm = (function() {

	var log = new Log();
	var deviceModule = require('/modules/device.js').device;
	var db = application.get('db');
	var device = new deviceModule(db);
	var driver = require('driver').driver(db);
	var common = require("/modules/common.js");
	var sqlscripts = require('/sqlscripts/db.js');
	var notificationModule = require('/modules/notification.js').notification;
	var notification = new notificationModule(db);
	var userModule = require('user.js').user;
	var mobilityManagerService = new Packages.org.wso2.carbon.emm.ios.core.service.iOSMobilityManagerService();
	mobilityManagerService = mobilityManagerService.getInstance();
	var user = '';

	var module = function() {
		user = new userModule(db);
	};

	function mergeRecursive(obj1, obj2) {
		for ( var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if (obj2[p].constructor == Object) {
					obj1[p] = MergeRecursive(obj1[p], obj2[p]);
				} else {
					obj1[p] = obj2[p];
				}
			} catch (e) {
				// Property in destination object not set; create it and set its
				// value.
				obj1[p] = obj2[p];
			}
		}
		return obj1;
	}

	module.prototype = {
		constructor : module,
		getCA : function() {
			try {
				var caCertificate = mobilityManagerService.getCACertificate();
				return caCertificate.getEncoded();
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		generateMobileConfigurations : function(token) {
			try {

				// Get Tenant from the Token (which is the username)
				var tenantName = user.getTenantNameByUser(token);

				var result = mobilityManagerService
						.generateMobileConfigurations(token, tenantName);
				var data = result.getBytes();
				var signedData = mobilityManagerService.getSignedData(data);

				return signedData;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		handleProfileRequest : function(inputStream) {

			try {
				log.debug("Handle Profile Request!");

				var profileResponse = mobilityManagerService
						.copyInputStream(inputStream);
				if (profileResponse.challengeToken != null) {
					driver.query(sqlscripts.device_pending.update4,
							profileResponse.udid,
							profileResponse.challengeToken);
				}
				var devices = driver.query(sqlscripts.device_pending.select4,
						profileResponse.udid);
				var tenantId = devices[0].tenant_id;
				var tenantName = user.getTenantNameFromID(tenantId);
				var mdmConfigurations = user
						.getiOSMDMConfigurations(parseInt(tenantId));
				var topicId = mdmConfigurations.properties.TopicID[0];

				var certConfigurations = user
						.getSCEPConfiguration(parseInt(tenantId));

				var country = certConfigurations.C ? certConfigurations.C[0]
						: "";
				var state = certConfigurations.ST ? certConfigurations.ST[0]
						: "";
				var locality = certConfigurations.L ? certConfigurations.L[0]
						: "";
				var organization = certConfigurations.O ? certConfigurations.O[0]
						: "";
				var organizationUnit = certConfigurations.OU ? certConfigurations.OU[0]
						: "";
				var email = "";

				var certificateAttributes = new Packages.org.wso2.carbon.emm.ios.core.util.CertificateAttributes();
				certificateAttributes.setCountry(new Packages.java.lang.String(
						country));
				certificateAttributes.setState(new Packages.java.lang.String(
						state));
				certificateAttributes
						.setLocality(new Packages.java.lang.String(locality));
				certificateAttributes
						.setOrganization(new Packages.java.lang.String(
								organization));
				certificateAttributes
						.setOrganizationUnit(new Packages.java.lang.String(
								organizationUnit));
				certificateAttributes.setEmail(new Packages.java.lang.String(
						email));

				var signedData = mobilityManagerService.handleProfileRequest(
						profileResponse.inputStream, tenantName, topicId,
						certificateAttributes);

				return signedData;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		getCACert : function(caPath, raPath) {

			try {
				var scepResponse = mobilityManagerService.scepGetCACert();

				return scepResponse;
			} catch (e) {
				log.error(e);
			}

			return null;
		},
		getCACaps : function() {

			var postBodyCACaps = "POSTPKIOperation\nSHA-1\nDES3\n";
			var strPostBodyCACaps = new Packages.java.lang.String(
					postBodyCACaps);

			return strPostBodyCACaps.getBytes();

		},
		getPKIMessage : function(inputStream) {

			try {
				var pkiMessage = mobilityManagerService
						.getPKIMessage(inputStream);

				return pkiMessage;
			} catch (e) {
				log.error(e);
			}

		},
		extractDeviceTokens : function(inputStream) {

			var writer = new Packages.java.io.StringWriter();
			Packages.org.apache.commons.io.IOUtils.copy(inputStream, writer,
					"UTF-8");
			var contentString = writer.toString();

			try {
				var checkinMessageType = mobilityManagerService
						.extractTokens(contentString);

				log.debug("CheckinMessageType >>>>>>>>>>>>>>>>>>>>>> "
						+ checkinMessageType.getMessageType());

				if (checkinMessageType.getMessageType() == "CheckOut") {
					var ctx = {};
					ctx.udid = checkinMessageType.getUdid();
					device.unRegisterIOS(ctx);
				} else if (checkinMessageType.getMessageType() == "TokenUpdate") {
					var tokenProperties = {};
					tokenProperties["token"] = checkinMessageType.getToken();
					tokenProperties["unlockToken"] = checkinMessageType
							.getUnlockToken();
					tokenProperties["magicToken"] = checkinMessageType
							.getPushMagic();
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
			Packages.org.apache.commons.io.IOUtils.copy(inputStream, writer,
					"UTF-8");
			var contentString = writer.toString();

			try {
				var apnsStatus = mobilityManagerService
						.extractAPNSResponse(contentString);

				var commandUUID = apnsStatus.getCommandUUID();

				if (("Acknowledged").equals(apnsStatus.getStatus())) {
					log.debug("Acknowledged >> " + apnsStatus.getOperation());

					var responseData = "";

					if ("QueryResponses" == apnsStatus.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("InstalledApplicationList" == apnsStatus
							.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("ProfileList" == apnsStatus.getOperation()) {
						responseData = apnsStatus.getResponseData();
					} else if ("NeedsRedemption" == apnsStatus.getState()) {

						var notifications = driver.query(
								sqlscripts.notifications.select4, commandUUID);
						var device_id = notifications[0].device_id;
						var message = notifications[0].message;
						message = parse(message);

						responseData = apnsStatus.getResponseData();
						var data = {};
                        log.info("RESPONSE DATA >>>>>>>>>>>>>> " + responseData);
						data.identifier = responseData.identifier;
						data.redemptionCode = message.redemptionCode;
						device.sendMessageToIOSDevice({
							'deviceid' : device_id,
							'operation' : "APPLYREDEMPTIONCODE",
							'data' : data
						});
					}

					var ctx = {};
					ctx.data = responseData;
					ctx.msgID = commandUUID;
					// log.debug(" Command >>>>> " + stringify(ctx) );

					var pendingExist = notification.addIosNotification(ctx);

					// log.debug("pendingExist >>>>>>>>>>>>>>>>>>>>>>> " +
					// stringify(pendingExist));
					// log.debug("pendingExist >>>>>>>>>>>>>>>>>>>>>>> " +
					// pendingExist);

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
				// log.debug("ctx.udid >>>>> " + stringify(ctx));

				var operation = device.getPendingOperationsFromDevice(ctx);

				if (operation != null) {
					var deviceInfo = driver.query(sqlscripts.devices.select7,
							parse(ctx.udid));
					if (operation.message == "null") {
						operation.message = deviceInfo[0].reg_id;
					}

					if (operation.feature_code.indexOf("-") > 0) {
						var featureCode = operation.feature_code.split("-")[0];
						var payload;
						payload = common.loadPayload(
								new Packages.java.lang.String(operation.id),
								featureCode, operation.message);
					} else {
						payload = common.loadPayload(
								new Packages.java.lang.String(operation.id),
								operation.feature_code, operation.message);
					}

					return payload;
				}

				// End of all Notifications pending for the device
				var datetime = common.getCurrentDateTime();
                var devices = driver.query(sqlscripts.devices.select7, apnsStatus.getUdid());
				if (devices != undefined && devices != null && devices[0] != undefined && devices[0] != null) {
					driver.query(sqlscripts.device_awake.update6, datetime, devices[0].id);
				}
				log.debug("Device awake completed!!");

				return null;

			} catch (e) {
				log.error(e);
			}
		}
	};

	return module;
})();
