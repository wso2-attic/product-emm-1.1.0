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

describe('User Module',function(){
    describe('Password Generator - User Module', function () {

        var user_module = require('/modules/user.js').user;
        var user, db;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test password is null', function () {
            try {
                initModule();
                var password = user.generatePassword();
                expect(password).not.toBe(null);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test password is empty', function () {
            try {
                initModule();
                var password = user.generatePassword();
                expect(password).not.toBeFalsy();
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });

        it('Test password is undefined', function () {
            try {
                initModule();
                var password = user.generatePassword();
                expect(password).not.toBe(undefined);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('User Add Operation - User Module', function () {
        try {
            db = new Database("WSO2_EMM_DB");
        } catch (e) {
            log.error(e);
        }
        var user_module = require('/modules/user.js').user;
        var user, db;
        var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": [], "type": ""};
        var userRole;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test addUser user', function () {
            try {
                initModule();
                ctx.username = "user@test.com";
                ctx.userid = "user@test.com";
                userRole = "subscriber";
                ctx.type = "user";
                ctx.groups.push(userRole);
                var userOp = user.addUser(ctx);
                expect(userOp.status).toEqual("SUCCESSFULL");
            } catch (e) {
                log.error(e);
            } finally {
                user.deleteUser(ctx);
                closeDB();
            }
        });

        it('Test addUser with partial data', function () {
            try {
                initModule();
                var userOp = user.addUser({"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789"});
                expect(userOp.status).toEqual("BAD_REQUEST");
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Get All User Names Operation - User Module', function () {
        try {
            db = new Database("WSO2_EMM_DB");
        } catch (e) {
            log.error(e);
        }
        var user_module = require('/modules/user.js').user;
        var user, db;
        var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": [], "type": ""};
        var userRole;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        function isElementExists(element, array) {
            var status = false;
            for (var i = 0; i < array.length; i++) {
                if (element == array[i]) {
                    status = true;
                    break;
                }
            }
            return status;
        }

        it('Test getAllUserNames', function () {
            try {
                initModule();
                ctx.type = "user";
                ctx.username = "user@test.com";
                ctx.userid = "user@test.com";
                userRole = "subscriber";
                ctx.groups.push(userRole);
                user.addUser(ctx);
                var userList = user.getAllUserNames();
                expect(isElementExists(ctx.username, userList)).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                user.deleteUser(ctx);
                closeDB();
            }
        });
    });

    describe('Get All User Names By Role Operation - User Module', function () {
        try {
            db = new Database("WSO2_EMM_DB");
        } catch (e) {
            log.error(e);
        }
        var user_module = require('/modules/user.js').user;
        var user, db;
        var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": [], "type": ""};
        var userRole;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        function isElementExists(element, array) {
            var status = false;
            for (var i = 0; i < array.length; i++) {
                if (element == array[i]) {
                    status = true;
                    break;
                }
            }
            return status;
        }

        it('Test getAllUserNamesByRole', function () {
            try {
                initModule();
                ctx.type = "user";
                ctx.username = "user@test.com";
                ctx.userid = "user@test.com";
                userRole = "subscriber";
                ctx.groups.push(userRole);
                user.addUser(ctx);
                ctx.groupid = userRole;
                var userList = user.getAllUserNamesByRole(ctx);
                expect(isElementExists(ctx.username, userList)).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                user.deleteUser(ctx);
                closeDB();
            }
        });
    });

    describe('User Delete Operation - User Module', function () {
        try {
            db = new Database("WSO2_EMM_DB");
        } catch (e) {
            log.error(e);
        }
        var user_module = require('/modules/user.js').user;
        var user, db;
        var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": [], "type": ""};
        var userRole;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test deleteUser', function () {
            try {
                initModule();
                ctx.username = "user@test.com";
                ctx.userid = "user@test.com";
                userRole = "subscriber";
                ctx.type = "user";
                ctx.groups.push(userRole);
                user.addUser(ctx);
                var opCode = user.deleteUser(ctx);
                expect(opCode).toEqual(200);
            } catch (e) {
                log.error(e);
            } finally {
                closeDB();
            }
        });
    });

    describe('Get users by Type Operation - User Module', function () {
        try {
            db = new Database("WSO2_EMM_DB");
        } catch (e) {
            log.error(e);
        }
        var user_module = require('/modules/user.js').user;
        var user, db;
        var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": [], "type": ""};
        var userRole;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getUsersByType', function () {
            try {
                initModule();
                ctx.type = "user";
                ctx.username = "user@test.com";
                ctx.userid = "user@test.com";
                userRole = "subscriber";
                ctx.groups.push(userRole);
                user.addUser(ctx);
                var userList = user.getUsersByType(ctx);
                expect((userList[0].username == ctx.username)).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                user.deleteUser(ctx);
                closeDB();
            }
        });
    });
});
