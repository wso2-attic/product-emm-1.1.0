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

describe('Policy Module',function(){
    describe('Add Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test addPolicy', function () {
            try {
                tearUp();
                var result = policy.addPolicy(ctx);
                expect(result).toBe(201);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });

        it('Test addPolicy with duplicate policy', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var result = policy.addPolicy(ctx);
                expect(result).toBe(409);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });
    });

    describe('Get Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test getPolicy', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                var result = policy.getPolicy({"policyid":policyId});
                expect(result.name).toBe("test_policy");
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });

        it('Test getPolicy with non-existing policy id', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var result = policy.getPolicy({"policyid":"1"});
                expect(result).toBe(undefined);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });
    });

    describe('Update Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test updatePolicy', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                ctx.policyType = "3";
                policy.updatePolicy(ctx);
                var policyType = driver.query("select type from policies where name='test_policy'")[0].type;
                expect(policyType).toBe("3");
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });

        it('Test updatePolicy with non-existing policy', function () {
            try {
                tearUp();
                var result = policy.updatePolicy(ctx);
                expect(result).toBe(1);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });
    });

    describe('Delete Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test deletePolicy', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.deletePolicy({"policyid":policyId});
                var test_policy = driver.query("select * from policies where name='test_policy'");
                expect(test_policy.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });

        it('Test deletePolicy with non-existing policy', function () {
            try {
                tearUp();
                var result = policy.deletePolicy({"policyid":"1"});
                expect(result.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                tearDown();
            }
        });
    });

    describe('Assign Users To Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};
        var test_usr = "test_user";

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test assignUsersToPolicy by adding users', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignUsersToPolicy({"policyid":policyId,"removed_users":[],"added_users":[test_usr]});
                var usr = driver.query("SELECT user_id from user_policy_mapping where policy_id = ? AND user_id = ?",policyId,test_usr)[0].user_id;
                expect(usr).toBe(test_usr);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from user_policy_mapping");
                tearDown();
            }
        });

        it('Test assignUsersToPolicy with removing users', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignUsersToPolicy({"policyid":policyId,"removed_users":[],"added_users":[test_usr]});
                policy.assignUsersToPolicy({"policyid":policyId,"removed_users":[test_usr],"added_users":[]});
                var usr = driver.query("SELECT user_id from user_policy_mapping where policy_id = ? AND user_id = ?",policyId,test_usr);
                expect(usr.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from user_policy_mapping");
                tearDown();
            }
        });
    });

    describe('Assign Platforms To Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};
        var platform_id = "1";

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test assignPlatformsToPolicy by adding platforms', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignPlatformsToPolicy({"policyid":policyId,"removed_platforms":[],"added_platforms":[platform_id]});
                var id = driver.query("SELECT platform_id from platform_policy_mapping where policy_id = ? AND platform_id = ?",policyId,platform_id)[0].platform_id;
                expect(id).toBe(platform_id);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from platform_policy_mapping");
                tearDown();
            }
        });

        it('Test assignPlatformsToPolicy with removing platforms', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignPlatformsToPolicy({"policyid":policyId,"removed_platforms":[],"added_platforms":[platform_id]});
                policy.assignPlatformsToPolicy({"policyid":policyId,"removed_platforms":[platform_id],"added_platforms":[]});
                var id = driver.query("SELECT platform_id from platform_policy_mapping where policy_id = ? AND platform_id = ?",policyId,platform_id);
                expect(id.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from platform_policy_mapping");
                tearDown();
            }
        });
    });

    describe('Assign Groups To Policy operations - Policy Module', function () {
        var policy_module = require('/modules/policy.js').policy;
        var db, policy, driver;
        var ctx = {"policyName":"test_policy", "policyData":{}, "policyType":"1", "category":"1", "policyMamData":{}};
        var group_id = "1";

        function tearUp() {
            try {
                db = new Database("WSO2_EMM_DB");
                policy = new policy_module(db);
                driver = require('driver').driver(db);
            } catch (e) {
                log.error(e);
            }
        }

        function tearDown() {
            db.close();
        }

        it('Test assignGroupsToPolicy by adding groups', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignGroupsToPolicy({"policyid":policyId,"removed_groups":[],"added_groups":[group_id],"removed_users":[],"added_users":[],"removed_platforms":[],"added_platforms":[]});
                var id = driver.query("SELECT group_id from group_policy_mapping where policy_id = ? AND group_id = ?",policyId,group_id)[0].group_id;
                expect(id).toBe(group_id);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from group_policy_mapping");
                tearDown();
            }
        });

        it('Test assignGroupsToPolicy with removing groups', function () {
            try {
                tearUp();
                policy.addPolicy(ctx);
                var policyId = driver.query("select id from policies where name='test_policy'")[0].id;
                policy.assignGroupsToPolicy({"policyid":policyId,"removed_groups":[],"added_groups":[group_id],"removed_users":[],"added_users":[],"removed_platforms":[],"added_platforms":[]});
                policy.assignGroupsToPolicy({"policyid":policyId,"removed_groups":[group_id],"added_groups":[],"removed_users":[],"added_users":[],"removed_platforms":[],"added_platforms":[]});
                var id = driver.query("SELECT group_id from group_policy_mapping where policy_id = ? AND group_id = ?",policyId,group_id);
                expect(id.length).toBe(0);
            } catch (e) {
                log.error(e);
            } finally {
                driver.query("delete from POLICIES");
                driver.query("delete from group_policy_mapping");
                tearDown();
            }
        });
    });
});
