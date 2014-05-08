
describe('notification module', function() {

    var common = require('/modules/common.js');
    var log = new Log();

    var db = common.getDatabase();
    var sqlscripts = require('/sqlscripts/mysql.js');
    var deviceModule = require('/modules/device.js').device;
    var notificationModule = require('/modules/notification.js').notification;
    var notification = new notificationModule(db);
    var driverModule = require('/modules/driver.js').driver;
    driver = new driverModule(db);

    it('Get Pending operations for Android', function() {

        driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, mac) values ('1',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('2', '-1', 'admin@admin.com', '1', '[{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"WSO2\", \"password\" : \"wso2\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]', 'P', '2014-05-07 18:11:41', '500P', 'Policy Enforcement', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47', '502A', 'Get All Applications', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

        var sendRestCall = {};
        sendRestCall.regId = "APA91bEf";
        try {
            var result = notification.getAndroidOperations(sendRestCall);
            var expectResult = JSON.parse('[{"code" : "501P", "data" : [{"messageId" : "6", "data" : {"type" : 1, "policies" : [{"code" : "507A", "data" : {"SSID" : "Niranjan", "password" : "niranjan"}}, {"code" : "508A", "data" : {"function" : "Disable"}}]}}]}, {"code" : "503A", "data" : [{"messageId" : "5", "data" : null}]}, {"code" : "506A", "data" : [{"messageId" : "4", "data" : {"notification" : "Hello World"}}]}, {"code" : "502A", "data" : [{"messageId" : "3", "data" : "hi"}]}, {"code" : "500P", "data" : [{"messageId" : "2", "data" : [{"code" : "507A", "data" : {"SSID" : "WSO2", "password" : "wso2"}}, {"code" : "508A", "data" : {"function" : "Disable"}}]}]}, {"code" : "500A", "data" : [{"messageId" : "1", "data" : "hi"}]}]');
            expect(result).toEqual(expectResult);
        } catch (e) {
            log.info(e);
        } finally {
            driver.query("delete from devices");
            driver.query("delete from notifications");
        }
    });

    it('Update operations from Android payload', function() {

        driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, mac) values ('1',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('2', '-1', 'admin@admin.com', '1', '[{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"WSO2\", \"password\" : \"wso2\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]', 'P', '2014-05-07 18:11:41', '500P', 'Policy Enforcement', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47', '502A', 'Get All Applications', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
        driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

        var sendRestCall = JSON.parse('{"regId": "APA91bEf","data":[{"code": "501P","data": [{"messageId": "6","data": [{"status":false,"code":"507A"},{"status":false,"code":"508A"},{"status":true,"code":"notrooted"}]}]},{"code": "503A", "data": [{"messageId": "5", "data": [{"status" : true}]}]},{"code": "506A", "data": [{"messageId": "4", "data": [{"status" : true}]}]},{"code": "502A", "data": [{"messageId": "3", "data": [{"package":"alexcrusher.just6weeks","icon":"","name":"Just 6 Weeks Lite"},{"package":"com.android.chrome","icon":"","name":"Chrome"},{"package":"com.application.zomato","icon":"","name":"Zomato"},{"package":"com.devuni.flashlight","icon":"","name":"  Flashlight"},{"package":"com.facebook.katana","icon":"","name":"Facebook"},{"package":"com.facebook.orca","icon":"","name":"Messenger"},{"package":"com.google.android.apps.docs","icon":"","name":"Drive"},{"package":"com.google.android.keep","icon":"","name":"Keep"},{"package":"com.icenta.sudoku.ui","icon":"","name":"Sudoku Free"},{"package":"com.ideashower.readitlater.pro","icon":"","name":"Pocket"},{"package":"com.igg.castleclash","icon":"","name":"Castle Clash"},{"package":"com.joelapenna.foursquared","icon":"","name":"Foursquare"},{"package":"com.linkedin.android","icon":"","name":"LinkedIn"},{"package":"com.mobilesrepublic.appygeek","icon":"","name":"Appy Geek"},{"package":"com.northpark.pushups","icon":"","name":"Push Ups"},{"package":"com.quizup.core","icon":"","name":"QuizUp"},{"package":"com.sec.android.mimage.photoretouching","icon":"","name":"Photo Editor"},{"package":"com.skype.raider","icon":"","name":"Skype"},{"package":"com.studioirregular.pop","icon":"","name":"POP"},{"package":"com.supercell.clashofclans","icon":"","name":"Clash of Clans"},{"package":"com.swype.android.inputmethod","icon":"","name":"Swype"},{"package":"com.tinyco.realms","icon":"","name":"Tiny Castle"},{"package":"com.viber.voip","icon":"","name":"Viber"},{"package":"com.whatsapp","icon":"","name":"WhatsApp"},{"package":"com.wso2.wso2con.mobile","icon":"","name":"WSO2Con"},{"package":"la.droid.qr","icon":"","name":"QR Droid"},{"package":"org.wso2.emm.agent","icon":"","name":"WSO2 Agent"},{"package":"tm.app.worldClock","icon":"","name":"World Clock"}]}]}, {"code": "500P", "data": [{"messageId": "2", "data": [{"code" : "507A", "data" : {"SSID" : "Niranjan", "password" : "niranjan"}}, {"code" : "508A", "data" : {"function" : "Disable"}}]}]}, {"code": "500A", "data": [{"messageId": "1", "data": {"internal_memory":{"total":1.97,"available":0.27},"location_obj":{"longitude":79.8524052,"latitude":6.9094117},"external_memory":{"total":11,"available":9.33},"operator":["Dialog"],"battery":{"level":64}}}]}]}');
        try {
            var result = notification.getAndroidOperations(sendRestCall);
            expect(result).toBe(null);
        } catch (e) {
            log.info(e);
        } finally {
            driver.query("delete from devices");
            driver.query("delete from notifications");
        }

    });

});