var dashboard = (function () {
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

    // prototype
    module.prototype = {
        constructor: module,
        
        getDeviceCountByOS: function(ctx){      	 	 
          	var tenantID = common.getTenantID();
          	var finalResult = db.query(sqlscripts.devices.select2, tenantID);
                       
            
            
            if(finalResult.length == 0){
            	finalResult =  [{"label" : "No Data", "devices": 0,  "data" : 100}];
            }
            
            return finalResult;
            
            
               
        },
        
        
        
        getDeviceCountByOwnership: function(ctx){
            var tenantID = common.getTenantID();
            var allDeviceCount = db.query(sqlscripts.devices.select3, tenantID);
	        var allByodCount = db.query(sqlscripts.devices.select4, tenantID);
	        var finalResult =  [{"label" : "Personal", "devices": allByodCount[0].count,  "data" : allByodCount[0].count}, {"label" : "Corporate", "devices": allDeviceCount[0].count - allByodCount[0].count, "data" : allDeviceCount[0].count - allByodCount[0].count}];   
            
                 
            if(allDeviceCount[0].count == 0){
            	finalResult =  [{"label" : "No Data", "devices": 0,  "data" : 100}];
            }
           
           	
            return finalResult;            
      
        },
        
        
        
        
         getAndroidDeviceCountByOwnership: function(ctx){
            var tenantID = common.getTenantID();
            var allDeviceCount = db.query(sqlscripts.devices.select3, tenantID);
	        var allByodCount = db.query(sqlscripts.devices.select4, tenantID);
	        var finalResult =  [{"label" : "Personal", "data" : allByodCount[0].count}, {"label" : "Corporate", "data" : allDeviceCount[0].count - allByodCount[0].count}];   
            
            if(allDeviceCount[0].count == 0){
            	finalResult =  [{"label" : "No Data", "devices": 0,  "data" : 100}];
            }
            
            
            
            return finalResult;            
      
        }
        
        
        
        
        
    };
    return module;
})();

