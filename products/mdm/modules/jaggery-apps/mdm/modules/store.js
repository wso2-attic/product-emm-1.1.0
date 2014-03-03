var store = (function() {
  var configs = {
    CONTEXT: "/"
  };
  var routes = new Array();
  var log = new Log();
  var db;

  var module = function(dbs) {
      db = dbs;
      //mergeRecursive(configs, conf);
    };
  var userModule = require('user.js').user;
  var user = new userModule();
  var sqlscripts = require('/sqlscripts/mysql.js');

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
    getAllDevicesFromEmail: function(ctx) {
      log.debug("Test platform :" + ctx.data.platform);
      var devicesArray;
      if (ctx.data.platform == 'webapp') {
        user.getUser(ctx.user)
        var userID = user.getUser({
          userid: ctx.data.email, login:true
        }).id;

        //SQL Check - injection
        //var devices = db.query("select * from devices where devices.user_id="+userID);
        var devices = db.query(sqlscripts.devices.select29, userID);
        log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(devices));

        devicesArray = new Array();
        for (var i = 0; i < devices.length; i++) {
          var deviceID = devices[i].id;

          var properties = devices[i].properties;
          var propertiesJsonObj = parse(properties);
          var name = propertiesJsonObj.device;
          var model = propertiesJsonObj.model;

          //SQL Check - injection
          //var platforms = db.query("select platforms.type_name as platform from devices, platforms where platforms.id = devices.platform_id && devices.id="+deviceID);
          var platforms = db.query(sqlscripts.devices.select30, deviceID);
          log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));

          var platform = platforms[0].platform
          var packet = {};
          packet.id = deviceID;
          packet.name = name;
          packet.model = model;
          packet.platform = platform;

          devicesArray.push(packet);
        }
        return devicesArray;
      }

      if (ctx.data.platform != undefined && ctx.data.platform != null) {

        var userID = user.getUser({
          userid: ctx.data.email,
          login:true
        }).id;
        var devices = db.query(sqlscripts.devices.select29, userID);

        //SQL check - injection
        //var platforms = db.query("select * from platforms where type_name ='"+ctx.data.platform+"'");
        var platforms = db.query(sqlscripts.platforms.select2, ctx.data.platform);
        log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));

        devicesArray = new Array();

        for (var j = 0; j < platforms.length; j++) {

          //SQL Check - injection
          //var devices = db.query("select * from devices where devices.user_id="+userID+" and devices.platform_id = "+platforms[j].id);
          var devices = db.query(sqlscripts.devices.select31, userID, platforms[j].id);
          log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(devices));

          for (var i = 0; i < devices.length; i++) {
            var deviceID = devices[i].id;

            var properties = devices[i].properties;
            var propertiesJsonObj = parse(properties);
            var name = propertiesJsonObj.device;
            var model = propertiesJsonObj.model;

            var packet = {};

            packet.id = deviceID;
            packet.name = name;
            packet.model = model;
            packet.platform = ctx.data.platform;
            devicesArray.push(packet);
          }
        }
      } else {
        var userID = user.getUser({
          userid: ctx.data.email,
          login:true
        }).username;

        //SQL Check - injection
        //var devices = db.query("select * from devices where devices.user_id='"+String(userID)+"'");
        var devices = db.query(sqlscripts.devices.select29, String(userID));
        log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(devices));

        devicesArray = new Array();

        for (var i = 0; i < devices.length; i++) {
          var deviceID = devices[i].id;

          var properties = devices[i].properties;
          var propertiesJsonObj = parse(properties);
          var name = propertiesJsonObj.device;
          var model = propertiesJsonObj.model;

          //SQL Check - injection
          //var platforms = db.query("select platforms.type_name as platform from devices, platforms where platforms.id = devices.platform_id && devices.id="+deviceID);
          var platforms = db.query(sqlscripts.devices.select30, deviceID);
          log.debug("getAllDevicesFromEmail: SQL Check - injection >>>>>>>>> " + stringify(platforms));

          var platform = platforms[0].platform
          var packet = {};
          packet.id = deviceID;
          packet.name = name;
          packet.model = model;
          packet.platform = platform;

          devicesArray.push(packet);
        }

      }
      return devicesArray;

    },
    getAllAppFromDevice: function(ctx) {
      var deviceId = ctx.data.deviceId;
      var GET_APP_FEATURE_CODE = '502A';

      //SQL Check - injection
      //var last_notification = db.query("select * from notifications where `device_id`=? and `feature_code`= '"+GET_APP_FEATURE_CODE+"' and `status`='R' and `id` = (select MAX(`id`) from notifications where `device_id`=? and `feature_code`= '"+GET_APP_FEATURE_CODE+"' and `status`='R')", deviceId,deviceId);
      var last_notification = db.query(sqlscripts.notifications.select12, deviceId, GET_APP_FEATURE_CODE, deviceId, GET_APP_FEATURE_CODE);
      log.debug("getAllAppFromDevice: SQL Check - injection >>>>>>>>> " + stringify(last_notification));

      last_notification[0].received_data = JSON.parse(unescape(last_notification[0].received_data));
      return last_notification[0];
    }
  };
  // return module
  return module;
})();