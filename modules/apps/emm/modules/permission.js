
var permission = (function () {
    var log = new Log();
    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;
    var driver;
    var common = require("common.js");
    var sqlscripts = require('/sqlscripts/db.js');
    var driver = require('driver').driver(db);
    var module = function (dbs) {
        db = dbs;
        driver = require('driver').driver(db);
        //mergeRecursive(configs, conf);
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
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    // prototype
    module.prototype = {
        constructor: module,

        assignPermissionToGroup: function(ctx){
            var responseMsg = {};
            var group = ctx.selectedGroup;
            var featureList = ctx.featureList;
            var resultCount1 = driver.query(sqlscripts.permissions.update1,stringify(featureList),group,common.getTenantID());
            var resultCount2 = 0;
            if(!resultCount1>0){
                resultCount2 = driver.query(sqlscripts.permissions.insert1,group,featureList,common.getTenantID());
            }
            if(resultCount1 > 0 || (resultCount2 && resultCount2.length == 0)){
                responseMsg.status = 201;
                return responseMsg.status;
            }
            responseMsg.status = 400;
            return responseMsg.status;
        },
        deletePolicy:function(ctx){

        },
        getPermission:function(ctx){
            var responseMsg = {};
            var featureArray = [];
            var featureObjOperations = {};
            featureObjOperations.title = "Operations";
            featureObjOperations.value = "MDM_OPERATION";
            featureObjOperations.isFolder = "true";
            featureObjOperations.key = 1;
            var roleFeaturesArray = driver.query(sqlscripts.permissions.select1,ctx.group,common.getTenantID());
            var roleFeatures;
            if(roleFeaturesArray == ""){
                roleFeatures = [];
            }else{
                roleFeatures = parse(roleFeaturesArray[0].content); 
            }    
            var operationFeatures = driver.query(sqlscripts.features.select7);

            var children1 = [];
            for(var i=0;i<operationFeatures.length;i++){
                var child = {};
                child.value = operationFeatures[i].name;
                child.title = operationFeatures[i].description;
                for(var j= 0; j< roleFeatures.length; j++){
                    if(operationFeatures[i].name == roleFeatures[j]){
                        child.select = true;
                        break;
                    }
                    child.select = false;
                }
                children1.push(child);
            }
            featureObjOperations.children = children1;
            featureArray.push(featureObjOperations);

            var featureObjMessaging = {};
            featureObjMessaging.title = "Messaging";
            featureObjMessaging.value = "MMM";
            featureObjMessaging.isFolder = "true";
            featureObjMessaging.key = 3;
            var msgFeatures = driver.query(sqlscripts.features.select8);
            log.debug("msgFeatures : " + stringify(msgFeatures));
            var children2 = [];
            for(var i=0;i<msgFeatures.length;i++){
                var child = {};
                child.value = msgFeatures[i].name;
                child.title = msgFeatures[i].description;
                for(var j= 0; j< roleFeatures.length; j++){
                    if(msgFeatures[i].name == roleFeatures[j]){
                        child.select = true;
                        break;
                    }
                    child.select = false;
                }
                children2.push(child);
            }
            featureObjMessaging.children = children2;
            featureArray.push(featureObjMessaging);

            var featureObjConfiguration = {};
            featureObjConfiguration.title = "Configuration";
            featureObjConfiguration.value = "MDM_CONFIGURATION";
            featureObjConfiguration.isFolder = "true";
            featureObjConfiguration.key = 4;
            var configurationFeatures = driver.query(sqlscripts.features.select9);
            var children3 = [];
            for(var i=0;i<configurationFeatures.length;i++){
                var child = {};
                child.value = configurationFeatures[i].name;
                child.title = configurationFeatures[i].description;
                for(var j= 0; j< roleFeatures.length; j++){
                    if(configurationFeatures[i].name == roleFeatures[j]){
                        child.select = true;
                        break;
                    }
                    child.select = false;
                }
                children3.push(child);
            }
            featureObjConfiguration.children = children3;
            featureArray.push(featureObjConfiguration);
            responseMsg.content = featureArray;
            responseMsg.status = 200;
            return responseMsg;
        }
    };
    // return module
    return module;
})();