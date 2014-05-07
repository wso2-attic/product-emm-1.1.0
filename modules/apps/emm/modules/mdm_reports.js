
var mdm_reports = (function () {

    var deviceModule = require('device.js').device;
    var device;

    var common = require("common.js");

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;

    var module = function (dbs) {
        db = dbs;
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
    function getComplianceStateFromReceivedData(receivedData){
        for(var i = 0; i< receivedData.length; i++){
            if(receivedData[i].status == false){
                return false;
            }
        }
        return true;
    }
    function getComplianceInfoFromReceivedData(receivedData){
        var newArray = new Array();
        for(var i = 0; i< receivedData.length; i++){
            if(receivedData[i].code == 'notrooted'){
                var obj = {};
                obj.name = 'Not Rooted';
                obj.status = receivedData[i].status;
                newArray.push(obj);
            }else{
                var featureCode = receivedData[i].code;
                try{
                    var obj = {};
                    var features = db.query("SELECT * FROM features WHERE code= ?",featureCode);
                    obj.name = features[0].description;
                    obj.status = receivedData[i].status;
                    newArray.push(obj);
                }catch(e){
                    log.debug(e);
                }
            }
        }
        return newArray;
    }
    function getComplianceStateChanges(result,deviceID){
        var currentState = device.getCurrentDeviceState(parseInt(deviceID));
        if(currentState == 'A'){
            currentState = "Active";
        }else if(currentState == 'PV'){
            currentState = "Policy Violated";
        }else{
            currentState = "Blocked";
        }
        var state = getComplianceStateFromReceivedData(parse(result[0].received_data));
        var array = new Array();
        var obj = {};
        obj.userID =  result[0].user_id;
        obj.timeStamp = common.getFormattedDate(result[0].received_date);
        obj.resons = getComplianceInfoFromReceivedData(parse(result[0].received_data));
        obj.status = state;
        obj.current_status = currentState;
        array.push(obj);

        for(var i = 1; i<result.length;i++){
            if(getComplianceStateFromReceivedData(parse(result[i].received_data)) !== state){
                state = getComplianceStateFromReceivedData(parse(result[i].received_data));
                var obj = {};
                obj.userID =  result[i].user_id;
                obj.timeStamp = common.getFormattedDate(result[i].received_date);
                obj.resons = getComplianceInfoFromReceivedData(parse(result[i].received_data));
                obj.status = state;
                obj.current_status = currentState;
                array.push(obj);
            }
        }
        return  array;
    }
    module.prototype = {
        constructor: module,
        getDevicesByRegisteredDate:function(ctx){
            var zeros = ' 00:00:00';
            var ends = ' 23:59:59';
            if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){

                ctx.startDate = "2013-01-01";

            }
            var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                var endDate = ctx.endDate+ends;
            }
            var result = [];
            if(typeof ctx.platformType !== 'undefined' && parse(ctx.platformType) !== 0){
                //sqlscripts.devices.select45
                result = db.query("SELECT devices.user_id, devices.properties, platforms.name as platform_name, devices.os_version, devices.created_date, devices.status  FROM devices,platforms where platforms.type =? && platforms.id = devices.platform_id  &&  devices.created_date between ? and ? and  devices.tenant_id = ?",ctx.platformType,startDate,endDate,common.getTenantID());
            }else{
               // result = db.query("SELECT devices.user_id, devices.properties, platforms.name as platform_name, devices.os_version, devices.created_date, devices.status  FROM devices, platforms where devices.created_date between '"+startDate+"' and '"+endDate+"' and  devices.tenant_id = "+common.getTenantID()+"&& devices.platform_id = platforms.id");
                result = db.query("SELECT devices.user_id, devices.properties, platforms.name as platform_name, devices.os_version, devices.created_date, devices.status  FROM devices, platforms where devices.created_date between ? and ? and  devices.tenant_id = ? && devices.platform_id = platforms.id",startDate,endDate,common.getTenantID());
            }
            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null ){
                for(var i=0; i< result.length;i++){
                    result[i].imei = parse(result[i].properties).imei;
                }
                return  result;
            }else{
                return null;
            }
        },
        getDevicesByComplianceState:function(ctx){
             var zeros = ' 00:00:00';
             var ends = ' 23:59:59';

             if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){
                ctx.startDate = "2013-01-01";
             }
             var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                endDate = ctx.endDate+ends;
            }
             //var result = db.query("SELECT devices.id, devices.properties, devices.user_id, devices.os_version, platforms.type_name as platform_name, devices.status from devices, platforms WHERE devices.created_date between '"+ctx.startDate+"' AND '"+ctx.endDate+"'AND devices.user_id like '%"+ctx.username+"%' AND status like '%"+ctx.status+"%' AND devices.tenant_id ="+common.getTenantID()+" AND devices.platform_id = platforms.id");
             var result = db.query("SELECT devices.id, devices.properties, devices.user_id, devices.os_version, platforms.type_name as platform_name, devices.status from devices, platforms WHERE devices.created_date between ? AND ? AND devices.user_id like ? AND status like ? AND devices.tenant_id = ? AND devices.platform_id = platforms.id",startDate,endDate,"%"+ctx.username+"%","%"+ctx.status+"%",common.getTenantID());
            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null ){
                 for(var i=0; i< result.length;i++){
                     result[i].imei = parse(result[i].properties).imei;
                     if(result[i].status == 'A'){
                        result[i].status = 'Policy Compliance';
                     }else if(result[i].status == 'PV'){
                        result[i].status = 'Policy Violated';
                     }else{
                        result[i].status = 'Blocked';
                     }
                 }
                 return  result;
             }else{
                 return null;
             }
        },
        getComplianceStatus:function(ctx){
            var zeros = ' 00:00:00';
            var ends = ' 23:59:59';
            if(typeof ctx.startDate == 'undefined' || ctx.startDate == null || ctx.startDate == ""){
                ctx.startDate = "2013-01-01";
            }
            var startDate = ctx.startDate+zeros;
            var endDate = '';
            if(typeof ctx.endDate == 'undefined' || ctx.endDate == null || ctx.endDate == ""){
                endDate = common.getCurrentDateTime();
            }else{
                endDate = ctx.endDate+ends;
            }
            //var result = db.query("select * from notifications where feature_code = '501P' && device_id ="+ctx.deviceID+"&& received_date between '"+startDate+"' and '"+endDate+"' and tenant_id = "+common.getTenantID());
            var result = db.query("select * from notifications where feature_code = '501P' && device_id = ? && received_date between ? and ? and tenant_id = ?",ctx.deviceID,startDate,endDate,common.getTenantID());
            if(typeof result !== 'undefined' && result !== null && typeof result[0] !== 'undefined' && result[0] !== null){
                var stateChangesArray = getComplianceStateChanges(result,ctx.deviceID);
                return stateChangesArray;
            }else{
                return null;
            }
        }
    };
    return module;
})();