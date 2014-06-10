/*
 * *
 *  *  Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *  *
 *  *  Licensed under the Apache License, Version 2.0 (the "License");
 *  *  you may not use this file except in compliance with the License.
 *  *  You may obtain a copy of the License at
 *  *
 *  *        http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  *  distributed under the License is distributed on an "AS IS" BASIS,
 *  *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  *  See the License for the specific language governing permissions and
 *  *  limitations under the License.
 *
 */

describe('Device Module', function () {

    describe('Register Android operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var deviceInfo = {"username": "user", "regid": "1234", "platform": "Android", "osversion": "4.1.3", "type": "BYOD", "properties": {"device": "GS4", "imei": "1212122234", "imsi": "223456776", "model": "S5"}, "vendor": "Samsung", "email": "user@test.com", "wifi_mac": "3c:97:0e:84:43:05"};
        var db, device, driver;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test registerAndroid device', function () {
            try {
                initModule();
                var deviceOp = device.registerAndroid(deviceInfo);
                expect(deviceOp).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("Delete from devices where reg_id = ?",'1234');
                closeDB();
            }
        });
    });

    describe('Device Unregister operations - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var reg_id = 'APA91bEa';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test unRegisterAndroid', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '1', 'APA91bEa', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                var ctx = {"regid": reg_id};
                var deviceOp = device.unRegisterAndroid(ctx);
                expect(deviceOp).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test unRegisterAndroid with device which doesnt exist', function () {
            try {
                initModule();
                var deviceOp = device.unRegisterAndroid({'regid':'APA91bEa'});
                expect(deviceOp).toBe(false);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test unRegisterIOS device', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var ctx = {"udid": reg_id};
                var deviceOp = device.unRegisterIOS(ctx);
                expect(deviceOp).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test unRegisterIOS with device which doesnt exist', function () {
            try {
                initModule();
                var deviceOp = device.unRegisterIOS({'udid':'APA91bEa'});
                expect(deviceOp).toBe(false);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Get license agreement operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getLicenseAgreement is returning not null', function () {
            try {
                initModule();
                var result = device.getLicenseAgreement({});
                expect(result).not.toBe(null);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test getLicenseAgreement is returning a string', function () {
            try {
                initModule();
                var result = device.getLicenseAgreement({});
                expect(result.length).not.toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Register IOS operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var ctx = {"auth_token": "-1234", "username": "user", "udid": "12345", "platform": "iPhone", "osversion": "7.1", "type": "BYOD", "properties": {"device": "iPhone", "imei": "12121222345", "imsi": "223456776", "model": "5c"}, "vendor": "Apple", "email": "user@test.com", "wifi_mac": "4c:97:0e:84:43:05"};
        var db, device;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test registerIOS device', function () {
            try {
                initModule();
                var deviceOp = device.registerIOS(ctx);
                expect(deviceOp).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Update Ios Tokens - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var udid = 'APA91bEa';

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            driver.query("delete from devices where udid = ?",udid);
            db.close();
        }

        var tokens = {"deviceid":"APA91bEa","token" : "test","unlockToken" : "12345","magicToken" :"iPhone"};

        it('Test updateiOSTokens of ios device', function () {
            try {
                tearUp();
                var deviceOp = device.updateiOSTokens(tokens);
                expect(deviceOp).toBe(false);
            } catch (e) {
                log.error(e);
            } finally {
                tearDown();
            }
        });
    });

    describe('Validate device operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db = new Object();
        var device = new device_module(db);

        it('Test validateDevice with ios device', function () {
            var f = device.validateDevice;
            var status = f.apply(f, ["iPad OS 5_1"]);
            expect(status).toBe(true);
        });

        it('Test validateDevice with ios device with unsupported OS', function () {
            var f = device.validateDevice;
            var status = f.apply(f, ["iPad OS 4_1"]);
            expect(status).toBe(false);
        });

        it('Test validateDevice with android device', function () {
            var f = device.validateDevice;
            var status = f.apply(f, ["Android 4.1.3"]);
            expect(status).toBe(true);
        });

        it('Test validateDevice with android device with unsupported OS', function () {
            var f = device.validateDevice;
            var status = f.apply(f, ["Android 4.0.0"]);
            expect(status).toBe(false);
        });
    });

    describe('Get features from device operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device ,driver;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        var ctx = {"username": "user", "deviceid": "2", "role": "user"};

        it('Test getFeaturesFromDevice from ios device', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var features = device.getFeaturesFromDevice(ctx);
                expect(features.length).not.toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                closeDB();
            }
        });

        it('Test getFeaturesFromDevice from android device', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token,wifi_mac) values ('2',  '-1234', 'user', '1', 'APA91bEa', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                var features = device.getFeaturesFromDevice(ctx);
                expect(features.length).not.toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                closeDB();
            }
        });

        it('Test getFeaturesFromDevice from non existing device', function () {
            try {
                initModule();
                var features = device.getFeaturesFromDevice(ctx);
                expect(features.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Get wifimac operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var udid = 'APA91bEa';

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            driver.query("delete from devices where udid = ?",udid);
            db.close();
        }

        var ctx = {"udid": "APA91bEa"};

        it('Test getWIFIMac from ios device', function () {
            try {
                tearUp();
                var result = device.getWIFIMac(ctx);
                expect(result.wifi_mac).toBe('92:1C:52:F3:53:52');
            } catch (e) {
                log.error(e);
            } finally {
                tearDown();
            }
        });

        it('Test getWIFIMac from non existing device', function () {
            try {
                tearUp();
                ctx = {"udid": "APA92bEa"};
                var result = device.getWIFIMac(ctx);
                expect(result.wifi_mac).toBe(null);
            } catch (e) {
                log.error(e);
            } finally {
                tearDown();
            }
        });
    });

    describe('Is registered operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device,driver;
        var udid = 'APA91bEa';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test isregistered for android device', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '1', 'APA91bEa', '4.1.2', '{\"device\":\"GT-I9100G\",\"model\":\"GT-I9100G\",\"imsi\":\"413025000690522\",\"imei\":\"358401042931186\"}', '2014-05-07 18:40:45', 'A', '1', 'samsung', '0', NULL, '92:1C:52:F3:53:52')");
                var ctx = {"regid": udid};
                var status = device.isRegistered(ctx);
                expect(status).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("Delete from devices where reg_id = ?",udid);
                closeDB();
            }
        });

        it('Test isregistered for unregistered android device', function () {
            try {
                initModule();
                var ctx = {"regid": "123456"};
                var status = device.isRegistered(ctx);
                expect(status).toBe(false);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test isregistered for ios device', function () {
            try {
                initModule();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var ctx = {"udid": "APA91bEa"};
                var status = device.isRegistered(ctx);
                expect(status).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("DELETE FROM devices WHERE udid = ?",udid);
                closeDB();
            }
        });

        it('Test isregistered for unregistered ios device', function () {
            try {
                initModule();
                var ctx = {"udid": "APA91bEasff"};
                var status = device.isRegistered(ctx);
                expect(status).toBe(false);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Get sender id operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device;

        function tearUp() {
            try {
                db = new Object();
                device = new device_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        it('Test getSenderid', function () {
            try {
                tearUp();
                var result = device.getSenderId();
                expect(result).not.toBe(null);
            } catch (e) {
                log.error(e);
            }
        });
    });

    describe('Save ios push token operation - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var udid = 'APA91bEa';

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test saveiOSPushToken operation', function () {
            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('2',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var result = device.saveiOSPushToken({'pushToken':'12345','udid':udid});
                expect(result).toBe('SUCCESS');
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices where udid = ?",udid);
                tearDown();
            }
        });

        it('Test saveiOSPushToken on non-existing device', function () {
            try {
                tearUp();
                var result = device.saveiOSPushToken({'pushToken':'12345','udid':udid});
                expect(result).toBe(null);
            } catch (e) {
                log.error(e);
            }finally {
                tearDown();
            }
        });
    });

    describe('Get current device status operations - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var udid = 'APA91bEa';

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getCurrentDeviceState', function () {
            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var dev = driver.query("SELECT id FROM devices WHERE udid = ?", udid);
                if(dev != null && dev != undefined && dev[0] != null && dev[0] != undefined) {
                    var id = parse(dev[0].id);
                    var result = device.getCurrentDeviceState(id);
                    expect(result).toBe('A');
                }
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                tearDown();
            }
        });

        it('Test getCurrentDeviceState on non-existing device', function () {
            try {
                tearUp();
                var result = device.getCurrentDeviceState(parse('1'));
                expect(result).toBe(null);
            } catch (e) {
                log.error(e);
            }finally {
                tearDown();
            }
        });
    });

    describe('Get pending operations - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver;
        var udid = "APA91bEa";
        var ctx = new Object();
        ctx.udid = stringify(udid);

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getPendingOperationsFromDevice', function () {
            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                driver.query("insert into notifications(id, group_id, user_id, device_id, message, status, sent_date, feature_code, feature_description, tenant_id) values ('1', '-1', 'user', '1', 'hi', 'P', '2014-05-07 18:10:46', '500A', 'Device Information', '-1234')");
                var result = device.getPendingOperationsFromDevice(ctx);
                var expectedResult = JSON.parse('{"feature_code" : "500A", "message" : "hi", "id" : "1", "received_data" : null}');
                expect(result).toEqual(expectedResult);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                driver.query("delete from notifications");
                tearDown();
            }
        });

        it('Test getPendingOperationsFromDevice from non-existing device', function () {
            try {
                tearUp();
                var result = device.getPendingOperationsFromDevice(ctx);
                expect(result).toBe(null);
            } catch (e) {
                log.error(e);
            }finally {
                tearDown();
            }
        });
    });

    describe('Update location operations - Device Module', function () {
        var device_module = require('/modules/device.js').device;
        var db, device, driver,properties;
        var udid = 'APA91bEa';

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                device = new device_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test updateLocation', function () {
            try {
                tearUp();
                driver.query("insert into devices(id, tenant_id, user_id, platform_id, reg_id, os_version, properties, created_date, status, byod, vendor, udid, push_token, wifi_mac) values ('1',  '-1234', 'user', '2', '', '7.1', '{\"device\":\"iPhone\",\"model\":\"5c\",\"imsi\":\"413025010690522\",\"imei\":\"358401043931186\"}', '2014-05-07 18:40:45', 'A', '1', 'Apple', 'APA91bEa', NULL, '92:1C:52:F3:53:52')");
                var ctx = new Object();
                ctx.latitude = "1.0";
                ctx.longitude = "1.0";
                ctx.udid = udid;
                device.updateLocation(ctx);
                var dev = driver.query("SELECT properties FROM devices WHERE udid = ?", udid);
                properties = parse(dev[0].properties);
                expect(properties["latitude"]).toBe('1.0');
                expect(properties["longitude"]).toBe('1.0');
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                tearDown();
            }
        });

        it('Test updateLocation on non-existing device', function () {
            try {
                tearUp();
                var ctx = new Object();
                ctx.latitude = "1.0";
                ctx.longitude = "1.0";
                ctx.udid = udid;
                device.updateLocation(ctx);
                var dev = driver.query("SELECT properties FROM devices WHERE udid = ?", udid);
                expect(dev.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from devices");
                tearDown();
            }
        });
    });
});
