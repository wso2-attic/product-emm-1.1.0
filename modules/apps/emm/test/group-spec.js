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

describe('Group Module',function(){
    describe('Add Group Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test addUserGroup function by adding a group', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            var result = group.addGroup(ctx);
            expect(result.status).toBe("SUCCESSFULL");
            group.deleteGroup({'groupid':role});
            closeDB();
        });

        it('Test addUserGroup function by adding a group which already exists', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var result = group.addGroup(ctx);
            expect(result.status).toBe("ALLREADY_EXIST");
            group.deleteGroup({'groupid':role});
            closeDB();
        });
    });

    describe('Delete Group Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test deleteUserGroup function by deleting a group', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            group.deleteGroup({'groupid':role});
            var result = group.getAllGroups();
            var deleted = true;
            for(var i=0;i<result.length;i++){
                if(result[i]==role){
                    deleted = false;
                }
            }
            expect(deleted).toBe(true);
            closeDB();
        });
    });

    describe('Get All Group Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getAllGroups function by using default roles', function () {
            initModule();
            var result = group.getAllGroups();
            expect(result.length).not.toBe(0);
            closeDB();
        });

        it('Test getAllGroups function by adding a new role', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var result = group.getAllGroups();
            var added = false;
            for(var i=0;i<result.length;i++){
                if(result[i]==role){
                    added = true;
                }
            }
            expect(added).toBe(true);
            group.deleteGroup({'groupid':role});
            closeDB();
        });
    });

    describe('Edit Group Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';
        var updatedRole = 'test_role1';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test editGroup Function by updating a group', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var result = group.editGroup(role,updatedRole);
            expect(result).toBe(updatedRole);
            group.deleteGroup({'groupid':updatedRole});
            closeDB();
        });

        it('Test editGroup function by updating a group which doesnt exist', function () {
            initModule();
            var result = group.editGroup(role,updatedRole);
            expect(result.status).toBe('NOT_EXIST');
            closeDB();
        });
    });

    describe('Update User List of Role Operation - Group Module', function () {
        var db, group,user,ctx;
        var group_module = require('/modules/group.js').group;
        var user_module = require('/modules/user.js').user;
        var role = 'test_role';
        var username =  "user@test.com";
        var userObj = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": ['subscriber'], "type": "user" ,"username": username,"userid":"user@test.com"};

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test updateUserListofRole function by adding a user', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            user.addUser(userObj);
            group.addGroup(ctx);
            ctx= {'groupid':role, 'added_users':["user@test.com"], 'removed_users':[]};
            group.updateUserListOfRole(ctx);
            var userList = group.getUsersOfGroup(ctx);
            var userExists = false ;
            for(var i=0;i<userList.length;i++){
                if(username==userList[i].username){
                    userExists = true;
                    break;
                }
            }
            expect(userExists).toBe(true);
            group.deleteGroup({'groupid':role});
            user.deleteUser(userObj);
            closeDB();
        });

        it('Test updateUserListofRole function by removing a user', function () {
            initModule();
            ctx = {'name':role,'users':["user@test.com"]};
            user.addUser(userObj);
            group.addGroup(ctx);
            ctx= {'groupid':role, 'added_users':[], 'removed_users':["user@test.com"]};
            group.updateUserListOfRole(ctx);
            var userList = group.getUsersOfGroup(ctx);
            var userExists = false ;
            for(var i=0;i<userList.length;i++){
                if(username==userList[i].username){
                    userExists = true;
                    break;
                }
            }
            expect(userExists).toBe(false);
            group.deleteGroup({'groupid':role});
            user.deleteUser(userObj);
            closeDB();
        });
    });

    describe('Role Exists Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test roleExists function', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var result = group.roleExists({'groupid':role});
            expect(result).toBe(true);
            group.deleteGroup({'groupid':role});
            closeDB();
        });

        it('Test roleExists function with non-existing groups', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var result = group.addGroup(ctx);
            expect(result.status).toBe("ALLREADY_EXIST");
            group.deleteGroup({'groupid':role});
            closeDB();
        });
    });

    describe('Get User Roles Operation - Group Module', function () {
        var db, group,user,ctx;
        var group_module = require('/modules/group.js').group;
        var user_module = require('/modules/user.js').user;
        var role = 'test_role';
        var username =  "user@test.com";
        var userObj = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": ['subscriber'], "type": "user" ,"username": username,"userid":"user@test.com"};

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getUserRoles function', function () {
            initModule();
            ctx = {'name':role,'users':[username]};
            user.addUser(userObj);
            group.addGroup(ctx);
            var roleList = group.getUserRoles({'username':username});
            var roleExists = false ;
            for(var i=0;i<roleList.length;i++){
                if(role==roleList[i]){
                    roleExists = true;
                    break;
                }
            }
            expect(roleExists).toBe(true);
            group.deleteGroup({'groupid':role});
            user.deleteUser(userObj);
            closeDB();
        });

        it('Test getUserRoles function with non-existing user', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            user.addUser(userObj);
            group.addGroup(ctx);
            var roleList = group.getUserRoles({'username':username});
            var roleExists = false ;
            for(var i=0;i<roleList.length;i++){
                if(username==roleList[i]){
                    roleExists = true;
                    break;
                }
            }
            expect(roleExists).toBe(false);
            group.deleteGroup({'groupid':role});
            user.deleteUser(userObj);
            closeDB();
        });
    });

    describe('Get Groups By Type Operation - Group Module', function () {
        var db, group,ctx;
        var group_module = require('/modules/group.js').group;
        var role = 'test_role';

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getGroupsByType function', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var roleList = group.getGroupsByType({'type':'user'});
            var roleExists = false ;
            for(var i=0;i<roleList.length;i++){
                if(role==roleList[i].name){
                    roleExists = true;
                    break;
                }
            }
            expect(roleExists).toBe(true);
            group.deleteGroup({'groupid':role});
            closeDB();
        });

        it('Test getGroupsByType function by not having roles of selected type', function () {
            initModule();
            var roleList = group.getGroupsByType({'type':'user'});
            expect(roleList.length).not.toBe(0);
            closeDB();
        });
    });

    describe('Get Users Of Group Operation - Group Module', function () {
        var db, group,user,ctx;
        var group_module = require('/modules/group.js').group;
        var user_module = require('/modules/user.js').user;
        var role = 'test_role';
        var username =  "user@test.com";
        var userObj = {"first_name": "Firstname", "last_name": "Lastname", "mobile_no": "0123456789", "groups": ['subscriber'], "type": "user" ,"username": username,"userid":"user@test.com"};

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                group = new group_module(db);
                user = new user_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getUsersOfGroup function', function () {
            initModule();
            ctx = {'name':role,'users':[username]};
            user.addUser(userObj);
            group.addGroup(ctx);
            var userList = group.getUsersOfGroup({'groupid':role});
            var userExists = false ;
            for(var i=0;i<userList.length;i++){
                if(username==userList[i].username){
                    userExists = true;
                    break;
                }
            }
            expect(userExists).toBe(true);
            group.deleteGroup({'groupid':role});
            user.deleteUser(userObj);
            closeDB();
        });

        it('Test getUsersOfGroup function with 0 users', function () {
            initModule();
            ctx = {'name':role,'users':[]};
            group.addGroup(ctx);
            var userList = group.getUsersOfGroup({'groupid':role});
            expect(userList.length).toBe(0);
            group.deleteGroup({'groupid':role});
            closeDB();
        });
    });
});
