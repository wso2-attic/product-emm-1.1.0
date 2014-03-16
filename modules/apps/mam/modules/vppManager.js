var TENANT_CONFIGS = 'tenant.configs';
var USER_MANAGER = 'user.manager';


var vppManager = (function () {
    var log = new Log();
	var carbon = require('carbon');
    var server = function(){
        return application.get("SERVER");
    }
	var common = require('common.js');

    var db;
    var module = function (dbs) {
        db = dbs;
    };
    
	var mdmModule = require('mdm.js').mdm;
    var mdm = new mdmModule();

    var configs = function (tenantId) {
        var configg = application.get(TENANT_CONFIGS);
        if (!tenantId) {
            return configg;
        }
        return configs[tenantId] || (configs[tenantId] = {});
    };

    var userManager = function (tenantId) {
        var config = configs(tenantId);
        if (!config || !config[USER_MANAGER]) {
            var um = new carbon.user.UserManager(server, tenantId);
            config[USER_MANAGER] = um;
            return um;
        }
        return configs(tenantId)[USER_MANAGER];
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
		/* 
			ctx - {uuid, deviceId, tenantId, userId}
		*/
        getCoupon: function(uuid, deviceId) {
			var tenantId = common.getTenantID();
			var userId = db.query("select user_id from devices where id=? and tenant_id=?", deviceId, tenantId)[0].user_id;
			var query = "select * from vpp_coupons where uuid=? and tenantId=? and status='F'";
			var result = db.query(query, uuid, tenantId);
            log.debug(result);
			if(result.length>0){
				var couponRecord = result[0];
				query = "update vpp_coupons set user=?, deviceId=?, status='E' where coupon=? and uuid=? and tenantId=?";
				//set the status as engaged
				db.query(query,userId, deviceId, couponRecord.coupon, uuid, tenantId);

				return couponRecord.coupon;
			}else{
				throw new Error("Error: No free coupon code found");
			}
        },
		installCallback: function(ctx){
			var coupon = ctx.coupon;
			var deviceId = ctx.deviceId;
			var tenantId = common.getTenantID();
			var query = "select * from vpp_coupons where uuid=? and tenantId=? and status='E'";
			var result = db.query(query, uuid, tenantId);
			if(result.length>0){
				var couponRecord = result[0];
				if(deviceId==couponRecord.deviceId){
					query = "update vpp_coupons set status='O' where coupon=? and deviceId=?";
					db.query(query, coupon, deviceId);
				}else{
					throw "Error: Incorrect Device ID requested";
				}
			}else{
				throw "Error: No engaged code for coupone provided found";
			}
		},
        addCoupons: function(uuid, coupons){
            var tenantId = common.getTenantID();
            var query = "insert into vpp_coupons set tenantId=?, uuid =? , coupon=?, status='F'";
            db.query(query,tenantId,appid, coupon);
        },
        removeCoupon: function(uuid, coupon){
            var tenantId = common.getTenantID();
            var query = "delete from vpp_coupons where tenantId=? and uuid =? and coupon=?";
            db.query(query,tenantId,uuid, coupon);
        },
        getCoupons: function(){
            var tenantId = common.getTenantID();
            var query = "select * from vpp_coupons where tenantId=?";
            return db.query(query,tenantId);
        }
    };
    return module;
})();