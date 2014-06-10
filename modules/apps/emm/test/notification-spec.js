describe('Notification Module',function(){
    describe('Get Android Operations - Notification Module', function() {

        var log = new Log();
        var notificationModule = require('/modules/notification.js').notification;
        var db, notification, driver;

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                notification = new notificationModule(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getAndroidOperations for Android', function() {

            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('224124124', '-1', 'admin@admin.com', '2', '[{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"WSO2\", \"password\" : \"wso2\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]', 'P', '2014-05-07 18:11:41', '500P', 'Policy Enforcement', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('224124125', '-1', 'admin@admin.com', '2', '\"hi\"', 'P', '2014-05-07 18:12:47', '502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('224124126', '-1', 'admin@admin.com', '2', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('224124127', '-1', 'admin@admin.com', '2', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('224124128', '-1', 'admin@admin.com', '2', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var sendRestCall = {};
                sendRestCall.regId = "APA91bEf";
                var result = notification.getAndroidOperations(sendRestCall);
                var expectResult = JSON.parse('[{"code" : "501P", "data" : [{"messageId" : "6", "data" : {"type" : 1, "policies" : [{"code" : "507A", "data" : {"SSID" : "Niranjan", "password" : "niranjan"}}, {"code" : "508A", "data" : {"function" : "Disable"}}]}}]}, {"code" : "503A", "data" : [{"messageId" : "5", "data" : null}]}, {"code" : "506A", "data" : [{"messageId" : "4", "data" : {"notification" : "Hello World"}}]}, {"code" : "502A", "data" : [{"messageId" : "3", "data" : "hi"}]}, {"code" : "500P", "data" : [{"messageId" : "2", "data" : [{"code" : "507A", "data" : {"SSID" : "WSO2", "password" : "wso2"}}, {"code" : "508A", "data" : {"function" : "Disable"}}]}]}]');
                expect(result).toEqual(expectResult);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                driver.query("delete from notifications");
                tearDown();
            }
        });

        it('Test getAndroidOperations for Android for non-existing device', function() {
            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                var sendRestCall = {};
                sendRestCall.regId = "APA91bEfee";
                var result = notification.getAndroidOperations(sendRestCall);
                expect(result).toEqual(null);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                driver.query("delete from notifications");
                tearDown();
            }
        });
    });

    describe('Add notification operation - Notification Module', function() {
        var log = new Log();
        var notificationModule = require('/modules/notification.js').notification;
        var db, notification, driver;
        var ctx = new Object();

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                notification = new notificationModule(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test addNotification', function() {
            try {
                tearUp();
                ctx.msgID = '1';
                ctx.data = 'Received';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                notification.addNotification(ctx);
                var result = driver.query("select status, received_data from notifications where id='1'");
                expect(result[0].status).toBe('R');
                expect(result[0].received_data).toBe("Received");
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from devices");
                driver.query("delete from notifications");
                tearDown();
            }
        });

        it('Test addNotification on non existing notification', function() {
            try {
                tearUp();
                ctx.msgID = '4';
                ctx.data = 'Received';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                notification.addNotification(ctx);
                var result = driver.query("select status, received_data from notifications where id='4'");
                expect(result.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                driver.query("delete from notifications");
                tearDown();
            }
        });
    });

    describe('Get notification operation - Notification Module', function() {
        var log = new Log();
        var notificationModule = require('/modules/notification.js').notification;
        var db, notification, driver;
        var ctx = new Object();

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                notification = new notificationModule(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getNotifications', function() {
            try {
                tearUp();
                ctx.deviceid = '1';
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47', '502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getNotifications(ctx);
                expect(result.length).toBe(5);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from notifications");
                tearDown();
            }
        });

        it('Test getNotifications on non existing device', function() {
            try {
                tearUp();
                ctx.deviceid = '2';
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47', '502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getNotifications(ctx);
                expect(result.length).toBe(0);
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from notifications");
                tearDown();
            }
        });
    });

    describe('Get last record operation - Notification Module', function() {
        var log = new Log();
        var notificationModule = require('/modules/notification.js').notification;
        var db, notification, driver;
        var ctx = new Object();

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                notification = new notificationModule(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getLastRecord', function() {
            try {
                tearUp();
                ctx.deviceid = '1';
                ctx.operation = '502A';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46','2014-05-07 18:10:46','Data', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data,feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47','2014-05-07 18:10:46','{}','502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getLastRecord(ctx);
                expect(result.id).toBe('3');
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from notifications");
                driver.query("delete from devices");
                tearDown();
            }
        });

        it('Test getLastRecord on non-existing device', function() {
            try {
                tearUp();
                ctx.deviceid = '2';
                ctx.operation = '502A';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46','2014-05-07 18:10:46','Data', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data,feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47','2014-05-07 18:10:46','{}','502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getLastRecord(ctx);
                expect(result.id).toBeUndefined();
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from notifications");
                driver.query("delete from devices");
                tearDown();
            }
        });

        it('Test getLastRecord on non-existing feature', function() {
            try {
                tearUp();
                ctx.deviceid = '1';
                ctx.operation = '501P';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'admin', '1', 'APA91bEf', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46','2014-05-07 18:10:46','Data', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data,feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47','2014-05-07 18:10:46','{}','502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getLastRecord(ctx);
                expect(result.id).toBeUndefined();
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from notifications");
                driver.query("delete from devices");
                tearDown();
            }
        });

        it('Test getLastRecord on ios device', function() {
            try {
                tearUp();
                ctx.deviceid = '1';
                ctx.operation = '500A';
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data, feature_code, feature_description, tenant_id) values ('1', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:10:46','2014-05-07 18:10:46','{}', '500A', 'Device Information', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, received_date, received_data,feature_code, feature_description, tenant_id) values ('3', '-1', 'admin@admin.com', '1', '\"hi\"', 'P', '2014-05-07 18:12:47','2014-05-07 18:10:46','{}','502A', 'Get All Applications', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('4', '-1', 'admin@admin.com', '1', '{\"notification\" : \"Hello World\"}', 'P', '2014-05-07 18:13:35', '506A', 'Message', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('5', '-1', 'admin@admin.com', '1', 'null', 'P', '2014-05-07 18:14:44', '503A', 'Device Lock', '-1234')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('6', '-1', 'admin@admin.com', '1', '{\"type\" : 1, \"policies\" : [{\"code\" : \"507A\", \"data\" : {\"SSID\" : \"Niranjan\", \"password\" : \"niranjan\"}}, {\"code\" : \"508A\", \"data\" : {\"function\" : \"Disable\"}}]}', 'P', '2014-05-07 18:15:08', '501P', 'Policy Monitoring ', '-1234')");

                var result =  notification.getLastRecord(ctx);
                expect(result.id).toBe('1');
            } catch (e) {
                log.info(e);
            } finally {
                driver.query("delete from notifications");
                driver.query("delete from devices");
                tearDown();
            }
        });
    });
});





