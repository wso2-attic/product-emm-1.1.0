var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';
var common = require("/modules/common.js");
var configFile = require('/config/emm.js').config();
var driver;

var device = (function () {

    var userModule = require('user.js').user;
    var user = '';
    var groupModule = require('group.js').group;
    var group = '';
    var sqlscripts = require('/sqlscripts/db.js');
    var tenantID = common.getTenantID();


    var configs = {
        CONTEXT: "/"
    };

    var carbon = require('carbon');
    var server = function(){
        return application.get("SERVER");
    }

    var log = new Log();
    var gcm = require('gcm').gcm;

    /** common functions * */
    var configs = function (tenantId) {
        var config = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return config;
        }
        return config[tenantId] || (config[tenantId] = {});
    };
    /**
	 * Returns the user manager of the given tenant.
	 * 
	 * @param tenantId
	 * @return {*}
	 */
    var userManager = function (tenantId) {

        var config = configs(tenantId);

        if (!config || !config[USER_MANAGER]) {

            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        var uManager = configs(tenantId)[USER_MANAGER];
        return uManager;
    };

    var db;
    var module = function (dbs) {
        db = dbs;
        driver = require('driver').driver(db);
        user = new userModule(db);
        group = new groupModule(db);

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
                // Property in destination object not set; create it and set its
				// value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }
    function getPolicyPayLoad(deviceId,category){

        var devices = driver.query(sqlscripts.devices.select1, deviceId);
        if (devices == null) {
            return null;
        } else if (devices[0].user_id == null) {
            return null;
        }

        var username = devices[0].user_id;// username for pull policy payLoad
		var tenantID = devices[0].tenant_id;

        var platforms = driver.query(sqlscripts.devices.select5, deviceId);
        var platformName = platforms[0].type_name;// platform name for pull

        var roleList = user.getUserRoles({'username':username});
        var removeRoles = new Array("Internal/everyone", "wso2.anonymous.role", "Internal/reviewer","Internal/store","Internal/publisher");
        var roles = common.removeNecessaryElements(roleList,removeRoles);
        var role = roles[0];// role name for pull policy payLoad

        log.debug("Roles >>> " + role);

        var obj = {};
        var upresult = driver.query(sqlscripts.policies.select15, category,String(username), tenantID);
        if(upresult!=undefined && upresult != null && upresult[0] != undefined && upresult[0] != null ){
            var policyPayLoad;
            var mdmPolicy = parse(upresult[0].data);
            var mamPolicy = parse(upresult[0].mam_data);
            if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = mdmPolicy.concat(newMamPolicy);
            } else if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length == 0){
                policyPayLoad = mdmPolicy;
            } else if (mdmPolicy == null && mdmPolicy[0] == null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = newMamPolicy;
            }
            obj.payLoad = policyPayLoad;
            obj.type = upresult[0].type;
            obj.policypriority = "USERS";
            obj.policyid = upresult[0].policyid;
            return obj;
        }

        var ppresult = driver.query(sqlscripts.policies.select2, category, platformName, tenantID );
        if(ppresult!=undefined && ppresult != null && ppresult[0] != undefined && ppresult[0] != null ){
            var policyPayLoad;
            var mdmPolicy = parse(ppresult[0].data);
            var mamPolicy = parse(ppresult[0].mam_data);
            if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = mdmPolicy.concat(newMamPolicy);
            } else if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length == 0){
                policyPayLoad = mdmPolicy;
            } else if (mdmPolicy == null && mdmPolicy[0] == null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = newMamPolicy;
            }
            obj.payLoad = policyPayLoad;
            obj.type = ppresult[0].type;
            obj.policypriority = "PLATFORMS";
            obj.policyid = ppresult[0].policyid;
            return obj;
        }

        var gpresult = driver.query(sqlscripts.policies.select3, category,role, tenantID);
        if(gpresult != undefined && gpresult != null && gpresult[0] != undefined && gpresult[0] != null){
            var policyPayLoad;
            var mdmPolicy = parse(gpresult[0].data);
            var mamPolicy = parse(gpresult[0].mam_data);
            if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = mdmPolicy.concat(newMamPolicy);
            } else if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length == 0){
                policyPayLoad = mdmPolicy;
            } else if (mdmPolicy == null && mdmPolicy[0] == null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = newMamPolicy;
            }
            obj.payLoad = policyPayLoad;
            obj.type = gpresult[0].type;
            obj.policypriority = "ROLES";
            obj.policyid = gpresult[0].policyid;
            return obj;
        }
        return null;
    }

    function getPolicyMonitoringPayLoad() {
        var deviceId = arguments[0];
        var category = arguments[1];

        var devices = driver.query(sqlscripts.devices.select1, deviceId);
        if (devices == null) {
            return null;
        } else if (devices[0].user_id == null) {
            return null;
        }

        var devicePolicy = driver.query(sqlscripts.policies.select16, deviceId, devices[0].tenant_id);
        if (devicePolicy != null && devicePolicy != undefined && devicePolicy[0] != null && devicePolicy[0] != undefined) {
            var policyPayLoad;
            var mdmPolicy = parse(devicePolicy[0].data);
            var mamPolicy = parse(devicePolicy[0].mam_data);

            if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = mdmPolicy.concat(newMamPolicy);
            } else if (mdmPolicy != null && mdmPolicy[0] != null && mamPolicy.length == 0){
                policyPayLoad = mdmPolicy;
            } else if (mdmPolicy == null && mdmPolicy[0] == null && mamPolicy.length != 0){
                var newMamPolicy = separateMAMPolicy(mamPolicy);
                policyPayLoad = newMamPolicy;
            }
            var obj = {};
            obj.payLoad = policyPayLoad;
            obj.type = devicePolicy[0].type;
            obj.policypriority = devicePolicy[0].policytype;
            obj.policyid = devicePolicy[0].policyid;
            return obj;
        }

        return null;
    }

    function separateMAMPolicy() {
        var policyArray = new Array();
        var mamPolicy = arguments[0];
        for (var j = 0; j < mamPolicy.length; ++j) {
            var mamData = mamPolicy[j].data;
            for (var i=0; i<mamData.length; ++i) {
                var newPolicyFormat = {};
                if (mamPolicy[j].code == "509B") {
                    newPolicyFormat.code = "509A";
                } else {
                    newPolicyFormat.code = mamPolicy[j].code;
                }
                newPolicyFormat.data = mamData[i];
                policyArray.push(newPolicyFormat);
            }
        }
        return policyArray;
    }

    function getXMLRequestString(role,action,operationName){
        var xmlRequest = <Request xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17" CombinedDecision="false" ReturnPolicyIdList="false">
            <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:action">
                <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:action:action-id" IncludeInResult="false">
                    <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{action}</AttributeValue>
                </Attribute>
            </Attributes>
            <Attributes Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject">
                <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:subject:subject-id" IncludeInResult="false">
                    <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{role}</AttributeValue>
                </Attribute>
            </Attributes>
            <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:resource">
                <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:resource:resource-id" IncludeInResult="false">
                    <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{operationName}</AttributeValue>
                </Attribute>
            </Attributes>
        </Request>;
        return xmlRequest;
    }
    var entitlement = null;
    var stub = null;

    function init(){
        entitlement = require('policy').entitlement;
        var samlResponse = session.get("samlresponse");
        var saml = require("/modules/saml.js").saml;
        var backEndCookie = saml.getBackendCookie(samlResponse);
        entitlement.setAuthCookie(backEndCookie);
        stub = entitlement.setEntitlementServiceParameters();
    }
    function checkPermission(roles,featureName){

        var whereRoles = '';
        for(var i=0;i<roles.length;++i) {
            whereRoles = whereRoles + '\'' + roles[i] + '\',';
        }
        whereRoles = '(' + whereRoles.substring(0, whereRoles.length - 1) + ')';

        var result;
        try {
            result = driver.query("SELECT content FROM permissions where role in " + whereRoles + " AND tenant_id = ?", common.getTenantID());
            //result = driver.query("SELECT content FROM permissions where role in ? AND tenant_id = ?", whereRoles, common.getTenantID());
            for(var i=0;i<result.length;i++) {
                var resultString = result[i].content.replace(/"/g,"");
                var newArray = (resultString.substring(1, resultString.length -1)).split(",");
                for(var j=0;j<newArray.length;j++) {
                    if(featureName == newArray[j].trim()){
                        return true;
                    }
                }
            }

        } catch(e) {
            log.error(e);
        }
        return false;
    }

    function policyByOsType(jsonData,os){
        for(var n=0;n<jsonData.length;n++){
            if(jsonData[n].code == '509B'||jsonData[n].code == '528B'){
                var apps = jsonData[n].data;
                var appsByOs = new Array();
                for(var k=0;k<apps.length;k++){
                    if(apps[k].os == os){
                        appsByOs.push(apps[k]);
                    }
                }
                var obj1 = {};
                obj1.code = jsonData[n].code;
                obj1.data = appsByOs;
                jsonData[n] = obj1;
            }
        }
        return  jsonData;
    }
    function versionComparison(osVersion,platformId,featureId){
        var deviceOsVersion = osVersion.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
        for (var i = deviceOsVersion.length; i < 4; i++) {
            deviceOsVersion += "0";
        }
        var platformFeatures = driver.query(sqlscripts.platformfeatures.select1, platformId, featureId);
        var minVersion = platformFeatures[0].min_version;
        minVersion = minVersion.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
        for (var i = minVersion.length; i < 4; i++) {
            minVersion += "0";
        }
        if(parseInt(deviceOsVersion)>parseInt(minVersion)){
            return true;
        }else{
            return false;
        }
    }

    function removeDevicePolicy(ctx) {

        var policyid = ctx.policyid;
        var deviceid = ctx.deviceid;
        var revokepolicyid = ctx.revokepolicyid;
        var tenantID = common.getTenantID();
        var policytype = ctx.policypriority;
        var device_policy;

        var devices = driver.query(sqlscripts.devices.select40, deviceid, tenantID);

        if (devices != null && devices[0] != null) {

            var policypriority = driver.query(sqlscripts.policy_priority.select1, policytype);

            var datetime = common.getCurrentDateTime();
            if (revokepolicyid == null) {
                // Revoke the policy specificed
                device_policy = driver.query(sqlscripts.device_policy.select1, deviceid, tenantID, policypriority[0].priority);
            } else {
                // Revoke the policy using the revoke policy id
                device_policy = driver.query(sqlscripts.device_policy.select2, deviceid, tenantID, revokepolicyid, policypriority[0].priority);
            }

            // Check if device already has a policy if so then revoke it
            if (device_policy != null && device_policy[0] != null) {
                if (devices[0].platform_type == "iOS") {
                    sendMessageToIOSDevice({'deviceid':deviceid, 'operation':'REVOKEPOLICY', 'data':parse(device_policy[0].payload_uids), 'policyid':revokepolicyid});
                } else if (devices[0].platform_type == "Android"){
                    var revokepolicy = {};
                    revokepolicy.policyid = revokepolicyid;
                    sendMessageToAndroidDevice({'deviceid':deviceid, 'operation':'REVOKEPOLICY', 'data':revokepolicy});
                }
                driver.query(sqlscripts.device_policy.update1, device_policy[0].id);
            }
        }

    }

    function saveDevicePolicy(ctx) {
        // Save the Policy to be enforced to device_policy table
        var policyid = ctx.policyid;
        var deviceid = ctx.deviceid;
        var revokepolicyid = ctx.revokepolicyid;
        var tenantID = common.getTenantID();
        var policytype = ctx.policypriority;
        var device_policy;
        var datetime = common.getCurrentDateTimeAdjusted("-1");

        var devices = driver.query(sqlscripts.devices.select40, deviceid, tenantID);

        if (devices != null && devices[0] != null) {

            var policypriority = driver.query(sqlscripts.policy_priority.select1, policytype);
            var existDevicePolicy = driver.query(sqlscripts.device_policy.select3, deviceid, tenantID);

            if (existDevicePolicy != null && existDevicePolicy[0] != null){

                // Check if the new priority has higher precedence then remove
				// old and apply new
                if (policypriority[0].priority <= existDevicePolicy[0].priority){
                    // Remove and apply new policy
                    if (devices[0].platform_type == "iOS") {
                        sendMessageToIOSDevice({'deviceid':deviceid, 'operation':'REVOKEPOLICY', 'data':parse(existDevicePolicy[0].payload_uids), 'policyid':existDevicePolicy[0].policy_id, 'newdatetime': datetime});
                    } else {
                        var revokepolicy = {};
                        revokepolicy.policyid = existDevicePolicy[0].policy_id;

                        sendMessageToAndroidDevice({'deviceid':deviceid, 'operation':'REVOKEPOLICY', 'data':revokepolicy, 'newdatetime': datetime});
                    }

                    driver.query(sqlscripts.device_policy.update1, existDevicePolicy[0].id);
                }
            }

            if (policyid != null) {
                device_policy = driver.query(sqlscripts.device_policy.select4, deviceid, tenantID);
                datetime = common.getCurrentDateTime();
                if (device_policy[0] == null) {
                    // Check platform and accordingly insert to device_policy
					// table
                    if (devices[0].platform_type == "iOS") {
                        var payloadIdentifiers = common.getPayloadIdentifierMap();
                        var payloadUidArray = new Array();
                        var policyArray = parse(stringify(ctx.data));
                        for(i=0; i<policyArray.length; ++i){
                            var features = driver.query(sqlscripts.features.select4, policyArray[i].code);
                            if (features != null && features[0] != null) {
                                var message = {};
                                if (payloadIdentifiers[features[0].name]) {
                                    message.code = "502P";
                                    var payloadUid = {};
                                    payloadUid.fname = features[0].name;
                                    payloadUid.uuid = payloadIdentifiers[features[0].name];
                                    message.data=payloadUid;
                                    payloadUidArray.push(message);
                                }
                            }
                        }

                        driver.query(sqlscripts.device_policy.insert1, deviceid, tenantID, policyid, policypriority[0].id, stringify(payloadUidArray), datetime);

                    } else if (devices[0].platform_type == "Android") {

                        driver.query(sqlscripts.device_policy.insert2, deviceid, tenantID, policyid, policypriority[0].id, datetime);
                    }
                }
            }

        }

    }

    <!-- android specific functions -->
    function sendMessageToAndroidDevice(ctx){
        var payLoad = stringify(ctx.data);
        var deviceId = ctx.deviceid;
        var operationName = ctx.operation;
        var tenantID = common.getTenantIDFromDevice(deviceId);

        var devices = driver.query(sqlscripts.devices.select6, deviceId);

        if(devices == undefined || devices == null || devices[0]== undefined || devices[0] == null ){
            return false;
        }
        var userID = devices[0].user_id;
        if(tenantID==null){
            tenantID = common.getTenantIDFromEmail(userID);
        }
        var osVersion = devices[0].os_version;
        var platformId = devices[0].platform_id;
        var regId = devices[0].reg_id;

        var features = driver.query(sqlscripts.features.select1, ctx.operation);
        if(features == undefined || features == null || features[0]== undefined || features[0] == null ){
            return false;
        }
        var featureCode = features[0].code;
        var featureId = features[0].id;
        var featureDescription = features[0].description;
            
        if (featureCode == "500P") {
            // Revoke policy and save to device_policy
            saveDevicePolicy(ctx);
        }

        var currentDate;
        if (ctx.newdatetime != null) {
            currentDate = ctx.newdatetime;
        } else {
            currentDate = common.getCurrentDateTime();
        }
        var insertMessage = true;
        if (featureCode == "501P" || featureCode == "500A" || featureCode == "502A" ) {
            var pendingCount = driver.query(sqlscripts.notifications.select14, deviceId, featureCode);
            if(pendingCount != null && pendingCount != undefined && pendingCount[0] != null && pendingCount[0] != undefined) {
                if(pendingCount[0].count > 0) {
                    insertMessage = false;
                }
            }
        }
        if (insertMessage) {
            driver.query(sqlscripts.notifications.insert1, deviceId, -1, payLoad, currentDate, featureCode, userID,featureDescription, tenantID);
        }

        // SQL Check
        var lastRecord = driver.query(sqlscripts.general.select1);
        var lastRecordJson = lastRecord[0];
        var token = lastRecordJson["LAST_INSERT_ID()"];
        log.debug("Android registration id "+regId);
        log.debug("Current feature code "+featureCode);
        log.debug("Message token "+token);

        var AndroidNotifierType;
        var androidGCMKeys = user.getAndroidGCMKeys(parseInt(tenantID));
        if(androidGCMKeys != null) {
            AndroidNotifierType = androidGCMKeys.AndroidMonitorType[0];
        } else {
            AndroidNotifierType = configFile.DEFAULT.ANDROID.NOTIFIER;
        }

        if(AndroidNotifierType == "GCM") {
            if(featureCode=="500P" || featureCode=="502P"){
                var gcmMSG = gcm.sendViaGCMtoMobile(androidGCMKeys.APIKeys[0], regId, featureCode, token, "CONTACT SERVER", 30240, "POLICY");
            }else{
                log.debug("Sending");
                var gcmMSG = gcm.sendViaGCMtoMobile(androidGCMKeys.APIKeys[0], regId, featureCode, "CONTACT SERVER", payLoad, 3);
            }
            log.debug(gcmMSG);
        }
        return true;
    }


    <!-- iOs specific functions-->
    function invokeInitialFunctions(ctx) {
        var db = common.getDatabase();
        var tenantID = common.getTenantID();
        var devices = driver.query(sqlscripts.devices.select7 ,ctx.deviceid);
        var deviceID = devices[0].id;
        var userId = devices[0].user_id;

        sendMessageToIOSDevice({'deviceid':deviceID, 'operation': "INFO", 'data': "null"});
        sendMessageToIOSDevice({'deviceid':deviceID, 'operation': "APPLIST", 'data': "null"});

        var mdmPolicy = getPolicyPayLoad(deviceID,1);
        if(mdmPolicy != undefined && mdmPolicy != null){
            if(mdmPolicy.payLoad != undefined && mdmPolicy.payLoad != null){
                sendMessageToIOSDevice({'deviceid':deviceID, 'operation': "POLICY", 'data': mdmPolicy.payLoad, 'policyid':mdmPolicy.policyid, 'policypriority': mdmPolicy.policypriority});
            }
        }

    }

    function sendMessageToIOSDevice(ctx){
        log.debug("CTX >>>>>"+stringify(ctx));
        var deviceID = ctx.deviceid;
        var tenantID = common.getTenantIDFromDevice(deviceID);
        var message = stringify(ctx.data);

        // Filter the policy depending on Device
        if (ctx.operation == 'MONITORING') {
            var filterMessage = policyFiltering({'deviceid': ctx.deviceid, 'operation':ctx.operation, 'data': ctx.data.policies});
            if (filterMessage != null) {
                ctx.data.policies = filterMessage;
                message = stringify(ctx.data);
                log.debug("MONITORING Message >>>>> " + message);
            }
        } else if (ctx.operation == "POLICY") {
            var filterMessage = policyFiltering({'deviceid': ctx.deviceid, 'operation':ctx.operation, 'data': ctx.data});
            if (filterMessage != null) {
                log.debug("POLICY Message >>>>> " + stringify(filterMessage));
                message = stringify(filterMessage);

                // Revoke policy and save to device_policy
                saveDevicePolicy(ctx);
            }
        }

        var devices = driver.query(sqlscripts.devices.select8, ctx.deviceid);

        if(devices == null || devices == undefined || devices[0] == null || devices[0] == undefined) {
            return;
        }

        // Fixed error log which is created when device is removed while
		// monitoring is happening. Log used to show empty JSON string
        if (devices[0].reg_id == null || devices[0].reg_id == undefined) {
            return;
        } else if (devices[0].reg_id.trim().length == 0) {
            return;
        }

        var regId = devices[0].reg_id;
        var regIdJsonObj = parse(regId);

        if(ctx.operation=="CLEARPASSWORD"){
            var unlockToken = regIdJsonObj.unlockToken;
            message = {};
            message.unlock_token = unlockToken;
            message = stringify(message);
            log.debug("Messagee"+message);
        }

        var pushMagicToken = regIdJsonObj.magicToken;
        var deviceToken = regIdJsonObj.token;

        log.debug("iOS Device ID: "+ ctx.deviceid);
        log.debug("iOS Device Token : "+ deviceToken);
        log.debug("iOS Magic Token : "+ pushMagicToken);

        var users = driver.query(sqlscripts.devices.select9, ctx.deviceid);
        var userId = users[0].user_id;
        var datetime;
        if (ctx.newdatetime != null){
            datetime = ctx.newdatetime;
        } else {
            datetime =  common.getCurrentDateTime();
        }

        var features = driver.query(sqlscripts.features.select2, ctx.operation);

        if(features == null || features == undefined || features[0] == null || features[0] == undefined) {
            return false;
        }

        var featureCode = features[0].code;
        var featureDescription = features[0].description;
        if(featureCode == "501P"){
            try{
                driver.query(sqlscripts.notifications.delete1, ctx.deviceid,featureCode);
            }catch (e){
                log.debug(e);
            }
        } else if(ctx.operation == "NOTIFICATION") { 
        	
            var deviceResults = driver.query(sqlscripts.devices.select39, ctx.deviceid);
            
            if(deviceResults != null &&  deviceResults[0] != null) {
            	
            	var pushToken = deviceResults[0].push_token;
            	var messageObj = parse(message);
            	sendIOSPushNotifications(pushToken, messageObj.notification);
            }
            
            return;
            
        } else if(ctx.operation == "MUTE") { 
        	
            var deviceResults = driver.query(sqlscripts.devices.select39, ctx.deviceid);
            
            if(deviceResults != null &&  deviceResults[0] != null) {
            	
            	var pushToken = deviceResults[0].push_token;
            	sendIOSPushNotifications(pushToken, "Device Muted");
            }
            
            return;
            
        }

        // Check if the feature code is a monitoring and status is "A" or "P"
        var notifyExists = driver.query(sqlscripts.notifications.select1, ctx.deviceid, featureCode);

        var tenantID = common.getTenantIDFromDevice(ctx.deviceid);

        log.debug("notifyExists >>>>> " + stringify(notifyExists[0]));
        if (notifyExists[0].count == 0) {
            log.debug("Notification inserted!");
            driver.query(sqlscripts.notifications.insert2, ctx.deviceid, message, datetime, featureCode, userId, featureDescription, tenantID);
        }

        var sendToAPNS = null;
        var lastApnsTime = driver.query(sqlscripts.device_awake.select1, ctx.deviceid);
        log.debug("lastApnsTime >> " + stringify(lastApnsTime[0]));
        if (lastApnsTime != null && lastApnsTime[0] != null && lastApnsTime != undefined && lastApnsTime[0] != undefined) {
            // 1 hr = 60 * 60 = 3600 seconds
            if (lastApnsTime[0].seconds != null && lastApnsTime[0].seconds != undefined) {
                if (lastApnsTime[0].seconds >= 1) {
                    sendToAPNS = "UPDATE";
                }
            }else {
                sendToAPNS = "INSERT";
            }
        } else {
            sendToAPNS = "INSERT";
        }

        if (sendToAPNS != null) {
            try {
                log.debug("Message send to iOS APNS");
                initAPNS(deviceToken, pushMagicToken);
            } catch (e) {
                driver.query(sqlscripts.device_awake.update1, datetime, ctx.deviceid);
                log.error(e);
                return;
            }
            if (sendToAPNS == "INSERT") {
                driver.query(sqlscripts.device_awake.insert1, ctx.deviceid, datetime);
            } else if (sendToAPNS == "UPDATE") {
                driver.query(sqlscripts.device_awake.update2, datetime, ctx.deviceid);
            }
        }

        return true;
    }
    
    function initAPNS(deviceToken, magicToken) {
    	
        log.debug("initAPNS >> " + stringify(mdmConfigurations));
        log.debug("Device Token: >> " + deviceToken);
        log.debug("Magic Token: >> " + magicToken);
        
    	if(deviceToken == null || magicToken == null || 
    		deviceToken == undefined || magicToken == undefined) {
    		return;
    	}
    	
    	var tenantId = parseInt(common.getTenantID());
    	var mdmConfigurations = user.getiOSMDMConfigurations(tenantId);
    	
    	if(mdmConfigurations == null) {
    		return;
    	}
    	
    	var password = mdmConfigurations.properties.Password[0];
    	var isProduction = mdmConfigurations.properties.Production[0] == 'true';
        
    	try {
    		var apnsInitiator = new Packages.org.wso2.carbon.emm.ios.apns.service.MDMPushNotificationSender(
    				(mdmConfigurations.inputStream).getStream(), password, isProduction);

    		var userData = new Packages.java.util.ArrayList();
    		var params = new Packages.java.util.HashMap();
    		params.put("devicetoken", deviceToken);
    		params.put("magictoken", magicToken);
    		userData.add(params);

    		apnsInitiator.pushToAPNS(userData);

    	} catch (e) {
    		log.error(e);
    	}
    }
    
    var sendIOSPushNotifications = function(token, message) {
    	
        log.debug("Send IOS Push Notifications");
        log.debug("token: >>>>>> " + token);
        log.debug("message: >>>>>> " + message);
        
    	if(token == null || token == null || 
    			message == undefined || message == undefined) {
    		return;
    	}

    	var tenantId = parseInt(common.getTenantID());
    	var mdmConfigurations = user.getiOSAPNSConfigurations(tenantId);
    	
    	if(mdmConfigurations == null) {
    		return;
    	}
    	
    	var password = mdmConfigurations.properties.Password[0];
    	var isProduction = mdmConfigurations.properties.Production[0] == 'true';

    	try {
    		var apnsInitiator = new Packages.org.wso2.carbon.emm.ios.apns.service.PushNotificationSender(
    				(mdmConfigurations.inputStream).getStream(), password, isProduction);
    		apnsInitiator.pushToAPNS(token, message);

    	} catch (e) {
    		log.error(e);
    	}
    }

    function policyFiltering(ctx) {
        // This function is used to filter policy based on the platform
        var tenantID = common.getTenantID();
        log.debug("Policy Filter based on Device type");

        var device_id = String(ctx.deviceid);
        var deviceFeature;
        var messageArray
        var i = 0;

        // Filter and remove Policies which are not valid for platform
        messageArray = parse(stringify(ctx.data));
        while (i < messageArray.length) {

            if(messageArray[i].code == "509A" || messageArray[i].code == "528B") {

                var appInstallInfo = messageArray[i].data;
                // log.debug("appInstallInfo >>>>>>> " + appInstallInfo);
                var platforms = driver.query(sqlscripts.platforms.select4, device_id, appInstallInfo.os);
                if(platforms[0].count == 0) {
                    // This app is not compatible with this device
                    messageArray.splice(i,1);
                } else {
                    ++i;
                }
            } else {
                deviceFeature = driver.query(sqlscripts.platformfeatures.select2, device_id, messageArray[i].code);

                // log.debug("Device Feature: " + deviceFeature[0].count);
                if (deviceFeature[0].count == 0) {
                    // feature not available for the platform
                    messageArray.splice(i,1);
                } else {
                    ++i;
                }
            }
        }
        log.debug("Number of Policy codes: " + messageArray.length);
        return messageArray;
    }

    // prototype
    module.prototype = {
        constructor: module,
        <!-- common functions -->
        getAppForDevice: function() {

            var userAgent= request.getHeader("User-Agent");

            if (userAgent.indexOf("Android") > 0) {
                return (configFile.device.android_location);
            } else if (userAgent.indexOf("iPhone") > 0) {
                 return("itms-services://?action=download-manifest&url=itms-services://?action=download-manifest&url=" + configFile.HTTPS_URL + "/emm/api/devices/ios/download");
            } else if (userAgent.indexOf("iPad") > 0){
                 return("itms-services://?action=download-manifest&url=itms-services://?action=download-manifest&url=" + configFile.HTTPS_URL + "/emm/api/devices/ios/download");
            } else if (userAgent.indexOf("iPod") > 0){
                 return("itms-services://?action=download-manifest&url=itms-services://?action=download-manifest&url=" + configFile.HTTPS_URL + "/emm/api/devices/ios/download");
            }
        },

        validateDevice: function() {

            // Allow Android version 4.0.3 and above
            // Allow iOS (iPhone and iPad) version 5.0 and above
            var userOS; // will either be iOS, Android or unknown
            var userOSversion;  // will be a string, use Number(userOSversion)
								// to convert
            var useragent = arguments[0];
            var uaindex;

            log.debug("UserAgent: " + useragent);

            // determine the OS
            if(useragent.match(/iPad/i) || useragent.match(/iPhone/i)) {
                userOS = 'iOS';
                uaindex = useragent.indexOf('OS ');
            } else if (useragent.match(/Tablet/i)) {
                return true;
            } else if (useragent.match(/Android/i)) {
                userOS = 'Android';
                uaindex = useragent.indexOf('Android ');
            } else {
                userOS = 'unknown';
            }

            // determine version
            if (userOS == 'iOS' && uaindex > -1) {
                userOSversion = useragent.substr(uaindex + 3, 3).replace('_', '.');
            } else if (userOS == 'Android' && uaindex > -1) {
                userOSversion = useragent.substr(uaindex + 8, 3);
            } else {
                userOSversion = 'unknown';
            }

            if (userOS == 'Android' && userOSversion.substr(0, 4) == '4.0.') {
                if(Number(userOSversion.charAt(4)) >= 3 ) {
                    // Allow device
                    return true;
                }else {
                    // Android version not allowed
                    return false;
                }
            } else if (userOS == 'Android' && Number(userOSversion.substr(0,3)) >= 4.1) {
                // Allow device
                return true;
            } else if(userOS == 'iOS' && Number(userOSversion.charAt(0)) >= 5) {
                // Allow device
                return true;
            } else {
                return false;
            }
        },


        getLicenseAgreement: function(ctx){
            return user.getLicenseByDomain(ctx.domain);
        },
        sendToDevice: function(ctx){
        	var tenantID = common.getTenantID();
            log.debug("MSG Format :"+stringify(ctx.data));
            log.debug("Device ID: " + ctx.deviceid);
            log.debug("Operation: " + ctx.operation);

            var devices = driver.query(sqlscripts.devices.select11, ctx.deviceid);

            if(devices == null || devices == undefined || 
            		devices[0] == null || devices[0] == undefined) {
            	return;
            }
            
            var platformID = devices[0].platform_id;
            if(platformID==1){
                return sendMessageToAndroidDevice(ctx);
            }else{
                return sendMessageToIOSDevice(ctx);
            }
        },
        sendToDevices:function(ctx){
            log.debug(ctx);
            var devices =  ctx.devices;

            for(var i=0;i<devices.length;i++){
                if(devices[i].deviceid != null && devices[i].deviceid != undefined) {
                    //MAM
                    this.sendToDevice({'deviceid':devices[i].deviceid,'operation':ctx.operation,'data':devices[i]});
                } else {
                    this.sendToDevice({'deviceid':devices[i],'operation':ctx.operation,'data':ctx.params.data});
                }

            }
        },
        getFeaturesFromDevice: function(ctx){

            //Fixed issue - Must be refactored

            var roles = ctx.roles;
            for(var i = 0; i<roles.length; i++) {
                if(roles[i].indexOf("Internal")!==-1) {
                    roles.splice(i,1);
                }
            }
            var deviceId =  ctx.deviceid;
//            if(role=="user"){
//                 //role = group.getEffectiveRoleFromDeviceID(deviceId);
//            }
//            if(role.indexOf("Internal")!==-1){
//                role = role.substring(9);
//            }
            var tenantID = common.getTenantID();
            var featureList = driver.query(sqlscripts.devices.select12, deviceId);
            var obj = new Array();
            for(var i=0; i<featureList.length; i++){
                var featureArr = {};
                var ftype = driver.query(sqlscripts.featuretype.select1, featureList[i].id);

                featureArr["name"] = featureList[i].name;
                featureArr["feature_code"] = featureList[i].code;
                featureArr["feature_type"] = ftype[0].name;
                featureArr["description"] = featureList[i].description;
                featureArr["enable"] = checkPermission(roles, featureList[i].name);
                // featureArr["enable"] = true;
                if(featureList[i].template === null || featureList[i].template === ""){

                }else{
                    featureArr["template"] = featureList[i].template;
                }
                obj.push(featureArr);
            }
            return obj;
        },
        sendMsgToUserDevices: function(ctx){
        	var tenantID = common.getTenantID();
            var device_list = driver.query(sqlscripts.devices.select13, ctx.userid, tenantID);
            var succeeded="";
            var failed="";
            for(var i=0; i<device_list.length; i++){
                var status = this.sendToDevice({'deviceid':device_list[i].id, 'operation': ctx.operation, 'data' : ctx.data});
                if(status == true){
                    succeeded += device_list[i].id+",";
                }else{
                    failed += device_list[i].id+",";
                }
            }
            return "Succeeded : "+succeeded+", Failed : "+failed;
        },
        sendMsgToGroupDevices :function(ctx){
            var succeeded="";
            var failed="";
			var tenantID = common.getTenantID();
            var userList = group.getUsersOfGroup();

            for(var i = 0; i < userList.length; i++) {

                var objUser = {};
                var result = driver.query(sqlscripts.devices.select14, String(userList[i].email), tenantID);

                for(var j = 0; j < result.length; j++) {

                    var status = this.sendToDevice({'deviceid':result[i].id, 'operation': ctx.operation, 'data' : ctx.data});
                    if(status == true){
                        succeeded += result[i].id+",";
                    }else{
                        failed += result[i].id+",";
                    }
                }
            }
            if(succeeded != "" && failed != ""){
                return "Succeeded : "+succeeded+", Failed : "+failed;
            }else{
                return "Succeeded : "+succeeded;
            }
        },
        monitoring:function(ctx){
            application.put("that",this);
            try{
                setInterval((application.get("that")).monitor({}),100000);
            }catch (e){
                log.debug("Error In Monitoring");
            }

        },
        monitor:function(ctx){
            log.debug("Monitor");
            db = common.getDatabase();
            var result = driver.query(sqlscripts.devices.select44);
            for(var i=0; i<result.length; i++){
                var deviceId = result[i].id;
                var operation = 'MONITORING';
                this.sendToDevice({'deviceid':deviceId,'operation':'INFO','data':{}});
                this.sendToDevice({'deviceid':deviceId,'operation':'APPLIST','data':{}});
                var mdmPolicy = getPolicyMonitoringPayLoad(deviceId,1);

                if(mdmPolicy != undefined && mdmPolicy != null){
                    if(mdmPolicy.payLoad != undefined && mdmPolicy.payLoad != null && mdmPolicy.type != undefined && mdmPolicy.type != null){
                        var obj = {};
                        obj.type = mdmPolicy.type;
                        obj.policies = mdmPolicy.payLoad;
                        this.sendToDevice({'deviceid':deviceId,'operation':operation,'data':obj});
                    }
                }
            }
        },
        changeDeviceState:function(deviceId,state){
        	var tenantID = common.getTenantID();
            driver.query(sqlscripts.devices.update1, state, deviceId);
        },
        saveDevicePolicy: saveDevicePolicy,
        removeDevicePolicy: removeDevicePolicy,
        separateMAMPolicy: separateMAMPolicy,

        <!-- android specific functions -->
        getSenderId: function(ctx){
            var message = {};

            var options = {};
            options.domain = ctx.domain.trim();
            var tenantId = carbon.server.tenantId(options);
            if (tenantId == null){
                tenantId = "-1234";
            }
            var androidGCMKeys = user.getAndroidGCMKeys(parseInt(tenantId));
            if(androidGCMKeys != null) {
                message.notifier = androidGCMKeys.AndroidMonitorType[0];
                message.notifierInterval = androidGCMKeys.AndroidNotifierFreq[0];
                message.sender_id = androidGCMKeys.SenderIds[0];
            } else {
                message.notifier = configFile.DEFAULT.ANDROID.NOTIFIER;
                message.sender_id = "";
                message.notifierInterval = configFile.DEFAULT.ANDROID.NOTIFIER_INTERVAL;
            }
            return message;
        },

        isRegistered: function(ctx){
            if(ctx.regid != undefined && ctx.regid != null && ctx.regid != ''){
                var result = driver.query(sqlscripts.devices.select17, ctx.regid);
                var state = (result != null && result != undefined && result[0] != null && result[0] != undefined);
                return state;
            }else if(ctx.udid != undefined && ctx.udid != null && ctx.udid != ''){
                var result = driver.query(sqlscripts.devices.select18, ctx.udid);
                var state = (result != null && result != undefined && result[0] != null && result[0] != undefined);
                return state;
            }
        },
        registerAndroid: function(ctx){
            var log = new Log();
            var tenantUser = carbon.server.tenantUser(ctx.username);
            var userId = tenantUser.username;
            var tenantId = tenantUser.tenantId;
            var platforms = driver.query(sqlscripts.platforms.select1, ctx.platform);
            var platformId = platforms[0].id;

            var createdDate =  common.getCurrentDateTime();

            if(ctx.regid!=null){
                var result = driver.query(sqlscripts.devices.select19, ctx.regid);
                /*
				 * Check if device is registered
				 */
                if(result[0]==null){
                    var roleList = user.getUserRoles({'username':userId});
                    var removeRoles = new Array("Internal/everyone", "portal", "wso2.anonymous.role", "reviewer","private_kasun:wso2mobile.com");
                    var roles = common.removeNecessaryElements(roleList,removeRoles);
                    var role = roles[0];
                    var byod = 0;
                    if(ctx.type == 'BYOD') {
                        //Type = BYOD
                        byod = 1;
                    } else {
                        //Type = COPE
                        byod = 0;
                    }
                    driver.query(sqlscripts.devices.insert1, tenantId, ctx.osversion, createdDate, ctx.properties, ctx.regid, byod, userId, platformId, ctx.vendor, ctx.mac);
                    var devices = driver.query(sqlscripts.devices.select19, ctx.regid);
                    var deviceID = devices[0].id;
                    log.debug("Android Device has been registered "+ctx.regid);
                    sendMessageToAndroidDevice({'deviceid':deviceID, 'operation': "INFO", 'data': "null"});
                    sendMessageToAndroidDevice({'deviceid':deviceID, 'operation': "APPLIST", 'data': "null"});

                    var mdmPolicy = getPolicyPayLoad(deviceID,1);
                    log.debug("PayLoad >>> " + mdmPolicy);
                    if(mdmPolicy != undefined && mdmPolicy != null){
                        if(mdmPolicy.payLoad != undefined && mdmPolicy.payLoad != null){
                            sendMessageToAndroidDevice({'deviceid':deviceID, 'operation': "POLICY", 'data': mdmPolicy.payLoad, 'policyid':mdmPolicy.policyid, 'policypriority': mdmPolicy.policypriority});
                        }
                    }
                    return true;
                }else{
                    driver.query(sqlscripts.devices.update2, ctx.regid, tenantId);
                    return true;
                }
            }else{

            }
        },
        unRegisterAndroid:function(ctx){
            if(ctx.regid!=null){
                var devices = driver.query(sqlscripts.devices.select41, ctx.regid);
                if(devices != undefined && devices != null && devices[0] != undefined && devices[0] != null) {
                    var result = driver.query(sqlscripts.devices.delete1, ctx.regid);
                    if(result == 1){
                        driver.query(sqlscripts.device_policy.update2, devices[0].id);
                        return true;
                    }else{
                        return false
                    }
                } else {
                    return false;
                }
            }else{
                return false;
            }
        },

        /*
         Authenticate the user and send the OAuth Client ID and Secret
         */
        getOAuthClientKey: function(ctx) {
            var objUser = user.authenticate(ctx);
            if(objUser != null) {
                var oauthClientKey = user.getOAuthClientKey(parseInt(objUser["tenantId"]));
                if (oauthClientKey != null) {
                    if(oauthClientKey.ClientKey[0].trim() == "" || oauthClientKey.ClientSecret[0].trim() == "") {
                        return null;
                    } else {
                        var oauthData = {};
                        oauthData.clientkey = oauthClientKey.ClientKey[0].trim();
                        oauthData.clientsecret = oauthClientKey.ClientSecret[0].trim();
                        return oauthData;
                    }
                } else {
                    return null;
                }
            } else {
                return false;
            }
        },
        
        <!-- iOS specific functions -->
        registerIOS: function(ctx){
            var tenantUser = carbon.server.tenantUser(ctx.auth_token);
            var userId = tenantUser.username;
            var tenantId = tenantUser.tenantId;

            var platforms = driver.query(sqlscripts.platforms.select1, ctx.platform);
            var platformId = platforms[0].id;
            var createdDate = common.getCurrentDateTime();
            var devicesCheckUDID = driver.query(sqlscripts.device_pending.select1, ctx.auth_token);

            // Save device data into temporary table
            if(devicesCheckUDID != undefined && devicesCheckUDID != null && devicesCheckUDID[0] != undefined && devicesCheckUDID[0] != null){

                driver.query(sqlscripts.device_pending.update1, tenantId, userId, platformId, stringify(ctx.properties), createdDate, ctx.vendor, ctx.udid, ctx.auth_token);
            } else {

                driver.query(sqlscripts.device_pending.insert1, tenantId, userId, platformId, stringify(ctx.properties), createdDate, ctx.vendor, ctx.udid, ctx.auth_token);
            }

            return true;
        },
        getPendingOperationsFromDevice: function(ctx){
            var deviceList = driver.query(sqlscripts.devices.select20, parse(ctx.udid));
            if(deviceList[0]!=null) {
                var deviceID = String(deviceList[0].id);

                log.debug("deviceID >>>>> " + deviceID);
                log.debug("Device List >>>> " + stringify(deviceList));

                var pendingFeatureCodeList=driver.query(sqlscripts.notifications.select3, deviceID);

                log.debug("Pending >>>> " + stringify(pendingFeatureCodeList));

                if(pendingFeatureCodeList!=undefined && pendingFeatureCodeList != null && pendingFeatureCodeList[0]!= undefined && pendingFeatureCodeList[0]!= null){
                    var id = pendingFeatureCodeList[0].id;
                    var feature_code = pendingFeatureCodeList[0].feature_code;

                    if(feature_code == "500P" || feature_code == "502P") {

                        var message = parse(pendingFeatureCodeList[0].message);

                            log.debug("message >>>>> " + stringify(message));

                        var received_data = pendingFeatureCodeList[0].received_data;

                        if(received_data == null || received_data == '') {

                            var arrEmptyReceivedData = new Array();

                            for(var i = 0; i < message.length; i++) {
                                var receivedObject = {};
                                receivedObject.status = "pending";
                                receivedObject.counter = "0";
                                receivedObject.message = message[i];
                                arrEmptyReceivedData.push(receivedObject);
                            }

                            driver.query(sqlscripts.notifications.update2, stringify(arrEmptyReceivedData), id);
                            received_data = parse(stringify(arrEmptyReceivedData));

                            log.debug("received message >>>>> " +stringify(received_data));
                        } else {
                            received_data = parse(received_data);
                        }

                        for(var i = 0; i < received_data.length; i++) {

                            var counter = parseInt(received_data[i].counter);

                            if(received_data[i].status == "pending") {

                                var objResponse = {};
                                objResponse.feature_code = received_data[i].message.code + "";
                                objResponse.message = stringify(received_data[i].message.data);
                                objResponse.id = id + "-" + i;

                                received_data[i].counter = ++counter + "";

                                if(counter > 3) {
                                    received_data[i].status = "skipped";
                                }

                                driver.query(sqlscripts.notifications.update2, stringify(received_data), id);

                                if(counter > 3) {
                                    continue;
                                }

                                return parse(stringify(objResponse));
                            }
                        }

                    } else {

                        driver.query(sqlscripts.notifications.update3, id);

                    }

                    return pendingFeatureCodeList[0];
                }else{
                    return null;
                }
            }else{
                return null;
            }
        },
        updateiOSTokens: function(ctx){

            var result = driver.query(sqlscripts.device_pending.select2, ctx.deviceid);
            var updateResult;

            var tokenProperties = {};
            tokenProperties["token"] = ctx.token;
            tokenProperties["unlockToken"] = ctx.unlockToken;
            tokenProperties["magicToken"] = ctx.magicToken;

            if(result != null && result != undefined && result[0] != null && result[0] != undefined) {

                var properties = parse(result[0].properties);
                var platform = "" + properties["product"];
                if (platform.toLowerCase().indexOf("ipad") != -1) {
                    platform = "iPad";
                } else if (platform.toLowerCase().indexOf("ipod") != -1) {
                    platform = "iPod";
                } else {
                    platform = "iPhone";
                }
                properties["model"] = platform;

                var userResultExist = driver.query(sqlscripts.devices.select21, ctx.deviceid);
                if(userResultExist != null && userResultExist != undefined && userResultExist[0] != null && userResultExist[0] != undefined) {
                	
                	var devicePendingResult = driver.query(sqlscripts.device_pending.select3, ctx.deviceid);
	                   
	                if(devicePendingResult != null && devicePendingResult != undefined && devicePendingResult[0] != null && devicePendingResult[0] != undefined) {
	                	devicePendingResult = devicePendingResult[0];

                        updateResult = driver.query(sqlscripts.devices.update3, devicePendingResult.tenant_id, devicePendingResult.user_id, devicePendingResult.platform_id, stringify(tokenProperties), stringify(properties), devicePendingResult.status,
                            devicePendingResult.byod, devicePendingResult.vendor, devicePendingResult.udid, ctx.deviceid);

                        var getDevice = driver.query(sqlscripts.devices.select20, ctx.deviceid);
                        if (getDevice != null && getDevice != undefined && getDevice[0] != null && getDevice != undefined) {
                            // Update from notifications, device_awake for this
							// device id
                            driver.query(sqlscripts.device_awake.update5, getDevice[0].id);
                            driver.query(sqlscripts.notifications.update7, getDevice[0].id);

                        }

	                }
	                
	                driver.query(sqlscripts.device_pending.update2, devicePendingResult.user_id);

                } else {
                	// Copy record from temporary table into device table and
					// delete the record from the temporary table
                    updateResult = driver.query(sqlscripts.devices.insert2, stringify(tokenProperties), stringify(properties), ctx.deviceid);
	                driver.query(sqlscripts.device_pending.update3, ctx.deviceid);
                }
                if(updateResult != null && updateResult != undefined && updateResult == 1) {

                    setTimeout(function(){invokeInitialFunctions(ctx)}, 2000);
// var devices = driver.query(sqlscripts.devices.select7 ,ctx.deviceid);
// var deviceID = devices[0].id;
// sendMessageToIOSDevice({'deviceid':deviceID, 'operation': "INFO", 'data':
// "hi"});

                    return true;
                }

            } else {

                result = driver.query(sqlscripts.devices.select7, ctx.deviceid);
                if(result != null && result != undefined && result[0] != null && result[0] != undefined) {

                    var properties = parse(result[0].properties);
                    var platform = "" + properties["product"];
                    if (platform.toLowerCase().indexOf("ipad") != -1) {
                        platform = "iPad";
                    } else if (platform.toLowerCase().indexOf("ipod") != -1) {
                        platform = "iPod";
                    } else {
                        platform = "iPhone";
                    }
                    properties["model"] = platform;

                    updateResult = driver.query(sqlscripts.devices.update8, stringify(properties), stringify(tokenProperties), ctx.deviceid);

                    if(updateResult != null && updateResult != undefined && updateResult == 1) {
                        var getDevice = driver.query(sqlscripts.devices.select20, ctx.deviceid);
                        if (getDevice != null && getDevice != undefined && getDevice[0] != null && getDevice != undefined) {
                            // Update from notifications, device_awake for this
							// device id
                            driver.query(sqlscripts.device_awake.update5, getDevice[0].id);
                        }
                        setTimeout(function(){invokeInitialFunctions(ctx)}, 2000);
                        return true;
                    }
                }
            }

            return false;
        },
        sendMessageToIOSDevice: sendMessageToIOSDevice,
        unRegisterIOS:function(ctx){

            // sendMessageToIOSDevice({'deviceid':ctx.udid, 'operation':
			// "ENTERPRISEWIPE", 'data': ""});

            if(ctx.udid != null){
                var devices = driver.query(sqlscripts.devices.select20, ctx.udid);
                if(devices != undefined && devices != null && devices[0] != undefined && devices[0] != null) {
                    driver.query(sqlscripts.device_awake.update5, devices[0].id);
                    var result = driver.query(sqlscripts.devices.delete3, devices[0].id);
                    if(result == 1){
                        driver.query(sqlscripts.device_policy.update2, devices[0].id);
                        return true;
                    }else{
                        return false
                    }
                } else {
                    return false;
                }
            }else{
                return false;
            }
        },
        invokeMessageToIOSDevice:function(ctx) {
        	sendMessageToIOSDevice(ctx);
        },
        updateDeviceProperties:function(deviceId, osVersion, deviceName, wifiMac) {

            var deviceResult = driver.query(sqlscripts.devices.select22, deviceId);

            var properties = deviceResult[0].properties;
        	properties = parse(parse(stringify(properties)));
        	properties["device"] = deviceName;

            driver.query(sqlscripts.devices.update4, osVersion, stringify(properties), wifiMac, deviceId + "");
        },
        getCurrentDeviceState:function(deviceId){
            var result = driver.query(sqlscripts.devices.select16, deviceId);
            if(result != undefined && result != null && result[0] != undefined && result[0] != null){
                return result[0].status;
            }else{
                return null;
            }
        },
        saveiOSPushToken:function(ctx){
	        // Save the Push Token to the respective device using UDID
	        if (ctx.pushToken != null || ctx.pushToken != undefined) {
	            
	            var result = driver.query(sqlscripts.devices.select23, ctx.udid);
	            if (result[0].count > 0) {
	                driver.query(sqlscripts.devices.update5, ctx.pushToken, ctx.udid);
	            } else {
	                return null;
	            }
	            return "SUCCESS";
	        }
	        return null;
	    },
	    updateLocation: function(ctx){
	    	
	        var result = driver.query(sqlscripts.devices.select38, ctx.udid);
	        
	        if(result != null && result != undefined && result[0] != null && result[0] != undefined) {
	
	            var properties = parse(result[0].properties);
	           
	            properties["latitude"] = ctx.latitude;
	            properties["longitude"] = ctx.longitude;
	            
	            driver.query(sqlscripts.devices.update7, properties, ctx.udid);
	
	        }
	
	        return false;
	    },
	    getWIFIMac: function(ctx){
	    	
	        var result = driver.query(sqlscripts.devices.select48, ctx.udid);
        	var resultObj = {};
        	resultObj.wifi_mac = null;
        	
	        if(result != null && result != undefined && result[0] != null && result[0] != undefined) {
	        	resultObj.wifi_mac = result[0].mac;
	        	return resultObj;
	        }
	        
	        return resultObj;
	    }
    };

    return module;
})();


