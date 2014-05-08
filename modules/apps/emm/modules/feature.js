var feature = (function () {
    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;
    var common = require("/modules/common.js");
    var sqlscripts = require('/sqlscripts/mysql.js');
    var module = function (dbs) {
        db = dbs;
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

    var entitlement = null;
    var stub = null;

    function init(){
        entitlement = require('policy').entitlement;
        var samlResponse = session.get("samlresponse");
        var saml = require("/modules/saml.js").saml;
        var backEndCookie = saml.getBackendCookie(samlResponse);
        entitlement.setAuthCookie(backEndCookie);
        stub = entitlement.setEntitlementPolicyAdminServiceParameters();
    }
    function setFlag(list,groupId){
        try{
            var result = entitlement.readExistingPolicy(stub,groupId);
            var languages = new XML('<xml>'+result+'</xml>');
            var svgns = new Namespace('urn:oasis:names:tc:xacml:3.0:core:schema:wd-17');
            var svg = languages..svgns::Policy;
            var ops = svg.*[1].children().children().children().children().children().children(0)[0];
            var array = ops.split('|');
            array[0] = array[0].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            array[array.length-1] = array[array.length-1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
        }catch(e){
            array = null;
            log.debug("EntitlementPolicy admin service cannot be invoked");
        }
        if(array != undefined && array != null && array.length != undefined && array.length != null){
            for(var i = 0; i<list.length;i++){
                for(var j=0;j <  array.length;j++){
                    if(list[i].value ==  array[j] ){
                        list[i].select = true;
                        break;
                    }else{
                        list[i].select = false;
                    }
                }
            }
            return list;

        }else{
            for(var i = 0; i<list.length;i++){
                list[i].flag = false;
            }
            return list;
        }
    }

    // prototype
    module.prototype = {
        constructor: module,
        getAllFeatures: function(ctx){
        	var tenantID = common.getTenantID();
            var featureList = db.query(sqlscripts.devices.select24, tenantID);

            var obj = new Array();
            for(var i=0; i<featureList.length; i++){
                var featureArr = {};

                var ftype = db.query(sqlscripts.featuretype.select2, featureList[i].id);
                //log.error(featureList[i]);
                featureArr["name"] = featureList[i].name;
                featureArr["feature_code"] = featureList[i].code;
                featureArr["feature_type"] = ftype[0].name;
                featureArr["description"] = featureList[i].description;
                if(featureList[i].template === null || featureList[i].template === ""){

                }else{
                    featureArr["template"] = featureList[i].template;
                }
                obj.push(featureArr);
            }
            return obj;
        },

        getAllFeaturesForRoles: function(ctx){
            init();
            var array = new Array();
            var featureGroupList = db.query(sqlscripts.featuregroup.select1);

            for(var i = 0;i<featureGroupList.length;i++){
                var obj = {};
                obj.title = featureGroupList[i].description;
                obj.value = featureGroupList[i].name;
                obj.isFolder = true;
                obj.key = featureGroupList[i].id;

                obj.children = setFlag(db.query(sqlscripts.features.select3, stringify(featureGroupList[i].id)),ctx.groupid);

                array[i] = obj;
            }
            return array;
        }
    };
    return module;
})();
