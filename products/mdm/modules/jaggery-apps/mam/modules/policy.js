
var policy = (function () {

    var userModule = require('user.js').user;
    var user;

    var usergModule = require('user_group.js').user_group;
    var userg

    var groupModule = require('group.js').group;
    var group;

    var deviceModule = require('device.js').device;
    var device;

    var common = require("common.js");
    var sqlscripts = require('/sqlscripts/mysql.js');

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;

    var mdmModule = require('mdm.js').mdm;
    var mdm = new mdmModule();

    var module = function (dbs) {
        db = dbs;
        user = new userModule(db);
        userg = new usergModule(db);
        group = new groupModule(db);
        device = new deviceModule(db);
        //mergeRecursive(configs, conf);
    };

    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = mergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    function isResourceExist(policyID,resource,type){
        if(type == 'user'){
            var result = db.query(sqlscripts.user_policy_mapping.select2,policyID,resource);
            if(typeof result != 'undefined' && result != null &&  typeof result[0] != 'undefined' && result[0] != null){
                return true;
            }
            return false;
        }else if(type == 'platform'){
            var result = db.query(sqlscripts.platform_policy_mapping.select2,policyID,resource);
            if(typeof result != 'undefined' && result != null &&  typeof result[0] != 'undefined' && result[0] != null){
                return true;
            }
            return false;
        }else{
            var result = db.query(sqlscripts.group_policy_mapping.select2,policyID,resource);
            if(typeof result != 'undefined' && result != null &&  typeof result[0] != 'undefined' && result[0] != null){
                return true;
            }
            return false;
        }
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
    function getPolicyIdFromDevice(deviceId){

        var devices = db.query(sqlscripts.devices.select1, String(deviceId));
        var userId = devices[0].user_id;
        var platform = '';
        if(devices[0].platform_id == 1){
            platform = 'android';
        }else{
            platform = 'ios';
        }
        var upresult = db.query(sqlscripts.policies.select4, userId);
        if(upresult!=undefined && upresult != null && upresult[0] != undefined && upresult[0] != null ){
            return upresult[0].id;
        }
        var ppresult = db.query(sqlscripts.policies.select5, platform);
        if(ppresult!=undefined && ppresult != null && ppresult[0] != undefined && ppresult[0] != null ){
            return ppresult[0].id;
        }
        var roleList = user.getUserRoles({'username':userId});
        var removeRoles = new Array("Internal/everyone", "portal", "wso2.anonymous.role", "reviewer");
        var roles = common.removeNecessaryElements(roleList,removeRoles);
        var role = roles[0];

        var gpresult = db.query(sqlscripts.policies.select6, role);
        return gpresult[0].id;
    }

    function revokePolicy(policyId){

        var policyPayload = require("/config/config.json").emptyPolicy;

        var users1 = db.query(sqlscripts.user_policy_mapping.select1, String(policyId));
        for(var i = 0;i<users1.length;i++){
            var devices1 = db.query(sqlscripts.devices.select26, users1[i].user_id, common.getTenantID());
            for(var j = 0;j<devices1.length;j++){
                device.sendToDevice({'deviceid':devices1[j].id,'operation':'REVOKEPOLICY','data':policyPayload});
            }
        }

        var platforms =  db.query(sqlscripts.platform_policy_mapping.select1,String(policyId));

        for(var i = 0;i<platforms.length;i++){
            if(platforms[i].platform_id == 'android'){

                var devices2 = db.query(sqlscripts.devices.select36, common.getTenantID());

                for(var j=0;j<devices2.length;j++){
                    var tempId = getPolicyIdFromDevice(devices2[j].id);
                    if(tempId == policyId){
                        device.sendToDevice({'deviceid':devices2[j].id,'operation':'REVOKEPOLICY','data':policyPayload});
                    }
                }

            }else{

                var devices3 = db.query(sqlscripts.devices.select37);

                for(var j=0;j<devices3.length;j++){
                    var tempId = getPolicyIdFromDevice(devices3[j].id);
                    if(tempId == policyId){
                        device.sendToDevice({'deviceid':devices3[i].id,'operation':'REVOKEPOLICY','data':policyPayload});
                    }
                }
            }

        }

        var groups =  db.query(sqlscripts.group_policy_mapping.select1, String(policyId));

        for(var i = 0;i<groups.length;i++){
            var users2 = group.getUsersOfGroup({'groupid':groups[i].group_id});
            for(var j=0;j<users2.length;j++){
                var devices4 = db.query(sqlscripts.devices.select26, users2[j].username, common.getTenantID());
                for(var k = 0;k<devices4.length;k++){
                    var tempId = getPolicyIdFromDevice(devices4[k].id);
                    if(tempId == policyId){
                        device.sendToDevice({'deviceid':devices4[k].id,'operation':'REVOKEPOLICY','data':policyPayload});
                    }
                }
            }
        }

    }
    module.prototype = {
        constructor: module,
        updatePolicy:function(ctx){
            var policyId = '';
            var result;
            var policy = db.query(sqlscripts.policies.select7, ctx.policyName);
            policyId = policy[0].id;
            if(ctx.category==1){
                if(policy!= undefined && policy != null && policy[0] != undefined && policy[0] != null){
                    result = db.query(sqlscripts.policies.update1, ctx.policyData, ctx.policyType, ctx.policyName, common.getTenantID());
                }else{
                    result = this.addPolicy(ctx);
                }
            }else if(ctx.category==2){
                var currentPolicy = policy[0];
                if(currentPolicy){
                    currentPolicy.mam_content = ctx.policyData;
                    log.info(ctx.policyData);
                    result = db.query(sqlscripts.policies.update2, currentPolicy.mam_content, currentPolicy.type, currentPolicy.name, common.getTenantID());
                    mdm.enforce(currentPolicy.id);
                }
            }
            return result;
        },
        addPolicy: function(ctx){
            var existingPolicies =  db.query(sqlscripts.policies.select14, ctx.policyName, common.getTenantID());
            if(ctx.category==1){
                if(existingPolicies != undefined && existingPolicies != null && existingPolicies[0] != undefined && existingPolicies[0] != null ){
                    return 409;
                }
                var result = db.query(sqlscripts.policies.insert1, ctx.policyName,ctx.policyData,ctx.policyType, ctx.category, common.getTenantID());
            }else if(ctx.category==2){
                var currentPolicy = existingPolicies[0];
                if(currentPolicy){
                    currentPolicy.mam_content = ctx.policyData;
                    result = db.query(sqlscripts.policies.update2, currentPolicy.mam_content, currentPolicy.type, currentPolicy.name, common.getTenantID());
                }else{
                    log.debug("MDM policy not found");
                }
            }
            return 201;
        },
        addDefaultPolicy: function(ctx){
            var existingPolicies =  db.query(sqlscripts.policies.select14, 'default', common.getTenantID());
            if(existingPolicies.length<0){
                db.query(sqlscripts.policies.insert2, 'default', common.getTenantID());
            }
        },
        getAllPoliciesForMDM:function(ctx){
            var result = db.query(sqlscripts.policies.select8, common.getTenantID());
            return result;
        },
        getAllPoliciesForMAM:function(ctx){
            var result = db.query(sqlscripts.policies.select8, common.getTenantID());
            return result;
        },
        getPolicy:function(ctx){
            var result = db.query(sqlscripts.policies.select10, ctx.policyid, common.getTenantID());
            return result[0];
        },
        deletePolicy:function(ctx){
            revokePolicy(ctx.policyid);
            var result = db.query(sqlscripts.policies.delete1, ctx.policyid, common.getTenantID());
            db.query(sqlscripts.group_policy_mapping.delete1, ctx.policyid);
            return result;
        },
        assignGroupsToPolicy:function(ctx){
            this.assignUsersToPolicy(ctx);
            this.assignPlatformsToPolicy(ctx);
            var deletedGroups = ctx.removed_groups;
            var newGroups = ctx.added_groups;
            var policyId = ctx.policyid;

            for(var i = 0; i< deletedGroups.length;i++){
                if(isResourceExist(policyId,deletedGroups[i],'group')==true){
                    var result = db.query(sqlscripts.group_policy_mapping.delete2, policyId,deletedGroups[i]);
                }
            }
            for(var i = 0; i< newGroups.length;i++){
                try{
                    if(isResourceExist(policyId,newGroups[i],'group')==false){
                        var result =db.query(sqlscripts.group_policy_mapping.insert1, newGroups[i],policyId);
                    }
                }catch(e){
                    log.debug(e);
                }
            }
        },
        assignUsersToPolicy:function(ctx){
            var deletedUsers = ctx.removed_users;
            var newUsers = ctx.added_users;
            var policyId = ctx.policyid;

            for(var i = 0; i< deletedUsers.length;i++){
                if(isResourceExist(policyId,deletedUsers[i],'user')==true){
                    var result = db.query(sqlscripts.user_policy_mapping.delete1, policyId,deletedUsers[i]);
                }
            }
            for(var i = 0; i< newUsers.length;i++){
                try{
                    if(isResourceExist(policyId,newUsers[i],'user')==false){
                        var result =db.query(sqlscripts.user_policy_mapping.insert1, newUsers[i],policyId);
                    }
                }catch(e){
                    log.debug(e);
                }
            }
        },
        assignPlatformsToPolicy:function(ctx){
            var deletedPlatforms = ctx.removed_platforms;
            var newPlatforms = ctx.added_platforms;
            var policyId = ctx.policyid;

            for(var i = 0; i< deletedPlatforms.length;i++){
                if(isResourceExist(policyId,deletedPlatforms[i],'platform')==true){
                    var result = db.query(sqlscripts.platform_policy_mapping.delete1, policyId,deletedPlatforms[i]);
                }
            }
            for(var i = 0; i< newPlatforms.length;i++){
                try{
                    if(isResourceExist(policyId,newPlatforms[i],'platform')==false){
                        var result =db.query(sqlscripts.platform_policy_mapping.insert1, newPlatforms[i],policyId);
                    }
                }catch(e){
                    log.debug(e);
                }
            }
        },
        getGroupsByPolicy:function(ctx){
            var totalGroups = group.getAllGroups({});
            var removeRoles = new Array("Internal/store", "Internal/publisher", "Internal/reviewer");
            var allGroups = common.removeNecessaryElements(totalGroups,removeRoles);
            var result = db.query(sqlscripts.group_policy_mapping.select1,ctx.policyid);

            var array = new Array();
            if(result == undefined || result == null || result[0] == undefined || result[0] == null){
                for(var i =0; i < allGroups.length;i++){
                    var element = {};
                    element.name = allGroups[i];
                    element.available = false;
                    array[i] = element;
                }
            }else{
                for(var i =0; i < allGroups.length;i++){
                    var element = {};
                    for(var j=0 ;j< result.length;j++){
                        if(allGroups[i]==result[j].group_id){
                            element.name = allGroups[i];
                            element.available = true;
                            break;
                        }else{
                            element.name = allGroups[i];
                            element.available = false;
                        }
                    }
                    array[i] = element;
                }
            }
            return array;
        },
        getUsersByPolicy:function(ctx){
            var allUsers = user.getAllUserNames();
            var result = db.query(sqlscripts.user_policy_mapping.select1, ctx.policyid);

            var array = new Array();
            if(result == undefined || result == null || result[0] == undefined || result[0] == null){
                for(var i =0; i < allUsers.length;i++){
                    var element = {};
                    element.name = allUsers[i];
                    element.available = false;
                    array.push(element);
                }
            }else{
                for(var i =0; i < allUsers.length;i++){
                    var element = {};
                    for(var j=0 ;j< result.length;j++){
                        if(allUsers[i]==result[j].user_id){
                            element.name = allUsers[i];
                            element.available = true;
                            break;
                        }else{
                            element.name = allUsers[i];
                            element.available = false;
                        }
                    }
                    array.push(element);
                }
            }
            return array;
        },
        getPlatformsByPolicy:function(ctx){
            var allPlatforms =new Array('android','ios');
            var result = db.query(sqlscripts.platform_policy_mapping.select1, ctx.policyid);

            var array = new Array();
            if(result == undefined || result == null || result[0] == undefined || result[0] == null){
                for(var i =0; i < allPlatforms.length;i++){
                    var element = {};
                    element.name = allPlatforms[i];
                    element.available = false;
                    array[i] = element;
                }
            }else{
                for(var i =0; i < allPlatforms.length;i++){
                    var element = {};
                    for(var j=0 ;j< result.length;j++){
                        if(allPlatforms[i]==result[j].platform_id){
                            element.name = allPlatforms[i];
                            element.available = true;
                            break;
                        }else{
                            element.name = allPlatforms[i];
                            element.available = false;
                        }
                    }
                    array[i] = element;
                }
            }

            return array;
        },
        enforcePolicy:function(ctx){
            var policyId =  ctx.policyid;

            var policies = db.query(sqlscripts.policies.select10, String(policyId), common.getTenantID());
            var payLoad = parse(policies[0].content);

            var users1 = db.query(sqlscripts.user_policy_mapping.select1, String(policyId));
            for(var i = 0;i<users1.length;i++){
                var devices1 = db.query(sqlscripts.devices.select26, users1[i].user_id, common.getTenantID());
                for(var j = 0;j<devices1.length;j++){
                    device.sendToDevice({'deviceid':devices1[j].id,'operation':'POLICY','data':payLoad});
                }
            }

            var platforms =  db.query(sqlscripts.platform_policy_mapping.select1,String(policyId));

            for(var i = 0;i<platforms.length;i++){
                if(platforms[i].platform_id == 'android'){

                    var devices2 = db.query(sqlscripts.devices.select36, common.getTenantID());

                    for(var j=0;j<devices2.length;j++){
                        var tempId = getPolicyIdFromDevice(devices2[j].id);
                        if(tempId == policyId){
                            device.sendToDevice({'deviceid':devices2[j].id,'operation':'POLICY','data':payLoad});
                        }
                    }

                }else{

                    var devices3 = db.query(sqlscripts.devices.select37);

                    for(var j=0;j<devices3.length;j++){
                        var tempId = getPolicyIdFromDevice(devices3[j].id);
                        if(tempId == policyId){
                            device.sendToDevice({'deviceid':devices3[i].id,'operation':'POLICY','data':payLoad});
                        }
                    }
                }

            }

            var groups =  db.query(sqlscripts.group_policy_mapping.select1, String(policyId));

            for(var i = 0;i<groups.length;i++){
                var users2 = group.getUsersOfGroup({'groupid':groups[i].group_id});
                for(var j=0;j<users2.length;j++){
                    var devices4 = db.query(sqlscripts.devices.select26, users2[j].username, common.getTenantID());
                    for(var k = 0;k<devices4.length;k++){
                        var tempId = getPolicyIdFromDevice(devices4[k].id);
                        if(tempId == policyId){
                            device.sendToDevice({'deviceid':devices4[k].id,'operation':'POLICY','data':payLoad});
                        }
                    }
                }
            }

        },
        getPolicyPayLoad:function(deviceId,category){
            var devices = db.query(sqlscripts.devices.select1 ,deviceId);
            var username = devices[0].user_id;//username for pull policy payLoad

            var platforms = db.query(sqlscripts.devices.select5 ,deviceId);
            var platformName = platforms[0].type_name;//platform name for pull policy payLoad

            var roleList = user.getUserRoles({'username':username});
            var removeRoles = new Array("Internal/everyone", "portal", "wso2.anonymous.role", "reviewer","private_kasun:wso2mobile.com");
            var roles = common.removeNecessaryElements(roleList,removeRoles);
            var role = roles[0];//role name for pull policy payLoad

            var upresult = db.query(sqlscripts.policies.select11, category,String(username));

            if(upresult!=undefined && upresult != null && upresult[0] != undefined && upresult[0] != null ){
                var policyPayLoad = parse(upresult[0].data);
                return policyPayLoad;
            }

            var ppresult = db.query(sqlscripts.policies.select12, category,platformName);
            if(ppresult!=undefined && ppresult != null && ppresult[0] != undefined && ppresult[0] != null ){
                var policyPayLoad = parse(ppresult[0].data);
                return policyPayLoad;
            }

            var gpresult = db.query(sqlscripts.policies.select13, category,role);
            if(gpresult != undefined && gpresult != null && gpresult[0] != undefined && gpresult[0] != null){
                var policyPayLoad = parse(gpresult[0].data);
                return policyPayLoad;
            }
            return null;
        },
        monitoring:function(ctx){
            setInterval(
             function(ctx){
                    device.monitor(ctx);
                }
            ,100000);
        }
    };
    return module;
})();
