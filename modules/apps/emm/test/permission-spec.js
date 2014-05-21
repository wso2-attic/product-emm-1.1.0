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

describe('Permission Module',function(){
    describe('Assign permission to group operations - Permission Module', function () {
        var permission_module = require('/modules/permission.js').permission;
        var db, permission, driver;
        var selectedGroup = "subscriber";
        var ctx = new Object();
        ctx.selectedGroup = selectedGroup;
        ctx.featureList = ['500A','501A','502A'];

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                permission = new permission_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test assignPermissionToGroup', function () {
            try {
                tearUp();
                var result = permission.assignPermissionToGroup(ctx);
                expect(result).toBe(201);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from PERMISSIONS");
                tearDown();
            }
        });
    });

    describe('Get permissions operations - Permission Module', function () {
        var permission_module = require('/modules/permission.js').permission;
        var db, permission, driver;
        var ctx = new Object();
        ctx.group = "subscriber";

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                permission = new permission_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getPermission', function () {
            try {
                tearUp();
                driver.query("INSERT INTO permissions (role,content,tenant_id) values ('subscriber','[\"LOCK\"]','-1234')");
                var result = permission.getPermission(ctx);
                var feature,content;
                for(var i=0;i<result.content.length;i++){
                    content = result.content[i];
                    if(content.title=="Operations"){
                        break;
                    }
                }
                for(var i=0;i<content.children.length;i++){
                    feature = content.children[i];
                    if(feature.value=="LOCK"){
                        break;
                    }
                }
                expect(feature.select).toBe(true);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from PERMISSIONS");
                tearDown();
            }
        });
    });
});
