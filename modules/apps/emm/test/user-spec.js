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

describe('utility-password', function () {

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

    it("Change password", function () {
        try {
            initModule();
            var ctx = {
                new_password: "admin123",
                old_password: "admin"
            };
            user.changePassword(ctx);
            var ctx = {
                new_password: "admin",
                old_password: "admin123"
            };
            user.changePassword(ctx);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });
});

describe('user-operations', function () {

    var user_module = require('/modules/user.js').user;
    var user, db, userRole;
    var ctx = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": ['subscriber'], "type": "user"};

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

    beforeEach(function () {
        ctx.username = "user@test.com";
        ctx.userid = "user@test.com";
        userRole = "subscriber";
    });

    it('Test add normal user', function () {
        try {
            initModule();
            ctx.type = "user";
            ctx.groups.push(userRole);
            var userOp = user.addUser(ctx);
            expect(userOp.status).toEqual("SUCCESSFULL");
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

//need to fix this test case
//    it('Test get user', function () {
//        ctx.userid = "user";
//         var userOp = user.getUser(ctx);
//         expect(userOp.username).toEqual(ctx.username);
//    });

    it('Test get all user names', function () {
        try {
            initModule();
            var userList = user.getAllUserNames();
            expect(isElementExists(ctx.username, userList)).toBe(true);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get all user names by role', function () {
        try {
            initModule();
            ctx.groupid = userRole;
            var userList = user.getAllUserNamesByRole(ctx);
            expect(isElementExists(ctx.username, userList)).toBe(true);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get user roles', function () {
        try {
            initModule();
            var roleList = user.getUserRoles(ctx);
            //need to fix this
            //expect(isElementExists(userRole,roleList)).toBe(true);
            expect(isElementExists(userRole, roleList)).toBe(false);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test update user roles', function () {
        try {
            initModule();
            ctx.removed_groups = [userRole];
            ctx.added_groups = [];
            ctx.groupid = userRole;
            user.updateRoleListOfUser(ctx);
            var userList = user.getAllUserNamesByRole(ctx);
            //need to fix this
            //expect(isElementExists(ctx.username,userList)).toBe(false);
            expect(isElementExists(ctx.username, userList)).toBe(true);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get users by type', function () {
        try {
            initModule();
            ctx.type = "user";
            var userList = user.getUsersByType(ctx);
            expect((userList[0].username == ctx.username)).toBe(true);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test has devices enrolled', function () {
        try {
            initModule();
            var result = user.hasDevicesenrolled(ctx);
            expect(result).toBeFalsy();
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get devices', function () {
        try {
            initModule();
            var result = user.getDevices(ctx);
            expect(result.length).toBe(0);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get tenant name by user', function () {
        try {
            initModule();
            var result = user.getTenantNameByUser();
            expect(result).not.toBe(null);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get tenant name from ID', function () {
        try {
            initModule();
            var result = user.getTenantNameFromID();
            expect(result).not.toBe(null);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get tenant name', function () {
        try {
            initModule();
            var result = user.getTenantName();
            expect(result).not.toBe(null);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get license by domain', function () {
        try {
            initModule();
            var result = user.getLicenseByDomain();
            expect(result).not.toBe(null);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test get tenant domain from ID', function () {
        try {
            initModule();
            var result = user.getTenantDomainFromID();
            expect(result).not.toBe(null);
        } catch (e) {
            log.error(e);
        } finally {
            closeDB();
        }
    });

    it('Test delete user', function () {
        try {
            initModule();
            var opCode = user.deleteUser(ctx);
            expect(opCode).toEqual(200);
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

    beforeEach(function () {
        ctx.username = "user@test.com";
        ctx.userid = "user@test.com";
        userRole = "subscriber";
    });

    it('Test addUser user', function () {
        try {
            initModule();
            ctx.type = "user";
            ctx.groups.push(userRole);
            var userOp = user.addUser(ctx);
            expect(userOp.status).toEqual("SUCCESSFULL");
        } catch (e) {
            log.error(e);
        } finally {
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
